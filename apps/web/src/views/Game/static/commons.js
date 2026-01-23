/**
 * Configuración general y constantes del juego.
 */

// Tamaño de cada bloque del juego en píxeles
export const BLOCK_SIZE = 24;

// Dimensiones del tablero (en número de bloques)
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 18;

// Velocidad de caída inicial
export const FALL_SPEED = 1000; // 1 segundo por bloque

// Posiciones iniciales de spawn para cada jugador
export const SPAWN_P1 = 2;
export const SPAWN_P2 = 6;

// Representación de una sección de pared
export const WALL = [[1]];

/**
 * Definición de las formas de las piezas (Tetriminos).
 * Los números corresponden a los IDs de los sprites/colores.
 */
export const PIECES = [
  // Pieza I
  [[3, 2, 3, 2]],

  // Pieza J
  [
    [3, 0, 0],
    [3, 3, 3]
  ],

  // Pieza L
  [
    [0, 0, 4],
    [4, 4, 4]
  ],

  // Pieza O
  [
    [5, 5],
    [5, 5]
  ],

  // Pieza S
  [
    [0, 6, 6],
    [6, 6, 0]
  ],

  // Pieza T
  [
    [0, 7, 0],
    [7, 7, 7]
  ],

  // Pieza Z
  [
    [8, 8, 0],
    [0, 8, 8]
  ]
];

/**
 * Matriz de la palabra "PAUSE" representada con bloques para el efecto visual.
 */
export const PAUSE = [
  [1, 1, 0, 0, 1, 1],
  [1, 1, 0, 0, 1, 1],
  [1, 1, 0, 0, 1, 1],
  [1, 1, 0, 0, 1, 1],
  [1, 1, 0, 0, 1, 1]
];

/**
 * Mapeo de códigos de teclas para el control de los jugadores.
 */
export const MOVEMENTS_CODES = {
  // Controles Jugador 1
  LEFT_P1: 'KeyA',
  RIGHT_P1: 'KeyD',
  DOWN_P1: 'KeyS',
  ROTATE_P1: 'KeyW',

  // Controles Jugador 2
  LEFT_P2: 'ArrowLeft',
  RIGHT_P2: 'ArrowRight',
  DOWN_P2: 'ArrowDown',
  ROTATE_P2: 'ArrowUp',

  // Controles Globales
  PAUSE: 'Space'
};

/**
 * Escalas de velocidad basadas en la puntuación actual.
 */
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

/**
 * Estructura inicial del estado del juego (usada como referencia).
 */
export const GAME = {
  canvas: null,
  context: null,
  state: {
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
