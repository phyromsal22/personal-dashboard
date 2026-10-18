import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSettingsStore = create(
  persist(
    (set) => ({
      monthlyBudget: 0,
      accentColor: 'indigo', // លំនាំដើមគឺពណ៌ស្វាយ
      setBudget: (amount) => set({ monthlyBudget: amount }),
      setAccentColor: (color) => set({ accentColor: color }),
    }),
    { name: 'app-settings' }
  )
)