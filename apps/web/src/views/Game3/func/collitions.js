export const checkCollisions = (piece, board) => {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return value !== 0 && board.matrix[y + piece.position.y]?.[x + piece.position.x] !== 0
    })
  })
}
