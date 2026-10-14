import { Card, User, Button, Chip } from '@nextui-org/react';

const PlayerCard = ({ name, avatar, status, isSelf, onChallenge }) => {
  return (
    <Card variant="border" style={{ border: '1px solid #f0f0f0' }}>
      <div className="flex flex-row justify-between items-center p-4">
        <User
          name={name}
          avatarProps={{
            src: avatar
          }}
        />
        {status === 'playing' ? (
          <Chip color="warning" variant="flat">
            En partida
          </Chip>
        ) : isSelf ? null : (
          <Button size="md" variant="ghost" style={{ border: '1px solid #f0f0f0' }} onPress={onChallenge}>
            VS
          </Button>
        )}
      </div>
    </Card>
  );
};

export default PlayerCard;
