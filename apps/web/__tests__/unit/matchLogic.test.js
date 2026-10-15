import { describe, test, expect } from 'vitest';
import { createGame, getCells, PIECE_TYPES, HIDDEN_ROWS, VISIBLE_ROWS } from '@tetris/shared';
import { buildSnapshot, createMatchState, matchReducer, isCurrentRound, isPlaying, rejoinMessage, ROUND_RESULT_MS, shouldRejoin } from '../../src/views/Match/logic.js';

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

describe('reconnection (match-reconnect S1-S3)', () => {
  const playing = () => matchReducer(createMatchState(start), { type: 'countdown-done' });

  test('a drop of this client pauses the game until the server resumes it after a countdown', () => {
    let state = matchReducer(playing(), { type: 'disconnected' });
    expect(state).toMatchObject({ phase: 'playing', pause: 'reconnecting' });
    expect(isPlaying(state)).toBe(false);
    state = matchReducer(state, { type: 'match-resume', payload: { round: 1, wins: { a: 0, b: 0 }, countdownMs: 3000 } });
    expect(state).toMatchObject({ phase: 'playing', pause: 'resuming', resumeMs: 3000 });
    expect(isPlaying(state)).toBe(false);
    state = matchReducer(state, { type: 'resume-done' });
    expect(state).toMatchObject({ phase: 'playing', pause: null });
    expect(isPlaying(state)).toBe(true);
  });

  test('a dropped opponent pauses the game with the grace period', () => {
    const state = matchReducer(playing(), { type: 'opponent-disconnected', payload: { graceMs: 15000 } });
    expect(state).toMatchObject({ phase: 'playing', pause: 'opponent', graceMs: 15000 });
    expect(isPlaying(state)).toBe(false);
    expect(matchReducer(state, { type: 'resume-done' })).toBe(state);
  });

  test('a round lost on rejoin, a new round or the match end clear the pause', () => {
    const paused = matchReducer(playing(), { type: 'opponent-disconnected', payload: { graceMs: 15000 } });
    const ended = matchReducer(paused, { type: 'round-end', payload: { round: 1, winner: 'a', wins: { a: 1, b: 0 } } });
    expect(ended).toMatchObject({ phase: 'roundOver', pause: null });
    const over = matchReducer(paused, { type: 'match-end', payload: { winner: 'a', wins: { a: 0, b: 0 }, reason: 'disconnect' } });
    expect(over).toMatchObject({ phase: 'over', pause: null, reason: 'disconnect' });
  });

  test('a match restored after a reload starts with the round lost: the board is gone (S3)', () => {
    const state = createMatchState({ ...start, round: 2, rejoin: true });
    expect(state).toMatchObject({ round: 2, phase: 'lost', pause: null });
    expect(rejoinMessage(state)).toEqual({ matchId: 'm1', round: 2, hasGame: false });
  });

  test('rejoining with a live board keeps the game; a topped-out board does not', () => {
    expect(rejoinMessage(playing())).toEqual({ matchId: 'm1', round: 1, hasGame: true });
    expect(rejoinMessage(matchReducer(playing(), { type: 'topout' }))).toMatchObject({ hasGame: false });
  });

  test('rejoining while the next round is queued names that round', () => {
    const roundOver = matchReducer(playing(), {
      type: 'round-end',
      payload: { round: 1, winner: 'a', wins: { a: 1, b: 0 } }
    });
    const queued = matchReducer(roundOver, {
      type: 'round-start',
      payload: { round: 2, seed: 5, wins: { a: 1, b: 0 }, countdownMs: 3000 }
    });
    expect(rejoinMessage(queued)).toEqual({ matchId: 'm1', round: 2, hasGame: true });
  });

  test('back online without the match: it ended while this client was away', () => {
    const reconnecting = matchReducer(playing(), { type: 'disconnected' });
    expect(matchReducer(reconnecting, { type: 'match-gone' })).toMatchObject({ phase: 'over', pause: null, winner: null });
    const live = playing();
    expect(matchReducer(live, { type: 'match-gone' })).toBe(live);
  });
});

describe('shouldRejoin (match-active while /match is mounted)', () => {
  const state = { matchId: 'm1', pause: null };

  test('answers only after this client dropped its connection', () => {
    expect(shouldRejoin({ ...state, pause: 'reconnecting' }, { matchId: 'm1' })).toBe(true);
  });

  test('ignores a duplicate match-active after a reload already rejoined (it would cost another round)', () => {
    expect(shouldRejoin(state, { matchId: 'm1' })).toBe(false);
    expect(shouldRejoin({ ...state, pause: 'opponent' }, { matchId: 'm1' })).toBe(false);
  });

  test('ignores another match', () => {
    expect(shouldRejoin({ ...state, pause: 'reconnecting' }, { matchId: 'm2' })).toBe(false);
  });
});

