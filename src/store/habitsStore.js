import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useHabitsStore = create(
  persist(
    (set) => ({
      habits: [],
      addHabit: (habit) => set((state) => ({ 
        habits: [...state.habits, { ...habit, id: crypto.randomUUID(), completedDates: [] }] 
      })),
      deleteHabit: (id) => set((state) => ({ 
        habits: state.habits.filter((h) => h.id !== id) 
      })),
      toggleHabit: (id, date) => set((state) => ({
        habits: state.habits.map((h) => {
          if (h.id === id) {
            const isCompleted = h.completedDates.includes(date)
            return {
              ...h,
              completedDates: isCompleted 
                ? h.completedDates.filter((d) => d !== date)
                : [...h.completedDates, date]
            }
          }
          return h
        })
      })),
    }),
    { name: 'habits-storage' } // រក្សាទុកក្នុង LocalStorage
  )
)