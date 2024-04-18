import { useState } from 'react';
import { UserTwitterCard } from '../../../components';

import { Popover, PopoverTrigger, PopoverContent, User } from '@nextui-org/react';
import { Music } from '../func/music';

const Player = ({ name, description, score, image }) => {
  const [musicState, setMusicState] = useState(false);

  const changeMusicState = () => {
    !musicState ? Music.pause() : Music.play();
    setMusicState(!musicState);
  };

  return (
    <Popover showArrow placement="bottom">
      <PopoverTrigger>
        <User
          as="button"
          name={name}
          description={score}
          className="transition-transform"
          avatarProps={{
            src: image
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="p-1">
        <UserTwitterCard
          name={name}
          image={image}
          score={score}
          description={description}
          music={[musicState, changeMusicState]}
        />
      </PopoverContent>
    </Popover>
  );
};

export default Player;
