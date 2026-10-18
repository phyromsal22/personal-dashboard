import { useState } from 'react'
import { Plus, CheckSquare } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { useHabitsStore } from '@/store/habitsStore'
import { HabitForm } from './components/HabitForm'
import { HabitItem } from './components/HabitItem'

export default function HabitsPage() {
  const habits = useHabitsStore((state) => state.habits)
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null) // បន្ថែម State នេះ

  const handleEdit = (habit) => {
    setEditingHabit(habit)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingHabit(null)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader 
        title="Habits" 
        subtitle="តាមដានទម្លាប់ប្រចាំថ្ងៃរបស់អ្នក" 
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> បន្ថែម
          </Button>
        }
      />

      {showForm && <HabitForm onClose={handleCloseForm} initialData={editingHabit} />}

      <div className="space-y-3">
        {habits.length === 0 && !showForm ? (
          <EmptyState 
            icon={CheckSquare}
            title="មិនទាន់មានទម្លាប់"
            description="ចាប់ផ្តើមបង្កើតទម្លាប់ថ្មី ដើម្បីតាមដានភាពជោគជ័យរបស់អ្នក។"
            action={<Button onClick={() => setShowForm(true)}>បង្កើតទម្លាប់ទី១</Button>}
          />
        ) : (
          habits.map((habit) => (
            <HabitItem key={habit.id} habit={habit} onEdit={handleEdit} />
          ))
        )}
      </div>
    </div>
  )
}