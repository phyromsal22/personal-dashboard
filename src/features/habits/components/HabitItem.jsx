import { useState } from 'react'
import { Check, Trash2, Flame, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { useHabitsStore } from '@/store/habitsStore'
import { calcStreak } from '../utils'
import { todayKey } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { HabitHeatmap } from './HabitHeatmap' 

export function HabitItem({ habit, onEdit }) {
  const toggleHabit = useHabitsStore((state) => state.toggleHabit)
  const deleteHabit = useHabitsStore((state) => state.deleteHabit)
  const [showConfirm, setShowConfirm] = useState(false)
  
  const today = todayKey()
  // ប្តូរមកប្រើ completed_dates វិញ
  const completedDates = habit.completed_dates || [] 
  const isCompletedToday = completedDates.includes(today)
  const streak = calcStreak(completedDates)

  const handleToggle = () => {
    toggleHabit(habit.id, today)
    if (!isCompletedToday) {
      toast.success('អបអរសាទរ! អ្នកបានបំពេញទម្លាប់នេះហើយ 🎉')
    }
  }

  const handleDelete = () => {
    deleteHabit(habit.id)
    toast.success('បានលុបទម្លាប់ដោយជោគជ័យ')
  }

  return (
    <>
      <div className={cn("card p-4 flex items-start justify-between transition-all group", isCompletedToday && "border-success/30 bg-success/5")}>
        <div className="flex items-start gap-4">
          <button
            onClick={handleToggle}
            className={cn(
              "mt-1 h-10 w-10 shrink-0 rounded-full flex items-center justify-center border-2 transition-all duration-300",
              isCompletedToday ? "bg-success border-success text-white scale-110 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "border-border text-transparent hover:border-primary/50"
            )}
          >
            <Check className="h-5 w-5" />
          </button>
          
          <div>
            <h4 className={cn("font-medium text-lg text-text transition-all", isCompletedToday && "text-text-muted")}>
              {habit.icon} {habit.name}
            </h4>
            {streak > 0 && (
              <span className="text-xs text-warning flex items-center gap-1 mt-1 font-semibold">
                <Flame className="h-3 w-3" /> {streak} ថ្ងៃជាប់គ្នា
              </span>
            )}
            
            {/* បញ្ជូន completedDates ដែលបានកែហើយទៅ Heatmap */}
            <HabitHeatmap completedDates={completedDates} />
          </div>
        </div>

        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(habit)} className="text-text-muted hover:text-primary p-2 transition-colors">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => setShowConfirm(true)} className="text-text-muted hover:text-danger p-2 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="លុបទម្លាប់?"
        description={`តើអ្នកប្រាកដជាចង់លុប "${habit.name}" មែនទេ?`}
      />
    </>
  )
}