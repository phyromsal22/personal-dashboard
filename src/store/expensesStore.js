import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export const useExpensesStore = create((set) => ({
  expenses: [],
  loading: false,

  fetchExpenses: async () => {
    set({ loading: true })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return set({ loading: false })

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })
    
    if (!error) set({ expenses: data, loading: false })
  },

  addExpense: async (expense) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('expenses')
      .insert([{ ...expense, user_id: user.id, date: new Date().toISOString() }])
      .select()
    
    if (!error) set((state) => ({ expenses: [data[0], ...state.expenses] }))
  },

  deleteExpense: async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) }))
  },

  updateExpense: async (id, updatedData) => {
    const { data, error } = await supabase
      .from('expenses')
      .update(updatedData)
      .eq('id', id)
      .select()
    
    if (!error) {
      set((state) => ({
        expenses: state.expenses.map((e) => e.id === id ? data[0] : e)
      }))
    }
  },
}))