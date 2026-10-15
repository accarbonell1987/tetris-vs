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
  // Payload of the last `match-start` or `match-active`; the /match view runs the match from it.
  // `over` once the server ended it: the player may leave /match and the match is dropped.
  match: null,
  setMatch: match => set({ match }),
  finishMatch: () => set(state => ({ match: state.match && { ...state.match, over: true } })),
  clearMatch: () => set({ match: null }),
  // Challenge feedback for the lobby (sent, declined, error).
  notice: null,
  setNotice: notice => set({ notice }),
  error: null,
  setError: error => set({ error }),
  clearError: () => set({ error: null })
});
