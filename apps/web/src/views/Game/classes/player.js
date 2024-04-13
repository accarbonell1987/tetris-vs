import { checkCollisions } from '../func/game';

export class Player {
  constructor(piece) {
    this.piece = piece;
    this.score = 0;
    this.lines = 0;
    this.level = 0;
    this.lose = false;
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
}
