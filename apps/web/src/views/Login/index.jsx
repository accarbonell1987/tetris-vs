import { useEffect, useState } from 'react';

import { Spinner } from '@nextui-org/react';
import { CustomLayout, CustomCard } from '../../components';
import { useFetchAvatars } from '../../hooks';
import { ListOfAvatars, PlayerForm } from './components';
import { useNavigate } from 'react-router-dom';
import { useGlobalStorage } from '../../store';
import { StorageService } from '../../services/localStorageService';
import { SocketService } from '../../services/socketService';

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
  const { setPlayer } = useGlobalStorage();

  const navigate = useNavigate();

  const handleGo = () => {
    const id = Math.random().toString(36).substring(2, 9); // simple random id
    const player = { id, name: playerState.name, image: playerState.image };
    setPlayer({ ...player, loggedIn: true });

    // Storage in LocalStorage
    const storageData = { user: { ...player, loggedIn: true }, saveTime: Date.now() };
    StorageService.setItem('tetris', storageData);

    // Create socket connection and join lobby
    SocketService.createSocketService();
    SocketService.login(player);

    navigate('/');
  };

  useEffect(() => {
    const storageValue = StorageService.getItem('tetris');
    if (!storageValue) {
      // No session, stay on login page
      return;
    }

    const { user } = storageValue;
    if (!user) {
      StorageService.removeItem('tetris');
      return;
    }

    const isExpired = StorageService.isExpired();
    if (isExpired) {
      StorageService.removeItem('tetris');
      // stay on login page
      return;
    }

    // Valid session: restore player state and navigate to lobby
    const { id, name, image } = user;
    setPlayerState({ id: id || Math.random().toString(36).substring(2, 9), name, image });
    setPlayer({ ...user, loggedIn: true });
    navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
