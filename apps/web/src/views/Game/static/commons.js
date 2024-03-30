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

const O = {
  color: colors.red,
  matrix: [
    [1, 1],
    [1, 1]
  ]
}

const I = {
  color: colors.green,
  matrix: [[1, 1, 1, 1]]
}

const L = {
  color: colors.yellow,
  matrix: [
    [1, 0],
    [1, 0],
    [1, 1]
  ]
}

const S = {
  color: colors.purple,
  matrix: [
    [0, 1, 1],
    [1, 1, 0]
  ]
}

const Li = {
  color: colors.pink,
  matrix: [
    [0, 1],
    [0, 1],
    [1, 1]
  ]
}

const Si = {
  color: colors.cyan,
  matrix: [
    [1, 1, 0],
    [0, 1, 1]
  ]
}

export const WallShape = {
  color: colors.wall,
  matrix: [[1]]
}

export const PIECES = [O, I, L, S, Li, Si]
