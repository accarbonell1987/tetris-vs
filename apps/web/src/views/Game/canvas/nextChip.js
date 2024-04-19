import { Containers } from '../func/containers';
import { drawPiece } from '../func/piece';
import { BLOCK_SIZE } from '../static/commons';

export class NextChipPlayer1 {
  constructor() {
    this.canvas = null;
    this.context = null;
    this.piece = null;
    this.render = {
      dropCounter: 0,
      lastTime: 0,
      pauseDrawTime: 0,
      interval: 1000
    };
  }

  init() {
    this.canvas = document.getElementById('nextChipPlayer1-canvas');
    this.context = this.canvas.getContext('2d');

    this.canvas.width = BLOCK_SIZE * 4;
    this.canvas.height = BLOCK_SIZE * 3;

    this.context.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  updatePiece(piece) {
    this.piece = piece;
  }

  update(piece) {
    Containers.drawBackGround(this);

    const pieceToDraw = { ...piece };

    pieceToDraw.position = { x: 0, y: 1 };
    drawPiece(this.context, pieceToDraw);
  }
}
