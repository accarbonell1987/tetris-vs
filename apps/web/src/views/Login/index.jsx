import React, { useEffect, useState } from 'react';

import { Button, Chip, Avatar, Spinner } from '@nextui-org/react';
import { CustomLayout, CustomCard } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useFetchAvatars } from '../../hooks';
import { fetchRandomAvatars } from '../../services/api/servicesAvatars';

const SubmitButtonPresentational = () => {
  return (
    <Button type={'submit'} color="primary">
      Login
    </Button>
  );
};

const ListOfAvatars = ({ avatars }) => {
  return (
    <div className="flex gap-0">
      <Avatar className="w-20 h-20 text-large" src="" />
    </div>
  );
};

const Loading = () => {
  return (
    <div className="flex gap-4">
      <Spinner label="Default" color="default" labelColor="foreground" />
    </div>
  );
};

const Login = () => {
  const [avatars, setAvatars] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    const response = fetchRandomAvatars({ amount: 4 });
    if (response.status === 200) setAvatars({ data: response.data, loading: false, error: null });
    else setAvatars({ data: null, loading: false, error: response.error });
  }, []);

  return (
    <CustomLayout>
      {avatars.loading ? (
        <Loading />
      ) : (
        <CustomCard header={ListOfAvatars({ avatars: avatars.data })} />
      )}
    </CustomLayout>
  );
};

export default Login;
