import { Game } from './classes/game'
import {
  BLOCK_SIZE,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  VELOCITY,
  MOVEMENTS,
  PIECES
} from './static/commons'

const game = new Game()

export const inject = (element) => {
  if (!element) return

  game.inject(element)
  game.init()

  animate()
}

const animate = (time = 0) => {
  game.update(time)

  requestAnimationFrame(animate)
}
