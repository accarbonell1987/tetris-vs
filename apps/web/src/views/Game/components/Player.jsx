import { useState } from 'react';
import { UserTwitterCard } from '../../../components';

import { Popover, PopoverTrigger, PopoverContent, User } from '@nextui-org/react';
import { Music } from '../func/music';

const Player = ({ name, description, score, image }) => {
  const [musicState, setMusicState] = useState(Music.isMuted);

  const changeMusicState = () => {
    Music.mute();
    setMusicState(!musicState);
  };

  return (
    <Popover showArrow placement="bottom">
      <PopoverTrigger>
        <User
          className="transition-transform"
          as="button"
          name={name}
          description={score}
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
