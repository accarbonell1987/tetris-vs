import { Piece } from '../classes/piece';
import { PIECES, BOARD_WIDTH } from '../static/commons';
import { loadSprite } from './utils';

/**
 * Genera una pieza aleatoria basándose en las constantes de PIECES.
 * Calcula su posición de inicio centrada en el tablero.
 * @returns {Piece} Una nueva instancia de Piece.
 */
export const generateRandomPiece = () => {
  const randomIndex = Math.floor(Math.random() * PIECES.length);
  const randomShape = PIECES[randomIndex];

  // Calcular la X para que aparezca centrada
  const x = Math.ceil(BOARD_WIDTH / 2 - randomShape[0].length / 2);

  // Cargar el sprite correspondiente al primer bloque no vacío de la pieza
  const index = randomShape[0].find(p => p !== 0);
  const image = loadSprite(index);
  const piece = new Piece(x, 0, randomShape, image);

  return piece;
};

/**
 * Dibuja los bloques individuales de una pieza en el canvas.
 * @param {CanvasRenderingContext2D} context
 * @param {Piece} piece
 */
export const drawPiece = (context, piece) => {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      // Solo dibujamos los bloques con valor distinto de 0
      if (value !== 0) {
        context.drawImage(piece.image, x + piece.position.x, y + piece.position.y, 1, 1);
      }
    });
  });
};
