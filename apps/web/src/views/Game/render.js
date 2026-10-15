import { BOARD_WIDTH, HIDDEN_ROWS, VISIBLE_ROWS, PIECE_TYPES, getCells, getGhost } from '@tetris/shared';
import { BLOCK_SIZE, PLAYER_COLORS, GARBAGE_COLOR } from './static/commons';

import wallSrc from '../../assets/images/block-wall.png';
import blueSrc from '../../assets/images/block-blue.png';
import cyanSrc from '../../assets/images/block-cyan.png';
import greenSrc from '../../assets/images/block-green.png';
import orangeSrc from '../../assets/images/block-orange.png';
import purpleSrc from '../../assets/images/block-purple.png';
import redSrc from '../../assets/images/block-red.png';
import yellowSrc from '../../assets/images/block-yellow.png';

// 'wide' (desktop) and 'compact' (phones): on a phone the side panels narrow and previews shrink,
// and online the opponent board becomes a miniature inside the panel, so my own board gets the width.
const LAYOUTS = {
  wide: { panel: 5, preview: 1, label: 0.55 },
  compact: { panel: 3, preview: 0.6, label: 0.42 }
};
export const CANVAS_ROWS = VISIBLE_ROWS;
export const gameColumns = layout => LAYOUTS[layout].panel * 2 + BOARD_WIDTH;
export const matchColumns = layout => (layout === 'compact' ? LAYOUTS.compact.panel + BOARD_WIDTH + 1 : 5 + BOARD_WIDTH + 2 + BOARD_WIDTH);

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

const drawLabel = (context, text, column, row, size) => {
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.fillStyle = '#a1a1aa';
  context.font = `bold ${BLOCK_SIZE * size}px sans-serif`;
  context.fillText(text, column * BLOCK_SIZE, row * BLOCK_SIZE);
  context.restore();
};

// Draws a piece centered in a panel slot `3 * scale` rows tall.
const drawPreview = (context, type, column, row, { panel, preview: scale }) => {
  const cells = getCells({ type, rotation: 0, x: 0, y: 0 });
  const xs = cells.map(([x]) => x);
  const ys = cells.map(([, y]) => y);
  const width = Math.max(...xs) - Math.min(...xs) + 1;
  const height = Math.max(...ys) - Math.min(...ys) + 1;
  context.save();
  context.translate(column + (panel - width * scale) / 2, row + ((3 - height) * scale) / 2);
  context.scale(scale, scale);
  drawCells(context, cells, cellValue(type), -Math.min(...xs), -Math.min(...ys));
  context.restore();
};

// Hold slot, then the 5-piece queue. Returns the first free row below it.
const drawPanel = (context, player, column, layout) => {
  const slot = 3 * layout.preview;
  drawLabel(context, 'GUARDAR', column + 0.3, 0.8, layout.label);
  if (player.hold) {
    context.globalAlpha = player.holdUsed ? 0.35 : 1;
    drawPreview(context, player.hold, column, 1, layout);
    context.globalAlpha = 1;
  }
  const queueRow = 1 + slot + 1;
  drawLabel(context, 'SIGUIENTE', column + 0.3, queueRow - 0.2, layout.label);
  player.queue.slice(0, 5).forEach((type, index) => drawPreview(context, type, column, queueRow + index * slot, layout));
  return queueRow + 5 * slot;
};

const drawBoard = (context, board, column) => {
  context.fillStyle = '#18181b';
  context.fillRect(column, 0, BOARD_WIDTH, CANVAS_ROWS);
  board.slice(HIDDEN_ROWS).forEach((row, y) =>
    row.forEach((value, x) => {
      if (value) context.drawImage(SPRITES[value], column + x, y, 1, 1);
    })
  );
};

// Ghost plus falling piece; returns the piece cells.
const drawActive = (context, game, index, column) => {
  const { active } = game.players[index];
  const value = cellValue(active.type);
  context.globalAlpha = 0.25;
  drawCells(context, getCells(getGhost(game, index)), value, column, -HIDDEN_ROWS);
  context.globalAlpha = 1;
  const cells = getCells(active);
  drawCells(context, cells, value, column, -HIDDEN_ROWS);
  return cells;
};

/** Draws the whole local match on a canvas already scaled to one unit per block. */
export const drawGame = (context, game, layoutName = 'wide') => {
  const layout = LAYOUTS[layoutName];
  const boardColumn = layout.panel;
  context.fillStyle = '#000';
  context.fillRect(0, 0, gameColumns(layoutName), CANVAS_ROWS);
  drawBoard(context, game.board, boardColumn);

  game.players.forEach((player, index) => {
    drawPanel(context, player, index === 0 ? 0 : boardColumn + BOARD_WIDTH, layout);
    if (!player.active) return;

    const cells = drawActive(context, game, index, boardColumn);
    // Outline the falling piece in its player's color: both share one board.
    context.strokeStyle = PLAYER_COLORS[index];
    context.lineWidth = 0.08;
    cells.forEach(([x, y]) => {
      if (y >= HIDDEN_ROWS) context.strokeRect(boardColumn + x + 0.04, y - HIDDEN_ROWS + 0.04, 0.92, 0.92);
    });
  });
};

// Opponent board drawn small (compact layout): scaled inside the side panel.
const drawMiniBoard = (context, board, column, row, scale) => {
  context.save();
  context.translate(column, row);
  context.scale(scale, scale);
  drawBoard(context, board, 0);
  context.strokeStyle = '#52525b';
  context.lineWidth = 0.15;
  context.strokeRect(0, 0, BOARD_WIDTH, CANVAS_ROWS);
  context.restore();
};

const drawGarbageMeter = (context, player, column) => {
  const pending = player.pendingGarbage.reduce((total, { lines }) => total + lines, 0);
  const height = Math.min(pending, CANVAS_ROWS);
  context.fillStyle = GARBAGE_COLOR;
  context.fillRect(column + 0.2, CANVAS_ROWS - height, 0.6, height);
};

/**
 * Draws an online match: my one-player game and the opponent's latest board snapshot.
 * wide: my panel, my board, my pending garbage meter, a gap, the opponent board full size.
 * compact: my panel with the opponent board as a miniature under the queue, my board, my meter.
 */
export const drawMatch = (context, game, opponentBoard, layoutName = 'wide') => {
  const layout = LAYOUTS[layoutName];
  const boardColumn = layout.panel;
  const player = game.players[0];
  context.fillStyle = '#000';
  context.fillRect(0, 0, matchColumns(layoutName), CANVAS_ROWS);
  drawBoard(context, game.board, boardColumn);
  const freeRow = drawPanel(context, player, 0, layout);
  if (player.active) drawActive(context, game, 0, boardColumn);
  drawGarbageMeter(context, player, boardColumn + BOARD_WIDTH);

  if (layoutName === 'compact') {
    const scale = (layout.panel - 0.4) / BOARD_WIDTH;
    drawLabel(context, 'RIVAL', 0.3, freeRow + 0.8, layout.label);
    drawMiniBoard(context, opponentBoard, 0.2, CANVAS_ROWS - CANVAS_ROWS * scale - 0.2, scale);
    return;
  }

  const opponentColumn = boardColumn + BOARD_WIDTH + 2;
  drawBoard(context, opponentBoard, opponentColumn);
  // The board color matches the dark card behind the canvas edge: outline it so it reads as a board.
  context.strokeStyle = '#3f3f46';
  context.lineWidth = 0.08;
  context.strokeRect(opponentColumn + 0.04, 0.04, BOARD_WIDTH - 0.08, CANVAS_ROWS - 0.08);
};
