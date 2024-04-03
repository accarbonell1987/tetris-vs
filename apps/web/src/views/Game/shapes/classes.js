import { drawShape } from '../func/functions'

export class Block {
  constructor(shape) {
    this.shape = shape
    this.container = drawShape(shape.block, shape.texture)
  }
}

export class Piece {
  constructor(shape) {
    this.shape = shape
    this.container = drawShape(shape.matrix, shape.texture)
  }
}

export class Player {
  constructor(spawn, piece, speed) {
    this.spawn = spawn
    this.piece = piece
    this.speed = speed
  }

  addShape(game) {
    const { app } = game
    const { width } = this.piece.container.getSize()

    this.piece.container.x = game.size.x * this.spawn.percent - width / 2
    this.piece.container.y = 5

    // Adicionar elementos a la escena
    app.stage.addChild(this.piece.container)
  }

  update(time) {
    this.piece.container.y += this.speed * time.deltaTime
  }
}
