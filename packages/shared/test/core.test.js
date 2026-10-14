import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, act, getGhost, PIECE_TYPES, NEXT_COUNT } from '../src/engine.js';

const ROWS = 22; // 20 visible + 2 hidden spawn rows

// Drops the active piece and empties the board so long sequences never top out.
const dropOnEmptyBoard = game => {
  const next = act(game, 0, 'hardDrop').game;
  next.board.forEach(row => row.fill(0));
  return next;
};

const pieceSequence = (seed, count) => {
  let game = createGame({ seed });
  const sequence = [game.players[0].active.type];
  while (sequence.length < count) {
    game = dropOnEmptyBoard(game);
    sequence.push(game.players[0].active.type);
  }
  return sequence;
};

test('S1: same seed produces the same piece sequence', () => {
  assert.deepEqual(pieceSequence(42, 14), pieceSequence(42, 14));
  assert.notDeepEqual(pieceSequence(42, 14), pieceSequence(7, 14));
});

test('S1: every group of 7 pieces is a full bag', () => {
  const sequence = pieceSequence(123, 14);
  assert.deepEqual([...sequence.slice(0, 7)].sort(), [...PIECE_TYPES].sort());
  assert.deepEqual([...sequence.slice(7, 14)].sort(), [...PIECE_TYPES].sort());
});

test('S2: rotate clockwise uses SRS wall kick off the left wall', () => {
  const game = createGame({ seed: 1 });
  game.players[0].active = { type: 'T', rotation: 1, x: -1, y: 5 };
  const { game: next } = act(game, 0, 'rotateCW');
  assert.deepEqual(next.players[0].active, { type: 'T', rotation: 2, x: 0, y: 5 });
});

test('S2: rotate counter-clockwise uses SRS wall kick off the right wall', () => {
  const game = createGame({ seed: 1 });
  game.players[0].active = { type: 'T', rotation: 3, x: 8, y: 5 };
  const { game: next } = act(game, 0, 'rotateCCW');
  assert.deepEqual(next.players[0].active, { type: 'T', rotation: 2, x: 7, y: 5 });
});

test('S2: I piece uses its own kick table (fifth kick off the floor)', () => {
  const game = createGame({ seed: 1 });
  game.players[0].active = { type: 'I', rotation: 0, x: 6, y: ROWS - 2 };
  const { game: next } = act(game, 0, 'rotateCW');
  assert.deepEqual(next.players[0].active, { type: 'I', rotation: 1, x: 7, y: ROWS - 4 });
});

test('S3: moving into a wall is ignored and the input game is not mutated', () => {
  const game = createGame({ seed: 1 });
  game.players[0].active = { type: 'T', rotation: 0, x: 0, y: 5 };
  const { game: next } = act(game, 0, 'left');
  assert.equal(next.players[0].active.x, 0);
  const { game: moved } = act(next, 0, 'right');
  assert.equal(moved.players[0].active.x, 1);
  assert.equal(next.players[0].active.x, 0);
});

test('S3: hard drop locks the piece on the floor and spawns the next one', () => {
  const game = createGame({ seed: 1 });
  game.players[0].active = { type: 'O', rotation: 0, x: 4, y: 0 };
  const expectedNext = game.players[0].queue[0];
  const { game: next, events } = act(game, 0, 'hardDrop');
  const bottom = next.board[ROWS - 1];
  assert.ok(bottom[4] !== 0 && bottom[5] !== 0);
  assert.equal(next.players[0].active.type, expectedNext);
  assert.deepEqual(events, [{ type: 'lock', player: 0 }]);
});

test('S5: hold once per piece, then available again after locking', () => {
  const game = createGame({ seed: 1 });
  const first = game.players[0].active.type;
  const second = game.players[0].queue[0];

  const held = act(game, 0, 'hold').game;
  assert.equal(held.players[0].hold, first);
  assert.equal(held.players[0].active.type, second);

  const heldAgain = act(held, 0, 'hold').game;
  assert.equal(heldAgain.players[0].active.type, second);

  const afterLock = act(heldAgain, 0, 'hardDrop').game;
  const swapped = act(afterLock, 0, 'hold').game;
  assert.equal(swapped.players[0].active.type, first);
  assert.equal(swapped.players[0].hold, afterLock.players[0].active.type);
});

test('S6: ghost is the lowest position the piece can fall to', () => {
  const game = createGame({ seed: 1 });
  game.players[0].active = { type: 'O', rotation: 0, x: 4, y: 0 };
  assert.deepEqual(getGhost(game, 0), { type: 'O', rotation: 0, x: 4, y: ROWS - 2 });
});

test('S7: the next queue always shows at least 5 pieces', () => {
  let game = createGame({ seed: 9 });
  assert.equal(NEXT_COUNT, 5);
  for (let index = 0; index < 20; index++) {
    assert.ok(game.players[0].queue.length >= NEXT_COUNT);
    game = dropOnEmptyBoard(game);
  }
});

test('S8: board is 10 wide with 20 visible rows plus 2 hidden rows', () => {
  const game = createGame({ seed: 1 });
  assert.equal(game.board.length, ROWS);
  assert.ok(game.board.every(row => row.length === 10));
});
