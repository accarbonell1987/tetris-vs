import { useEffect, useReducer, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Card, CardHeader, CardBody, CardFooter, Divider, User } from '@nextui-org/react';
import { createGame, act, tick, receiveGarbage, BOARD_WIDTH, HIDDEN_ROWS, VISIBLE_ROWS } from '@tetris/shared';
import { CustomLayout } from '../../components';
import { useGlobalStorage } from '../../store';
import { useDevice } from '../../hooks';
import Keys from '../Game/components/Keys';
import Pause from '../Game/components/Pause';
import { createInput, press, release, update } from '../Game/input';
import { createGamepadPoller, pollGamepads } from '../Game/gamepad';
import { drawMatch, MATCH_CANVAS_COLUMNS, CANVAS_ROWS } from '../Game/render';
import { BLOCK_SIZE, KEY_BINDINGS, ONLINE_CONTROLS_LEGEND } from '../Game/static/commons';
import { buildSnapshot, createMatchState, isPlaying, matchReducer, rejoinMessage, ROUND_RESULT_MS, shouldRejoin } from './logic';

// A long frame (e.g. after switching tabs) must not drop pieces several rows at once.
const MAX_FRAME_MS = 100;
// A5: board snapshots go out at most every 100 ms.
const BOARD_SEND_MS = 100;

const emptyBoard = () => Array.from({ length: HIDDEN_ROWS + VISIBLE_ROWS }, () => Array(BOARD_WIDTH).fill(0));

const OVER_DETAIL = {
  forfeit: won => (won ? 'Tu rival abandonó' : 'Abandonaste la partida'),
  // Only the player who stayed gets this match-end.
  disconnect: () => 'Tu rival no volvió a conectarse'
};

// Whole seconds left of `milliseconds` while `running`; dispatches `doneType` (if any) at zero.
const useCountdown = (running, milliseconds, doneType, dispatch, restartKey) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!running) return;
    let remaining = Math.ceil(milliseconds / 1000);
    setCount(remaining);
    const timer = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) return setCount(remaining);
      clearInterval(timer);
      if (doneType) dispatch({ type: doneType });
    }, 1000);
    return () => clearInterval(timer);
  }, [running, milliseconds, doneType, dispatch, restartKey]);
  return count;
};

const overlayFor = (match, me, opponentName, count, pauseCount) => {
  const { phase, pause, round, roundWinner, winner, reason } = match;
  if (phase === 'over' && !winner) {
    return { text: 'La partida terminó', detail: 'Terminó mientras estabas desconectado', final: true };
  }
  // The reducer clears `pause` when the match is over.
  if (pause === 'reconnecting') return { text: 'Reconectando…' };
  if (pause === 'opponent') return { text: `Esperando a ${opponentName}…`, detail: pauseCount };
  if (pause === 'resuming') return { text: 'Reanudando', detail: pauseCount };
  if (phase === 'countdown') return { text: `Ronda ${round}`, detail: count };
  if (phase === 'lost') return { text: `Perdiste la ronda ${round}`, detail: 'Esperando al rival…' };
  if (phase === 'roundOver') {
    return { text: roundWinner === me ? `¡Ganaste la ronda ${round}!` : `Perdiste la ronda ${round}` };
  }
  if (phase === 'over') {
    const won = winner === me;
    const detail = OVER_DETAIL[reason]?.(won) ?? null;
    return { text: won ? '¡Ganaste la partida!' : 'Perdiste la partida', detail, final: true };
  }
  return null;
};

/**
 * Online 1v1: each client runs its own one-player board on @tetris/shared (S2) and the server
 * referees rounds. The engine state lives inside one effect per round; React renders the HUD.
 */
