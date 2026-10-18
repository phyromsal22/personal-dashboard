import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useMoodStore = create(
  persist(
    (set) => ({
      moods: {}, // ទម្រង់៖ { '2023-10-25': 4, '2023-10-26': 5 }
      setMood: (date, score) => set((state) => ({
        moods: { ...state.moods, [date]: score }
      })),
    }),
    { name: 'mood-storage' }
  )
)