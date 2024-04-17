import { createImage } from './utils';
import blockWallSrc from '../../../assets/images/block-wall.png';
import { PAUSE } from '../static/commons';

export const Containers = {
  pauseGame: game => {
    const ctx = game.context;
    const image = createImage(blockWallSrc);

    PAUSE.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          ctx.drawImage(image, x + 3, y + 8, 1, 1);
        }
      });
    });
  },
  unpauseGame: game => {
    game.board.update(game.context);
    game.players.player1.piece.update(game.context);
    game.players.player2.piece.update(game.context);
  }
};
