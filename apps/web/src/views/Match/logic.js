import { PIECE_TYPES, getCells } from '@tetris/shared';

/** Board sent to the opponent: every row, with the falling piece drawn in (A5). */
export const buildSnapshot = game => {
  const board = game.board.map(row => [...row]);
  const { active } = game.players[0];
  if (active) {
    const value = PIECE_TYPES.indexOf(active.type) + 1;
    getCells(active).forEach(([x, y]) => {
      if (board[y]) board[y][x] = value;
    });
  }
  return board;
};

// How long the round result stays up before the next countdown.
export const ROUND_RESULT_MS = 2000;

export const isCurrentRound = (state, message) => message.round === state.round;

/** Match state from the `match-start` payload. Phases: countdown → playing → lost → roundOver → ... → over. */
export const createMatchState = ({ matchId, players, round, seed, wins, countdownMs }) => ({
  matchId,
  players,
  round,
  seed,
  wins,
  countdownMs,
  phase: 'countdown',
  roundWinner: null,
  nextRound: null,
  resultShown: false,
  winner: null,
  reason: null
});

const startRound = (state, { round, seed, wins, countdownMs }) => ({
  ...state,
  round,
  seed,
  wins,
  countdownMs,
  phase: 'countdown',
  roundWinner: null,
  nextRound: null,
  resultShown: false
});

/**
 * Server messages (`round-end`, `round-start`, `match-end`) plus local `countdown-done`, `topout`
 * and `result-shown` (the round result was on screen for ROUND_RESULT_MS).
 */
export const matchReducer = (state, { type, payload }) => {
  if (state.phase === 'over') return state;
  switch (type) {
    case 'countdown-done':
      return state.phase === 'countdown' ? { ...state, phase: 'playing' } : state;
    case 'topout':
      return state.phase === 'playing' ? { ...state, phase: 'lost' } : state;
    case 'round-end':
      if (!isCurrentRound(state, payload)) return state;
      return { ...state, phase: 'roundOver', roundWinner: payload.winner, wins: payload.wins };
    case 'round-start':
      if (payload.round <= state.round) return state;
      // The server sends round-start right after round-end: keep the result up until it was shown.
      if (state.phase === 'roundOver' && !state.resultShown) return { ...state, nextRound: payload };
      return startRound(state, payload);
    case 'result-shown':
      if (state.phase !== 'roundOver') return state;
      return state.nextRound ? startRound(state, state.nextRound) : { ...state, resultShown: true };
    case 'match-end':
      return { ...state, phase: 'over', winner: payload.winner, wins: payload.wins, reason: payload.reason };
    default:
      return state;
  }
};
