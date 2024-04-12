// Tamaño de cada bloque del juego en píxeles
export const BLOCK_SIZE = 24;

// Ancho y altura del tablero del juego en número de bloques
export const BOARD_WIDTH = 12;
export const BOARD_HEIGHT = 20;

// Velocidad de caída de las piezas (en milisegundos)
export const FALL_SPEED = 1000; // 1 segundo

export const SPAWN_P1 = 2;
export const SPAWN_P2 = 6;

// Wall
export const WALL = [[1]];

// Piezas
export const PIECES = [
  // I
  [[2, 2, 2, 2]],

  // J
  [
    [3, 0, 0],
    [3, 3, 3]
  ],

  // L
  [
    [0, 0, 4],
    [4, 4, 4]
  ],

  // O
  [
    [5, 5],
    [5, 5]
  ],

  // S
  [
    [0, 6, 6],
    [6, 6, 0]
  ],

  // T
  [
    [0, 7, 0],
    [7, 7, 7]
  ],

  // Z
  [
    [8, 8, 0],
    [0, 8, 8]
  ]
];

export const MOVEMENTS_CODES = {
  LEFT_P1: 'KeyA',
  LEFT_P2: 'ArrowLeft',
  RIGHT_P1: 'KeyD',
  RIGHT_P2: 'ArrowRight',
  DOWN_P1: 'KeyS',
  DOWN_P2: 'ArrowDown',
  ROTATE_P1: 'KeyW',
  ROTATE_P2: 'ArrowUp',
  PAUSE: 'Space'
};

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
];

export const GAME = {
  canvas: null,
  context: null,
  state: {
    score: 0,
    maxScore: 0,
    level: 1,
    paused: true
  },
  players: {
    player1: null,
    player2: null
  },
  render: {
    dropCounter: 0,
    lastTime: 0
  },
  board: null
};
