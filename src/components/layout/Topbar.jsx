import { Bell, Search } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Topbar() {
  return (
    <header className="h-16 sticky top-0 z-30 bg-bg/80 backdrop-blur-lg border-b border-border flex items-center px-4 md:px-6 gap-4">
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input placeholder="Search..." className="pl-9" />
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon"><Bell className="h-4 w-4" /></Button>
        <ThemeToggle />
        <div className="ml-2 h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">S</div>
      </div>
    </header>
  )
}