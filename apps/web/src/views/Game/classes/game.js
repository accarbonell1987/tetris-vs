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
import { randomIntFromRange } from '../func/utils';
import { Music } from '../func/music';

/**
 * Clase principal que controla el flujo del juego, el renderizado y los estados.
 */
export class Game {
  constructor() {
    this.canvas = null; // Elemento canvas de HTML
    this.context = null; // Contexto 2D para dibujar
    this.state = { currentState: null, modify: () => {} }; // Estado global del juego (pausa, nivel, etc.)
    this.players = {
      player1: { currentState: null, modify: () => {} },
      player2: { currentState: null, modify: () => {} }
    };
    this.render = {
      dropCounter: 0, // Acumulador de tiempo para la caída de piezas
      lastTime: 0, // Último timestamp procesado
      pauseDrawTime: 0, // Timer para efectos visuales en pausa
      interval: 1000 // Intervalo base
    };
    this.board = null; // Instancia del tablero
    this.pause = {
      images: [] // Imágenes aleatorias para el fondo de pausa
    };
    this.initialStates = {
      game: null,
      player1: null
    };
  }

  /**
   * Vincula el juego con los estados de React y el canvas del DOM.
   * @param {Object} state - Referencias a estados y setters de React.
   */
  inject(state) {
    this.initialStates.game = state.gameState;
    this.initialStates.player1 = state.playerState;

    // Guardamos las funciones de modificación de estado de React
    this.state = { currentState: state.gameState, modify: state.setGameState };
    this.players.player1 = { currentState: null, modify: state.setPlayerState };
    this.players.player2 = { currentState: null, modify: state.setEnemyState };

    this.initialStates.player2 = state.enemyState;

    this.canvas = document.getElementById('game-canvas');
    this.context = this.canvas.getContext('2d');

    // Configuración del tamaño del canvas basado en constantes
    this.canvas.width = BLOCK_SIZE * BOARD_WIDTH;
    this.canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

    // Escalamos el contexto para que 1 unidad equivalga a 1 bloque
    this.context.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  /**
   * Inicializa los componentes del juego (música, tablero, jugadores).
   */
  init() {
    Music.init();
    Music.mute(); // Empieza silenciado por defecto

    this.board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);

    // Creamos jugadores con sus piezas iniciales y siguientes
    const player1 = new Player(generateRandomPiece(), generateRandomPiece(), SPAWN_P1, {
      ...this.initialStates.player1
    });
    const player2 = new Player(generateRandomPiece(), generateRandomPiece(), SPAWN_P2, {
      ...this.initialStates.player2
    });

    this.players.player1 = { ...this.players.player1, currentState: player1 };
    this.players.player2 = { ...this.players.player2, currentState: player2 };

    // Sincronizamos con el estado de React
    this.players.player1.modify({ ...player1 });
    this.players.player2.modify({ ...player2 });
  }

  /**
   * Bucle principal de actualización. Se llama con requestAnimationFrame.
   */
  update(time = 0, nextChipPlayer1, nextChipPlayer2) {
    const deltaTime = time - this.render.lastTime;
    this.render.lastTime = time;
    this.render.dropCounter += deltaTime;

    // Actualizamos los previews de las siguientes fichas en la UI
    nextChipPlayer1.update(this.players.player1.currentState.nextPiece);
    nextChipPlayer2.update(this.players.player2.currentState.nextPiece);

    if (!this.state.currentState.paused) {
      const player1 = this.players.player1.currentState;
      const piecePlayer1 = player1.piece;

      const player2 = this.players.player2.currentState;
      const piecePlayer2 = player2.piece;

      // Lógica de caída automática basada en la velocidad del nivel actual
      if (this.render.dropCounter > VELOCITY[this.state.currentState.level - 1].speed) {
        piecePlayer1.position.y++;
        piecePlayer2.position.y++;
        this.render.dropCounter = 0;
      }

      // --- Procesamiento de colisiones para Jugador 1 ---
      if (checkCollisions(piecePlayer1, this.board, piecePlayer2)) {
        piecePlayer1.position.y--; // Revertimos caída
        solidifyPiece(player1, this.board); // Fijamos la pieza en el tablero
        player1.score += 10;

        if (isGameOver(this.board)) {
          player1.lose = true;
          this.board = createBoard(BOARD_WIDTH, BOARD_HEIGHT); // Reset del tablero
        } else {
          player1.assignNextPiece();
          removeRows(player1, this.board); // Limpiar filas completas
        }
        this.players.player1.modify({ ...player1 });
      }

      // --- Procesamiento de colisiones para Jugador 2 ---
      if (checkCollisions(piecePlayer2, this.board, piecePlayer1)) {
        piecePlayer2.position.y--;
        solidifyPiece(player2, this.board);
        player2.score += 10;

        if (isGameOver(this.board)) {
          player2.lose = true;
          this.board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);
        } else {
          player2.assignNextPiece();
          removeRows(player2, this.board);
        }
        this.players.player2.modify({ ...player2 });
      }

      // Dibujado de todos los elementos
      Containers.drawBackGround(this);
      Containers.drawBoard(this);
      Containers.drawGame(this);
    } else {
      // Lógica visual cuando el juego está en PAUSA
      if (time - this.render.pauseDrawTime >= this.render.interval) {
        this.pause.images = [];
        for (let index = 0; index < 20; index++) {
          this.pause.images.push(randomIntFromRange(2, 10));
        }
        this.render.pauseDrawTime = time;
      }
      Containers.drawBackGround(this);
      Containers.drawPause(this);
    }
  }

  /**
   * Alterna entre pausa y juego activo.
   */
  pauseGame() {
    const paused = !this.state.currentState.paused;
    !paused ? Music.play() : Music.pause();

    this.state.currentState.paused = paused;
    this.state.modify({ ...this.state.currentState, paused });
  }
}
