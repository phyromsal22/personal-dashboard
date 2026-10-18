import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export const useMoodStore = create((set, get) => ({
  moods: {}, 
  notes: {}, // បន្ថែមសម្រាប់រក្សាទុក Note
  loading: false,

  fetchMoods: async () => {
    set({ loading: true })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return set({ loading: false })

    const { data, error } = await supabase.from('moods').select('*')
    if (!error) {
      const moodsObj = {}
      const notesObj = {}
      data.forEach(item => {
        moodsObj[item.mood_date] = item.score
        if (item.note) notesObj[item.mood_date] = item.note
      })
      set({ moods: moodsObj, notes: notesObj, loading: false })
    }
  },

  setMood: async (date, score, note = '') => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const existingMood = get().moods[date]
    if (existingMood) {
      await supabase.from('moods').update({ score, note }).eq('user_id', user.id).eq('mood_date', date)
    } else {
      await supabase.from('moods').insert([{ user_id: user.id, mood_date: date, score, note }])
    }

    set((state) => ({
      moods: { ...state.moods, [date]: score },
      notes: { ...state.notes, [date]: note }
    }))
  },
}))