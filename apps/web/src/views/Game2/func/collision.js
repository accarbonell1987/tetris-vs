import { BOARD_HEIGHT } from '../../Game/static/commons'
import { generateRandomPiece } from './utils'

// Función para verificar si una pieza colisiona con el tablero o con otras piezas fijas
export function checkCollision(piece, boardState) {
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col] === 1) {
        const boardRow = piece.y + row
        const boardCol = piece.x + col

        // Verificar colisión con el borde inferior del tablero
        if (boardRow >= BOARD_HEIGHT) {
          return true
        }

        // Verificar colisión con otras piezas fijas
        if (boardRow >= 0 && boardState[boardRow][boardCol] === 1) {
          return true
        }
      }
    }
  }

  return false // Sin colisión
}

// Función para fijar la pieza actual en su posición actual y generar una nueva pieza
export function fixPiece(piece, boardState) {
  // Actualizar el estado del tablero con la pieza actual
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col] === 1) {
        const boardRow = piece.y + row
        const boardCol = piece.x + col

        if (boardRow >= 0) {
          boardState[boardRow][boardCol] = 1
        }
      }
    }
  }

  // Generar una nueva pieza aleatoria y devolverla
  return generateRandomPiece()
}
