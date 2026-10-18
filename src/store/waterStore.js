import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { todayKey } from '@/lib/formatters'

export const useWaterStore = create((set, get) => ({
  waterAmount: 0,
  loading: false,

  fetchWater: async () => {
    set({ loading: true })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return set({ loading: false })

    const today = todayKey()
    const { data, error } = await supabase
      .from('water_intake')
      .select('amount')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle()
    
    if (data) {
      set({ waterAmount: Number(data.amount), loading: false })
    } else {
      set({ waterAmount: 0, loading: false })
    }
  },

  addWater: async (liters) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = todayKey()
    // បូកបញ្ចូលគ្នាជាលេខទសភាគ
    const newAmount = Number(get().waterAmount) + Number(liters)

    const { error } = await supabase.from('water_intake').upsert({
      user_id: user.id,
      date: today,
      amount: newAmount
    }, { onConflict: 'user_id, date' })

    if (!error) set({ waterAmount: newAmount })
  }
}))