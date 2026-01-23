import { checkCollisions } from '../func/game';
import { generateRandomPiece } from '../func/piece';

/**
 * Clase que representa a un jugador y su estado dentro de la partida.
 */
export class Player {
  /**
   * @param {Piece} piece - Pieza activa actual.
   * @param {Piece} nextPiece - Siguiente pieza en espera.
   * @param {number} spawn - Columna de inicio para las piezas.
   * @param {Object} props - Datos del usuario (id, nombre, imagen).
   */
  constructor(piece, nextPiece, spawn, props) {
    this.piece = piece;
    this.nextPiece = nextPiece;
    this.spawn = spawn;
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.lose = false; // Indica si el jugador ha perdido

    this.id = props.id;
    this.name = props.name;
    this.image = props.image;

    // Posicionar la pieza inicial en el punto de spawn
    this.piece.position.x = spawn;
  }

  /**
   * Intenta mover la pieza a la izquierda. Si hay colisión, revierte el movimiento.
   * @param {Board} board
   * @param {Piece} otherPiece - Pieza del oponente para detectar choques.
   */
  moveLeft(board, otherPiece) {
    if (this.piece) {
      this.piece.moveLeft();
      if (checkCollisions(this.piece, board, otherPiece)) this.piece.moveRight();
    }
  }

  /**
   * Intenta mover la pieza a la derecha. Si hay colisión, revierte el movimiento.
   * @param {Board} board
   * @param {Piece} otherPiece
   */
  moveRight(board, otherPiece) {
    if (this.piece) {
      this.piece.moveRight();
      if (checkCollisions(this.piece, board, otherPiece)) this.piece.moveLeft();
    }
  }

  /**
   * Mueve la pieza hacia abajo (gravedad o input).
   * @param {Board} board
   * @param {Piece} otherPiece
   */
  moveDown(board, otherPiece) {
    if (this.piece) {
      this.piece.moveDown();
      if (checkCollisions(this.piece, board, otherPiece)) {
        this.piece.moveUp();
        // Nota: La solidificación se maneja en el loop principal del juego
      }
    }
  }

  /**
   * Intenta rotar la pieza. Valida colisiones con la nueva forma.
   * @param {Board} board
   * @param {Piece} otherPiece
   */
  rotate(board, otherPiece) {
    if (this.piece) {
      const originalShape = this.piece.shape;
      const rotated = this.piece.rotate();
      this.piece.shape = rotated;
      // Si la nueva rotación colisiona, volvemos a la forma original
      if (checkCollisions(this.piece, board, otherPiece)) {
        this.piece.shape = originalShape;
      }
    }
  }

  /**
   * Asigna la siguiente pieza como la actual y genera una nueva pieza aleatoria.
   */
  assignNextPiece() {
    this.piece = this.nextPiece;
    this.piece.position.x = this.spawn;

    this.nextPiece = generateRandomPiece();
  }
}
