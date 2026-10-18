import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSettingsStore = create(
  persist(
    (set) => ({
      monthlyBudget: 0,
      setBudget: (amount) => set({ monthlyBudget: amount }),
    }),
    { name: 'app-settings' }
  )
)