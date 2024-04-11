import { useState } from 'react';

import { Spinner } from '@nextui-org/react';
import { CustomLayout, CustomCard } from '../../components';
import { useFetchAvatars } from '../../hooks';
import { ListOfAvatars, PlayerForm } from './components';
import { useNavigate } from 'react-router-dom';

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
  const [selectedAvatar, setSelectedAvatar] = useState({ id: null, image: null });
  const { data, error, isLoading } = useFetchAvatars();

  const component = isLoading ? (
    <Loading />
  ) : error ? (
    <Error message={error} />
  ) : (
    <CustomCard
      header={
        <ListOfAvatars
          data={data}
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
        />
      }
      headDivider={true}
      body={<PlayerForm selectedAvatar={selectedAvatar} />}
    />
  );

  return <CustomLayout>{component}</CustomLayout>;
};

export default Login;
