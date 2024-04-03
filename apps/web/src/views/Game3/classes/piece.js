import { drawPiece } from '../func/piece'

export class Piece {
  constructor(x, y, shape, color) {
    this.position = { x: x, y: y }
    this.velocity = { x: 0, y: 0.05 }
    this.shape = shape
    this.color = color
  }

  draw(context) {
    drawPiece(context, this)
  }

  update(context) {
    this.draw(context)
  }
}
