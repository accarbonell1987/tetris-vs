import { togglePause, restartGame } from './game'
import { moveLeft, moveRight, rotatePiece } from './movement' // Importa las funciones para mover y rotar las piezas

// Función para manejar la entrada del jugador
export function handleInput(event) {
  switch (event.keyCode) {
    case 37: // Flecha izquierda
      moveLeft()
      break
    case 39: // Flecha derecha
      moveRight()
      break
    case 38: // Flecha arriba (rotar)
      rotatePiece()
      break
    case 32: // Barra espaciadora (pausar/reanudar)
      togglePause()
      break
    case 13: // Tecla Enter (reiniciar)
      restartGame()
      break
    // Otros casos para manejar más acciones del jugador si es necesario
  }
}
