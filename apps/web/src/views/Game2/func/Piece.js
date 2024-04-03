// func/Piece.js

import { Graphics, Container } from 'pixi.js'
import { BLOCK_SIZE } from '../static/commons'

export default class Piece {
  constructor(shape, color) {
    this.shape = shape
    this.color = color
    this.container = new Container()
    this.draw()
  }

  draw() {
    this.shape.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col === 1) {
          const block = new Graphics()
          block.fill(this.color)
          block.rect(0, 0, BLOCK_SIZE, BLOCK_SIZE)
          block.fill()
          block.position.set(colIndex * BLOCK_SIZE, rowIndex * BLOCK_SIZE)
          this.container.addChild(block)
        }
      })
    })
  }

  rotate() {
    const newShape = []
    const rows = this.shape.length
    const cols = this.shape[0].length

    for (let i = 0; i < cols; i++) {
      newShape[i] = []
      for (let j = 0; j < rows; j++) {
        newShape[i][j] = this.shape[rows - 1 - j][i]
      }
    }

    this.shape = newShape
    this.container.removeChildren()
    this.draw()
  }

  moveDown() {
    this.container.position.y += BLOCK_SIZE
  }

  moveLeft() {
    this.container.position.x -= BLOCK_SIZE
  }

  moveRight() {
    this.container.position.x += BLOCK_SIZE
  }
}
