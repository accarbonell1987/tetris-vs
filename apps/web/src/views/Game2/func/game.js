import { displayGameOverMessage } from './display'
import { clearFullRows } from './rows'
import { updateScore } from './score'
import { update, render } from './update'

let isPaused = false
export const game = {
  app: null,
  boardContainer: null,
  pieceContainer: null,
  currentPiece: null,
  score: 0,
  board: undefined,
  restartRequested: false
}

// Función para reiniciar el juego
export function restartGame() {
  // Reiniciar el tablero y la puntuación
  resetBoard()
  resetScore()

  // Ocultar el mensaje de "Game Over"
  hideGameOverMessage()

  // Reiniciar el bucle de juego
  gameLoop()
}

// Función para pausar o reanudar el juego
export function togglePause() {
  if (isPaused) {
    resumeGame()
  } else {
    pauseGame()
  }
}

// Función principal del bucle del juego
export function gameLoop() {
  // Lógica para actualizar el juego
  update()

  // Lógica para renderizar el juego
  render()

  // Vuelve a llamar a gameLoop en el próximo fotograma
  requestAnimationFrame(gameLoop)
}

// Función para reiniciar el tablero
function resetBoard() {
  // Implementa la lógica para reiniciar el tablero, por ejemplo, limpiando todas las filas y reiniciando el estado del tablero
}

// Función para reiniciar la puntuación
function resetScore() {
  // Implementa la lógica para reiniciar la puntuación, por ejemplo, estableciendo la puntuación en 0
}

// Función para ocultar el mensaje de "Game Over"
function hideGameOverMessage() {
  // Implementa la lógica para ocultar el mensaje de "Game Over", por ejemplo, cambiando el estilo del elemento HTML correspondiente
}

// Función para pausar el juego
function pauseGame() {
  isPaused = true
  // Implementa la lógica para pausar el juego, como detener el bucle del juego o mostrar un mensaje de pausa
}

// Función para reanudar el juego
function resumeGame() {
  isPaused = false
  // Implementa la lógica para reanudar el juego, como volver a iniciar el bucle del juego
}
