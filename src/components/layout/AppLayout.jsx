import { useEffect, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNav } from './MobileNav'
import { supabase } from '@/lib/supabase'

export function AppLayout() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ពិនិត្យមើលថាតើអ្នកប្រើប្រាស់ Login រួចហើយឬនៅ
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // តាមដានរាល់ការផ្លាស់ប្តូរ (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="min-h-screen bg-bg flex items-center justify-center text-text">កំពុងផ្ទុក...</div>
  }

  // បើគ្មាន Session (មិនទាន់ Login) ឱ្យលោតទៅទំព័រ /login
  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}