import { Game } from './classes/game'
import { MOVEMENTS_CODES } from './static/commons'

let game = null

export const getGameInstance = () => {
  if (!game) {
    game = new Game()
    game.init()
  }
  return game
}

export const inject = (element) => {
  if (!element) return
  const game = getGameInstance()

  game.inject(element)
  game.init()

  animate()
}

const animate = (time = 0) => {
  const game = getGameInstance()
  requestAnimationFrame(animate)
  game.context.clearRect(0, 0, game.canvas.width, game.canvas.height)

  game.update(time)
}

document.addEventListener('keydown', (event) => {
  const game = getGameInstance()
  switch (event.code) {
    case MOVEMENTS_CODES.LEFT_P1:
      game.players.player1.moveLeft(game.board)
      break
    case MOVEMENTS_CODES.LEFT_P2:
      game.players.player2.moveLeft(game.board)
      break
    case MOVEMENTS_CODES.RIGHT_P1:
      game.players.player1.moveRight(game.board)
      break
    case MOVEMENTS_CODES.RIGHT_P2:
      game.players.player2.moveRight(game.board)
      break
    case MOVEMENTS_CODES.DOWN_P1:
      game.players.player1.moveDown(game.board)
      break
    case MOVEMENTS_CODES.DOWN_P2:
      game.players.player2.moveDown(game.board)
      break
    case MOVEMENTS_CODES.ROTATE_P1:
      game.players.player1.rotate(game.board)
      break
    case MOVEMENTS_CODES.ROTATE_P2:
      game.players.player2.rotate(game.board)
      break
    case MOVEMENTS_CODES.PAUSE:
      game.pauseGame()
      break

    default:
      break
  }
})
