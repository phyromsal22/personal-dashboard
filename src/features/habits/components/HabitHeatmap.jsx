import { getLastNDays } from '@/lib/formatters'
import { cn } from '@/lib/utils'

export function HabitHeatmap({ completedDates }) {
  // ទាញយក ៣៥ ថ្ងៃចុងក្រោយ (៥ សប្តាហ៍)
  const days = getLastNDays(35)

  return (
    <div className="flex flex-wrap gap-1 mt-3 max-w-[200px]">
      {days.map((date, index) => {
        const isCompleted = completedDates.includes(date)
        return (
          <div
            key={date}
            title={date}
            className={cn(
              "h-3 w-3 rounded-sm transition-colors duration-200",
              isCompleted ? "bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-surface-hover border border-border/50"
            )}
          />
        )
      })}
    </div>
  )
}