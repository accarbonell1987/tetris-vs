import { create } from 'zustand'
import { createPlayerStore } from './slices/createPlayerStore'
import { devtools } from 'zustand/middleware'

export const useGlobalStore = create(
  devtools((set, get) => ({
    ...createPlayerStore(set, get)
  }))
)
