import { generateRandomPiece } from './piece'
import { VELOCITY, BOARD_WIDTH } from '../static/commons'

export const checkCollisions = (piece, board) => {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return value !== 0 && board.matrix[y + piece.position.y]?.[x + piece.position.x] !== 0
    })
  })
}

export const solidifyPiece = (player, board) => {
  player.piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        board.matrix[y + player.piece.position.y][x + player.piece.position.x] = 1
      }
    })
  })
  player.piece = generateRandomPiece()
  // gameOver(piece, board)
}

export const removeRows = (player, board) => {
  const rowsToRemove = []

  board.matrix.forEach((row, y) => {
    if (row.every((value) => value === 1)) {
      rowsToRemove.push(y)
    }
  })

  rowsToRemove.forEach((y) => {
    board.matrix.splice(y, 1)

    const newRow = Array(BOARD_WIDTH).fill(0)
    newRow[0] = 1
    newRow[BOARD_WIDTH - 1] = 1

    board.matrix.unshift(newRow)
  })

  player.score += rowsToRemove.length * 10

  let currentLevel = 1
  for (const item of VELOCITY) {
    if (item.score.max > player.score) {
      player.level = currentLevel
      break
    }
    currentLevel++
  }
}

export const isGameOver = (piece, board) => {
  //! gameover
  return checkCollisions(piece, board)
}
