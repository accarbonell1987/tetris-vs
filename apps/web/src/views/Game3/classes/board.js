import { drawMatrix } from '../func/board'
import { BOARD_WIDTH } from '../static/commons'

export class Board {
  constructor() {
    this.matrix = null
    this.color = null
  }

  create(width, height) {
    this.matrix = Array(height)
      .fill()
      .map(() => Array(width).fill(0))

    this.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (x === 0 || x === BOARD_WIDTH - 1) this.matrix[y][x] = 1
      })
    })
    this.color = '#000'
  }

  draw(context) {
    drawMatrix(context, this.matrix, '#FF0000')
  }

  update(context) {
    this.draw(context)
  }
}
