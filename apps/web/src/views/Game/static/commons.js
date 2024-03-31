export const colors = {
  green: 'green',
  red: 'red',
  yellow: 'yellow',
  purple: 'purple',
  pink: 'pink',
  cyan: 'cyan',
  blue: 'blue',
  wall: 'wall'
}

const block = [[1]]

export const WallShape = {
  id: 1,
  color: colors.wall,
  block,
  matrix: block
}

const O = {
  id: 2,
  color: colors.red,
  block,
  matrix: [
    [2, 2],
    [2, 2]
  ]
}

const I = {
  id: 3,
  color: colors.green,
  block,
  matrix: [[3, 3, 3, 3]]
}

const L = {
  id: 4,
  color: colors.yellow,
  block,
  matrix: [
    [4, 0],
    [4, 0],
    [4, 4]
  ]
}

const S = {
  id: 5,
  color: colors.purple,
  block,
  matrix: [
    [0, 5, 5],
    [5, 5, 0]
  ]
}

const Li = {
  id: 6,
  color: colors.pink,
  block,
  matrix: [
    [0, 6],
    [0, 6],
    [6, 6]
  ]
}

const Si = {
  id: 7,
  color: colors.cyan,
  block,
  matrix: [
    [7, 7, 0],
    [0, 7, 7]
  ]
}

export const BLOCK_SIZE = 24

export const BOARD_WIDTH = 12
export const BOARD_HEIGHT = 21

export const MOVEMENTS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  ROTATE: 'ArrowUp'
}

export const PIECES = [O, I, L, S, Li, Si]
export const BLOCKS = [WallShape, ...PIECES]
