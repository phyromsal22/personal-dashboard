import { useEffect, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNav } from './MobileNav'
import { supabase } from '@/lib/supabase'
import { useHabitsStore } from '@/store/habitsStore'
import { useExpensesStore } from '@/store/expensesStore'
import { useMoodStore } from '@/store/moodStore' // បន្ថែម Import សម្រាប់ Mood

export function AppLayout() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // ហៅ Function ទាញទិន្នន័យពី Store ទាំង ៣
  const fetchHabits = useHabitsStore((state) => state.fetchHabits)
  const fetchExpenses = useExpensesStore((state) => state.fetchExpenses)
  const fetchMoods = useMoodStore((state) => state.fetchMoods) 

  useEffect(() => {
    // ពិនិត្យមើល Session ពេលបើក App ដំបូង
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      
      // ប្រសិនបើមានអ្នក Login រួចហើយ ឱ្យទាញទិន្នន័យទាំងអស់មកបង្ហាញ
      if (session) {
        fetchHabits()
        fetchExpenses()
        fetchMoods()
      }
    })

    // តាមដានរាល់ការផ្លាស់ប្តូរ (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        fetchHabits()
        fetchExpenses()
        fetchMoods()
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchHabits, fetchExpenses, fetchMoods])

  // បង្ហាញអក្សរពេលកំពុងផ្ទុក
  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-text font-medium">
        កំពុងផ្ទុក...
      </div>
    )
  }

  // ប្រសិនបើគ្មាន Session (មិនទាន់ Login) ឱ្យលោតទៅទំព័រ /login
  if (!session) {
    return <Navigate to="/login" replace />
  }

  // បង្ហាញ Layout ពេល Login រួចរាល់
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