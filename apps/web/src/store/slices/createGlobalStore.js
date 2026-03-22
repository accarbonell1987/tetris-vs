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
  error: null,
  setError: error => set({ error }),
  clearError: () => set({ error: null })
});
