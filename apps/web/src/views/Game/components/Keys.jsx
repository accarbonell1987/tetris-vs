import { Button } from '@nextui-org/react';
import {
  ArrowNarrowDown,
  ArrowNarrowLeft,
  ArrowNarrowRight,
  Flame,
  PlayerPause,
  RotateClockwise
} from 'tabler-icons-react';
import { PlayerKeysMapEvents, GlobalKeysMapEvents } from '../func/events';

const LeftArrows = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        isIconOnly
        color="warning"
        variant="solid"
        onClick={() => PlayerKeysMapEvents.movePieceLeft()}>
        <ArrowNarrowLeft size={48} strokeWidth={2} color={'black'} />
      </Button>
      <Button
        isIconOnly
        color="warning"
        variant="solid"
        onClick={() => PlayerKeysMapEvents.movePieceRight()}>
        <ArrowNarrowRight size={48} strokeWidth={2} color={'black'} />
      </Button>
      <div className="grid col-span-2 justify-center">
        <Button
          isIconOnly
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
    <div className="grid gap-2">
      <div className="grid col-start-2">
        <Button color="danger" variant="solid" onClick={() => PlayerKeysMapEvents.fireBooster()}>
          <Flame size={48} strokeWidth={2} color={'black'} />
        </Button>
      </div>
      <div className="grid col-start-2">
        <Button
          color="success"
          variant="solid"
          onClick={() => PlayerKeysMapEvents.movePieceRotate()}>
          <RotateClockwise size={48} strokeWidth={2} color={'black'} />
        </Button>
      </div>
    </div>
  );
};

const MiddleButtons = () => {
  return (
    <div>
      <Button isIconOnly variant="solid" size="sm" onClick={() => GlobalKeysMapEvents.pauseGame()}>
        <PlayerPause size={18} strokeWidth={2} color={'white'} />
      </Button>
    </div>
  );
};

const Keys = () => {
  return (
    <div className="grid justify-items-center grid-cols-3 gap-4">
      <LeftArrows />
      <MiddleButtons />
      <RightButtons />
    </div>
  );
};

export default Keys;
