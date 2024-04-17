import { PAUSE } from '../static/commons';
import { loadSprite } from './utils';

export const Containers = {
  drawBackGround: game => {
    game.context.fillStyle = '#000';
    game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
  },
  drawPause: game => {
    const ctx = game.context;

    let counter = 0;

    PAUSE.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const image = loadSprite(game.pause.images[counter++]);
          ctx.drawImage(image, x + 3, y + 8, 1, 1);
        }
      });
    });
  },
  drawGame: game => {
    game.players.player1.piece.update(game.context);
    game.players.player2.piece.update(game.context);
  },
  drawBoard: game => {
    game.board.update(game.context);
  }
};
