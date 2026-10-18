import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useHabitsStore } from '@/store/habitsStore'
import { toast } from 'sonner'

export function HabitForm({ onClose, initialData }) {
  const [name, setName] = useState('')
  const addHabit = useHabitsStore((state) => state.addHabit)
  const updateHabit = useHabitsStore((state) => state.updateHabit)

  // បើមាន initialData មានន័យថាកំពុង Edit
  useEffect(() => {
    if (initialData) setName(initialData.name)
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    
    if (initialData) {
      updateHabit(initialData.id, { name: name.trim() })
      toast.success('បានកែប្រែទម្លាប់ដោយជោគជ័យ')
    } else {
      addHabit({ name: name.trim(), icon: '🎯' })
      toast.success('បានបន្ថែមទម្លាប់ថ្មី')
    }
    
    setName('')
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-6 animate-fade-up border-primary/30">
      <h3 className="font-semibold mb-4">{initialData ? 'កែប្រែទម្លាប់' : 'បន្ថែមទម្លាប់ថ្មី'}</h3>
      <Input 
        placeholder="ឧ. ហាត់ប្រាណ ៣០ នាទី..." 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        autoFocus
      />
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="ghost" onClick={onClose}>បោះបង់</Button>
        <Button type="submit">{initialData ? 'រក្សាទុកការកែប្រែ' : 'រក្សាទុក'}</Button>
      </div>
    </form>
  )
}