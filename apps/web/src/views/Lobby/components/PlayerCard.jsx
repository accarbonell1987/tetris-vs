import React from 'react';

import { Card, User, Button } from '@nextui-org/react';

const PlayerCard = ({ key, name, avatar }) => {
  return (
    <Card key={key} variant="border" style={{ border: '1px solid #f0f0f0' }}>
      <div className="flex flex-row justify-between items-center p-4">
        <User
          name={name}
          avatarProps={{
            src: avatar
          }}
        />
        <Button size="md" variant="ghost" style={{ border: '1px solid #f0f0f0' }}>
          VS
        </Button>
      </div>
    </Card>
  );
};

export default PlayerCard;
