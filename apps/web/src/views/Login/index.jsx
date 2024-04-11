import React, { useEffect, useState } from 'react';

import { Button, Chip, Avatar, Spinner, Input, Divider } from '@nextui-org/react';
import { CustomLayout, CustomCard } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useFetchAvatars } from '../../hooks';
import { GetImage } from '../../utils/images';

const SubmitButtonPresentational = () => {
  return (
    <Button type={'submit'} color="primary">
      Entrar
    </Button>
  );
};

const ListOfAvatars = ({ data, selected,  setSelected, setSelectedAvatar }) => {
  if(!data) return null;
  return (
    <div className="flex gap-x-10">
      {data?.map((avatar, index) => {
        const image = GetImage(avatar);
        return <Avatar key={`avatar-${index}`} className="w-20 h-20 text-large"  src={image} isBordered={false} color='primary' onClick={() => {
          setSelectedAvatar({index: index , image: image})
        }} />;
      })}
    </div>
  );
};

const NicknameInput = ({selectedAvatar}) => {
  return (
    <div className='flex flex-col gap-y-3'>
      <label htmlFor="nickname">
        Como deseas llamarte?:
      </label>
      <div className='flex flex-row gap-3 '>
        <Avatar key={`avatar-${selectedAvatar.index}`} src={selectedAvatar.image} className='w-16'/>
        <Input
          id='nickname'
          isRequired
          type="text"
          placeholder="Ingresa tu nickname"
        />
        <SubmitButtonPresentational />
      </div>
    </div>
  )
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
  const [selected, setSelected] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState
  ({index: null, image: false});
  
  const { data, error, isLoading } = useFetchAvatars();

  const component = isLoading ? (
    <Loading />
  ) : error ? (
    <Error message={error} />
  ) : (
    <CustomCard header={ListOfAvatars({ data, selected, setSelected, setSelectedAvatar })} headDivider={true} body={NicknameInput({selectedAvatar})} />
  );

  return <CustomLayout>{component}</CustomLayout>;
};

export default Login;
