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
  winner: null,
  reason: null
});

/** Server messages (`round-end`, `round-start`, `match-end`) plus local `countdown-done` and `topout`. */
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
      return {
        ...state,
        round: payload.round,
        seed: payload.seed,
        wins: payload.wins,
        countdownMs: payload.countdownMs,
        phase: 'countdown',
        roundWinner: null
      };
    case 'match-end':
      return { ...state, phase: 'over', winner: payload.winner, wins: payload.wins, reason: payload.reason };
    default:
      return state;
  }
};
