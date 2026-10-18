import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export const useSavingsStore = create((set, get) => ({
  goals: [],
  contributions: [], // បន្ថែមសម្រាប់រក្សាទុកប្រវត្តិ
  loading: false,

  fetchGoals: async () => {
    set({ loading: true })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return set({ loading: false })

    const { data: goalsData, error } = await supabase
      .from('savings_goals')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      const { data: contributions } = await supabase.from('savings_contributions').select('goal_id, amount')
      
      const formattedGoals = goalsData.map(goal => {
        const totalContributed = (contributions || [])
          .filter(c => c.goal_id === goal.id)
          .reduce((sum, c) => sum + Number(c.amount), 0)
        return { ...goal, current_amount: totalContributed }
      })
      
      set({ goals: formattedGoals, loading: false })
    } else {
      set({ loading: false })
    }
  },

  // ទាញយកប្រវត្តិនៃការដាក់លុយសម្រាប់គោលដៅណាមួយ
  fetchContributions: async (goalId) => {
    const { data, error } = await supabase
      .from('savings_contributions')
      .select('*')
      .eq('goal_id', goalId)
      .order('created_at', { ascending: false })
    
    if (!error) set({ contributions: data })
  },

  addGoal: async (goal) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase.from('savings_goals').insert([{ ...goal, user_id: user.id }]).select()
    if (!error) set((state) => ({ goals: [{ ...data[0], current_amount: 0 }, ...state.goals] }))
  },

  joinGoal: async (goalId) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data: goal } = await supabase.from('savings_goals').select('user_id').eq('id', goalId).single()
    if (goal?.user_id === user.id) return true

    const { data: existing } = await supabase.from('goal_collaborators').select('*').eq('goal_id', goalId).eq('user_id', user.id).single()
    if (existing) return true

    const { error } = await supabase.from('goal_collaborators').insert([{ goal_id: goalId, user_id: user.id }])
    if (!error) {
      get().fetchGoals()
      return true
    }
    return false
  },

  contributeToGoal: async (goalId, amount, note, receiptFile) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let receiptUrl = null
    if (receiptFile) {
      const fileExt = receiptFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('receipts').upload(fileName, receiptFile)
      if (!uploadError) {
        const { data } = supabase.storage.from('receipts').getPublicUrl(fileName)
        receiptUrl = data.publicUrl
      }
    }

    const { error } = await supabase.from('savings_contributions').insert([{
      goal_id: goalId,
      contributor_id: user.id,
      contributor_email: user.email, // បន្ថែម Email អ្នកដាក់លុយ
      amount: Number(amount),
      note,
      receipt_url: receiptUrl
    }])

    if (!error) {
      set((state) => ({
        goals: state.goals.map(g => g.id === goalId ? { ...g, current_amount: g.current_amount + Number(amount) } : g)
      }))
    }
  },

  deleteGoal: async (id) => {
    const { error } = await supabase.from('savings_goals').delete().eq('id', id)
    if (!error) set((state) => ({ goals: state.goals.filter(g => g.id !== id) }))
  }
}))