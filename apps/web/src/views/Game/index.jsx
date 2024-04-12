import { useRef, useState, useEffect } from 'react';
import { CustomLayout } from '../../components';
import { inject } from './tetris.js';
import { Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react';
import { Player } from './components';
import { useDevice } from '../../hooks';
import { GAME } from './static/commons.js';

const GameComponent = ({ player1, player2, totalScore }) => {
  const gameRef = useRef(null);

  const [gameState, setGameState] = useState();
  const [player1State, setPlayer1State] = useState();
  const [player2State, setPlayer2State] = useState();

  const [mounted, setMounted] = useState(false);
  const { deviceType } = useDevice();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !gameRef.current.hasChildNodes()) {
      const initialGameState = { ...GAME.state, maxScore: totalScore };
      const initialP1State = player1;
      const initialP2State = player2;

      const props = {
        initialGameState,
        initialP1State,
        initialP2State,
        gameState,
        setGameState,
        player1State,
        setPlayer1State,
        player2State,
        setPlayer2State
      };

      inject(gameRef.current, props);
    }
  }, [mounted]);

  if (!mounted) return;

  return (
    <CustomLayout>
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3 justify-center">
          <div className="flex h-7 justify-evenly items-center space-x-4 text-small">
            <Player
              name={player1State?.name}
              image={player1State?.image}
              score={`${player1State?.score} / ${totalScore}`}
              description={'CAMARADA'}
            />
            <Divider orientation="vertical" />
            <Player
              name={player2State?.name}
              image={player2State?.image}
              score={`${player2State?.score} / ${totalScore}`}
              description={'TENIENTE'}
            />
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <canvas ref={gameRef}></canvas>
        </CardBody>
        <Divider />
        <CardFooter>{deviceType !== 'unknown' ? 'PC' : 'Mobile'}</CardFooter>
      </Card>
    </CustomLayout>
  );
};

export default GameComponent;
