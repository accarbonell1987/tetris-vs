import { Piece } from '../classes/piece'
import { PIECES, BOARD_WIDTH } from '../static/commons'
import { loadSprite } from './utils'

export const generateRandomPiece = () => {
  const randomIndex = Math.floor(Math.random() * PIECES.length)
  const randomShape = PIECES[randomIndex]

  const x = Math.ceil(BOARD_WIDTH / 2 - randomShape[0].length / 2)

  const index = randomShape[0].find((p) => p !== 0)
  const image = loadSprite(index)
  const piece = new Piece(x, 0, randomShape, image)

  return piece
}

export const drawPiece = (context, piece) => {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.drawImage(piece.image, x + piece.position.x, y + piece.position.y, 1, 1)
      }
    })
  })
}
