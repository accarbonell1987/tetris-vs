import { BLOCK_SIZE, BOARD_HEIGHT, BOARD_WIDTH, VELOCITY, SPAWN_P1, SPAWN_P2 } from '../static/commons'
import { generateRandomPiece } from '../func/piece'
import { createBoard } from '../func/board'
import { checkCollisions, solidifyPiece, removeRows, isGameOver } from '../func/game'
import { Player } from './player'

export class Game {
  constructor() {
    this.canvas = null
    this.context = null
    this.state = {
      score: 0,
      level: 1,
      paused: true,
    }
    this.players = {
      player1: null,
      player2: null,
    }
    this.render = {
      dropCounter: 0,
      lastTime: 0,
    }
    this.board = null
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

    this.players.player1 = new Player(generateRandomPiece())
    this.players.player2 = new Player(generateRandomPiece())

    this.players.player1.spawn = SPAWN_P1
    this.players.player2.spawn = SPAWN_P2

    this.players.player1.piece.position.x = SPAWN_P1
    this.players.player2.piece.position.x = SPAWN_P2
  }

  draw() {
    // const image = createImage(bgSrc, BOARD_WIDTH, BOARD_HEIGHT)
    // this.context.imageSmoothingEnabled = false
    // this.context.drawImage(image, 0, 0, 20, 20)

    this.context.fillStyle = '#000'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.board.update(this.context)
    this.players.player1.piece.update(this.context)
    this.players.player2.piece.update(this.context)
  }

  update(time = 0) {
    const deltaTime = time - this.render.lastTime

    this.render.lastTime = time
    this.render.dropCounter += deltaTime

    if (!this.state.paused) {
      const player1 = this.players.player1
      const player2 = this.players.player2

      const piecePlayer1 = player1.piece
      const piecePlayer2 = player2.piece

      if (this.render.dropCounter > VELOCITY[this.state.level - 1].speed) {
        piecePlayer1.position.y++
        piecePlayer2.position.y++
        this.render.dropCounter = 0
      }

      if (checkCollisions(piecePlayer1, this.board)) {
        piecePlayer1.position.y--
        solidifyPiece(player1, this.board)

        // Chequear si se acaba el juego
        if (isGameOver(this.board)) {
          player1.lose = true
          this.board = createBoard(BOARD_WIDTH, BOARD_HEIGHT)
        } else {
          player1.piece = generateRandomPiece()
          player1.piece.position.x = player1.spawn
          removeRows(player1, this.board)
        }
      }
      if (checkCollisions(piecePlayer2, this.board)) {
        piecePlayer2.position.y--
        solidifyPiece(player2, this.board)

        // Chequear si se acaba el juego
        if (isGameOver(this.board)) {
          player2.lose = true
          this.board = createBoard(BOARD_WIDTH, BOARD_HEIGHT)
        } else {
          player2.piece = generateRandomPiece()
          player2.piece.position.x = player2.spawn
          removeRows(player2, this.board)
        }
      }
    }

    this.draw()
  }

  pauseGame() {
    this.state.paused = !this.state.paused
  }
}
