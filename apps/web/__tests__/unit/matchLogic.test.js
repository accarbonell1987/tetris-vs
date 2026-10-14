import { describe, test, expect } from 'vitest';
import { createGame, getCells, PIECE_TYPES, HIDDEN_ROWS, VISIBLE_ROWS } from '@tetris/shared';
import { buildSnapshot, createMatchState, matchReducer, isCurrentRound, ROUND_RESULT_MS } from '../../src/views/Match/logic.js';

const start = {
  matchId: 'm1',
  players: [
    { id: 'a', name: 'Ana', image: 'a.svg' },
    { id: 'b', name: 'Beto', image: 'b.svg' }
  ],
  round: 1,
  seed: 42,
  wins: { a: 0, b: 0 },
  countdownMs: 3000
};

describe('board snapshot (S5, A5)', () => {
  test('draws the falling piece into a copy of the board and keeps every row', () => {
    const game = createGame({ seed: 7 });
    game.board[HIDDEN_ROWS + VISIBLE_ROWS - 1][0] = 8;
    const { active } = game.players[0];

    const snapshot = buildSnapshot(game);

    expect(snapshot).toHaveLength(HIDDEN_ROWS + VISIBLE_ROWS);
    expect(snapshot.every(row => row.length === 10)).toBe(true);
    expect(snapshot[HIDDEN_ROWS + VISIBLE_ROWS - 1][0]).toBe(8);
    getCells(active).forEach(([x, y]) => expect(snapshot[y][x]).toBe(PIECE_TYPES.indexOf(active.type) + 1));
    expect(game.board.flat().filter(Boolean)).toEqual([8]); // the game is not mutated
  });

  test('without a falling piece it is the plain board', () => {
    const game = createGame({ seed: 7 });
    game.players[0].active = null;
    expect(buildSnapshot(game)).toEqual(game.board);
  });
});

describe('match state (S4)', () => {
  test('match-start begins with the round 1 countdown', () => {
    expect(createMatchState(start)).toMatchObject({
      matchId: 'm1',
      round: 1,
      seed: 42,
      wins: { a: 0, b: 0 },
      phase: 'countdown',
      roundWinner: null
    });
  });

  test('countdown ends into play, a local top-out marks the round as lost', () => {
    const playing = matchReducer(createMatchState(start), { type: 'countdown-done' });
    expect(playing.phase).toBe('playing');
    expect(matchReducer(playing, { type: 'topout' }).phase).toBe('lost');
  });

  test('round-end for the current round shows the winner and the new wins', () => {
    const state = matchReducer(createMatchState(start), {
      type: 'round-end',
      payload: { round: 1, winner: 'b', wins: { a: 0, b: 1 } }
    });
    expect(state).toMatchObject({ phase: 'roundOver', roundWinner: 'b', wins: { a: 0, b: 1 } });
  });

  test('messages for another round are ignored', () => {
    const state = createMatchState(start);
    expect(matchReducer(state, { type: 'round-end', payload: { round: 2, winner: 'b', wins: { a: 0, b: 1 } } })).toBe(
      state
    );
    expect(matchReducer(state, { type: 'round-start', payload: { round: 1, seed: 9, wins: {}, countdownMs: 3000 } })).toBe(
      state
    );
    expect(isCurrentRound(state, { round: 1 })).toBe(true);
    expect(isCurrentRound(state, { round: 2 })).toBe(false);
  });

  const nextRound = { round: 2, seed: 99, wins: { a: 0, b: 1 }, countdownMs: 3000 };
  const roundOver = () => {
    const state = matchReducer(createMatchState(start), { type: 'topout' });
    return matchReducer(state, { type: 'round-end', payload: { round: 1, winner: 'b', wins: { a: 0, b: 1 } } });
  };

  test('the round result stays up until shown, then round-start resets to a new countdown', () => {
    let state = matchReducer(roundOver(), { type: 'round-start', payload: nextRound });
    expect(state).toMatchObject({ round: 1, phase: 'roundOver', roundWinner: 'b' });
    state = matchReducer(state, { type: 'result-shown' });
    expect(state).toMatchObject({ round: 2, seed: 99, wins: { a: 0, b: 1 }, phase: 'countdown', roundWinner: null });
    expect(ROUND_RESULT_MS).toBe(2000);
  });

  test('a round-start after the result was shown starts the countdown at once', () => {
    let state = matchReducer(roundOver(), { type: 'result-shown' });
    expect(state).toMatchObject({ round: 1, phase: 'roundOver' });
    state = matchReducer(state, { type: 'round-start', payload: nextRound });
    expect(state).toMatchObject({ round: 2, seed: 99, phase: 'countdown', roundWinner: null });
  });

  test('match-end finishes the match with the winner and the reason', () => {
    const state = matchReducer(createMatchState(start), {
      type: 'match-end',
      payload: { winner: 'a', wins: { a: 0, b: 0 }, reason: 'forfeit' }
    });
    expect(state).toMatchObject({ phase: 'over', winner: 'a', reason: 'forfeit' });
    expect(matchReducer(state, { type: 'round-start', payload: { round: 2, seed: 1, wins: {}, countdownMs: 3000 } })).toBe(
      state
    );
  });
});
