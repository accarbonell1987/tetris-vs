import React, { useRef, useState, useEffect } from 'react';
import { CustomLayout } from '../../components';
import { inject, setGameIntance } from './tetris.js';
import { Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react';
import { Player } from './components';
import { useDevice } from '../../hooks';
import { Game } from './classes/game';

const GameComponent = () => {
  const gameRef = useRef(null);

  const [game, setGame] = useState({ gameObject: null, mounted: false });
  const { deviceType } = useDevice();

  useEffect(() => {
    const gameObject = new Game();

    setGameIntance(gameObject);
    setGame({ gameObject, mounted: true });
  }, []);

  useEffect(() => {
    if (game.mounted && !gameRef.current.hasChildNodes()) {
      inject(gameRef.current);
    }
  }, [game.mounted]);

  if (!game.mounted) return;

  return (
    <CustomLayout>
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3 justify-center">
          <div className="flex h-7 justify-evenly items-center space-x-4 text-small">
            <Player
              name={'Piño'}
              image={'https://i.pravatar.cc/150?u=a042581f4e29026024d'}
              score={`${0} / 3000`}
              description={'CAMARADA'}
            />
            <Divider orientation="vertical" />
            <Player
              name={'Tunga'}
              image={'https://i.pravatar.cc/150?u=a04258114e29026702d'}
              score={`${0} / 3000`}
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
