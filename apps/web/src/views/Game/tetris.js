import { MOVEMENTS_CODES } from './static/commons';
import { Game } from './game';

export const inject = (element, props) => {
  if (!element) return;

  Game.inject(element);
  Game.init(props);

  // animate();
};

const animate = (time = 0) => {
  const game = Game.getGame();

  requestAnimationFrame(animate);
  game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);

  Game.update(time);
};

document.addEventListener('keydown', event => {
  const game = Game.getGame();

  switch (event.code) {
    case MOVEMENTS_CODES.LEFT_P1:
      game.players.player1.moveLeft(game.board);
      break;
    case MOVEMENTS_CODES.LEFT_P2:
      game.players.player2.moveLeft(game.board);
      break;
    case MOVEMENTS_CODES.RIGHT_P1:
      game.players.player1.moveRight(game.board);
      break;
    case MOVEMENTS_CODES.RIGHT_P2:
      game.players.player2.moveRight(game.board);
      break;
    case MOVEMENTS_CODES.DOWN_P1:
      game.players.player1.moveDown(game.board);
      break;
    case MOVEMENTS_CODES.DOWN_P2:
      game.players.player2.moveDown(game.board);
      break;
    case MOVEMENTS_CODES.ROTATE_P1:
      game.players.player1.rotate(game.board);
      break;
    case MOVEMENTS_CODES.ROTATE_P2:
      game.players.player2.rotate(game.board);
      break;
    case MOVEMENTS_CODES.PAUSE:
      Game.pauseGame();
      break;

    default:
      break;
  }
});
