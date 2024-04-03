import { Piece } from '../classes/piece'
import { PIECES, BOARD_WIDTH } from '../static/commons'

export const generateRandomPiece = () => {
  const randomIndex = Math.floor(Math.random() * PIECES.length)
  const randomShape = PIECES[randomIndex]
  const randomColor = '#fff' // Color aleatorio en formato hexadecimal

  const x = Math.ceil(BOARD_WIDTH / 2 - randomShape[0].length / 2)

  const piece = new Piece(x, 0, randomShape, randomColor)

  return piece
}

export const drawPiece = (context, piece) => {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = piece.color
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
      }
    })
  })
}
