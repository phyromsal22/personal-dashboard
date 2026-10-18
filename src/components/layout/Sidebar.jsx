import { NavLink, useNavigate } from 'react-router-dom'
import { Home, CheckSquare, Wallet, Smile, Settings, ChevronLeft, LogOut, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home, end: true },
  { to: '/habits', label: 'Habits', icon: CheckSquare },
  { to: '/expenses', label: 'Expenses', icon: Wallet },
  { to: '/savings', label: 'Savings', icon: Target }, // បន្ថែម Savings
  { to: '/mood', label: 'Mood', icon: Smile },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('បានចាកចេញពីគណនី')
    navigate('/login')
  }

  return (
    <aside className={cn('hidden md:flex flex-col h-screen sticky top-0 bg-surface border-r border-border transition-all duration-300', collapsed ? 'w-20' : 'w-64')}>
      <div className="flex items-center h-16 px-4 border-b border-border">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shrink-0">D</div>
        {!collapsed && <span className="ml-3 font-semibold text-text whitespace-nowrap">Dashboard</span>}
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => cn('flex items-center gap-3 h-11 px-3 rounded-lg transition-all duration-200 group', isActive ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-text-secondary hover:bg-surface-hover hover:text-text')}>
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border flex flex-col">
        <button onClick={handleLogout} className="flex items-center gap-3 h-12 px-4 text-danger hover:bg-danger/10 transition-colors">
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">ចាកចេញ</span>}
        </button>
        <button onClick={() => setCollapsed(!collapsed)} className="flex items-center justify-center h-12 border-t border-border text-text-muted hover:text-text hover:bg-surface-hover transition">
          <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>
    </aside>
  )
}