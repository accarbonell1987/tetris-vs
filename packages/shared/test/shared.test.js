import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, act, tick } from '../src/engine.js';

const ROWS = 22;
const GARBAGE = 8;
const holeRow = hole => Array.from({ length: 10 }, (_, x) => (x === hole ? 0 : GARBAGE));

const sharedGame = options => createGame({ seed: 1, players: 2, ...options });

test('S13: two players fall on one board and block each other', () => {
  const game = sharedGame();
  assert.equal(game.players.length, 2);
  game.players[0].active = { type: 'O', rotation: 0, x: 3, y: 10 };
  game.players[1].active = { type: 'O', rotation: 0, x: 5, y: 10 };
  assert.equal(act(game, 0, 'right').game.players[0].active.x, 3);
  assert.equal(act(game, 1, 'left').game.players[1].active.x, 5);
});

test('S13: a piece resting on the other falling piece does not lock mid-air', () => {
  const game = sharedGame();
  game.players[0].active = { type: 'O', rotation: 0, x: 3, y: 8 };
  game.players[1].active = { type: 'O', rotation: 0, x: 3, y: 10 };
  game.players[1].gravityTimer = -1e9; // keep the lower piece still
  const { game: next, events } = tick(game, 2000);
  assert.deepEqual(events, []);
  assert.deepEqual(next.players[0].active, { type: 'O', rotation: 0, x: 3, y: 8 });
  assert.ok(next.board.every(row => row.every(cell => cell === 0)));
});

test('S13: a spawn blocked only by the other falling piece waits instead of topping out', () => {
  const game = sharedGame();
  game.players[0].active = { type: 'O', rotation: 0, x: 7, y: 0 };
  game.players[1].active = { type: 'O', rotation: 0, x: 0, y: 5 };
  const expected = game.players[1].queue[0];

  const blocked = act(game, 1, 'hardDrop');
  assert.equal(blocked.game.players[1].active, null);
  assert.equal(blocked.game.over, false);
  assert.ok(!blocked.events.some(event => event.type === 'topOut'));

  let moved = blocked.game;
  for (let step = 0; step < 3; step++) moved = act(moved, 0, 'left').game;
  assert.equal(tick(moved, 1).game.players[1].active.type, expected);
});

test('S13: a falling piece under an overhang moves down with the board when lines clear', () => {
  const game = sharedGame();
  game.board[ROWS - 1] = [0, 0, 8, 8, 8, 8, 8, 8, 8, 8];
  game.board[ROWS - 5][5] = GARBAGE; // overhang right above player 2's piece
  game.players[0].active = { type: 'O', rotation: 0, x: 0, y: 5 };
  game.players[1].active = { type: 'O', rotation: 0, x: 5, y: ROWS - 4 };
  const { game: next } = act(game, 0, 'hardDrop');
  assert.equal(next.players[1].active.y, ROWS - 3);
  assert.equal(next.board[ROWS - 4][5], GARBAGE);
});

test('S14: cleared lines score 100 / 300 / 500 / 800 for the player who closed them', () => {
  const points = [1, 2, 3, 4].map(lines => {
    const game = sharedGame();
    for (let y = ROWS - lines; y < ROWS; y++) game.board[y] = holeRow(9);
    game.players[0].active = { type: 'I', rotation: 1, x: 7, y: 4 };
    const next = act(game, 0, 'hardDrop').game;
    assert.equal(next.players[1].score, 0);
    return next.players[0].score;
  });
  assert.deepEqual(points, [100, 300, 500, 800]);
});

test('S14: reaching the 3000 target wins the game', () => {
  const game = sharedGame({ targetScore: 3000 });
  game.players[0].score = 2900;
  game.board[ROWS - 1] = holeRow(9);
  game.players[0].active = { type: 'I', rotation: 1, x: 7, y: 4 };
  const { game: next, events } = act(game, 0, 'hardDrop');
  assert.deepEqual(events.at(-1), { type: 'win', player: 0 });
  assert.equal(next.over, true);
  assert.equal(next.winner, 0);
});

test('S14: the player whose piece cannot spawn loses and the other one wins', () => {
  const game = sharedGame();
  for (let x = 6; x < 10; x++) {
    game.board[0][x] = GARBAGE;
    game.board[1][x] = GARBAGE;
  }
  game.players[1].active = { type: 'O', rotation: 0, x: 0, y: 5 };
  const { game: next, events } = act(game, 1, 'hardDrop');
  assert.deepEqual(events.at(-1), { type: 'topOut', player: 1 });
  assert.equal(next.loser, 1);
  assert.equal(next.winner, 0);
});
