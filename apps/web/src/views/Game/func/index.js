import { Container, Graphics } from 'pixi.js'
import { PIECE_TYPES, BOARD_HEIGHT, BOARD_WIDTH, BLOCK_SIZE } from '../static/commons'
import { Piece } from '../pieces'

export const drawBoard = (game) => {
  const boardContainer = new Container()

  // Dibujar celdas del tablero
  for (let row = 0; row < BOARD_HEIGHT; row++) {
    for (let col = 0; col < BOARD_WIDTH; col++) {
      const cell = new Graphics()
      cell.setStrokeStyle(1, 0x000000, 0.5)
      cell.rect(0, 0, BLOCK_SIZE, BLOCK_SIZE)
      cell.position.set(col * BLOCK_SIZE, row * BLOCK_SIZE)
      boardContainer.addChild(cell)
    }
  }

  game.app.stage.addChild(boardContainer)
}

// Función para generar una nueva pieza de Tetris aleatoria
export const generateRandomPiece = () => {
  const type = Math.floor(Math.random() * PIECE_TYPES.length)
  const color = 0x000000 // Color de los bloques de la pieza
  return new Piece(type, color)
}

// Función para manejar el movimiento de la pieza actual
export const handlePieceMovement = (piece) => {
  if (!piece) {
    piece = generateRandomPiece()
    piece.draw()
  } else {
    piece.moveDown()
  }
}
