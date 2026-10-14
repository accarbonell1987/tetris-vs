export const createGlobalStore = set => ({
  socket: null,
  setSocket: socket => set({ socket }),
  players: [],
  setPlayers: players => set({ players }),
  addPlayer: player => set(state => ({
    players: state.players.some(p => p.id === player.id) ? state.players : [...state.players, player]
  })),
  removePlayer: playerId => set(state => ({
    players: state.players.filter(p => p.id !== playerId)
  })),
  // Payload of the last `match-start`; the /match view runs the match from it.
  match: null,
  setMatch: match => set({ match }),
  clearMatch: () => set({ match: null }),
  error: null,
  setError: error => set({ error }),
  clearError: () => set({ error: null })
});
