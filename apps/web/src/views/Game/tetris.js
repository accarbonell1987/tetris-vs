import { Game } from './classes/game';
import { NextChipPlayer } from './canvas/nextChip';
import { setGameToEvents } from './func/events';

const game = new Game();
const nextChipPlayer1 = new NextChipPlayer(1);
const nextChipPlayer2 = new NextChipPlayer(2);

// Inyectar el objeto games a los eventos
setGameToEvents(game);

export const inject = state => {
  game.inject(state);
  game.init();
  nextChipPlayer1.init();
  nextChipPlayer2.init();

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
  nextChipPlayer2.context.clearRect(
    0,
    0,
    nextChipPlayer2.canvas.width,
    nextChipPlayer2.canvas.height
  );

  game.update(time, nextChipPlayer1, nextChipPlayer2);
};
