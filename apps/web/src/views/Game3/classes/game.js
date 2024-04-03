import {
  BLOCK_SIZE,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  VELOCITY,
  MOVEMENTS,
  PIECES
} from '../static/commons'
import { generateRandomPiece } from '../func/piece'
import { createBoard } from '../func/board'
import { checkCollisions } from '../func/collitions'

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

    if (checkCollisions(this.piece, this.board)) {
      this.piece.position.y--
    }

    this.draw()
  }
}
