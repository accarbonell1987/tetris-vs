// func/utils.js

import { PIECE_SHAPES } from '../static/pieceShapes'
import Piece from './Piece'

export function generateRandomPiece() {
  const randomIndex = Math.floor(Math.random() * PIECE_SHAPES.length)
  const randomShape = PIECE_SHAPES[randomIndex]
  const randomColor = Math.random() * 0xffffff // Color aleatorio en formato hexadecimal

  return new Piece(randomShape, randomColor)
}
