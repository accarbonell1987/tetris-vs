import {
  BLOCK_SIZE,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  VELOCITY,
  SPAWN_P1,
  SPAWN_P2
} from '../static/commons';
import { generateRandomPiece } from '../func/piece';
import { createBoard } from '../func/board';
import { checkCollisions, solidifyPiece, removeRows, isGameOver } from '../func/game';
import { Player } from './player';
import { Containers } from '../func/containers';
import { GetRandomNumber } from '../../../utils/random';
import { loadSprite, randomIntFromRange } from '../func/utils';

export class Game {
  constructor() {
    this.canvas = null;
    this.context = null;
    this.state = { currentState: null, modify: () => {} };
    this.players = {
      player1: null,
      player2: null
    };
    this.render = {
      dropCounter: 0,
      lastTime: 0,
      pauseDrawTime: 0,
      interval: 1000
    };
    this.board = null;
    this.pause = {
      images: []
    };
  }

  inject(state) {
    //! Almacenar la referncia del estado del hook y la funcion para modificar ese estado
    this.state = { currentState: state.gameState, modify: state.setGameState };

    this.canvas = document.querySelector('canvas');
    this.context = this.canvas.getContext('2d');

    this.canvas.width = BLOCK_SIZE * BOARD_WIDTH;
    this.canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

    this.context.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  init() {
    this.board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);

    this.players.player1 = new Player(generateRandomPiece());
    this.players.player2 = new Player(generateRandomPiece());

    this.players.player1.spawn = SPAWN_P1;
    this.players.player2.spawn = SPAWN_P2;

    this.players.player1.level = 2;

    this.players.player1.piece.position.x = SPAWN_P1;
    this.players.player2.piece.position.x = SPAWN_P2;
  }

  update(time = 0) {
    const deltaTime = time - this.render.lastTime;

    this.render.lastTime = time;
    this.render.dropCounter += deltaTime;

    if (!this.state.currentState.paused) {
      const player1 = this.players.player1;
      const player2 = this.players.player2;

      const piecePlayer1 = player1.piece;
      const piecePlayer2 = player2.piece;

      if (this.render.dropCounter > VELOCITY[this.state.currentState.level - 1].speed) {
        piecePlayer1.position.y++;
        piecePlayer2.position.y++;
        this.render.dropCounter = 0;
      }

      if (checkCollisions(piecePlayer1, this.board)) {
        piecePlayer1.position.y--;
        solidifyPiece(player1, this.board);

        // Chequear si se acaba el juego
        if (isGameOver(this.board)) {
          player1.lose = true;
          this.board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);
        } else {
          player1.piece = generateRandomPiece();
          player1.piece.position.x = player1.spawn;
          removeRows(player1, this.board);
        }
      }
      if (checkCollisions(piecePlayer2, this.board)) {
        piecePlayer2.position.y--;
        solidifyPiece(player2, this.board);

        // Chequear si se acaba el juego
        if (isGameOver(this.board)) {
          player2.lose = true;
          this.board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);
        } else {
          player2.piece = generateRandomPiece();
          player2.piece.position.x = player2.spawn;
          removeRows(player2, this.board);
        }
      }

      Containers.drawBackGround(this);
      Containers.drawBoard(this);
      Containers.drawGame(this);
    } else {
      if (time - this.render.pauseDrawTime >= this.render.interval) {
        this.pause.images = [];

        for (let index = 0; index < 20; index++) {
          const randomNumber = randomIntFromRange(2, 10);
          this.pause.images.push(randomNumber);
        }

        console.log(this.pause.images);
        this.render.pauseDrawTime = time;
      }

      Containers.drawBackGround(this);
      Containers.drawBoard(this);
      Containers.drawPause(this);
    }
  }

  pauseGame() {
    const paused = !this.state.currentState.paused;
    this.state.currentState.paused = paused;
    this.state.modify({ ...this.state.currentState, paused });
  }
}
