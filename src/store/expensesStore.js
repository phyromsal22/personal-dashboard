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
      // បន្ថែមមុខងារនេះ
      updateExpense: (id, updatedData) => set((state) => ({
        expenses: state.expenses.map((e) => e.id === id ? { ...e, ...updatedData } : e)
      })),
    }),
    { name: 'expenses-storage' }
  )
)