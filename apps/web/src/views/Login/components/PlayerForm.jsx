import { Avatar, Input, Button } from '@nextui-org/react';

const PlayerForm = ({ playerState, setPlayerState, onClick }) => {
  return (
    <div className="flex flex-col gap-y-3">
      <label htmlFor="nickname">Como deseas llamarte?:</label>
      <div className="flex gap-3 flex-col items-center md:flex-row">
        <Avatar src={playerState.image} className="w-16" />
        <Input
          id="nickname"
          isRequired
          value={playerState?.name}
          onValueChange={value => {
            setPlayerState({ ...playerState, name: value });
          }}
          type="text"
          placeholder="Ingresa tu nickname"
        />
        <Button
          type={'submit'}
          color="primary"
          onClick={onClick}
          isDisabled={playerState?.name && playerState?.image ? false : true}>
          Vamos!
        </Button>
      </div>
    </div>
  );
};

export default PlayerForm;
