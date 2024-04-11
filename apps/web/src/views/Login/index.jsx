import React, { useEffect, useState } from 'react';

import { Button, Chip, Avatar, Spinner, Input, AvatarGroup } from '@nextui-org/react';
import { CustomLayout, CustomCard } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useFetchAvatars } from '../../hooks';
import { GetImage } from '../../utils/images';

const SubmitButtonPresentational = () => {
  const onClick = () => {};
  return (
    <Button type={'submit'} color="primary" onClick={onClick}>
      Entrar
    </Button>
  );
};

const ListOfAvatars = ({ data, setSelectedAvatar }) => {
  const [selected, setSelected] = useState(false);

  if (!data) return null;

  return (
    <div className="flex gap-x-3">
      {data?.map((image, index) => {
        return (
          <Avatar
            key={`avatar-${index}`}
            className="w-20 h-20 text-large"
            src={image}
            isBordered={selected}
            color="primary"
            onClick={() => {
              setSelected(!selected);
              setSelectedAvatar({ index: index, image: image });
            }}
          />
        );
      })}
    </div>
  );
};

const NicknameInput = ({ selectedAvatar }) => {
  const [value, setValue] = useState('');

  return (
    <div className="flex flex-col gap-y-3">
      <label htmlFor="nickname">Como deseas llamarte?:</label>
      <div className="flex flex-row gap-3 ">
        <Avatar
          key={`avatar-${selectedAvatar.index}`}
          src={selectedAvatar.image}
          className="w-16"
        />
        <Input
          id="nickname"
          isRequired
          value={value}
          onValueChange={setValue}
          type="text"
          placeholder="Ingresa tu nickname"
        />
        <SubmitButtonPresentational />
      </div>
    </div>
  );
};

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
  const [selectedAvatar, setSelectedAvatar] = useState({ index: null, image: false });

  const { data, error, isLoading } = useFetchAvatars();

  const component = isLoading ? (
    <Loading />
  ) : error ? (
    <Error message={error} />
  ) : (
    <CustomCard
      header={<ListOfAvatars data={data} setSelectedAvatar={setSelectedAvatar} />}
      headDivider={true}
      body={<NicknameInput selectedAvatar={selectedAvatar} />}
    />
  );

  return <CustomLayout>{component}</CustomLayout>;
};

export default Login;
