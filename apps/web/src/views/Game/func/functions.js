import { Assets, Container, Sprite } from 'pixi.js'
import { Block } from '../shapes/classes'
import { BLOCKS, PIECES, WallShape } from '../static/commons'

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
        const wall = getShapeForBlock(game, value)
        wall.container.x = x * size + size / 2
        wall.container.y = y * size + size / 2
        game.app.stage.addChild(wall.container)
      }
    })
  })

  // const size = 24
  // for (let y = 0; y < 21; y++) {
  //   for (let x = 0; x < 12; x++) {
  //     const position = game.board[y][x]

  //     if (position === 1) {
  //       const wall = getShapeForWall(game)

  //       // Posicionar
  //       wall.container.x = x * size + size / 2
  //       wall.container.y = y * size + size / 2

  //       // Adicionar elementos al arreglo de walls
  //       game.walls.push(wall)
  //     }
  //   }
  // }
}

export const drawPiece = (piece, color) => {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = color
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
      }
    })
  })
}

export const getShapeForPlayer = (game) => {
  // Cargar Shape
  const shape = randomFromArray(PIECES)
  // const shape = PIECES[1]
  shape.texture = Object.entries(game.textures).find((p) => p[0] === shape.color)[1]

  // Crear Shape
  return new Block(shape)
}

export const getShapeForBlock = (game, id) => {
  const piece = BLOCKS.find((p) => p.id === id)
  piece.texture = Object.entries(game.textures).find((p) => p[0] === piece.color)[1]

  // Crear Shape
  return new Block(piece)
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
