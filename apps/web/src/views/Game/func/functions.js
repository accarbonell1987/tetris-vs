import { Assets } from 'pixi.js'

export const loadTextureFromAssets = async (path) => {
  const texture = await Assets.load(path)
  return texture
}
