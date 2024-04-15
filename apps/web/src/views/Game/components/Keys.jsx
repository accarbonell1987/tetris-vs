import { Button } from '@nextui-org/react';
import {
  ArrowNarrowDown,
  ArrowNarrowLeft,
  ArrowNarrowRight,
  Flame,
  PlayerPause,
  RotateClockwise
} from 'tabler-icons-react';

const LeftArrows = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button isIconOnly color="warning" variant="solid">
        <ArrowNarrowLeft size={48} strokeWidth={2} color={'black'} />
      </Button>
      <Button isIconOnly color="warning" variant="solid">
        <ArrowNarrowRight size={48} strokeWidth={2} color={'black'} />
      </Button>
      <div className="grid col-span-2 justify-center">
        <Button isIconOnly color="warning" variant="solid">
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
        <Button color="danger" variant="solid">
          <Flame size={48} strokeWidth={2} color={'black'} />
        </Button>
      </div>
      <div className="grid col-start-2">
        <Button color="success" variant="solid">
          <RotateClockwise size={48} strokeWidth={2} color={'black'} />
        </Button>
      </div>
    </div>
  );
};

const MiddleButtons = () => {
  return (
    <div>
      <Button isIconOnly variant="solid" size="sm">
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
