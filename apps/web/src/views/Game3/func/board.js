import { Board } from '../classes/board'
import blockWallSrc from '../../../assets/images/block-wall.png'
import { createImage } from './utils'

export const createBoard = (width, height) => {
  const board = new Board()

  board.create(width, height)

  return board
}

export const drawMatrix = (context, matrix) => {
  const image = createImage(blockWallSrc)

  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        // context.fillStyle = color
        // context.fillRect(x, y, 1, 1)
        context.drawImage(image, x, y, 1, 1)
      }
    })
  })
}
