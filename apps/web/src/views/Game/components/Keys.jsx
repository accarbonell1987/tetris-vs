import { Button } from '@nextui-org/react';
import {
  ArrowNarrowDown,
  ArrowNarrowLeft,
  ArrowNarrowRight,
  Flame,
  KeyboardHide,
  KeyboardShow,
  PlayerPause,
  RotateClockwise
} from 'tabler-icons-react';
import { PlayerKeysMapEvents, GlobalKeysMapEvents } from '../func/events';
import { useState } from 'react';

const LeftArrows = () => {
  return (
    <div className="flex gap-2 flex-col">
      <div className="flex gap-2">
        <Button color="warning" variant="solid" onClick={() => PlayerKeysMapEvents.movePieceLeft()}>
          <ArrowNarrowLeft size={48} strokeWidth={2} color={'black'} />
        </Button>
        <Button
          color="warning"
          variant="solid"
          onClick={() => PlayerKeysMapEvents.movePieceRight()}>
          <ArrowNarrowRight size={48} strokeWidth={2} color={'black'} />
        </Button>
      </div>
      <div className="flex justify-center">
        <Button
          className="w-full"
          color="warning"
          variant="solid"
          onClick={() => PlayerKeysMapEvents.movePieceDown()}>
          <ArrowNarrowDown size={48} strokeWidth={2} color={'black'} />
        </Button>
      </div>
    </div>
  );
};

const RightButtons = () => {
  return (
    <div>
      <div>
        <Button
          color="success"
          variant="solid"
          onClick={() => PlayerKeysMapEvents.movePieceRotate()}>
          <RotateClockwise size={48} strokeWidth={2} color={'black'} />
        </Button>
      </div>
      <div>
        <Button color="danger" variant="solid" onClick={() => PlayerKeysMapEvents.fireBooster()}>
          <Flame size={48} strokeWidth={2} color={'black'} />
        </Button>
      </div>
    </div>
  );
};

const MiddleButtons = ({ isMobile, showKeys, setShowKeys }) => {
  return (
    <div className="flex flex-col gap-2">
      <Button isIconOnly variant="solid" size="sm" onClick={() => GlobalKeysMapEvents.pauseGame()}>
        <PlayerPause size={18} strokeWidth={2} color={'white'} />
      </Button>
      {!isMobile ? (
        <Button
          isIconOnly
          color="success"
          variant="solid"
          size="sm"
          onClick={() => {
            setShowKeys(!showKeys);
          }}>
          <KeyboardHide size={22} strokeWidth={2} color={'white'} />
        </Button>
      ) : null}
    </div>
  );
};

const Keys = ({ show }) => {
  const isMobile = show;

  const [showKeys, setShowKeys] = useState(show || false);

  const keysComponents = (
    <div className="flex justify-center gap-2">
      <LeftArrows />
      <MiddleButtons isMobile={isMobile} showKeys={showKeys} setShowKeys={setShowKeys} />
      <RightButtons />
    </div>
  );

  return showKeys ? (
    keysComponents
  ) : (
    <div className="flex justify-center w-full">
      <Button
        isIconOnly
        color="success"
        variant="solid"
        onClick={() => {
          setShowKeys(!showKeys);
        }}>
        <KeyboardShow size={22} strokeWidth={2} color={'white'} />
      </Button>
    </div>
  );
};

export default Keys;
