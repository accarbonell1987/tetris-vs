import { BLOCK_SIZE, BOARD_HEIGHT, BOARD_WIDTH, VELOCITY } from '../static/commons'
import { generateRandomPiece } from '../func/piece'
import { createBoard } from '../func/board'

export class Game {
  constructor() {
    this.canvas = null
    this.context = null
    this.state = {
      score: 0,
      level: 1
    }
    this.render = {
      dropCounter: 0,
      lastTime: 0
    }
    this.board = null
    this.piece = null
  }

  inject() {
    this.canvas = document.querySelector('canvas')
    this.context = this.canvas.getContext('2d')

    this.canvas.width = BLOCK_SIZE * BOARD_WIDTH
    this.canvas.height = BLOCK_SIZE * BOARD_HEIGHT

    this.context.scale(BLOCK_SIZE, BLOCK_SIZE)
  }

  init() {
    this.board = createBoard(BOARD_WIDTH, BOARD_HEIGHT)
    this.piece = generateRandomPiece()
  }

  draw() {
    this.context.fillStyle = '#000'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.board.update(this.context)
    this.piece.update(this.context)
  }

  update(time = 0) {
    const deltaTime = time - this.render.lastTime

    this.render.lastTime = time
    this.render.dropCounter += deltaTime

    if (this.render.dropCounter > VELOCITY[this.state.level - 1].speed) {
      this.piece.position.y++
      this.render.dropCounter = 0
    }

    if (this.checkCollisions()) {
      this.piece.position.y--
      this.solidifyPiece()
      this.removeRows()
    }

    this.draw()
  }

  moveLeft() {
    this.piece.moveLeft()
    if (this.checkCollisions()) this.piece.moveRight()
  }

  moveRight() {
    this.piece.moveRight()
    if (this.checkCollisions()) this.piece.moveLeft()
  }

  moveDown() {
    this.piece.moveDown()
    if (this.checkCollisions()) {
      this.piece.moveUp()
      this.solidifyPiece()
      this.removeRows()
    }
  }

  rotate() {
    const rotated = this.piece.rotate()
    if (!this.checkCollisions()) this.piece.shape = rotated
  }

  checkCollisions() {
    return this.piece.shape.find((row, y) => {
      return row.find((value, x) => {
        return (
          value !== 0 &&
          this.board.matrix[y + this.piece.position.y]?.[x + this.piece.position.x] !== 0
        )
      })
    })
  }

  solidifyPiece() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1) {
          this.board.matrix[y + this.piece.position.y][x + this.piece.position.x] = 1
        }
      })
    })
    this.piece = generateRandomPiece()
    this.gameOver()
  }

  removeRows() {
    const rowsToRemove = []

    this.board.matrix.forEach((row, y) => {
      if (row.every((value) => value === 1)) {
        rowsToRemove.push(y)
      }
    })

    rowsToRemove.forEach((y) => {
      this.board.matrix.splice(y, 1)
      const newRow = Array(BOARD_WIDTH).fill(0)
      this.board.matrix.unshift(newRow)
    })

    this.state.score += rowsToRemove.length * 10

    let currentLevel = 1
    for (const item of VELOCITY) {
      if (item.score.max > this.state.score) {
        this.state.level = currentLevel
        break
      }
      currentLevel++
    }
  }

  gameOver() {
    //! gameover
    if (this.checkCollisions()) {
      this.board.matrix.forEach((row) => row.fill(0))
    }
  }
}
