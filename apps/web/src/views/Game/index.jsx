import { useEffect, useRef, useState } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react';
import { createGame, act, tick } from '@tetris/shared';
import { CustomLayout } from '../../components';
import { useDevice } from '../../hooks';
import { Player, Pause, Keys } from './components';
import { createInput, press, release, update } from './input';
import { createGamepadPoller, pollGamepads } from './gamepad';
import { drawGame, gameColumns, CANVAS_ROWS } from './render';
import { Music } from './func/music';
import { BLOCK_SIZE, KEY_BINDINGS, PAUSE_KEYS, CONTROLS_LEGEND, GAME_CARD, CANVAS_FRAME, CANVAS } from './static/commons';

// A long frame (e.g. after switching tabs) must not drop pieces several rows at once.
const MAX_FRAME_MS = 100;

const initialHud = { scores: [0, 0], paused: true, winner: null };

/**
 * Presentational component: header with both players, the canvas and the controls.
 */
const GameComponentPresentational = ({
  canvasRef,
  player,
  enemy,
  hud,
  totalScore,
  isTouch,
  onPress,
  onRelease,
  onPause,
  onRematch
}) => {
  const winnerName = hud.winner === null ? null : [player, enemy][hud.winner]?.name;

  return (
    <CustomLayout>
      <Card className={GAME_CARD}>
        <CardHeader className="flex gap-3 justify-center">
          <div className="flex h-7 space-x-4 text-small w-full">
            <div className="flex justify-start w-1/2">
              <Player
                name={player?.name}
                image={player?.image}
                score={`${hud.scores[0]} / ${totalScore}`}
                description={'CAMARADA'}
              />
            </div>
            <Divider orientation="vertical" />
            <div className="flex justify-end w-1/2">
              <Player
                name={enemy?.name}
                image={enemy?.image}
                score={`${hud.scores[1]} / ${totalScore}`}
                description={'TENIENTE'}
              />
            </div>
          </div>
        </CardHeader>
        <Divider />

        <CardBody className="min-h-0 flex-1 items-center gap-3 py-2 sm:py-3">
          <div className={CANVAS_FRAME}>
            <canvas ref={canvasRef} className={CANVAS} />
            {winnerName !== null ? (
              <Pause text={`¡Ganó ${winnerName}!`}>
                <Button color="warning" onPress={onRematch}>
                  Revancha
                </Button>
              </Pause>
            ) : (
              hud.paused && (
                <Pause text="PAUSA">
                  <Button color="warning" onPress={onPause}>
                    Jugar
                  </Button>
                </Pause>
              )
            )}
          </div>
          {/* Keyboard and gamepad help; touch screens use the buttons below instead. */}
          {isTouch ? null : (
            <ul className="text-tiny text-default-500 text-center">
              {CONTROLS_LEGEND.map(line => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
        </CardBody>
        <Divider />

        <CardFooter>
          {/* Touch controls for player 1 (shown by default on touch devices) */}
          <Keys show={isTouch} onPress={onPress} onRelease={onRelease} onPause={onPause} />
        </CardFooter>
      </Card>
    </CustomLayout>
  );
};

/**
 * Container component: runs a local shared-board match on @tetris/shared.
 * The engine state lives inside the effect; React only renders the HUD.
 */
const GameComponent = ({ player, enemy, totalScore }) => {
  const { isSmallScreen, isTouch } = useDevice();
  const canvasRef = useRef(null);
  const controlsRef = useRef({ press: () => {}, release: () => {}, togglePause: () => {} });
  // Read by the render loop every frame: switching layouts must not restart the match.
  const layoutRef = useRef('wide');
  layoutRef.current = isSmallScreen ? 'compact' : 'wide';
  const [hud, setHud] = useState(initialHud);
  const [round, setRound] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let sizedFor = null;

    let game = createGame({ players: 2, targetScore: totalScore });
    let inputs = [createInput(), createInput()];
    const touchInput = createInput(); // on-screen buttons drive player 1
    let paused = true;
    let lastTime = null;
    let frame = 0;

    const syncHud = () =>
      setHud({
        scores: game.players.map(({ score }) => score),
        paused,
        winner: game.over ? game.winner : null
      });

    const apply = result => {
      game = result.game;
      if (result.events.some(({ type }) => type !== 'lock')) syncHud();
      if (game.over) Music.pause();
    };

    const playing = () => !paused && !game.over;

    controlsRef.current = {
      press: action => {
        if (playing()) press(touchInput, action).forEach(next => apply(act(game, 0, next)));
      },
      release: action => release(touchInput, action),
      togglePause: () => {
        if (game.over) return;
        paused = !paused;
        if (paused) Music.pause();
        else Music.play();
        syncHud();
      }
    };

    // Game keys are captured before any focused button sees them: NextUI buttons swallow
    // Space/Enter and would also fire their own action.
    const claim = event => {
      event.preventDefault();
      event.stopPropagation();
    };

    const onKeyDown = event => {
      // Leave browser/OS shortcuts (Cmd+D, Ctrl+S...) alone.
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (PAUSE_KEYS.includes(event.code)) {
        claim(event);
        if (!event.repeat) controlsRef.current.togglePause();
        return;
      }
      const binding = KEY_BINDINGS[event.code];
      // While paused or finished, Space/Enter must still activate the overlay buttons.
      if (!binding || !playing()) return;
      claim(event);
      press(inputs[binding.player], binding.action).forEach(action =>
        apply(act(game, binding.player, action))
      );
    };

    const onKeyUp = event => {
      const binding = KEY_BINDINGS[event.code];
      if (!binding) return;
      release(inputs[binding.player], binding.action);
      // Buttons fire on key-up: let them have it while paused or finished.
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
      // Gamepads: the first pad plays P1, the second P2; Options / Start pauses.
      pollGamepads(gamepads, navigator.getGamepads?.(), delta, playing()).forEach(({ slot, actions, pause }) => {
        if (pause) controlsRef.current.togglePause();
        if (slot < 2) actions.forEach(action => apply(act(game, slot, action)));
      });
      if (playing()) {
        inputs.forEach((input, index) =>
          update(input, delta).forEach(action => apply(act(game, index, action)))
        );
        update(touchInput, delta).forEach(action => apply(act(game, 0, action)));
        apply(tick(game, delta));
      }
      if (sizedFor !== layoutRef.current) {
        sizedFor = layoutRef.current;
        // Resizing a canvas also resets its transform.
        canvas.width = gameColumns(sizedFor) * BLOCK_SIZE;
        canvas.height = CANVAS_ROWS * BLOCK_SIZE;
        context.scale(BLOCK_SIZE, BLOCK_SIZE);
      }
      drawGame(context, game, sizedFor);
      frame = requestAnimationFrame(loop);
    };

    Music.init();
    setHud(initialHud);
    frame = requestAnimationFrame(loop);
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);
    window.addEventListener('blur', onBlur);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp, true);
      window.removeEventListener('blur', onBlur);
      Music.pause();
    };
  }, [round, totalScore]);

  return (
    <GameComponentPresentational
      canvasRef={canvasRef}
      player={player}
      enemy={enemy}
      hud={hud}
      totalScore={totalScore}
      isTouch={isTouch}
      onPress={action => controlsRef.current.press(action)}
      onRelease={action => controlsRef.current.release(action)}
      onPause={() => controlsRef.current.togglePause()}
      onRematch={() => setRound(value => value + 1)}
    />
  );
};

export default GameComponent;
