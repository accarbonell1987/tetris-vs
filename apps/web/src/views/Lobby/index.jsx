import React from 'react';

import { Card, CardHeader, CardBody } from '@nextui-org/react';
import PlayerCard from './components/PlayerCard';
import { CustomLayout } from '../../components';

const Lobby = () => {
  //Data for mock
  const users = [
    { name: 'User Name 1', avatar: 'https://i.pravatar.cc/300' },
    { name: 'User Name 2', avatar: 'https://i.pravatar.cc/301' },
    { name: 'User Name 3', avatar: 'https://i.pravatar.cc/302' },
    { name: 'User Name 4', avatar: 'https://i.pravatar.cc/303' },
    { name: 'User Name 5', avatar: 'https://i.pravatar.cc/304' },
    { name: 'User Name 6', avatar: 'https://i.pravatar.cc/305' },
    { name: 'User Name 7', avatar: 'https://i.pravatar.cc/306' },
    { name: 'User Name 8', avatar: 'https://i.pravatar.cc/307' },
    { name: 'User Name 9', avatar: 'https://i.pravatar.cc/308' },
    { name: 'User Name 10', avatar: 'https://i.pravatar.cc/309' }
  ];

  return (
    <CustomLayout>
      <Card
        className="flex w-full max-w-[600px] max-h-[70%] min-w-[180px]"
        variant="bordered"
        style={{ border: '1px solid #f0f0f0' }}>
        <CardHeader>
          <h1>Lobby</h1>
        </CardHeader>
        <CardBody className="overflow-auto scrollbar-hide max-h-screen">
          <div className="flex flex-col gap-3">
            {users.map((user, index) => (
              <PlayerCard key={index} index={index} name={user.name} avatar={user.avatar} />
            ))}
          </div>
        </CardBody>
      </Card>
    </CustomLayout>
  );
};

export default Lobby;
