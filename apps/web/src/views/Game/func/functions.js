import { Assets, Container, Sprite } from 'pixi.js'
import { Block } from '../shapes/classes'
import { BLOCKS, PIECES } from '../static/commons'

export const initBoard = (game) => {
  // Cargar el board con 0 para las posiciones abiertas y 1 para los bloques
  for (let y = 0; y < 21; y++) {
    game.board[y] = new Array(12).fill(y === 20 ? 1 : 0)
    for (let x = 0; x < 12; x++) {
      if (x === 0 || x === 11) game.board[y][x] = 1
    }
  }
}

export const drawShape = (matrix, texture) => {
  const container = new Container()

  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        const sprite = new Sprite(texture)
        sprite.x = x * 24
        sprite.y = y * 24

        sprite.anchor.set(0.5)

        sprite.width = 24
        sprite.height = 24

        container.addChild(sprite)
      }
    })
  })

  return container
}

export const drawBoard = (game) => {
  initBoard(game)

  const size = game.block.size

  game.board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        const wall = getPieceForBlock(game, value)
        wall.sprite.x = x * size + size / 2
        wall.sprite.y = y * size + size / 2
        game.app.stage.addChild(wall.sprite)
      }
    })
  })
}

export const drawPiece = (game, player) => {
  const size = game.block.size
  const middle = size / 2

  player.piece.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        const piece = getPieceForBlock(game, value)
        piece.sprite.x = player.piece.position.x + x * size + size + middle
        piece.sprite.y = player.piece.position.y + y * size + middle

        // console.log(`x: ${x}, y: ${y}, pX: ${piece.sprite.x}, pY: ${piece.sprite.y}`)

        game.app.stage.addChild(piece.sprite)
      }
    })
  })
}

//! Crear la cantidad de jugadores
export const createPlayers = (game, numbers) => {
  const range = game.statics.BOARD_WIDTH / 4

  for (let index = 1; index <= numbers; index++) {
    const position = index === 1 ? range / 2 : range + range / 2

    game.players.push({
      speed: 0.5,
      piece: null,
      spawn: { position: { x: Math.ceil(position), y: 0 } }
    })
  }
}

export const getPieceForPlayer = (game, player) => {
  // Cargar Shape
  const shape = randomFromArray(PIECES)
  // const shape = PIECES[1]
  shape.texture = Object.entries(game.textures).find((p) => p[0] === shape.color)[1]
  shape.position = player.spawn.position

  return shape
}

export const getPieceForBlock = (game, id) => {
  const piece = BLOCKS.find((p) => p.id === id)

  const texture = Object.entries(game.textures).find((p) => p[0] === piece.color)[1]
  piece.sprite = new Sprite(texture)
  piece.sprite.anchor.set(0.5)
  piece.sprite.width = 24
  piece.sprite.height = 24

  // Crear Shape
  return piece
}

export const checkCollisions = (game) => {
  console.log(game.player1)
  // const result = game.player1.shape.find((row, y) => {
  //   return row.find((value, x) => {
  //     return value !== 0 && board[y + piece.position.y]?.[x + piece.position.x] !== 0
  //   })
  // })

  // return result
}

export const loadAllTextures = async () => {
  // Cargar todos las texturas y hacer los sprites
  const blockRedTexture = await Assets.load('../../../assets/images/block-red.png')
  const blockGreenTexture = await Assets.load('../../../assets/images/block-green.png')
  const blockYellowTexture = await Assets.load('../../../assets/images/block-yellow.png')
  const blockPurpleTexture = await Assets.load('../../../assets/images/block-purple.png')
  const blockPinkTexture = await Assets.load('../../../assets/images/block-pink.png')
  const blockOrangeTexture = await Assets.load('../../../assets/images/block-orange.png')
  const blockCyanTexture = await Assets.load('../../../assets/images/block-cyan.png')
  const blockBlueTexture = await Assets.load('../../../assets/images/block-blue.png')
  const blockWallTexture = await Assets.load('../../../assets/images/block-wall.png')

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

export const randomIntFromRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const randomFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

export const getDistance = (x1, y1, x2, y2) => {
  const xDist = x2 - x1
  const yDist = y2 - y1

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}
