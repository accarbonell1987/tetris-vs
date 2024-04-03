import { Application } from 'pixi.js'
import { drawBoard, handlePieceMovement, generateRandomPiece } from './func'
import { BLOCK_SIZE, BOARD_HEIGHT, BOARD_WIDTH, FALL_SPEED } from './static/commons'

const app = new Application()

const game = {
  app: app,
  fallTimer: 0,
  size: { x: 0, y: 0 },
  textures: null,
  player: {
    piece: null
  },
  figures: [],
  board: [],
  walls: []
}

const init = async (element) => {
  const size = { width: BLOCK_SIZE * BOARD_WIDTH, height: BLOCK_SIZE * BOARD_HEIGHT }
  await app.init({ antialias: true, ...size })
  game.size = { x: app.canvas.width, y: app.canvas.height }

  element.appendChild(game.app.canvas)

  await loadResources()
  startGame()
}

const loadResources = async () => {
  // Aquí deberías cargar todas las texturas necesarias para el juego.
  // Por ahora, la función loadResources() está vacía.
  // const textures = await loadAllTextures()
  // game.textures = textures
}

const gameLoop = (delta) => {
  update(delta)
  render()
}

const render = () => {
  app.renderer.render(app.stage)
}

const update = (delta) => {
  // Actualizar el temporizador de movimiento automático hacia abajo
  game.fallTimer += delta

  // Si el temporizador supera la velocidad de caída, mover la pieza hacia abajo
  if (game.fallTimer >= FALL_SPEED) {
    currentPiece.moveDown()
    game.fallTimer = 0
  }

  handlePieceMovement(game.player.piece)
  // Lógica de actualización del juego
}

const startGame = () => {
  // Dibujar el tablero del juego
  drawBoard(game)

  // Generar una nueva pieza de Tetris
  const currentPiece = generateRandomPiece()
  console.log('🚀 ~ startGame ~ currentPiece:', currentPiece)
  game.player.piece = currentPiece
}

export const displayCanvas = async (element) => {
  await init(element)
  app.ticker.add(gameLoop)
}
