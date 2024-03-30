import { Application, Assets } from 'pixi.js'
import { Block } from './shapes/hectas'
import { randomFromArray } from './func/functions'
import { PIECES, WallShape } from './static/commons'

const app = new Application()

const loadAllTextures = async () => {
  // Cargar todos las texturas y hacer los sprites
  const blockRedTexture = await Assets.load('../../assets/images/block-red.png')
  const blockGreenTexture = await Assets.load('../../assets/images/block-green.png')
  const blockYellowTexture = await Assets.load('../../assets/images/block-yellow.png')
  const blockPurpleTexture = await Assets.load('../../assets/images/block-purple.png')
  const blockPinkTexture = await Assets.load('../../assets/images/block-pink.png')
  const blockOrangeTexture = await Assets.load('../../assets/images/block-orange.png')
  const blockCyanTexture = await Assets.load('../../assets/images/block-cyan.png')
  const blockBlueTexture = await Assets.load('../../assets/images/block-blue.png')
  const blockWallTexture = await Assets.load('../../assets/images/block-wall.png')

  return {
    red: blockRedTexture,
    green: blockGreenTexture,
    yellow: blockYellowTexture,
    purple: blockPurpleTexture,
    pink: blockPinkTexture,
    orange: blockOrangeTexture,
    cyan: blockCyanTexture,
    blue: blockBlueTexture,
    wall: blockWallTexture
  }
}

const init = async () => {
  await app.init({ width: 284, height: 504 })
}

const drawBorders = (game) => {
  // Cargar el board con 0 para las posiciones abiertas y 1 para los bloques
  for (let x = 0; x < 12; x++) {
    const rowToFill = new Array(12).fill(x === 11 ? 1 : 0)
    game.board[x] = rowToFill

    for (let y = 0; y < 21; y++) {
      if (y === 0 || y === 20) game.board[x][y] = 1
    }
  }

  const wall = new Block({ dx: 0, dy: 0 }, WallShape)
  wall.createShape(game)
}

export const displayCanvas = async (element) => {
  await init()

  element.appendChild(app.canvas)

  // Parametros globales
  const game = {
    size: { x: app.canvas.width, y: app.canvas.height },
    active: null,
    textures: null,
    player1: {},
    player2: {},
    figures: [],
    board: []
  }

  // Cargar texturas
  const textures = await loadAllTextures()
  game.textures = textures

  drawBorders(game)

  // Cargar formas
  const shape = randomFromArray(PIECES)
  shape.texture = Object.entries(game.textures).find((p) => p[0] === shape.color)[1]

  const containerIBlock = new Block({ dx: 0, dy: 3 }, shape)
  containerIBlock.createShape(game)

  // Posicionar elementos en la escena

  // Adicionar elementos
  app.stage.addChild(containerIBlock.container)

  game.active = containerIBlock.container

  // Bucle de animación
  app.ticker.add((time) => {
    // Continuously rotate the container!
    // * use delta to create frame-independent transform *
    // container.rotation -= 0.01 * time.deltaTime
    game.active.y += 1 * time.deltaTime
  })
}
