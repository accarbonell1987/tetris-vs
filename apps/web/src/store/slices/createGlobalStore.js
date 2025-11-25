export const createGlobalStore = set => ({
  socket: null,
  setSocket: socket => set({ socket })
});
