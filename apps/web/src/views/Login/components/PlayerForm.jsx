import { useState } from 'react';

import { Avatar, Input, Button } from '@nextui-org/react';

const PlayerForm = ({ selectedAvatar, onClick }) => {
  const [value, setValue] = useState('');

  return (
    <div className="flex flex-col gap-y-3">
      <label htmlFor="nickname">Como deseas llamarte?:</label>
      <div className="flex flex-row gap-3 ">
        <Avatar src={selectedAvatar.image} className="w-16" />
        <Input
          id="nickname"
          isRequired
          value={value}
          onValueChange={setValue}
          type="text"
          placeholder="Ingresa tu nickname"
        />
        <Button type={'submit'} color="primary" onClick={onClick}>
          Vamos!
        </Button>
      </div>
    </div>
  );
};

export default PlayerForm;
