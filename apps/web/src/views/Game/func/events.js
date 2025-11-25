import { MOVEMENTS_CODES } from '../static/commons';

let game = null;

export const setGameToEvents = instance => (game = instance);

export const PlayerKeysMapEvents = {
  movePieceLeft: () => {
    game.players.player1.currentState.moveLeft(game.board);
  },
  movePieceRight: () => {
    game.players.player1.currentState.moveRight(game.board);
  },
  movePieceDown: () => {
    game.players.player1.currentState.moveDown(game.board);
  },
  movePieceRotate: () => {
    game.players.player1.currentState.rotate(game.board);
  },
  fireBooster: () => {}
};

//! No usable
export const Player2KeysMapEvents = {
  movePieceLeft: () => {
    game.players.player2.currentState.moveLeft(game.board);
  },
  movePieceRight: () => {
    game.players.player2.currentState.moveRight(game.board);
  },
  movePieceDown: () => {
    game.players.player2.currentState.moveDown(game.board);
  },
  movePieceRotate: () => {
    game.players.player2.currentState.rotate(game.board);
  },
  fireBooster: () => {}
};

export const GlobalKeysMapEvents = {
  pauseGame: () => {
    game.pauseGame();
  }
};

document.addEventListener('keydown', event => {
  switch (event.code) {
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

    case MOVEMENTS_CODES.PAUSE:
      GlobalKeysMapEvents.pauseGame();
      break;

    default:
      break;
  }
});
