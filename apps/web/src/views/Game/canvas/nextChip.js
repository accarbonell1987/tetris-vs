import { drawPiece } from '../func/piece';
import { BLOCK_SIZE } from '../static/commons';

// export class NextChipPlayer1 {
//   constructor() {
//     this.canvas = null;
//     this.context = null;
//     this.piece = null;
//     this.render = {
//       dropCounter: 0,
//       lastTime: 0,
//       pauseDrawTime: 0,
//       interval: 1000
//     };
//   }

//   init() {
//     this.canvas = document.getElementById('nextChipPlayer1-canvas');
//     this.context = this.canvas.getContext('2d');
//   }

//   updatePiece(piece) {
//     this.piece = piece;
//   }

//   update(piece) {
//     const pieceToDraw = { ...piece };

//     //! determinar las dimensiones de la ficha en las x
//     let maxWidth = 0;
//     pieceToDraw.shape.forEach(row => {
//       if (maxWidth < row.length) maxWidth = row.length;
//     });

//     //! determinar las dimensiones de la ficha en las y
//     const maxHeight = pieceToDraw.shape.length;

//     //! redefinir el canvas
//     this.canvas.width = BLOCK_SIZE * maxWidth;
//     this.canvas.height = BLOCK_SIZE * maxHeight;
//     this.context.scale(BLOCK_SIZE, BLOCK_SIZE);

//     //! recolocar la ficha
//     pieceToDraw.position = { x: 0, y: 0 };

//     //! dibujar la ficha
//     drawPiece(this.context, pieceToDraw);
//   }
// }

export class NextChipPlayer {
  constructor(id) {
    this.id = id;
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
    this.canvas = document.getElementById(`nextChipPlayer${this.id}-canvas`);
    this.context = this.canvas.getContext('2d');
  }

  updatePiece(piece) {
    this.piece = piece;
  }

  update(piece) {
    const pieceToDraw = { ...piece };

    //! determinar las dimensiones de la ficha en las x
    let maxWidth = 0;
    pieceToDraw.shape.forEach(row => {
      if (maxWidth < row.length) maxWidth = row.length;
    });

    //! determinar las dimensiones de la ficha en las y
    const maxHeight = pieceToDraw.shape.length;

    //! redefinir el canvas
    this.canvas.width = BLOCK_SIZE * maxWidth;
    this.canvas.height = BLOCK_SIZE * maxHeight;
    this.context.scale(BLOCK_SIZE, BLOCK_SIZE);

    //! recolocar la ficha
    pieceToDraw.position = { x: 0, y: 0 };

    //! dibujar la ficha
    drawPiece(this.context, pieceToDraw);
  }
}
