import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export const useHabitsStore = create((set, get) => ({
  habits: [],
  loading: false,

  fetchHabits: async () => {
    set({ loading: true })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return set({ loading: false })

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (!error) set({ habits: data, loading: false })
  },

  addHabit: async (habit) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('habits')
      .insert([{ ...habit, user_id: user.id, completed_dates: [] }])
      .select()
    
    if (!error) set((state) => ({ habits: [...state.habits, data[0]] }))
  },

  deleteHabit: async (id) => {
    const { error } = await supabase.from('habits').delete().eq('id', id)
    if (!error) set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }))
  },

  updateHabit: async (id, updatedData) => {
    const { data, error } = await supabase
      .from('habits')
      .update(updatedData)
      .eq('id', id)
      .select()
    
    if (!error) {
      set((state) => ({
        habits: state.habits.map((h) => h.id === id ? data[0] : h)
      }))
    }
  },

  toggleHabit: async (id, date) => {
    const habit = get().habits.find(h => h.id === id)
    const isCompleted = habit.completed_dates.includes(date)
    
    const newDates = isCompleted 
      ? habit.completed_dates.filter(d => d !== date)
      : [...habit.completed_dates, date]

    const { data, error } = await supabase
      .from('habits')
      .update({ completed_dates: newDates })
      .eq('id', id)
      .select()
    
    if (!error) {
      set((state) => ({
        habits: state.habits.map((h) => h.id === id ? data[0] : h)
      }))
    }
  },
}))