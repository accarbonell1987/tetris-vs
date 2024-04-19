import { drawMatrix } from '../func/board';
// import { BOARD_WIDTH } from '../static/commons'

export class Board {
  constructor() {
    this.matrix = null;
    this.color = null;
  }

  create(width, height) {
    this.matrix = Array(height)
      .fill()
      .map(() => Array(width).fill(0));

    this.color = '#000';
  }

  draw(context) {
    drawMatrix(context, this.matrix, '#FF0000');
  }

  update(context) {
    this.draw(context);
  }
}
