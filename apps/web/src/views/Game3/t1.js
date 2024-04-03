import { Game } from './classes/game'

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
