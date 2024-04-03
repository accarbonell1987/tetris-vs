import * as commons from './static/commons'

// Arreglo para mantener el estado del tablero
const boardState = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))
