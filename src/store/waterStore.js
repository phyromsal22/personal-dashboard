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
      .single()
    
    if (data) set({ waterAmount: data.amount, loading: false })
    else set({ waterAmount: 0, loading: false })
  },

  addWater: async (glasses) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = todayKey()
    const newAmount = get().waterAmount + glasses

    // Upsert ទិន្នន័យ (បើមានហើយ កែថ្មី បើគ្មាន បង្កើតថ្មី)
    const { error } = await supabase.from('water_intake').upsert({
      user_id: user.id,
      date: today,
      amount: newAmount
    }, { onConflict: 'user_id, date' })

    if (!error) set({ waterAmount: newAmount })
  }
}))