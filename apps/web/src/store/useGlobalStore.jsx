import { create } from 'zustand';
import { createPlayerStore } from './slices/createPlayerStore';
import { createGlobalStore } from './slices/createGlobalStore';
import { devtools } from 'zustand/middleware';

const useGlobalStore = create(
  devtools((set, get) => ({
    ...createPlayerStore(set, get),
    ...createGlobalStore(set, get)
  }))
);

export default useGlobalStore;
