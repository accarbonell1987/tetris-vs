import { Container, Sprite } from 'pixi.js'

export class IBlock {
  constructor(texture, velocity = { dx: 0, dy: 3 }) {
    this.shapeMatrix = [[1, 1, 1, 1]]

    this.position = { x: 0, y: 0 }
    this.texture = texture
    this.velocity = velocity

    this.container = null
  }

  createShape(game) {
    const sprite = new Sprite(game.textures.red)
    const container = new Container()

    this.shapeMatrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1) {
          const sprite = new Sprite(this.texture)
          sprite.x = x + 24
          sprite.y = y

          container.addChild(sprite)

          // context.fillStyle = color
          // context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
        }
      })
    })

    // container.addChild(sprite)

    const { width } = container.getSize()

    container.x = game.size.x / 2 - width / 2
    container.y = 5

    this.container = container
  }
}
