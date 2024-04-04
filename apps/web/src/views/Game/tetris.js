import { Game } from './classes/game'
import { MOVEMENTS } from './static/commons'

const game = new Game()

export const inject = (element) => {
  if (!element) return

  game.inject(element)
  game.init()

  animate()
}

const animate = (time = 0) => {
  requestAnimationFrame(animate)
  game.context.clearRect(0, 0, game.canvas.width, game.canvas.height)

  game.update(time)
}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case MOVEMENTS.LEFT:
      game.moveLeft()
      break
    case MOVEMENTS.RIGHT:
      game.moveRight()
      break
    case MOVEMENTS.DOWN:
      game.moveDown()
      break
    case MOVEMENTS.ROTATE:
      game.rotate()
      break

    default:
      break
  }
})
