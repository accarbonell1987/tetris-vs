import { Game } from './classes/game';
import { setGameToEvents } from './func/events';

const game = new Game();

// Inyectar el objeto games a los eventos
setGameToEvents(game);

export const inject = element => {
  if (!element) return;

  game.inject(element);
  game.init();

  animate();
};

const animate = (time = 0) => {
  requestAnimationFrame(animate);
  game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);

  game.update(time);
};
