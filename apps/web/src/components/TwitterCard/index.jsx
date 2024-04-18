import { Avatar, Button, Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import { Volume, VolumeOff } from 'tabler-icons-react';

const UserCard = ({ name, image, score, description, music }) => {
  const [musicState, changeMusicState] = music;

  return (
    <Card shadow="none" className="max-w-[300px] border-none bg-transparent">
      <CardHeader className="justify-between">
        <div className="flex gap-3">
          <Avatar isBordered radius="full" size="md" src={image} />
          <div className="flex flex-col items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">{name}</h4>
            <h5 className="text-small tracking-tight text-default-500">{score}</h5>
          </div>
        </div>
        <Button
          className={musicState ? 'bg-transparent text-foreground border-default-200' : ''}
          color="primary"
          radius="full"
          size="sm"
          variant={musicState ? 'bordered' : 'solid'}
          isIconOnly
          onPress={() => changeMusicState()}>
          {musicState ? (
            <VolumeOff size={24} strokeWidth={2} color={'white'} />
          ) : (
            <Volume size={24} strokeWidth={2} color={'white'} />
          )}
        </Button>
      </CardHeader>
      <CardBody className="px-3 py-0">
        <p className="text-small pl-px text-default-500">
          {description}
          <span aria-label="confetti" role="img">
            🎉
          </span>
        </p>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">4</p>
          <p className=" text-default-500 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">97.1K</p>
          <p className="text-default-500 text-small">Followers</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserCard;
