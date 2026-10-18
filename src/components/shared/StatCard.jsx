import { Card } from '@/components/ui/card'

export function StatCard({ title, value, icon: Icon, color = 'text-primary' }) {
  return (
    <Card hover className="flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-text-secondary">{title}</span>
        <div className={`p-2 rounded-lg bg-surface-hover ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-text">{value}</h3>
      </div>
    </Card>
  )
}