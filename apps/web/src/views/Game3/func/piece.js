import { Piece } from '../classes/piece'
import { PIECES, BOARD_WIDTH } from '../static/commons'

import blockWallSrc from '../../../assets/images/block-wall.png'
import { createImage } from './utils'

export const generateRandomPiece = () => {
  const randomIndex = Math.floor(Math.random() * PIECES.length)
  const randomShape = PIECES[randomIndex]

  const x = Math.ceil(BOARD_WIDTH / 2 - randomShape[0].length / 2)

  const image = createImage(blockWallSrc)
  const piece = new Piece(x, 0, randomShape, image)

  return piece
}

export const drawPiece = (context, piece) => {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.drawImage(piece.image, x + piece.position.x, y + piece.position.y, 1, 1)
      }
    })
  })
}
