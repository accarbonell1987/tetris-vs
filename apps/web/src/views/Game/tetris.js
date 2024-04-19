import { Game } from './classes/game';
import { NextChipPlayer1 } from './canvas/nextChip';
import { setGameToEvents } from './func/events';

const game = new Game();
const nextChipPlayer1 = new NextChipPlayer1();

// Inyectar el objeto games a los eventos
setGameToEvents(game);

export const inject = state => {
  game.inject(state);
  game.init();

  nextChipPlayer1.init();

  animate();
};

const animate = (time = 0) => {
  requestAnimationFrame(animate);
  game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
  nextChipPlayer1.context.clearRect(
    0,
    0,
    nextChipPlayer1.canvas.width,
    nextChipPlayer1.canvas.height
  );

  game.update(time, nextChipPlayer1);
};
