const connectedPlayers = new Map();

export const Lobby = {
  getConnectedPlayers: () => {
    return connectedPlayers;
  },

  setConnectedPlayers: players => {
    connectedPlayers.set(players);
  },

  clearConnectedPlayers: () => {
    connectedPlayers.clear();
  },

  addPlayer: player => {
    connectedPlayers.set(player);
  },

  removePlayer: player => {
    connectedPlayers.delete(player);
  },

  getPlayerById: id => {
    return connectedPlayers.get(id);
  }
};
