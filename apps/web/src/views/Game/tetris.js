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
    case MOVEMENTS.LEFT_P1:
      game.players.player1.moveLeft(game.board)
      break
    case MOVEMENTS.LEFT_P2:
      game.players.player2.moveLeft(game.board)
      break
    case MOVEMENTS.RIGHT_P1:
      game.players.player1.moveRight(game.board)
      break
    case MOVEMENTS.RIGHT_P2:
      game.players.player2.moveRight(game.board)
      break
    case MOVEMENTS.DOWN_P1:
      game.players.player1.moveDown(game.board)
      break
    case MOVEMENTS.DOWN_P2:
      game.players.player2.moveDown(game.board)
      break
    case MOVEMENTS.ROTATE_P1:
      game.players.player1.rotate(game.board)
      break
    case MOVEMENTS.ROTATE_P2:
      game.players.player2.rotate(game.board)
      break
    case MOVEMENTS.PAUSE:
      game.paused()
      break

    default:
      break
  }
})
