import { BLOCK_SIZE } from '../static/commons'

export const randomIntFromRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const randomElement = (arrs) => {
  return arrs[Math.floor(Math.random() * arrs.length)]
}

export const createImage = (imageSrc) => {
  const image = new Image(BLOCK_SIZE, BLOCK_SIZE)
  image.src = imageSrc

  return image
}
