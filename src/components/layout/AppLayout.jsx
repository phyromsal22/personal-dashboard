import { useEffect, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNav } from './MobileNav'
import { supabase } from '@/lib/supabase'
import { useHabitsStore } from '@/store/habitsStore'
import { useExpensesStore } from '@/store/expensesStore'

export function AppLayout() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // ហៅ Function ទាញទិន្នន័យ
  const fetchHabits = useHabitsStore((state) => state.fetchHabits)
  const fetchExpenses = useExpensesStore((state) => state.fetchExpenses)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      // បើមាន Session ឱ្យទាញទិន្នន័យ
      if (session) {
        fetchHabits()
        fetchExpenses()
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        fetchHabits()
        fetchExpenses()
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchHabits, fetchExpenses])

  if (loading) return <div className="min-h-screen bg-bg flex items-center justify-center text-text">កំពុងផ្ទុក...</div>
  if (!session) return <Navigate to="/login" replace />

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 pb-20 md:p-6">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}