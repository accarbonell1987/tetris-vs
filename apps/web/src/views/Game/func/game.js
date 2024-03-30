import { Application, Assets, Container, Sprite } from 'pixi.js'
import { IBlock } from '../shapes/hectas'
import { loadTextureFromAssets } from './functions'

export const displayCanvas = async (element) => {
  const app = new Application()
  await app.init({ width: 240, height: 480 })

  element.appendChild(app.canvas)

  // Parametros globales
  const game = {
    size: { x: app.canvas.width, y: app.canvas.height },
    active: null,
    textures: null
  }

  // Cargar todos las texturas y hacer los sprites
  const blockRedTexture = await loadTextureFromAssets('../../../assets/images/block-red.png')
  const blockGreenTexture = await loadTextureFromAssets('../../../assets/images/block-green.png')

  game.textures = {
    red: blockRedTexture,
    green: blockGreenTexture
  }

  const containerIBlock = new IBlock(blockRedTexture, { dx: 0, dy: 3 })
  containerIBlock.createShape(game)

  // // Posicionar elementos en la escena

  // // Adicionar elementos
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
