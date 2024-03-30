import { Assets, Container, Sprite } from 'pixi.js'

export const drawShape = (matrix, texture) => {
  const container = new Container()

  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        const sprite = new Sprite(texture)
        sprite.x = x * 24
        sprite.y = y * 24
        sprite.anchor.set(0.5)

        container.addChild(sprite)
      }
    })
  })

  return container
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
