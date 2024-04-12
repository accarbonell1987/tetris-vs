import {
  BLOCK_SIZE,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  VELOCITY,
  SPAWN_P1,
  SPAWN_P2,
  GAME
} from './static/commons';
import { generateRandomPiece } from './func/piece';
import { createBoard } from './func/board';
import { checkCollisions, solidifyPiece, removeRows, isGameOver } from './func/game';
import { Player } from './classes/player';

export const Game = {
  state: { data: null, modify: () => {} },
  player1: { data: null, modify: () => {} },
  player2: { data: null, modify: () => {} },
  game: GAME,
  setGame: g => (Game.game = g),
  getGame: () => Game.game,
  inject: () => {
    Game.game.canvas = document.querySelector('canvas');
    Game.game.context = Game.game.canvas.getContext('2d');

    Game.game.canvas.width = BLOCK_SIZE * BOARD_WIDTH;
    Game.game.canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

    Game.game.context.scale(BLOCK_SIZE, BLOCK_SIZE);
  },
  init: ({
    initialGameState,
    initialP1State,
    initialP2State,
    gameState,
    setGameState,
    player1State,
    setPlayer1State,
    player2State,
    setPlayer2State
  }) => {
    console.log(initialP1State);

    Game.game.board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);

    Game.state = { data: gameState, modify: setGameState };
    Game.player1 = { data: player1State, modify: setPlayer1State };
    Game.player2 = { data: player2State, modify: setPlayer2State };

    // json of data for PLAYER 1 creation
    const p1Json = {
      name: initialP1State.name,
      image: initialP1State.image,
      piece: generateRandomPiece(),
      spawn: SPAWN_P1,
      modifyPlayer: setPlayer1State
    };

    // update player one with setPlayer1
    Game.player1.modify(new Player(p1Json));

    // json of data for PLAYER 1 creation
    const p2Json = {
      name: initialP2State.name,
      image: initialP2State.image,
      piece: generateRandomPiece(),
      spawn: SPAWN_P2,
      modifyPlayer: setPlayer2State
    };

    // update player one with setPlayer2
    Game.player2.modify(new Player(p2Json));
  },
  draw: () => {
    // const image = createImage(bgSrc, BOARD_WIDTH, BOARD_HEIGHT)
    // this.context.imageSmoothingEnabled = false
    // this.context.drawImage(image, 0, 0, 20, 20)

    Game.game.context.fillStyle = '#000';
    Game.game.context.fillRect(0, 0, Game.game.canvas.width, Game.game.canvas.height);

    Game.game.board.update(Game.game.context);
    Game.game.players.player1.piece.update(Game.game.context);
    Game.game.players.player2.piece.update(Game.game.context);
  },
  update: (time = 0) => {
    const deltaTime = time - Game.game.render.lastTime;

    Game.game.render.lastTime = time;
    Game.game.render.dropCounter += deltaTime;

    if (!Game.game.state.paused) {
      const player1 = Game.game.players.player1;
      const player2 = Game.game.players.player2;

      const piecePlayer1 = player1.piece;
      const piecePlayer2 = player2.piece;

      if (Game.game.render.dropCounter > VELOCITY[Game.game.state.level - 1].speed) {
        piecePlayer1.position.y++;
        piecePlayer2.position.y++;
        Game.game.render.dropCounter = 0;
      }

      if (checkCollisions(piecePlayer1, Game.game.board)) {
        piecePlayer1.position.y--;
        solidifyPiece(player1, Game.game.board);

        // Chequear si se acaba el juego
        if (isGameOver(Game.game.board)) {
          player1.lose = true;
          Game.game.board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);
        } else {
          player1.piece = generateRandomPiece();
          player1.piece.position.x = player1.spawn;
          removeRows(player1, Game.game.board);
        }
      }
      if (checkCollisions(piecePlayer2, Game.game.board)) {
        piecePlayer2.position.y--;
        solidifyPiece(player2, Game.game.board);

        // Chequear si se acaba el juego
        if (isGameOver(Game.game.board)) {
          player2.lose = true;
          Game.game.board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);
        } else {
          player2.piece = generateRandomPiece();
          player2.piece.position.x = player2.spawn;
          removeRows(player2, Game.game.board);
        }
      }
    }

    Game.draw();
  },
  pauseGame: () => {
    Game.game.state.paused = !Game.game.state.paused;
  }
};
