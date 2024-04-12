import { useEffect, useState } from 'react';

import { Spinner } from '@nextui-org/react';
import { CustomLayout, CustomCard } from '../../components';
import { useFetchAvatars } from '../../hooks';
import { ListOfAvatars, PlayerForm } from './components';
import { useNavigate } from 'react-router-dom';
import { useGlobalStorage } from '../../store';
import { isExpiredDate } from './func/functions';

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
    setPlayer({ name: playerState.name, image: playerState.image });
    localStorage.setItem('user', JSON.stringify(playerState));
    localStorage.setItem('saveTime', Date.now());
    navigate('/');
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const saveTime = new Date(parseInt(localStorage.getItem('saveTime')));
    if (user) {
      const { name, image } = user;
      const isExpiredTime = isExpiredDate(saveTime);
      if (isExpiredTime) {
        localStorage.removeItem('user');
      } else {
        setPlayerState({ name, image });
      }
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
