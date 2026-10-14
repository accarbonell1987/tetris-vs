import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, act, tick, LOCK_DELAY, MAX_LOCK_RESETS } from '../src/engine.js';

const ROWS = 22;
const GARBAGE = 8;

const withPiece = (piece, setup = () => {}) => {
  const game = createGame({ seed: 1 });
  game.players[0].active = piece;
  setup(game);
  return game;
};

test('S4: level 1 gravity drops one row per second', () => {
  const game = withPiece({ type: 'O', rotation: 0, x: 4, y: 0 });
  const waited = tick(game, 999).game;
  assert.equal(waited.players[0].active.y, 0);
  assert.equal(tick(waited, 1).game.players[0].active.y, 1);
});

test('S4: gravity speeds up with the level (level 10 is ~64 ms per row)', () => {
  const game = withPiece({ type: 'O', rotation: 0, x: 4, y: 0 }, setup => {
    setup.players[0].lines = 90;
  });
  assert.equal(tick(game, 65).game.players[0].active.y, 1);
});

test('S4: a grounded piece locks after the 500 ms lock delay', () => {
  assert.equal(LOCK_DELAY, 500);
  const game = withPiece({ type: 'O', rotation: 0, x: 4, y: ROWS - 2 });
  const waiting = tick(game, 499);
  assert.deepEqual(waiting.events, []);
  assert.deepEqual(tick(waiting.game, 1).events, [{ type: 'lock', player: 0 }]);
});

test('S4: moving a grounded piece resets the lock delay at most 15 times', () => {
  assert.equal(MAX_LOCK_RESETS, 15);
  let game = withPiece({ type: 'O', rotation: 0, x: 4, y: ROWS - 2 });
  for (let reset = 0; reset < MAX_LOCK_RESETS; reset++) {
    const waited = tick(game, 400);
    assert.deepEqual(waited.events, [], `locked early after ${reset} resets`);
    game = act(waited.game, 0, reset % 2 ? 'left' : 'right').game;
  }
  assert.deepEqual(tick(game, 1).events, [{ type: 'lock', player: 0 }]);
});

test('S8: a full row is cleared and the rows above fall down', () => {
  const game = withPiece({ type: 'O', rotation: 0, x: 4, y: 0 }, setup => {
    setup.board[ROWS - 1] = [8, 8, 8, 8, 0, 0, 8, 8, 8, 8];
  });
  const { game: next, events } = act(game, 0, 'hardDrop');
  assert.deepEqual(
    next.board[ROWS - 1].map(cell => cell !== 0),
    [false, false, false, false, true, true, false, false, false, false]
  );
  assert.equal(next.players[0].lines, 1);
  assert.equal(events.find(event => event.type === 'clear').lines, 1);
});

test('S8: top-out when a new piece cannot spawn (block out)', () => {
  const game = withPiece({ type: 'O', rotation: 0, x: 0, y: 0 }, setup => {
    for (let x = 3; x <= 6; x++) {
      setup.board[0][x] = GARBAGE;
      setup.board[1][x] = GARBAGE;
    }
  });
  const { game: next, events } = act(game, 0, 'hardDrop');
  assert.deepEqual(events.at(-1), { type: 'topOut', player: 0 });
  assert.equal(next.over, true);
  assert.deepEqual(act(next, 0, 'left').game, next);
  assert.deepEqual(tick(next, 5000).game, next);
});

test('S8: top-out when a piece locks entirely above the visible field (lock out)', () => {
  const game = withPiece({ type: 'O', rotation: 0, x: 0, y: 0 }, setup => {
    for (let y = 2; y < ROWS; y++) setup.board[y] = [8, 8, 8, 8, 8, 8, 8, 8, 8, 0];
  });
  const { game: next, events } = act(game, 0, 'hardDrop');
  assert.deepEqual(events, [
    { type: 'lock', player: 0 },
    { type: 'topOut', player: 0 }
  ]);
  assert.equal(next.over, true);
});
