import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export const useMoodStore = create((set, get) => ({
  moods: {}, // ទម្រង់៖ { '2023-10-25': 4, '2023-10-26': 5 }
  loading: false,

  fetchMoods: async () => {
    set({ loading: true })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return set({ loading: false })

    const { data, error } = await supabase
      .from('moods')
      .select('*')
    
    if (!error) {
      // បំប្លែងពី Array ទៅជា Object ដើម្បីងាយស្រួលហៅប្រើ
      const moodsObj = {}
      data.forEach(item => {
        moodsObj[item.mood_date] = item.score
      })
      set({ moods: moodsObj, loading: false })
    }
  },

  setMood: async (date, score) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // ពិនិត្យមើលថាតើថ្ងៃនេះមានអារម្មណ៍ហើយឬនៅ
    const existingMood = get().moods[date]

    if (existingMood) {
      // បើមានហើយ ធ្វើការ Update
      await supabase
        .from('moods')
        .update({ score })
        .eq('user_id', user.id)
        .eq('mood_date', date)
    } else {
      // បើមិនទាន់មាន ធ្វើការ Insert
      await supabase
        .from('moods')
        .insert([{ user_id: user.id, mood_date: date, score }])
    }

    // Update ក្នុង State ភ្លាមៗ
    set((state) => ({
      moods: { ...state.moods, [date]: score }
    }))
  },
}))