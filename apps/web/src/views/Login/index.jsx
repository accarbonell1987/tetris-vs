import React, { useEffect, useState } from 'react';

import { Button, Chip, Avatar, Spinner } from '@nextui-org/react';
import { CustomLayout, CustomCard } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useFetchAvatars } from '../../hooks';
import { fetchRandomAvatars } from '../../services/api/servicesAvatars';
import { GetImage } from '../../utils/images';

const SubmitButtonPresentational = () => {
  return (
    <Button type={'submit'} color="primary">
      Login
    </Button>
  );
};

const ListOfAvatars = ({ data }) => {
  if (!data) return;

  return (
    <div className="flex gap-x-10">
      {data?.map((avatar, index) => {
        const image = GetImage(avatar);
        return <Avatar key={`avatar-${index}`} className="w-20 h-20 text-large" src={image} />;
      })}
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

const Error = message => {
  return (
    <div className="flex gap-4">
      <h1>{message}</h1>
    </div>
  );
};

const Login = () => {
  // const [avatars, setAvatars] = useState({ data: null, loading: true, error: null });

  // const getAvatars = async () => {
  //   const amountAvatarsToLoad = 4;
  //   const response = await fetchRandomAvatars(amountAvatarsToLoad);
  //   console.log('🚀 ~ getAvatars ~ response:', response);
  //   setAvatars({ data: response, loading: false, error: null });
  // };

  // useEffect(() => {
  //   getAvatars();
  // }, []);

  const { data, error, isLoading } = useFetchAvatars();

  const component = isLoading ? (
    <Loading />
  ) : error ? (
    <Error message={error} />
  ) : (
    <CustomCard header={ListOfAvatars({ data })} />
  );

  return <CustomLayout>{component}</CustomLayout>;
};

export default Login;
