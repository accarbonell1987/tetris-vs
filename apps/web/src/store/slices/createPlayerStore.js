export const createPlayerStore = set => ({
  player: null,
  setPlayer: player => set({ player }),
  clear: () => set({ player: null })
});
