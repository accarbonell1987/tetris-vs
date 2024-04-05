export const createPlayerStore = (set) => ({
  player: null,
  clear: () => set({ player: null })
})
