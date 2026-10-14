import { useEffect, useRef, useState } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react';
import { createGame, act, tick } from '@tetris/shared';
import { CustomLayout } from '../../components';
import { useDevice } from '../../hooks';
import { Player, Pause, Keys } from './components';
import { createInput, press, release, update } from './input';
import { drawGame, CANVAS_COLUMNS, CANVAS_ROWS } from './render';
import { Music } from './func/music';
import { BLOCK_SIZE, KEY_BINDINGS, PAUSE_KEYS, CONTROLS_LEGEND } from './static/commons';

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
  device,
  onAction,
  onPause,
  onRematch
}) => {
  const winnerName = hud.winner === null ? null : [player, enemy][hud.winner]?.name;

  return (
    <CustomLayout>
      <Card className="max-w-full">
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

        <CardBody className="items-center gap-3">
          <div className="relative max-w-full">
            <canvas ref={canvasRef} className="block max-w-full h-auto rounded-md" />
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
          <ul className="text-tiny text-default-500 text-center">
            {CONTROLS_LEGEND.map(line => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </CardBody>
        <Divider />

        <CardFooter>
          {/* Touch controls for player 1 (shown by default on touch devices) */}
          <Keys show={device !== 'unknown'} onAction={onAction} onPause={onPause} />
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
  const { deviceType } = useDevice();
  const canvasRef = useRef(null);
  const controlsRef = useRef({ action: () => {}, togglePause: () => {} });
  const [hud, setHud] = useState(initialHud);
  const [round, setRound] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = CANVAS_COLUMNS * BLOCK_SIZE;
    canvas.height = CANVAS_ROWS * BLOCK_SIZE;
    const context = canvas.getContext('2d');
    context.scale(BLOCK_SIZE, BLOCK_SIZE);

    let game = createGame({ players: 2, targetScore: totalScore });
    let inputs = [createInput(), createInput()];
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
      action: action => playing() && apply(act(game, 0, action)),
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

    const loop = time => {
      const delta = lastTime === null ? 0 : Math.min(time - lastTime, MAX_FRAME_MS);
      lastTime = time;
      if (playing()) {
        inputs.forEach((input, index) =>
          update(input, delta).forEach(action => apply(act(game, index, action)))
        );
        apply(tick(game, delta));
      }
      drawGame(context, game);
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
      device={deviceType}
      onAction={action => controlsRef.current.action(action)}
      onPause={() => controlsRef.current.togglePause()}
      onRematch={() => setRound(value => value + 1)}
    />
  );
};

export default GameComponent;
