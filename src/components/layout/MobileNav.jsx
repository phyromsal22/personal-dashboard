import { NavLink } from 'react-router-dom'
import { Home, CheckSquare, Wallet, Smile, Settings, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { to: '/dashboard', icon: Home, end: true },
  { to: '/habits', icon: CheckSquare },
  { to: '/expenses', icon: Wallet },
  { to: '/savings', icon: Target }, // បន្ថែម Savings
  { to: '/mood', icon: Smile },
  { to: '/settings', icon: Settings },
]

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border flex overflow-x-auto">
      {items.map(({ to, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => cn('flex-1 flex flex-col items-center justify-center h-16 min-w-[60px] gap-1 transition', isActive ? 'text-primary' : 'text-text-muted')}>
          <Icon className="h-5 w-5" />
        </NavLink>
      ))}
    </nav>
  )
}