import { cn } from '@/lib/utils'
export function Card({ className, hover = false, children, ...props }) {
  return <div className={cn('card', hover && 'card-hover', className)} {...props}>{children}</div>
}