const OnlineMatch = ({ started }) => {
  const { socket, player, players: lobbyPlayers, clearMatch } = useGlobalStorage();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const { deviceType } = useDevice();
  // Touch buttons call into the game loop of the current round.
  const touchActionRef = useRef(() => {});
  const [match, dispatch] = useReducer(matchReducer, started, createMatchState);
  const stateRef = useRef(match);
  // A match restored by match-active (reload, new tab) tells the server once that its board is gone (S3).
  const rejoinPendingRef = useRef(Boolean(started.rejoin));
  const { matchId, round, seed, countdownMs, phase, pause, graceMs, resumeMs, players, wins } = match;
  const me = player?.id ?? players[0].id;
  const [mine, opponent] = players[0].id === me ? players : [players[1], players[0]];

  useEffect(() => {
    stateRef.current = match;
  }, [match]);

  // Referee messages (S4) and reconnection (match-reconnect S1-S3).
  useEffect(() => {
    if (!socket) return;
    const handlers = {
      'round-end': payload => dispatch({ type: 'round-end', payload }),
      'round-start': payload => dispatch({ type: 'round-start', payload }),
      'match-end': payload => dispatch({ type: 'match-end', payload }),
      'opponent-disconnected': payload => dispatch({ type: 'opponent-disconnected', payload }),
      'match-resume': payload => dispatch({ type: 'match-resume', payload }),
      disconnect: () => dispatch({ type: 'disconnected' }),
      // Back online after a drop: this board is still here.
      'match-active': payload => {
        if (shouldRejoin(stateRef.current, payload)) socket.emit('match-rejoin', rejoinMessage(stateRef.current));
      }
    };
    Object.entries(handlers).forEach(([event, handler]) => socket.on(event, handler));
    // Listeners first: the answer to match-rejoin may come at once. The ref survives StrictMode's double effect.
    if (rejoinPendingRef.current) {
      rejoinPendingRef.current = false;
      socket.emit('match-rejoin', rejoinMessage(stateRef.current));
    }
    return () => Object.entries(handlers).forEach(([event, handler]) => socket.off(event, handler));
  }, [socket]);

  // Back online without a match-active: the server already ended the match while this client was away.
  const selfIdle = lobbyPlayers.some(entry => entry.id === me && entry.status === 'idle');
  useEffect(() => {
    if (selfIdle) dispatch({ type: 'match-gone' });
  }, [selfIdle]);

  // The round result stays up for ROUND_RESULT_MS before the next countdown.
  useEffect(() => {
    if (phase !== 'roundOver') return;
    const timer = setTimeout(() => dispatch({ type: 'result-shown' }), ROUND_RESULT_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  // 3-2-1 before every round.
  const count = useCountdown(phase === 'countdown', countdownMs, 'countdown-done', dispatch, round);
  // Seconds left of the opponent's grace, or of the countdown before a paused round goes on.
  const resuming = pause === 'resuming';
  const pauseCount = useCountdown(
    resuming || pause === 'opponent',
    resuming ? resumeMs : graceMs,
    resuming ? 'resume-done' : null,
    dispatch,
    pause
  );

  // One fresh game per round, same seed on both clients.
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = MATCH_CANVAS_COLUMNS * BLOCK_SIZE;
    canvas.height = CANVAS_ROWS * BLOCK_SIZE;
    const context = canvas.getContext('2d');
    context.scale(BLOCK_SIZE, BLOCK_SIZE);

    let game = createGame({ seed });
    let opponentBoard = emptyBoard();
    let inputs = [createInput(), createInput()];
    let lastTime = null;
    let sinceBoard = BOARD_SEND_MS;
    let frame = 0;

    const playing = () => isPlaying(stateRef.current) && !game.over;
    touchActionRef.current = action => playing() && apply(act(game, 0, action));
    const sendBoard = () => socket?.emit('match-board', { matchId, round, board: buildSnapshot(game) });

    const apply = result => {
      game = result.game;
      result.events.forEach(event => {
        if (event.type === 'clear' && event.sent > 0) {
          socket?.emit('match-garbage', { matchId, round, lines: event.sent });
        }
        if (event.type === 'topOut') {
          sendBoard();
          socket?.emit('match-topout', { matchId, round });
          dispatch({ type: 'topout' });
        }
      });
    };

    // Messages from another round are stale: ignore them.
    const onGarbage = message => {
      if (message.round === round) game = receiveGarbage(game, 0, message.lines).game;
    };
    const onBoard = message => {
      if (message.round === round) opponentBoard = message.board;
    };

    // Same capture-phase keyboard as the local view; A4: every binding drives this board.
    const claim = event => {
      event.preventDefault();
      event.stopPropagation();
    };

    const onKeyDown = event => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const binding = KEY_BINDINGS[event.code];
      // Outside play, Space/Enter must still activate the overlay buttons.
      if (!binding || !playing()) return;
      claim(event);
      press(inputs[binding.player], binding.action).forEach(action => apply(act(game, 0, action)));
    };

    const onKeyUp = event => {
      const binding = KEY_BINDINGS[event.code];
      if (!binding) return;
      release(inputs[binding.player], binding.action);
      if (playing()) claim(event);
    };

    // Key-up events are lost while the window is unfocused: forget every held key.
    const onBlur = () => {
      inputs = [createInput(), createInput()];
    };

    const gamepads = createGamepadPoller();

    const loop = time => {
      const delta = lastTime === null ? 0 : Math.min(time - lastTime, MAX_FRAME_MS);
      lastTime = time;
      // Gamepads: any pad drives this board (no pause online).
      pollGamepads(gamepads, navigator.getGamepads?.(), delta, playing()).forEach(({ actions }) =>
        actions.forEach(action => apply(act(game, 0, action)))
      );
      if (playing()) {
        inputs.forEach(input => update(input, delta).forEach(action => apply(act(game, 0, action))));
        apply(tick(game, delta));
        sinceBoard += delta;
        if (sinceBoard >= BOARD_SEND_MS && !game.over) {
          sinceBoard = 0;
          sendBoard();
        }
      }
      drawMatch(context, game, opponentBoard);
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    socket?.on('match-garbage', onGarbage);
    socket?.on('match-board', onBoard);
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);
    window.addEventListener('blur', onBlur);

    return () => {
      cancelAnimationFrame(frame);
      socket?.off('match-garbage', onGarbage);
      socket?.off('match-board', onBoard);
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp, true);
      window.removeEventListener('blur', onBlur);
    };
  }, [socket, matchId, round, seed]);

  const leave = () => {
    if (phase !== 'over') socket?.emit('match-leave', { matchId });
    clearMatch();
    navigate('/');
  };

  const overlay = overlayFor(match, me, opponent.name, count, pauseCount);

  return (
    <CustomLayout>
      <Card className="max-w-full">
        <CardHeader className="flex justify-between gap-4">
          <User name={mine.name} description={`Rondas: ${wins[mine.id] ?? 0}`} avatarProps={{ src: mine.image }} />
          <span className="text-small text-default-500">Mejor de 3</span>
          <User
            name={opponent.name}
            description={`Rondas: ${wins[opponent.id] ?? 0}`}
            avatarProps={{ src: opponent.image }}
          />
        </CardHeader>
        <Divider />
        <CardBody className="items-center gap-3">
          <div className="relative max-w-full">
            <canvas ref={canvasRef} className="block max-w-full h-auto rounded-md" />
            {overlay && (
              <Pause text={overlay.text}>
                {overlay.detail ? <p className="text-2xl font-bold text-white">{overlay.detail}</p> : null}
                {overlay.final ? (
                  <Button color="warning" onPress={leave}>
                    Volver al lobby
                  </Button>
                ) : null}
              </Pause>
            )}
          </div>
          <ul className="text-tiny text-default-500 text-center">
            {ONLINE_CONTROLS_LEGEND.map(line => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          {phase !== 'over' ? (
            <Button color="danger" variant="flat" size="sm" onPress={leave}>
              Abandonar
            </Button>
          ) : null}
        </CardBody>
        <Divider />
        <CardFooter>
          {/* Touch controls (shown by default on touch devices); no pause online. */}
          <Keys show={deviceType !== 'unknown'} onAction={action => touchActionRef.current(action)} />
        </CardFooter>
      </Card>
    </CustomLayout>
  );
};

/**
 * /match: without a match in the store (e.g. after a refresh) there is nothing to play.
 * A new match-start while on /match (rematch from the result screen) remounts with fresh state.
 */
const Match = () => {
  const { match } = useGlobalStorage();
  return match ? <OnlineMatch key={match.matchId} started={match} /> : <Navigate to="/" replace />;
};

export default Match;
