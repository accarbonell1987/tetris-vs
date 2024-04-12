import { checkCollisions } from '../func/game';

export class Player {
  constructor(props) {
    this.name = props.name;
    this.image = props.image;
    this.piece = props.piece;
    this.score = 0;
    this.lines = 0;
    this.level = 0;
    this.lose = false;
    this.spaw = props.spawn;

    this.modifyPlayer = props.modifyPlayer;

    // ubicar la pieza segun la posicion en X
    this.piece.position.x = this.spaw;
  }

  moveLeft(board) {
    if (this.piece) {
      this.piece.moveLeft();
      if (checkCollisions(this.piece, board)) this.piece.moveRight();
      this.modifyPlayer(this);
    }
  }

  moveRight(board) {
    if (this.piece) {
      this.piece.moveRight();
      if (checkCollisions(this.piece, board)) this.piece.moveLeft();
      this.modifyPlayer(this);
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
      this.modifyPlayer(this);
    }
  }

  rotate(board) {
    if (this.piece) {
      const rotated = this.piece.rotate();
      if (!checkCollisions(this.piece, board)) this.piece.shape = rotated;
      this.modifyPlayer(this);
    }
  }
}
