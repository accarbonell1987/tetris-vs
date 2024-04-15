import { useEffect, useState } from 'react';

import { Spinner } from '@nextui-org/react';
import { CustomLayout, CustomCard } from '../../components';
import { useFetchAvatars } from '../../hooks';
import { ListOfAvatars, PlayerForm } from './components';
import { useNavigate } from 'react-router-dom';
import { useGlobalStorage } from '../../store';
import { StorageService } from '../../services/localStorageService';

const Loading = () => {
  return (
    <div className="flex gap-4">
      <Spinner label="Cargando" color="default" labelColor="foreground" />
    </div>
  );
};

const Error = message => {
  return (
    <div className="flex gap-4">
      <h1>{message}</h1>
    </div>
  );
};

const Login = () => {
  const [playerState, setPlayerState] = useState({ id: null, name: '', image: null });

  const { data, error, isLoading } = useFetchAvatars();
  const { player, setPlayer } = useGlobalStorage();

  const navigate = useNavigate();

  const handleGo = () => {
    setPlayer({ name: playerState.name, image: playerState.image, loggedIn: true });

    // Storage in LocalStorage*
    const storageValue = { user: { ...playerState, loggedIn: true }, saveTime: Date.now() };
    StorageService.setItem('tetris', storageValue);

    navigate('/');
  };

  useEffect(() => {
    // Get Data from LocalStorage
    const storageValue = StorageService.getItem('tetris');
    if (!storageValue) navigate('/login');

    if (storageValue?.user) {
      const { name, image } = storageValue.user;

      const isExpiredTime = StorageService.isExpired();
      if (isExpiredTime) StorageService.removeItem('tetris');
      else setPlayerState({ name, image });
    }
  }, []);

  const component = isLoading ? (
    <Loading />
  ) : error ? (
    <Error message={error} />
  ) : (
    <CustomCard
      header={
        <ListOfAvatars
          data={data}
          selectedAvatar={playerState}
          setSelectedAvatar={setPlayerState}
        />
      }
      headDivider={true}
      body={
        <PlayerForm playerState={playerState} setPlayerState={setPlayerState} onClick={handleGo} />
      }
    />
  );

  return <CustomLayout>{component}</CustomLayout>;
};

export default Login;
