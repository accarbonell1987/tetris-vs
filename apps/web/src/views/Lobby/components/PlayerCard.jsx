import React from 'react';

import { Card, User, Button, useDisclosure } from '@nextui-org/react';
import PlayerScore from './PlayerScore';

const PlayerCard = ({ index, name, avatar }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Card key={index} variant="border" style={{ border: '1px solid #f0f0f0' }}>
      <div className="flex flex-row justify-between items-center p-4">
        <User
          name={name}
          avatarProps={{
            src: avatar
          }}
        />
        <Button size="md" variant="ghost" style={{ border: '1px solid #f0f0f0' }} onPress={onOpen}>
          VS
        </Button>
        <PlayerScore useDisclosure={{ isOpen, onOpenChange }} />
      </div>
    </Card>
  );
};

export default PlayerCard;
