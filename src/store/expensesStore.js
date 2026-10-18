import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useExpensesStore = create(
  persist(
    (set) => ({
      expenses: [],
      addExpense: (expense) => set((state) => ({ 
        expenses: [{ ...expense, id: Date.now().toString(), date: new Date().toISOString() }, ...state.expenses] 
      })),
      deleteExpense: (id) => set((state) => ({ 
        expenses: state.expenses.filter((e) => e.id !== id) 
      })),
    }),
    { name: 'expenses-storage' }
  )
)