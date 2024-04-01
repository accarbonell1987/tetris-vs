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

export const WallShape = {
  id: 1,
  color: colors.wall,
  block: [[1]],
  matrix: [[1]]
}

const O = {
  id: 2,
  color: colors.red,
  block: [[2]],
  matrix: [
    [2, 2],
    [2, 2]
  ]
}

const I = {
  id: 3,
  color: colors.green,
  block: [[3]],
  matrix: [[3, 3, 3, 3]]
}

const L = {
  id: 4,
  color: colors.yellow,
  block: [[4]],
  matrix: [
    [4, 0],
    [4, 0],
    [4, 4]
  ]
}

const S = {
  id: 5,
  color: colors.purple,
  block: [[5]],
  matrix: [
    [0, 5, 5],
    [5, 5, 0]
  ]
}

const Li = {
  id: 6,
  color: colors.pink,
  block: [[6]],
  matrix: [
    [0, 6],
    [0, 6],
    [6, 6]
  ]
}

const Si = {
  id: 7,
  color: colors.cyan,
  block: [[7]],
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
