import { useEffect, useState } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNav } from './MobileNav'
import { supabase } from '@/lib/supabase'
import { useHabitsStore } from '@/store/habitsStore'
import { useExpensesStore } from '@/store/expensesStore'
import { useMoodStore } from '@/store/moodStore'

export function AppLayout() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  
  const fetchHabits = useHabitsStore((state) => state.fetchHabits)
  const fetchExpenses = useExpensesStore((state) => state.fetchExpenses)
  const fetchMoods = useMoodStore((state) => state.fetchMoods)

  useEffect(() => {
    // ពិនិត្យ Session ដំបូង
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      
      // បើមាន Session ឱ្យទាញទិន្នន័យ
      if (session) {
        fetchHabits()
        fetchExpenses()
        fetchMoods()
      }
    })

    // តាមដានការផ្លាស់ប្តូរ (Login/Logout)
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

  // បង្ហាញ Loading មុនពេលសម្រេចចិត្តថាត្រូវលោតទៅ Login
  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-text font-medium">
        កំពុងផ្ទុក...
      </div>
    )
  }

  // បើគ្មាន Session ទេ ទើបលោតទៅ /login
  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 pb-20 md:p-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}