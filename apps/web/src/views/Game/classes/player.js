import { checkCollisions } from '../func/game';
import { generateRandomPiece } from '../func/piece';

export class Player {
  constructor(piece, nextPiece, spawn, props) {
    this.piece = piece;
    this.nextPiece = nextPiece;
    this.spawn = spawn;
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.lose = false;

    this.name = props.name;
    this.image = props.image;

    this.piece.position.x = spawn;
  }

  moveLeft(board) {
    if (this.piece) {
      this.piece.moveLeft();
      if (checkCollisions(this.piece, board)) this.piece.moveRight();
    }
  }

  moveRight(board) {
    if (this.piece) {
      this.piece.moveRight();
      if (checkCollisions(this.piece, board)) this.piece.moveLeft();
    }
  }

  moveDown(board) {
    if (this.piece) {
      this.piece.moveDown();
      if (checkCollisions(this.piece, board)) {
        this.piece.moveUp();
        // this.solidifyPiece()
        // this.removeRows()
      }
    }
  }

  rotate(board) {
    if (this.piece) {
      const rotated = this.piece.rotate();
      if (!checkCollisions(this.piece, board)) this.piece.shape = rotated;
    }
  }

  assignNextPiece() {
    this.piece = this.nextPiece;
    this.piece.position.x = this.spawn;

    this.nextPiece = generateRandomPiece();
  }
}
