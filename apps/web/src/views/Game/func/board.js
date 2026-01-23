import { Board } from '../classes/board';
import blockWallSrc from '../../../assets/images/block-wall.png';
import { createImage } from './utils';

/**
 * Crea una nueva instancia de Board e inicializa su matriz.
 * @param {number} width - Ancho en bloques.
 * @param {number} height - Alto en bloques.
 * @returns {Board} La instancia del tablero.
 */
export const createBoard = (width, height) => {
  const board = new Board();
  board.create(width, height);
  return board;
};

/**
 * Dibuja la matriz del tablero en el canvas.
 * @param {CanvasRenderingContext2D} context - Contexto del canvas.
 * @param {number[][]} matrix - Matriz de celdas del tablero.
 */
export const drawMatrix = (context, matrix) => {
  const image = createImage(blockWallSrc);

  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      // Si el valor es distinto de 0, dibujamos un bloque ocupado
      if (value !== 0) {
        context.drawImage(image, x, y, 1, 1);
      }
    });
  });
};
