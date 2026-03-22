/* global vi */
import { describe, test, expect, beforeEach } from 'vitest';
import { Lobby } from '../../src/services/lobbyServices.js';

describe('Lobby service', () => {
  beforeEach(() => {
    Lobby.clearConnectedPlayers();
  });

  describe('addPlayer', () => {
    test('adds a player with id as key', () => {
      const player = { id: 'player-123', name: 'Alice' };
      Lobby.addPlayer(player);
      expect(Lobby.getPlayerById('player-123')).toBe(player);
    });

    test('overwrites player with same id', () => {
      const player1 = { id: 'same', name: 'Alice' };
      const player2 = { id: 'same', name: 'Bob' };
      Lobby.addPlayer(player1);
      Lobby.addPlayer(player2);
      expect(Lobby.getPlayerById('same')).toBe(player2);
    });
  });

  describe('removePlayer', () => {
    test('removes player by id', () => {
      const player = { id: 'player-123', name: 'Alice' };
      Lobby.addPlayer(player);
      expect(Lobby.getPlayerById('player-123')).toBe(player);
      Lobby.removePlayer(player);
      expect(Lobby.getPlayerById('player-123')).toBeUndefined();
    });

    test('does nothing if player not in map', () => {
      const player = { id: 'nonexistent', name: 'Alice' };
      expect(() => Lobby.removePlayer(player)).not.toThrow();
      expect(Lobby.getConnectedPlayers().size).toBe(0);
    });
  });

  describe('getPlayerById', () => {
    test('returns undefined for missing player', () => {
      expect(Lobby.getPlayerById('unknown')).toBeUndefined();
    });
  });

  describe('getPlayersArray', () => {
    test('returns empty array when no players', () => {
      expect(Lobby.getPlayersArray()).toEqual([]);
    });

    test('returns array of player objects', () => {
      const player1 = { id: '1', name: 'Alice' };
      const player2 = { id: '2', name: 'Bob' };
      Lobby.addPlayer(player1);
      Lobby.addPlayer(player2);
      const array = Lobby.getPlayersArray();
      expect(array).toHaveLength(2);
      expect(array).toContain(player1);
      expect(array).toContain(player2);
    });
  });

  describe('setConnectedPlayers', () => {
    test('replaces map with new Map', () => {
      const player1 = { id: '1', name: 'Alice' };
      Lobby.addPlayer(player1);
      const newMap = new Map();
      newMap.set('2', { id: '2', name: 'Bob' });
      Lobby.setConnectedPlayers(newMap);
      expect(Lobby.getPlayerById('1')).toBeUndefined();
      expect(Lobby.getPlayerById('2')).toEqual({ id: '2', name: 'Bob' });
    });

    test('logs error if argument is not a Map', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      Lobby.setConnectedPlayers({});
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('setConnectedPlayers expects a Map'));
      consoleSpy.mockRestore();
    });
  });

  describe('clearConnectedPlayers', () => {
    test('removes all players', () => {
      Lobby.addPlayer({ id: '1', name: 'Alice' });
      Lobby.addPlayer({ id: '2', name: 'Bob' });
      expect(Lobby.getConnectedPlayers().size).toBe(2);
      Lobby.clearConnectedPlayers();
      expect(Lobby.getConnectedPlayers().size).toBe(0);
    });
  });
});
