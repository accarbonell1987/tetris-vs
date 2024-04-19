import { PAUSE } from '../static/commons';
import { loadSprite } from './utils';

export const Containers = {
  drawBackGround: ({ context, canvas }) => {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
  },
  drawPause: ({ context, pause }) => {
    let counter = 0;

    PAUSE.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const image = loadSprite(pause.images[counter++]);
          context.drawImage(image, x + 2, y + 7, 1, 1);
        }
      });
    });
  },
  drawGame: ({ context, players }) => {
    const player1 = players.player1;
    player1.currentState.piece.update(context);
  },
  drawBoard: ({ context, board }) => {
    board.update(context);
  }
};
