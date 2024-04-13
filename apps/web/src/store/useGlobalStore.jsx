import { create } from 'zustand';
import { createPlayerStore } from './slices/createPlayerStore';
import { devtools } from 'zustand/middleware';

const useGlobalStore = create(
  devtools((set, get) => ({
    ...createPlayerStore(set, get)
  }))
);

export default useGlobalStore;
