import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, act, tick, receiveGarbage, GARBAGE_DELAY } from '../src/engine.js';

const ROWS = 22;
const GARBAGE = 8;
const emptyRow = () => Array(10).fill(0);
const holeRow = hole => Array.from({ length: 10 }, (_, x) => (x === hole ? 0 : GARBAGE));

// Clears `lines` rows by dropping a vertical I into column 9.
const clearLines = (game, lines) => {
  const next = structuredClone(game);
  next.board = Array.from({ length: ROWS }, (_, y) => (y >= ROWS - lines ? holeRow(9) : emptyRow()));
  next.players[0].active = { type: 'I', rotation: 1, x: 7, y: 0 };
  return act(next, 0, 'hardDrop');
};

// Locks an O on an empty board: a placement that clears nothing.
const lockWithoutClear = game => {
  const next = structuredClone(game);
  next.board = Array.from({ length: ROWS }, emptyRow);
  next.players[0].active = { type: 'O', rotation: 0, x: 0, y: 0 };
  return act(next, 0, 'hardDrop');
};

const clearEvent = events => events.find(event => event.type === 'clear');

// Lays out a T-spin double slot: the T pointing down fills row 20 (cols 3-5) and row 21 (col 4).
const tSpinDoubleGame = () => {
  const game = createGame({ seed: 1 });
  game.board[ROWS - 1] = holeRow(4);
  game.board[ROWS - 2] = [8, 8, 8, 0, 0, 0, 8, 8, 8, 8];
  game.board[ROWS - 3][3] = GARBAGE;
  game.players[0].active = { type: 'T', rotation: 1, x: 3, y: ROWS - 3 };
  return game;
};

test('S9: line clears send 0 / 1 / 2 / 4 garbage lines', () => {
  const sent = [1, 2, 3, 4].map(lines => clearEvent(clearLines(createGame({ seed: 1 }), lines).events).attack);
  assert.deepEqual(sent, [0, 1, 2, 4]);
});

test('S9: a T-spin double sends 4', () => {
  const rotated = act(tSpinDoubleGame(), 0, 'rotateCW').game;
  const event = clearEvent(act(rotated, 0, 'hardDrop').events);
  assert.equal(event.lines, 2);
  assert.equal(event.tSpin, 'full');
  assert.equal(event.attack, 4);
});

test('S9: the same double without a final rotation is not a T-spin', () => {
  const game = tSpinDoubleGame();
  game.players[0].active = { type: 'T', rotation: 2, x: 3, y: ROWS - 3 };
  const event = clearEvent(act(game, 0, 'hardDrop').events);
  assert.equal(event.tSpin, 'none');
  assert.equal(event.attack, 1);
});

test('S10: consecutive clears add a combo bonus and a non-clearing lock resets it', () => {
  const first = clearLines(createGame({ seed: 1 }), 1);
  const second = clearLines(first.game, 1);
  const third = clearLines(second.game, 1);
  assert.deepEqual([first, second, third].map(step => clearEvent(step.events).attack), [0, 1, 1]);
  const afterBreak = clearLines(lockWithoutClear(third.game).game, 1);
  assert.equal(clearEvent(afterBreak.events).attack, 0);
});

test('S10: back-to-back Tetrises add 1, and a normal clear breaks the chain', () => {
  const firstTetris = clearLines(createGame({ seed: 1 }), 4);
  const secondTetris = clearLines(lockWithoutClear(firstTetris.game).game, 4);
  assert.equal(clearEvent(secondTetris.events).attack, 5);
  assert.equal(clearEvent(secondTetris.events).backToBack, true);

  const single = clearLines(lockWithoutClear(secondTetris.game).game, 1);
  const thirdTetris = clearLines(lockWithoutClear(single.game).game, 4);
  assert.equal(clearEvent(thirdTetris.events).attack, 4);
});

test('S11: an attack cancels pending garbage before sending the rest', () => {
  const pendingThree = receiveGarbage(createGame({ seed: 1 }), 0, 3).game;
  const fullCancel = clearLines(pendingThree, 4);
  assert.equal(clearEvent(fullCancel.events).sent, 1);
  assert.deepEqual(fullCancel.game.players[0].pendingGarbage, []);

  const pendingFive = receiveGarbage(createGame({ seed: 1 }), 0, 5).game;
  const partialCancel = clearLines(pendingFive, 4);
  assert.equal(clearEvent(partialCancel.events).sent, 0);
  assert.equal(partialCancel.game.players[0].pendingGarbage[0].lines, 1);
});

test('S12: garbage waits 500 ms, then rises on the next non-clearing lock as gray rows with one hole', () => {
  assert.equal(GARBAGE_DELAY, 500);
  const pending = receiveGarbage(createGame({ seed: 1 }), 0, 2).game;

  const tooEarly = lockWithoutClear(pending).game;
  assert.ok(tooEarly.board[ROWS - 1].every(cell => cell !== GARBAGE));

  const ready = tick(pending, GARBAGE_DELAY).game;
  const risen = lockWithoutClear(ready).game;
  const bottomRows = risen.board.slice(ROWS - 2);
  bottomRows.forEach(row => {
    assert.equal(row.filter(cell => cell === GARBAGE).length, 9);
    assert.equal(row.filter(cell => cell === 0).length, 1);
  });
  assert.equal(bottomRows[0].indexOf(0), bottomRows[1].indexOf(0));
  assert.deepEqual(risen.players[0].pendingGarbage, []);
});

test('S8: garbage that pushes blocks above the ceiling tops out', () => {
  const game = receiveGarbage(createGame({ seed: 1 }), 0, 2).game;
  game.board[1][9] = GARBAGE;
  game.players[0].active = { type: 'O', rotation: 0, x: 0, y: 0 };
  const { game: next, events } = act(tick(game, GARBAGE_DELAY).game, 0, 'hardDrop');
  assert.deepEqual(events.at(-1), { type: 'topOut', player: 0 });
  assert.equal(next.over, true);
});
