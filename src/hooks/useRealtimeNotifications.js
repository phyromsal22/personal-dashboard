import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/formatters'

export function useRealtimeNotifications(user) {
  useEffect(() => {
    if (!user) return

    // ចាប់ផ្តើមស្តាប់ការផ្លាស់ប្តូរនៅលើតារាង savings_contributions
    const channel = supabase
      .channel('realtime-contributions')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'savings_contributions' },
        async (payload) => {
          const newContribution = payload.new

          // បើអ្នកដាក់លុយគឺជាខ្លួនយើងផ្ទាល់ មិនចាំបាច់ជូនដំណឹងទេ
          if (newContribution.contributor_id === user.id) return

          // ពិនិត្យមើលថាតើគោលដៅនេះជារបស់យើងឬអត់
          const { data: goal } = await supabase
            .from('savings_goals')
            .select('user_id, name')
            .eq('id', newContribution.goal_id)
            .single()

          // បើជាគោលដៅរបស់យើង ទើបបង្ហាញការជូនដំណឹង
          if (goal && goal.user_id === user.id) {
            toast.info(`💰 មានគេដាក់លុយចូល!`, {
              description: `មានគេដាក់ ${formatCurrency(newContribution.amount, 'USD')} ចូលក្នុងគោលដៅ "${goal.name}" របស់អ្នក។`,
              duration: 6000,
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])
}