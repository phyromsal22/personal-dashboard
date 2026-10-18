import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export const useSavingsStore = create((set, get) => ({
  goals: [],
  loading: false,

  fetchGoals: async () => {
    set({ loading: true })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return set({ loading: false })

    // ទាញយកតែគោលដៅសន្សំសិន (មិនទាញ contributions ភ្ជាប់មកជាមួយទេ)
    const { data: goalsData, error } = await supabase
      .from('savings_goals')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      // ទាញយកការចូលរួមដាក់លុយដាច់ដោយឡែក
      const { data: contributions } = await supabase.from('savings_contributions').select('goal_id, amount')
      
      const formattedGoals = goalsData.map(goal => {
        const totalContributed = (contributions || [])
          .filter(c => c.goal_id === goal.id)
          .reduce((sum, c) => sum + Number(c.amount), 0)
        return { ...goal, current_amount: totalContributed }
      })
      
      set({ goals: formattedGoals, loading: false })
    } else {
      console.error("Fetch Goals Error:", error)
      set({ loading: false })
    }
  },

  addGoal: async (goal) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase.from('savings_goals').insert([{ ...goal, user_id: user.id }]).select()
    if (!error) set((state) => ({ goals: [{ ...data[0], current_amount: 0 }, ...state.goals] }))
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