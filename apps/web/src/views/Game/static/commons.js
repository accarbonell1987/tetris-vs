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

// Velocidad de caída de las piezas (en milisegundos)
export const FALL_SPEED = 1000 // 1 segundofall

// Definir los tipos de piezas
export const PIECE_TYPES = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1, 1],
    [0, 1, 0]
  ], // T
  [
    [1, 1, 1],
    [1, 0, 0]
  ], // L
  [
    [1, 1, 1],
    [0, 0, 1]
  ], // J
  [
    [1, 1],
    [1, 1]
  ], // O
  [
    [1, 1, 0],
    [0, 1, 1]
  ], // S
  [
    [0, 1, 1],
    [1, 1, 0]
  ] // Z
]

// Colores correspondientes a los tipos de piezas
export const PIECE_COLORS = [
  0xff0000, // Rojo
  0x00ff00, // Verde
  0x0000ff, // Azul
  0xffff00, // Amarillo
  0xff00ff, // Magenta
  0x00ffff, // Cyan
  0xffa500 // Naranja
]

export const MOVEMENTS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  ROTATE: 'ArrowUp'
}

export const PIECES = [O, I, L, S, Li, Si]
export const BLOCKS = [WallShape, ...PIECES]
