import { useState, useEffect, useRef } from 'react';
import { CustomLayout } from '../../components';
import { inject } from './tetris.js';
import { Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react';
import { Player } from './components';
import { useDevice } from '../../hooks';
import { GAME } from './static/commons.js';
import Keys from './components/Keys.jsx';

const GameComponentPresentational = ({ gameRef, player1, player2, totalScore, device }) => {
  return (
    <CustomLayout>
      <div className="flex flex-row gap-5">
        <Card className="max-w-[400px]">
          <CardHeader className="flex gap-3 justify-center">
            <div className="flex h-7 justify-evenly items-center space-x-4 text-small">
              <Player
                name={player1?.name}
                image={player1?.image}
                score={`${player1?.score} / ${totalScore}`}
                description={'CAMARADA'}
              />
              <Divider orientation="vertical" />
              <Player
                name={player2?.name}
                image={player2?.image}
                score={`${player2?.score} / ${totalScore}`}
                description={'TENIENTE'}
              />
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="relative ">
            {/* {gameState.paused ? <Pause text={'Pausa'} /> : null} */}
            <canvas className="z-0 max-w-[288px] max-h-[480px]" ref={gameRef}></canvas>
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

const GameComponent = ({ player1, player2, totalScore }) => {
  const { deviceType } = useDevice();
  const gameRef = useRef(null);

  const initialGameState = { ...GAME.state, maxScore: totalScore };

  const [gameState, setGameState] = useState(initialGameState);
  const [playerState, setPlayerState] = useState(player1);
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

  useEffect(() => {
    console.log(playerState);
  }, [playerState]);

  if (!mounted) return;

  return (
    <GameComponentPresentational
      gameRef={gameRef}
      player1={player1}
      player2={player2}
      totalScore={totalScore}
      device={deviceType}
    />
  );
};

export default GameComponent;
