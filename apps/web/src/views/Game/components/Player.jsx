import { useState } from 'react';
import { UserTwitterCard } from '../../../components';

import { Popover, PopoverTrigger, PopoverContent, User } from '@nextui-org/react';
import { Music } from '../func/music';

/**
 * Componente que muestra la información del jugador (nombre, avatar, puntuación)
 * y permite abrir un Popover con más detalles y controles de música.
 */
const Player = ({ name, description, score, image }) => {
  // Estado local para reflejar si la música está silenciada en la UI
  const [musicState, setMusicState] = useState(Music.isMuted);

  /** Alterna el estado de silencio de la música */
  const changeMusicState = () => {
    Music.mute();
    setMusicState(!musicState);
  };

  return (
    <Popover showArrow placement="bottom">
      <PopoverTrigger>
        {/* Avatar y resumen del jugador */}
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
        {/* Detalle ampliado del jugador (Card estilo Twitter) */}
        <UserTwitterCard
          name={name}
          image={image}
          score={score}
          description={description}
          music={[musicState, changeMusicState]} // Pasamos estado y función de control de música
        />
      </PopoverContent>
    </Popover>
  );
};

export default Player;
