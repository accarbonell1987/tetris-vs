import { Keyboard } from 'pixi.js'
import { currentPiece } from './game'
import { checkCollision, fixPiece } from './collision'
import { update } from './update'
import { game } from './game'

export function handlePieceMovement(piece) {
  // Handle horizontal movement
  if (Keyboard.isKeyDown(Keyboard.LEFT_ARROW)) {
    piece.moveLeft()
    if (checkCollision(piece)) {
      piece.moveRight() // Undo movement if collision detected
    }
  } else if (Keyboard.isKeyDown(Keyboard.RIGHT_ARROW)) {
    currentPiece.moveRight()
    if (checkCollision(piece)) {
      piece.moveLeft() // Undo movement if collision detected
    }
  }

  // Handle rotation
  if (Keyboard.isKeyDown(Keyboard.UP_ARROW)) {
    piece.rotate()
    if (checkCollision(piece)) {
      piece.rotate() // Undo rotation if collision detected
    }
  }

  // Handle downward movement (falling)
  if (Keyboard.isKeyDown(Keyboard.DOWN_ARROW)) {
    piece.moveDown()
    if (checkCollision(piece)) {
      piece.moveUp() // Undo movement if collision detected
      fixPiece() // Fix the piece in place
    }
  }
}

// Función para mover la pieza actual hacia la izquierda
export function moveLeft() {
  game.currentPiece.moveLeft()
  if (checkCollision(game.currentPiece, game.board)) {
    game.currentPiece.moveRight() // Deshacer el movimiento si hay colisión
  }
  update()
}

// Función para mover la pieza actual hacia la derecha
export function moveRight() {
  game.currentPiece.moveRight()
  if (checkCollision(game.currentPiece, game.board)) {
    game.currentPiece.moveLeft() // Deshacer el movimiento si hay colisión
  }
  update()
}

// Función para mover la pieza actual hacia abajo (caída rápida)
export function moveDown() {
  game.currentPiece.moveDown()
  if (checkCollision(game.currentPiece, game.board)) {
    game.currentPiece.moveUp() // Deshacer el movimiento si hay colisión
    fixPiece() // Fijar la pieza en su posición actual
    update()
  }
}

// Función para rotar la pieza actual
export function rotatePiece() {
  game.currentPiece.rotate()
  if (checkCollision(game.currentPiece, game.board)) {
    game.currentPiece.rotateInverse() // Deshacer la rotación si hay colisión
  }
  update()
}
