import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useHabitsStore } from '@/store/habitsStore'
import { toast } from 'sonner'

export function HabitForm({ onClose, initialData }) {
  const [name, setName] = useState('')
  const [reminderTime, setReminderTime] = useState('')
  
  const addHabit = useHabitsStore((state) => state.addHabit)
  const updateHabit = useHabitsStore((state) => state.updateHabit)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setReminderTime(initialData.reminder_time || '')
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    
    const data = { name: name.trim(), icon: '🎯', reminder_time: reminderTime }

    if (initialData) {
      updateHabit(initialData.id, data)
      toast.success('បានកែប្រែទម្លាប់ដោយជោគជ័យ')
    } else {
      addHabit(data)
      toast.success('បានបន្ថែមទម្លាប់ថ្មី')
    }
    
    setName('')
    setReminderTime('')
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-6 animate-fade-up border-primary/30">
      <h3 className="font-semibold mb-4">{initialData ? 'កែប្រែទម្លាប់' : 'បន្ថែមទម្លាប់ថ្មី'}</h3>
      <div className="space-y-4">
        <Input 
          placeholder="ឧ. ហាត់ប្រាណ ៣០ នាទី..." 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          autoFocus
        />
        <div>
          <label className="text-sm text-text-secondary mb-1 block">ម៉ោងរំលឹក (ស្រេចចិត្ត)</label>
          <Input 
            type="time" 
            value={reminderTime} 
            onChange={(e) => setReminderTime(e.target.value)} 
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="ghost" onClick={onClose}>បោះបង់</Button>
        <Button type="submit">{initialData ? 'រក្សាទុកការកែប្រែ' : 'រក្សាទុក'}</Button>
      </div>
    </form>
  )
}