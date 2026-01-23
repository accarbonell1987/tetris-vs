import { MOVEMENTS_CODES } from '../static/commons';

let game = null;

/**
 * Establece la instancia del juego para que los eventos puedan acceder a ella.
 * @param {Game} instance
 */
export const setGameToEvents = instance => (game = instance);

/**
 * Mapeo de acciones para el Jugador 1 basándose en las teclas configuradas.
 */
export const PlayerKeysMapEvents = {
  movePieceLeft: () => {
    const p1 = game.players.player1.currentState;
    const p2 = game.players.player2.currentState;
    p1.moveLeft(game.board, p2.piece);
  },
  movePieceRight: () => {
    const p1 = game.players.player1.currentState;
    const p2 = game.players.player2.currentState;
    p1.moveRight(game.board, p2.piece);
  },
  movePieceDown: () => {
    const p1 = game.players.player1.currentState;
    const p2 = game.players.player2.currentState;
    p1.moveDown(game.board, p2.piece);
  },
  movePieceRotate: () => {
    const p1 = game.players.player1.currentState;
    const p2 = game.players.player2.currentState;
    p1.rotate(game.board, p2.piece);
  },
  fireBooster: () => {}
};

/**
 * Mapeo de acciones para el Jugador 2 basándose en las teclas configuradas.
 */
export const Player2KeysMapEvents = {
  movePieceLeft: () => {
    const p1 = game.players.player1.currentState;
    const p2 = game.players.player2.currentState;
    p2.moveLeft(game.board, p1.piece);
  },
  movePieceRight: () => {
    const p1 = game.players.player1.currentState;
    const p2 = game.players.player2.currentState;
    p2.moveRight(game.board, p1.piece);
  },
  movePieceDown: () => {
    const p1 = game.players.player1.currentState;
    const p2 = game.players.player2.currentState;
    p2.moveDown(game.board, p1.piece);
  },
  movePieceRotate: () => {
    const p1 = game.players.player1.currentState;
    const p2 = game.players.player2.currentState;
    p2.rotate(game.board, p1.piece);
  },
  fireBooster: () => {}
};

/**
 * Acciones globales (pausa, etc.)
 */
export const GlobalKeysMapEvents = {
  pauseGame: () => {
    game.pauseGame();
  }
};

/**
 * Listener global de teclado para capturar los movimientos en el juego.
 */
document.addEventListener('keydown', event => {
  if (!game) return;

  switch (event.code) {
    // Teclas Jugador 1
    case MOVEMENTS_CODES.LEFT_P1:
      PlayerKeysMapEvents.movePieceLeft();
      break;
    case MOVEMENTS_CODES.RIGHT_P1:
      PlayerKeysMapEvents.movePieceRight();
      break;
    case MOVEMENTS_CODES.DOWN_P1:
      PlayerKeysMapEvents.movePieceDown();
      break;
    case MOVEMENTS_CODES.ROTATE_P1:
      PlayerKeysMapEvents.movePieceRotate();
      break;

    // Teclas Jugador 2
    case MOVEMENTS_CODES.LEFT_P2:
      Player2KeysMapEvents.movePieceLeft();
      break;
    case MOVEMENTS_CODES.RIGHT_P2:
      Player2KeysMapEvents.movePieceRight();
      break;
    case MOVEMENTS_CODES.DOWN_P2:
      Player2KeysMapEvents.movePieceDown();
      break;
    case MOVEMENTS_CODES.ROTATE_P2:
      Player2KeysMapEvents.movePieceRotate();
      break;

    // Pausa
    case MOVEMENTS_CODES.PAUSE:
      GlobalKeysMapEvents.pauseGame();
      break;

    default:
      break;
  }
});
