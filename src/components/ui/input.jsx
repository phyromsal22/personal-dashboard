import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
export const Input = forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} className={cn('w-full h-10 px-3 rounded-lg bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-150', className)} {...props} />
))
Input.displayName = 'Input'