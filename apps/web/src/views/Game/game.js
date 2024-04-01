import { Application } from 'pixi.js'
import {
  loadAllTextures,
  initBoard,
  drawBoard,
  createPlayers,
  getPieceForPlayer,
  drawPiece
} from './func/functions'

import { BLOCK_SIZE, BOARD_HEIGHT, BOARD_WIDTH } from './static/commons'

var game = {
  app: null,
  size: { x: 0, y: 0 },
  textures: null,
  players: [],
  figures: [],
  board: [],
  walls: []
}

const setup = async (element) => {
  const app = new Application()

  const size = { width: BLOCK_SIZE * BOARD_WIDTH, height: BLOCK_SIZE * BOARD_HEIGHT }
  await app.init({ antialias: true, ...size })

  //Initialize the game sprites, set the game `state` to `play`
  //and start the 'gameLoop'
  game = {
    app: app,
    block: {
      size: 24
    },
    size: { x: app.canvas.width, y: app.canvas.height },
    textures: null,
    players: [],
    figures: [],
    board: [],
    statics: {
      BLOCK_SIZE,
      BOARD_HEIGHT,
      BOARD_WIDTH
    }
  }

  element.appendChild(game.app.canvas)

  // Cargar texturas
  const textures = await loadAllTextures()
  game.textures = textures

  initBoard(game)
  createPlayers(game, 2)

  drawBoard(game)

  game.players[0].piece = getPieceForPlayer(game, game.players[0])
  // game.players[1].piece = getPieceForPlayer(game, game.players[1])

  drawPiece(game, game.players[0])
  // drawPiece(game, game.players[1])

  console.log(game)

  // const player1Shape = getShapeForPlayer(game)
  // const player2Shape = getShapeForPlayer(game)

  // game.player1 = new Player({ percent: 0.297 }, player1Shape, 1)
  // game.player2 = new Player({ percent: 0.791 }, player2Shape, 1)

  // game.player1.addShape(game)
  // console.log(game.player1)
  // game.player2.addShape(game)

  // game.walls.objects.map((p) => {
  //   game.app.stage.addChild(p.container)
  // })

  gameLoop()
}

const gameLoop = () => {
  // Bucle de animación
  game.app.ticker.add((time) => {
    const delta = time.deltaTiem

    // drawPiece(game, game.players[0].piece)

    // game.player1.update(time)
    // game.player2.update(time)
    // Continuously rotate the container!
    // * use delta to create frame-independent transform *
    // container.rotation -= 0.01 * time.deltaTime
  })
}

export const displayCanvas = async (element) => {
  await setup(element)
}
