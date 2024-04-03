import { Container, Graphics } from 'pixi.js'
import { BOARD_WIDTH, BLOCK_SIZE, PIECE_TYPES } from '../static/commons'

export class Piece {
  constructor(type, color) {
    this.type = type
    this.color = color
    this.shape = PIECE_TYPES[type]
    this.x = Math.floor(BOARD_WIDTH / 2) - Math.floor(this.shape[0].length / 2)
    this.y = 0
    this.container = new Container()
    this.draw()
  }

  // Función para dibujar la pieza en el lienzo
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
    this.container.position.set(this.x * BLOCK_SIZE, this.y * BLOCK_SIZE)
  }

  // Método para rotar la pieza
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

  // Función para mover la pieza hacia abajo
  moveDown() {
    this.y++
    this.container.position.y += BLOCK_SIZE
  }

  // Método para mover la pieza hacia la izquierda
  moveLeft() {
    this.x--
    this.container.position.x -= BLOCK_SIZE
  }

  // Método para mover la pieza hacia la derecha
  moveRight() {
    this.x++
    this.container.position.x += BLOCK_SIZE
  }
}
