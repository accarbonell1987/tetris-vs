import { drawMatrix } from '../func/board';

/**
 * Clase que representa el tablero de juego.
 */
export class Board {
  constructor() {
    this.matrix = null; // Matriz que contiene el estado de cada celda (0 para vacío, 1 para ocupado)
    this.color = null; // Color de fondo del tablero
  }

  /**
   * Inicializa la matriz del tablero con ceros.
   * @param {number} width - Ancho del tablero.
   * @param {number} height - Alto del tablero.
   */
  create(width, height) {
    this.matrix = Array(height)
      .fill()
      .map(() => Array(width).fill(0));

    this.color = '#000';
  }

  /**
   * Dibuja el tablero en el contexto de canvas.
   * @param {CanvasRenderingContext2D} context - El contexto del canvas.
   */
  draw(context) {
    drawMatrix(context, this.matrix, '#FF0000');
  }

  /**
   * Actualiza la representación visual del tablero.
   * @param {CanvasRenderingContext2D} context - El contexto del canvas.
   */
  update(context) {
    this.draw(context);
  }
}
