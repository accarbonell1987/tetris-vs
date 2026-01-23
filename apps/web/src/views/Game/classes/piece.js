import { drawPiece } from '../func/piece';

/**
 * Clase que representa una pieza de Tetris.
 */
export class Piece {
  /**
   * @param {number} x - Posición inicial en X.
   * @param {number} y - Posición inicial en Y.
   * @param {number[][]} shape - Matriz que define la forma de la pieza.
   * @param {HTMLImageElement} image - Sprite o imagen de la pieza.
   */
  constructor(x, y, shape, image) {
    this.position = { x: x, y: y }; // Coordenadas actuales
    this.velocity = { x: 0, y: 0.05 }; // Velocidad (no muy usada en la lógica actual de drop)
    this.shape = shape; // Matriz de la forma
    this.image = image; // Imagen para el renderizado
  }

  /**
   * Dibuja la pieza.
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    drawPiece(context, this);
  }

  /**
   * Actualiza el dibujo de la pieza en cada frame.
   * @param {CanvasRenderingContext2D} context
   */
  update(context) {
    this.draw(context);
  }

  // Métodos de movimiento básico
  moveLeft() {
    this.position.x--;
  }

  moveRight() {
    this.position.x++;
  }

  moveDown() {
    this.position.y++;
  }

  moveUp() {
    this.position.y--;
  }

  /**
   * Realiza la rotación de la matriz de la pieza (90 grados).
   * @returns {number[][]} Una nueva matriz con la forma rotada.
   */
  rotate() {
    const rotated = [];

    // Transposición y reversa de filas para rotar 90 grados
    for (let i = 0; i < this.shape[0].length; i++) {
      const row = [];
      for (let j = this.shape.length - 1; j >= 0; j--) {
        row.push(this.shape[j][i]);
      }

      rotated.push(row);
    }

    return rotated;
  }
}
