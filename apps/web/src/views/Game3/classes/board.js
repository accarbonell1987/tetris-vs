import { drawMatrix } from '../func/board'

export class Board {
  constructor() {
    this.matrix = null
    this.color = null
  }

  create(width, height) {
    this.matrix = Array(height)
      .fill()
      .map(() => Array(width).fill(0))
    this.color = '#000'
  }

  draw(context) {
    drawMatrix(context, this.matrix, this.color)
  }

  update(context) {
    this.draw(context)
  }
}
