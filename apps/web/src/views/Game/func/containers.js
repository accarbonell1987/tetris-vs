import { PAUSE } from '../static/commons';
import { loadSprite } from './utils';

/**
 * Objeto que agrupa las funciones de renderizado de alto nivel para diferentes estados del juego.
 */
export const Containers = {
  /**
   * Limpia el canvas con un fondo negro.
   */
  drawBackGround: ({ context, canvas }) => {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
  },

  /**
   * Dibuja los elementos visuales que aparecen cuando el juego está en pausa.
   */
  drawPause: ({ context, pause }) => {
    let counter = 0;

    PAUSE.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          // Cargamos sprites aleatorios para darle un efecto visual a la pausa
          const image = loadSprite(pause.images[counter++]);
          context.drawImage(image, x + 2, y + 7, 1, 1);
        }
      });
    });
  },

  /**
   * Llama al método update de las piezas de ambos jugadores para redibujarlas.
   */
  drawGame: ({ context, players }) => {
    const player1 = players.player1;
    player1.currentState.piece.update(context);

    const player2 = players.player2;
    player2.currentState.piece.update(context);
  },

  /**
   * Llama al método update del tablero para redibujarlo.
   */
  drawBoard: ({ context, board }) => {
    board.update(context);
  }
};
