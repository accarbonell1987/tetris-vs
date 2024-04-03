import { Board } from '../classes/board'

export const createBoard = (width, height) => {
  const board = new Board()
  board.create(width, height)

  return board
}

export const drawMatrix = (context, matrix, color) => {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = color
        context.fillRect(x, y, 1, 1)
      }
    })
  })
}
