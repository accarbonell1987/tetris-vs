import { BOARD_WIDTH, HIDDEN_ROWS, VISIBLE_ROWS, PIECE_TYPES, getCells, getGhost } from '@tetris/shared';
import { BLOCK_SIZE, PLAYER_COLORS } from './static/commons';

import wallSrc from '../../assets/images/block-wall.png';
import blueSrc from '../../assets/images/block-blue.png';
import cyanSrc from '../../assets/images/block-cyan.png';
import greenSrc from '../../assets/images/block-green.png';
import orangeSrc from '../../assets/images/block-orange.png';
import purpleSrc from '../../assets/images/block-purple.png';
import redSrc from '../../assets/images/block-red.png';
import yellowSrc from '../../assets/images/block-yellow.png';

const PANEL_COLUMNS = 5; // hold + next queue column on each side of the board
export const CANVAS_COLUMNS = PANEL_COLUMNS * 2 + BOARD_WIDTH;
export const CANVAS_ROWS = VISIBLE_ROWS;

// Indexed by board cell value: 1-7 follow PIECE_TYPES (I J L O S T Z), 8 is garbage.
// Loaded once: creating images every frame made unloaded sprites flicker.
const SPRITES = [null, cyanSrc, blueSrc, orangeSrc, yellowSrc, greenSrc, purpleSrc, redSrc, wallSrc].map(
  source => {
    if (!source) return null;
    const image = new Image();
    image.src = source;
    return image;
  }
);

const cellValue = type => PIECE_TYPES.indexOf(type) + 1;

const drawCells = (context, cells, value, offsetX, offsetY = 0) => {
  cells.forEach(([x, y]) => {
    if (y + offsetY >= 0) context.drawImage(SPRITES[value], x + offsetX, y + offsetY, 1, 1);
  });
};

const drawLabel = (context, text, column, row) => {
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.fillStyle = '#a1a1aa';
  context.font = `bold ${BLOCK_SIZE * 0.55}px sans-serif`;
  context.fillText(text, column * BLOCK_SIZE, row * BLOCK_SIZE);
  context.restore();
};

// Draws a piece centered in a PANEL_COLUMNS x 3 slot.
const drawPreview = (context, type, column, row) => {
  const cells = getCells({ type, rotation: 0, x: 0, y: 0 });
  const xs = cells.map(([x]) => x);
  const ys = cells.map(([, y]) => y);
  const offsetX = column + (PANEL_COLUMNS - (Math.max(...xs) - Math.min(...xs) + 1)) / 2 - Math.min(...xs);
  const offsetY = row + (3 - (Math.max(...ys) - Math.min(...ys) + 1)) / 2 - Math.min(...ys);
  drawCells(context, cells, cellValue(type), offsetX, offsetY);
};

const drawPanel = (context, player, column) => {
  drawLabel(context, 'GUARDAR', column + 0.5, 0.8);
  if (player.hold) {
    context.globalAlpha = player.holdUsed ? 0.35 : 1;
    drawPreview(context, player.hold, column, 1);
    context.globalAlpha = 1;
  }
  drawLabel(context, 'SIGUIENTE', column + 0.5, 4.8);
  player.queue.slice(0, 5).forEach((type, slot) => drawPreview(context, type, column, 5 + slot * 3));
};

/** Draws the whole local match on a canvas already scaled to one unit per block. */
export const drawGame = (context, game) => {
  context.fillStyle = '#000';
  context.fillRect(0, 0, CANVAS_COLUMNS, CANVAS_ROWS);
  context.fillStyle = '#18181b';
  context.fillRect(PANEL_COLUMNS, 0, BOARD_WIDTH, CANVAS_ROWS);

  game.board.slice(HIDDEN_ROWS).forEach((row, y) =>
    row.forEach((value, x) => {
      if (value) context.drawImage(SPRITES[value], PANEL_COLUMNS + x, y, 1, 1);
    })
  );

  game.players.forEach((player, index) => {
    drawPanel(context, player, index === 0 ? 0 : PANEL_COLUMNS + BOARD_WIDTH);
    if (!player.active) return;

    const value = cellValue(player.active.type);
    context.globalAlpha = 0.25;
    drawCells(context, getCells(getGhost(game, index)), value, PANEL_COLUMNS, -HIDDEN_ROWS);
    context.globalAlpha = 1;

    const cells = getCells(player.active);
    drawCells(context, cells, value, PANEL_COLUMNS, -HIDDEN_ROWS);
    // Outline the falling piece in its player's color: both share one board.
    context.strokeStyle = PLAYER_COLORS[index];
    context.lineWidth = 0.08;
    cells.forEach(([x, y]) => {
      if (y >= HIDDEN_ROWS) context.strokeRect(PANEL_COLUMNS + x + 0.04, y - HIDDEN_ROWS + 0.04, 0.92, 0.92);
    });
  });
};
