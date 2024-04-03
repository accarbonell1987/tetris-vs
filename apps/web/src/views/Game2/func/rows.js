import { BOARD_WIDTH, BOARD_HEIGHT } from '../static/commons'

// Función para eliminar filas completas del tablero
export function clearFullRows(board) {
  let rowsCleared = 0

  // Iterar sobre todas las filas del tablero
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    // Verificar si la fila actual está completa
    if (isRowFull(board[y])) {
      // Eliminar la fila completa
      board.splice(y, 1)
      // Agregar una nueva fila vacía al principio del tablero
      board.unshift(Array(BOARD_WIDTH).fill(0))
      rowsCleared++
      y++ // Ajustar el índice de fila después de eliminar una fila
    }
  }

  return rowsCleared
}

// Función para verificar si una fila está completa
function isRowFull(row) {
  return row.every((cell) => cell === 1)
}
