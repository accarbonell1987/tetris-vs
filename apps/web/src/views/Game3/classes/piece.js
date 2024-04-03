import { drawPiece } from '../func/piece'

export class Piece {
  constructor(x, y, shape, image) {
    this.position = { x: x, y: y }
    this.velocity = { x: 0, y: 0.05 }
    this.shape = shape
    this.image = image
  }

  draw(context) {
    drawPiece(context, this)
  }

  update(context) {
    this.draw(context)
  }

  moveLeft() {
    this.position.x--
  }

  moveRight() {
    this.position.x++
  }

  moveDown() {
    this.position.y++
  }

  moveUp() {
    this.position.y--
  }

  rotate() {
    const rotated = []

    for (let i = 0; i < this.shape[0].length; i++) {
      const row = []
      for (let j = this.shape.length - 1; j >= 0; j--) {
        row.push(this.shape[j][i])
      }

      rotated.push(row)
    }

    return rotated
  }
}
