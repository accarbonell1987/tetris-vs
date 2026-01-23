import { drawPiece } from '../func/piece';
import { BLOCK_SIZE } from '../static/commons';

/**
 * Clase responsable de renderizar la vista previa de la siguiente pieza (next chip)
 * en un canvas independiente para cada jugador.
 */
export class NextChipPlayer {
  /**
   * @param {number} id - El ID del jugador (1 o 2).
   */
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

  /**
   * Inicializa el canvas de vista previa buscando el elemento por su ID dinámico.
   */
  init() {
    this.canvas = document.getElementById(`nextChipPlayer${this.id}-canvas`);
    this.context = this.canvas.getContext('2d');
  }

  /**
   * Actualiza la referencia de la pieza que se va a mostrar.
   */
  updatePiece(piece) {
    this.piece = piece;
  }

  /**
   * Renderiza la pieza en el canvas de vista previa.
   * Ajusta dinámicamente el tamaño del canvas según la forma de la pieza.
   * @param {Piece} piece - La pieza a renderizar.
   */
  update(piece) {
    const pieceToDraw = { ...piece };

    // Determinamos el ancho máximo de la pieza analizando su matriz
    let maxWidth = 0;
    pieceToDraw.shape.forEach(row => {
      if (maxWidth < row.length) maxWidth = row.length;
    });

    // Determinamos el alto máximo de la pieza
    const maxHeight = pieceToDraw.shape.length;

    // Redimensionamos el canvas para que se ajuste exactamente a la pieza
    this.canvas.width = BLOCK_SIZE * maxWidth;
    this.canvas.height = BLOCK_SIZE * maxHeight;
    this.context.scale(BLOCK_SIZE, BLOCK_SIZE);

    // Forzamos la posición a (0,0) para que se dibuje dentro del pequeño canvas de preview
    pieceToDraw.position = { x: 0, y: 0 };

    // Dibujamos la pieza
    drawPiece(this.context, pieceToDraw);
  }
}
