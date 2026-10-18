import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useHabitsStore } from '@/store/habitsStore'

export function HabitForm({ onClose }) {
  const [name, setName] = useState('')
  const addHabit = useHabitsStore((state) => state.addHabit)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    addHabit({ name: name.trim(), icon: '🎯' }) // Default icon
    setName('')
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-6 animate-fade-up border-primary/30">
      <h3 className="font-semibold mb-4">បន្ថែមទម្លាប់ថ្មី</h3>
      <Input 
        placeholder="ឧ. ហាត់ប្រាណ ៣០ នាទី..." 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        autoFocus
      />
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="ghost" onClick={onClose}>បោះបង់</Button>
        <Button type="submit">រក្សាទុក</Button>
      </div>
    </form>
  )
}