import { randomInt, randomUUID } from 'crypto';

const ROUNDS_TO_WIN = 2;

const matches = new Map();
// challenger id -> target id; one pending challenge per challenger
const pendingChallenges = new Map();

const randomSeed = () => randomInt(2 ** 32);

export const Match = {
  clear: () => {
    matches.clear();
    pendingChallenges.clear();
  },

  create: players => {
    const match = {
      id: randomUUID(),
      players,
      round: 1,
      seed: randomSeed(),
      wins: Object.fromEntries(players.map(player => [player.id, 0]))
    };
    matches.set(match.id, match);
    return match;
  },

  get: id => matches.get(id),

  findByPlayer: playerId =>
    Array.from(matches.values()).find(match =>
      match.players.some(player => player.id === playerId)
    ),

  opponentOf: (match, playerId) => match.players.find(player => player.id !== playerId).id,

  isMember: (match, playerId) => match.players.some(player => player.id === playerId),

  // Returns null when ignored (unknown match, outsider, or not the current round).
  topOut: (matchId, playerId, round) => {
    const match = matches.get(matchId);
    if (!match || !Match.isMember(match, playerId) || round !== match.round) return null;
    const winner = Match.opponentOf(match, playerId);
    match.wins[winner] += 1;
    const result = {
      round,
      winner,
      wins: { ...match.wins },
      matchOver: match.wins[winner] === ROUNDS_TO_WIN
    };
    if (result.matchOver) {
      matches.delete(matchId);
    } else {
      match.round += 1;
      match.seed = randomSeed();
    }
    return result;
  },

  forfeit: (matchId, playerId) => {
    const match = matches.get(matchId);
    if (!match || !Match.isMember(match, playerId)) return null;
    matches.delete(matchId);
    return { winner: Match.opponentOf(match, playerId), wins: { ...match.wins } };
  },

  // The target answers one invite at a time: returns the challengers whose open invite was replaced.
  sendChallenge: (fromId, toId) => {
    const replaced = Array.from(pendingChallenges)
      .filter(([otherId, targetId]) => targetId === toId && otherId !== fromId)
      .map(([otherId]) => otherId);
    replaced.forEach(otherId => pendingChallenges.delete(otherId));
    pendingChallenges.set(fromId, toId);
    return replaced;
  },

  challengeTarget: fromId => pendingChallenges.get(fromId),

  // Consumes the challenge; true when it was pending.
  takeChallenge: (fromId, toId) => {
    if (pendingChallenges.get(fromId) !== toId) return false;
    pendingChallenges.delete(fromId);
    return true;
  },

  dropChallenges: playerId => {
    pendingChallenges.delete(playerId);
    pendingChallenges.forEach((toId, fromId) => {
      if (toId === playerId) pendingChallenges.delete(fromId);
    });
  }
};
