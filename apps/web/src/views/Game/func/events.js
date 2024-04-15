import { MOVEMENTS_CODES } from '../static/commons';

let game = null;

export const setGame = instance => (game = instance);

export const PlayerKeysMapEvents = {
  movePieceLeft: () => {
    game.players.player1.moveLeft(game.board);
  },
  movePieceRight: () => {
    game.players.player1.moveRight(game.board);
  },
  movePieceDown: () => {
    game.players.player1.moveDown(game.board);
  },
  movePieceRotate: () => {
    game.players.player1.rotate(game.board);
  },
  fireBooster: () => {}
};

export const EnemyKeysMapEvents = {
  movePieceLeft: () => {
    game.players.player2.moveLeft(game.board);
  },
  movePieceRight: () => {
    game.players.player2.moveRight(game.board);
  },
  movePieceDown: () => {
    game.players.player2.moveDown(game.board);
  },
  movePieceRotate: () => {
    game.players.player2.rotate(game.board);
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
    case MOVEMENTS_CODES.LEFT_P2:
      EnemyKeysMapEvents.movePieceLeft();
      break;
    case MOVEMENTS_CODES.RIGHT_P1:
      PlayerKeysMapEvents.movePieceRight();
      break;
    case MOVEMENTS_CODES.RIGHT_P2:
      EnemyKeysMapEvents.movePieceRight();
      break;
    case MOVEMENTS_CODES.DOWN_P1:
      PlayerKeysMapEvents.movePieceDown();
      break;
    case MOVEMENTS_CODES.DOWN_P2:
      EnemyKeysMapEvents.movePieceDown();
      break;
    case MOVEMENTS_CODES.ROTATE_P1:
      PlayerKeysMapEvents.movePieceRotate();
      break;
    case MOVEMENTS_CODES.ROTATE_P2:
      EnemyKeysMapEvents.movePieceRotate();
      break;
    case MOVEMENTS_CODES.PAUSE:
      GlobalKeysMapEvents.pauseGame();
      break;

    default:
      break;
  }
});
