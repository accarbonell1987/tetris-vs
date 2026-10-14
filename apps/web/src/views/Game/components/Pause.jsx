import { Chip } from '@nextui-org/react';

/**
 * Overlay over the game canvas (pause, game over) with an optional action below the text.
 * @param {string} text - Text to show.
 */
const Pause = ({ text, children }) => {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-md bg-black/70">
      <Chip
        size="lg"
        variant="shadow"
        classNames={{
          base: 'bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30',
          content: 'drop-shadow shadow-black text-white'
        }}>
        {text}
      </Chip>
      {children}
    </div>
  );
};

export default Pause;
