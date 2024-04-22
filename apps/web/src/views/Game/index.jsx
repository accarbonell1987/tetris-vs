import { useState, useEffect, useRef } from 'react';
import { CustomLayout } from '../../components';
import { inject } from './tetris.js';
import { Card, CardHeader, CardBody, CardFooter, Divider, Chip } from '@nextui-org/react';
import { NextChip, Player } from './components';
import { useDevice } from '../../hooks';
import { GAME } from './static/commons.js';
import Keys from './components/Keys.jsx';

const GameComponentPresentational = ({ gameRef, player, enemy, totalScore, device }) => {
  return (
    <CustomLayout>
      <div className="flex flex-row gap-5">
        <Card className="max-w-[360px]">
          <CardHeader className="flex gap-3 justify-center">
            <div className="flex h-7 items- space-x-4 text-small">
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
            <div className="flex flex-col items-center gap-2 min-w-[257px]">
              <Chip color="warning" variant="bordered">
                Siguiente Ficha
              </Chip>
              <section className="flex justify-evenly items-center space-x-4 text-small min-h-[72px]">
                <NextChip player={player} />
                <Divider orientation="vertical" />
                <NextChip player={enemy} />
              </section>
            </div>
            <section className="flex justify-center  rounded-md border-solid border-color: rgb(245, 165, 36)">
              <canvas id="game-canvas" className="z-0 rounded-md " ref={gameRef} />
            </section>
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
  const [playerState, setPlayerState] = useState(player);
  const [enemyState, setEnemyState] = useState(enemy);
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
      enemy={{ ...enemy, piece: playerState.piece, id: 2 }}
      totalScore={totalScore}
      device={deviceType}
    />
  );
};

export default GameComponent;
