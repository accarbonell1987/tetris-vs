import { VELOCITY, BOARD_WIDTH } from '../static/commons';

/**
 * Comprueba si una pieza colisiona con el tablero o con otra pieza.
 * @param {Piece} piece - La pieza que queremos validar.
 * @param {Board} board - El tablero de juego.
 * @param {Piece} otherPiece - (Opcional) La otra pieza activa para detectar choques entre jugadores.
 * @returns {boolean} True si hay colisión, false en caso contrario.
 */
export const checkCollisions = (piece, board, otherPiece = null) => {
  return piece.shape.some((row, y) => {
    return row.some((value, x) => {
      if (value === 0) return false; // Ignorar celdas vacías de la pieza

      const boardX = x + piece.position.x;
      const boardY = y + piece.position.y;

      // Comprobar límites del tablero (lados y fondo)
      if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= board.matrix.length) {
        return true;
      }

      // Comprobar colisión con bloques ya fijados en el tablero
      // Permitimos y < 0 para que las piezas puedan asomar por arriba al spawnear
      if (boardY >= 0 && board.matrix[boardY][boardX] !== 0) {
        return true;
      }

      // Comprobar colisión con la pieza del otro jugador
      if (otherPiece) {
        const otherX = boardX - otherPiece.position.x;
        const otherY = boardY - otherPiece.position.y;

        if (
          otherY >= 0 &&
          otherY < otherPiece.shape.length &&
          otherX >= 0 &&
          otherX < otherPiece.shape[0].length &&
          otherPiece.shape[otherY][otherX] !== 0
        ) {
          return true;
        }
      }

      return false;
    });
  });
};

/**
 * Pasa los bloques de la pieza actual a la matriz permanente del tablero.
 */
export const solidifyPiece = (player, board) => {
  player.piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        const boardY = y + player.piece.position.y;
        const boardX = x + player.piece.position.x;
        // Solo solidificamos si está dentro del rango visible del tablero
        if (boardY >= 0 && boardY < board.matrix.length) {
          board.matrix[boardY][boardX] = 1;
        }
      }
    });
  });
};

/**
 * Detecta y elimina las filas que estén completamente llenas.
 * Actualiza la puntuación y el nivel del jugador.
 */
export const removeRows = (player, board) => {
  let rowsRemoved = 0;

  // Recorremos de abajo hacia arriba
  for (let y = board.matrix.length - 1; y >= 0; y--) {
    if (board.matrix[y].every(value => value === 1)) {
      board.matrix.splice(y, 1); // Eliminar fila llena
      const newRow = Array(BOARD_WIDTH).fill(0);
      board.matrix.unshift(newRow); // Añadir nueva fila vacía arriba

      // Al desplazar las filas, debemos re-comprobar la misma posición y
      y++;
      rowsRemoved++;
    }
  }

  // Actualizar puntos: 10 por cada fila eliminada
  player.score += rowsRemoved * 10;

  // Actualizar nivel basado en la puntuación
  let currentLevel = 1;
  for (const item of VELOCITY) {
    if (item.score.max > player.score) {
      player.level = currentLevel;
      break;
    }
    currentLevel++;
  }
};

/**
 * Determina si el juego ha terminado.
 * Se considera fin de juego si hay algún bloque en la fila superior del tablero.
 */
export const isGameOver = board => {
  const firstRow = board.matrix[0];
  return firstRow.some(cell => cell !== 0);
};
