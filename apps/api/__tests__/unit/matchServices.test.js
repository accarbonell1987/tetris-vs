import { describe, test, expect, beforeEach } from 'vitest';
import { Match } from '../../src/services/matchServices.js';

const alice = { id: 'a', name: 'Alice', image: 'a.png' };
const bob = { id: 'b', name: 'Bob', image: 'b.png' };

describe('Match service', () => {
  beforeEach(() => {
    Match.clear();
  });

  describe('create', () => {
    test('starts round 1 with both players, zero wins and a uint32 seed', () => {
      const match = Match.create([alice, bob]);
      expect(match.id).toEqual(expect.any(String));
      expect(match.players).toEqual([alice, bob]);
      expect(match.round).toBe(1);
      expect(match.wins).toEqual({ a: 0, b: 0 });
      expect(Number.isInteger(match.seed)).toBe(true);
      expect(match.seed).toBeGreaterThanOrEqual(0);
      expect(match.seed).toBeLessThan(2 ** 32);
      expect(Match.get(match.id)).toBe(match);
      expect(Match.findByPlayer('b')).toBe(match);
      expect(Match.opponentOf(match, 'a')).toBe('b');
    });
  });

  describe('topOut', () => {
    test('the other player wins the current round and a new round starts with a new seed', () => {
      const match = Match.create([alice, bob]);
      const firstSeed = match.seed;
      const result = Match.topOut(match.id, 'a', 1);
      expect(result).toEqual({ round: 1, winner: 'b', wins: { a: 0, b: 1 }, matchOver: false });
      expect(match.round).toBe(2);
      expect(match.seed).not.toBe(firstSeed);
    });

    test('only the first top-out of the current round counts', () => {
      const match = Match.create([alice, bob]);
      Match.topOut(match.id, 'a', 1);
      expect(Match.topOut(match.id, 'b', 1)).toBeNull();
      expect(match.wins).toEqual({ a: 0, b: 1 });
    });

    test('ignores unknown matches and players outside the match', () => {
      const match = Match.create([alice, bob]);
      expect(Match.topOut('missing', 'a', 1)).toBeNull();
      expect(Match.topOut(match.id, 'c', 1)).toBeNull();
      expect(match.round).toBe(1);
    });

    test('a second round win ends the match by KO and closes it', () => {
      const match = Match.create([alice, bob]);
      Match.topOut(match.id, 'a', 1);
      Match.topOut(match.id, 'b', 2);
      const result = Match.topOut(match.id, 'a', 3);
      expect(result).toEqual({ round: 3, winner: 'b', wins: { a: 1, b: 2 }, matchOver: true });
      expect(Match.get(match.id)).toBeUndefined();
      expect(Match.findByPlayer('a')).toBeUndefined();
    });
  });

  describe('forfeit', () => {
    test('the other player wins and the match closes', () => {
      const match = Match.create([alice, bob]);
      Match.topOut(match.id, 'b', 1);
      expect(Match.forfeit(match.id, 'a')).toEqual({ winner: 'b', wins: { a: 1, b: 0 } });
      expect(Match.get(match.id)).toBeUndefined();
    });

    test('ignores players outside the match', () => {
      const match = Match.create([alice, bob]);
      expect(Match.forfeit(match.id, 'c')).toBeNull();
      expect(Match.get(match.id)).toBe(match);
    });
  });

  describe('challenges', () => {
    test('a challenger keeps only one pending challenge', () => {
      Match.sendChallenge('a', 'b');
      Match.sendChallenge('a', 'c');
      expect(Match.takeChallenge('a', 'b')).toBe(false);
      expect(Match.takeChallenge('a', 'c')).toBe(true);
      expect(Match.takeChallenge('a', 'c')).toBe(false);
    });

    test('dropping a player removes challenges sent by and to them', () => {
      Match.sendChallenge('a', 'b');
      Match.sendChallenge('c', 'a');
      Match.sendChallenge('c2', 'b');
      Match.dropChallenges('a');
      expect(Match.takeChallenge('a', 'b')).toBe(false);
      expect(Match.takeChallenge('c', 'a')).toBe(false);
      expect(Match.takeChallenge('c2', 'b')).toBe(true);
    });
  });
});
