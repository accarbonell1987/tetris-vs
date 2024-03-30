import { drawShape } from '../func/functions'

export class Block {
  constructor(velocity = { dx: 0, dy: 3 }, shape) {
    this.shape = shape

    this.position = { x: 0, y: 0 }
    this.texture = shape.texture
    this.velocity = velocity

    this.container = null
  }

  createShape(game) {
    const container = drawShape(this.shape.matrix, this.texture)

    const { width } = container.getSize()

    container.x = game.size.x / 2 - width / 2
    container.y = 5

    this.container = container
  }
}
