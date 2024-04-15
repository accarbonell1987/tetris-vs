import { useRef, useState, useEffect } from 'react';
import { CustomLayout } from '../../components';
import { inject } from './tetris.js';
import { Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react';
import { Pause, Player } from './components';
import { useDevice } from '../../hooks';
import { GAME } from './static/commons.js';
import Keys from './components/Keys.jsx';

const GameComponent = ({ player1, player2, totalScore }) => {
  const gameRef = useRef(null);

  const initialGameState = { ...GAME.state, maxScore: totalScore };

  const [gameState, setGameState] = useState(initialGameState);

  const [mounted, setMounted] = useState(false);
  const { deviceType } = useDevice();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !gameRef.current.hasChildNodes()) {
      inject(gameRef.current, { gameState, setGameState });
    }
  }, [mounted, gameState, setGameState]);

  if (!mounted) return;

  return (
    <CustomLayout>
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
        <CardBody className="relative">
          {gameState.paused ? <Pause text={'Pausa'} /> : null}
          <canvas className="z-0" ref={gameRef}></canvas>
        </CardBody>
        <Divider />
        <CardFooter>
          <Keys show={deviceType !== 'unknown'} />
        </CardFooter>
        {/* <CardFooter>
          <Keys />
        </CardFooter> */}
      </Card>
    </CustomLayout>
  );
};

export default GameComponent;
