import { Console } from '../utils/handleConsole.js';

const connectedPlayers = new Map();

export const Lobby = {
  getConnectedPlayers: () => {
    return connectedPlayers;
  },

  setConnectedPlayers: players => {
    connectedPlayers.clear();
    if (players instanceof Map) {
      players.forEach((player, id) => connectedPlayers.set(id, player));
    } else {
      Console.error('setConnectedPlayers expects a Map');
    }
  },

  clearConnectedPlayers: () => {
    connectedPlayers.clear();
  },

  addPlayer: player => {
    connectedPlayers.set(player.id, player);
  },

  removePlayer: player => {
    connectedPlayers.delete(player.id);
  },

  setStatus: (id, status) => {
    const player = connectedPlayers.get(id);
    if (player) player.status = status;
  },

  getPlayerById: id => {
    return connectedPlayers.get(id);
  },

  getPlayersArray: () => {
    return Array.from(connectedPlayers.values());
  }
};
