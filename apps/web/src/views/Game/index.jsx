import { useState, useEffect, useRef } from 'react';
import { CustomLayout } from '../../components';
import { inject } from './tetris.js';
import { Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react';
import { NextChip, Player } from './components';
import { useDevice } from '../../hooks';
import { GAME } from './static/commons.js';
import Keys from './components/Keys.jsx';

const GameComponentPresentational = ({ gameRef, player, enemy, totalScore, device }) => {
  return (
    <CustomLayout>
      <div className="flex flex-row gap-5">
        <Card className="max-w-[400px]">
          <CardHeader className="flex gap-3 justify-center">
            <div className="flex h-7 justify-evenly items-center space-x-4 text-small">
              <Player
                name={player?.name}
                image={player?.image}
                score={`${player?.score} / ${totalScore}`}
                description={'CAMARADA'}
              />
              <Divider orientation="vertical" />
              <Player
                name={enemy?.name}
                image={enemy?.image}
                score={`${enemy?.score} / ${totalScore}`}
                description={'TENIENTE'}
              />
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="relative ">
            {/* {gameState.paused ? <Pause text={'Pausa'} /> : null} */}
            <section className="flex justify-evenly items-center space-x-4 text-small">
              <NextChip player={player} />
              <Divider orientation="vertical" />
              <NextChip player={player} />
            </section>
            <canvas id="game-canvas" className="z-0 max-w-[288px] max-h-[480px]" ref={gameRef} />
          </CardBody>
          <Divider />
          <CardFooter>
            <Keys show={device !== 'unknown'} />
          </CardFooter>
          {/* <CardFooter>
      <Keys />
    </CardFooter> */}
        </Card>
      </div>
    </CustomLayout>
  );
};

const GameComponent = ({ player, enemy, totalScore }) => {
  const { deviceType } = useDevice();
  const gameRef = useRef(null);

  const initialGameState = { ...GAME.state, maxScore: totalScore };

  const [gameState, setGameState] = useState(initialGameState);
  const [playerState, setPlayerState] = useState({ ...player, id: 1 });
  const [enemyState, setEnemyState] = useState({ ...enemy, id: 2 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !gameRef.current.hasChildNodes()) {
      inject({ gameState, setGameState, playerState, setPlayerState });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (!mounted) return;

  return (
    <GameComponentPresentational
      gameRef={gameRef}
      player={playerState}
      enemy={enemyState}
      totalScore={totalScore}
      device={deviceType}
    />
  );
};

export default GameComponent;
