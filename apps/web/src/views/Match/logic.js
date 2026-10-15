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

/**
 * Match state from the `match-start` payload. Phases: countdown → playing → lost → roundOver → ... → over.
 * A `rejoin` payload (match-active after a reload) has no board left: its round is already lost (S3).
 * `pause` stops the game within any phase: reconnecting (this client dropped), opponent (they dropped),
 * resuming (countdown before play goes on).
 */
export const createMatchState = ({ matchId, players, round, seed, wins, countdownMs, rejoin }) => ({
  matchId,
  players,
  round,
  seed,
  wins,
  countdownMs,
  phase: rejoin ? 'lost' : 'countdown',
  pause: null,
  graceMs: 0,
  resumeMs: 0,
  roundWinner: null,
  nextRound: null,
  resultShown: false,
  winner: null,
  reason: null
});

export const isPlaying = state => state.phase === 'playing' && !state.pause;

/**
 * A match-active for the match on screen means "back online": rejoin only after this client dropped.
 * After a reload the mount already rejoined once; answering a duplicate match-active (one per lobby-join)
 * would report a lost board again and cost a second round.
 */
export const shouldRejoin = (state, payload) => payload.matchId === state.matchId && state.pause === 'reconnecting';

/** `match-rejoin` payload: a topped-out board is no game to resume (its top-out may never have arrived). */
export const rejoinMessage = state => ({
  matchId: state.matchId,
  round: state.nextRound?.round ?? state.round,
  hasGame: state.phase !== 'lost'
});

const startRound = (state, { round, seed, wins, countdownMs }) => ({
  ...state,
  round,
  seed,
  wins,
  countdownMs,
  phase: 'countdown',
  pause: null,
  roundWinner: null,
  nextRound: null,
  resultShown: false
});

/**
 * Server messages (`round-end`, `round-start`, `match-end`, `opponent-disconnected`, `match-resume`) plus local
 * `countdown-done`, `topout`, `result-shown` (the round result was on screen for ROUND_RESULT_MS),
 * `disconnected` (this socket dropped), `resume-done` and `match-gone` (back online, the match is over).
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
      return { ...state, phase: 'roundOver', pause: null, roundWinner: payload.winner, wins: payload.wins };
    case 'round-start':
      if (payload.round <= state.round) return state;
      // The server sends round-start right after round-end: keep the result up until it was shown.
      if (state.phase === 'roundOver' && !state.resultShown) return { ...state, nextRound: payload };
      return startRound(state, payload);
    case 'result-shown':
      if (state.phase !== 'roundOver') return state;
      return state.nextRound ? startRound(state, state.nextRound) : { ...state, resultShown: true };
    case 'match-end':
      return { ...state, phase: 'over', pause: null, winner: payload.winner, wins: payload.wins, reason: payload.reason };
    case 'disconnected':
      return { ...state, pause: 'reconnecting' };
    case 'opponent-disconnected':
      return { ...state, pause: 'opponent', graceMs: payload.graceMs };
    case 'match-resume':
      return { ...state, pause: 'resuming', resumeMs: payload.countdownMs, wins: payload.wins };
    case 'resume-done':
      return state.pause === 'resuming' ? { ...state, pause: null } : state;
    case 'match-gone':
      return state.pause === 'reconnecting' ? { ...state, phase: 'over', pause: null } : state;
    default:
      return state;
  }
};
