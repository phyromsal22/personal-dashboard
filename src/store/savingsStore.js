import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export const useSavingsStore = create((set) => ({
  goals: [],
  loading: false,

  fetchGoals: async () => {
    set({ loading: true })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return set({ loading: false })

    const { data, error } = await supabase.from('savings_goals').select('*').order('created_at', { ascending: false })
    if (!error) set({ goals: data, loading: false })
  },

  addGoal: async (goal) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase.from('savings_goals').insert([{ ...goal, user_id: user.id }]).select()
    if (!error) set((state) => ({ goals: [data[0], ...state.goals] }))
  },

  updateProgress: async (id, currentAmount) => {
    const { data, error } = await supabase.from('savings_goals').update({ current_amount: currentAmount }).eq('id', id).select()
    if (!error) set((state) => ({ goals: state.goals.map(g => g.id === id ? data[0] : g) }))
  },

  deleteGoal: async (id) => {
    const { error } = await supabase.from('savings_goals').delete().eq('id', id)
    if (!error) set((state) => ({ goals: state.goals.filter(g => g.id !== id) }))
  }
}))