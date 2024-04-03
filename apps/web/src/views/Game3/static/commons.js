// Tamaño de cada bloque del juego en píxeles
export const BLOCK_SIZE = 24

// Ancho y altura del tablero del juego en número de bloques
export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 20

// Velocidad de caída de las piezas (en milisegundos)
export const FALL_SPEED = 1000 // 1 segundo

// Piezas
export const PIECES = [
  // I
  [[1, 1, 1, 1]],

  // J
  [
    [1, 0, 0],
    [1, 1, 1]
  ],

  // L
  [
    [0, 0, 1],
    [1, 1, 1]
  ],

  // O
  [
    [1, 1],
    [1, 1]
  ],

  // S
  [
    [0, 1, 1],
    [1, 1, 0]
  ],

  // T
  [
    [0, 1, 0],
    [1, 1, 1]
  ],

  // Z
  [
    [1, 1, 0],
    [0, 1, 1]
  ]
]

export const MOVEMENTS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  ROTATE: 'ArrowUp'
}

export const VELOCITY = [
  { score: { min: 0, max: 100 }, speed: 1000 },
  { score: { min: 101, max: 200 }, speed: 900 },
  { score: { min: 201, max: 300 }, speed: 800 },
  { score: { min: 301, max: 400 }, speed: 700 },
  { score: { min: 401, max: 500 }, speed: 600 },
  { score: { min: 501, max: 600 }, speed: 500 },
  { score: { min: 601, max: 700 }, speed: 400 },
  { score: { min: 701, max: 800 }, speed: 300 },
  { score: { min: 801, max: 900 }, speed: 200 },
  { score: { min: 901, max: Infinity }, speed: 100 }
]