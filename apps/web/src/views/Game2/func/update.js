import { isGameOver } from './gameOver'
import { clearFullRows } from './rows'
import { updateScore } from './score'
import { displayScore, displayGameOverMessage } from './display'
import { restartGame } from './game'
import { game } from './game'
import { handleInput } from './input'

// Función para actualizar la lógica del juego en cada fotograma
export function update() {
  // Manejar la entrada del jugador
  handleInput()

  // Verificar si el juego ha terminado
  if (isGameOver()) {
    displayGameOverMessage()
    return
  }

  // Eliminar filas completas y actualizar la puntuación
  const rowsCleared = clearFullRows(game.board)
  const newScore = updateScore(rowsCleared, game.score)
  displayScore(newScore)

  // Reiniciar el juego si es necesario
  if (game.restartRequested) {
    restartGame()
    return
  }

  // Otra lógica de actualización del juego aquí
}

// Función para renderizar la representación visual del juego en cada fotograma
export function render() {
  // Limpiar el lienzo
  game.app.renderer.clear()

  // Renderizar el tablero del juego
  renderBoard()

  // Renderizar las piezas del juego
  renderPieces()

  // Renderizar otros elementos del juego, como la puntuación
  // Por ejemplo, game.app.stage.addChild(scoreText);
}

// Función para renderizar el tablero del juego
function renderBoard() {
  // Limpiar el contenedor del tablero
  game.boardContainer.removeChildren()

  // Renderizar cada celda del tablero
  for (let y = 0; y < game.board.length; y++) {
    for (let x = 0; x < game.board[y].length; x++) {
      if (game.board[y][x] === 1) {
        const block = new PIXI.Graphics()
        block.fill(0xffffff)
        block.rect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        block.fill()
        game.boardContainer.addChild(block)
      }
    }
  }

  // Añadir el contenedor del tablero al escenario
  game.app.stage.addChild(game.boardContainer)
}

// Función para renderizar las piezas del juego
function renderPieces() {
  // Limpiar el contenedor de piezas
  game.pieceContainer.removeChildren()

  // Renderizar la pieza actual
  game.currentPiece.draw(game)

  // Renderizar otras piezas, como las piezas fijas
  // Por ejemplo, game.pieces.forEach(piece => piece.draw(game));

  // Añadir el contenedor de piezas al escenario
  game.app.stage.addChild(game.pieceContainer)
}
