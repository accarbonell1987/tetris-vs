import { Chip } from '@nextui-org/react';

const Pause = ({ text }) => {
  return (
    <div
      className="flex flex-col items-center justify-center bg-black w-fit h-fit z-10 absolute border-solid border-1 border-gray-300 border-r-2"
      style={{ width: '288px', height: '480px' }}>
      <Chip
        size="lg"
        variant="shadow"
        classNames={{
          base: 'bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30',
          content: 'drop-shadow shadow-black text-white'
        }}>
        {text}
      </Chip>
    </div>
  );
};

export default Pause;
