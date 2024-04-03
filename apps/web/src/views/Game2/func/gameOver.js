import { game } from './game'

// Función para verificar si el juego ha terminado
export function isGameOver(piece, boardState) {
  // Si hay colisión entre la nueva pieza y el estado actual del tablero, el juego ha terminado
  // return checkCollision(piece, boardState)
  // Obtener la posición Y de la pieza actual
  const currentPieceY = game.currentPiece.y

  // Verificar si la posición Y de la pieza actual ha alcanzado la parte superior del tablero
  return currentPieceY <= 0
}
