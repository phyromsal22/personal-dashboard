import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useExpensesStore } from '@/store/expensesStore'
import { EXPENSE_CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function ExpenseForm({ onClose, initialData }) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')
  
  const addExpense = useExpensesStore((state) => state.addExpense)
  const updateExpense = useExpensesStore((state) => state.updateExpense)

  // បើមាន initialData មានន័យថាកំពុង Edit
  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount)
      setCategory(initialData.category)
      setNote(initialData.note || '')
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || isNaN(amount)) return

    const data = { amount: parseFloat(amount), category, note }

    if (initialData) {
      updateExpense(initialData.id, data)
      toast.success('បានកែប្រែការចំណាយដោយជោគជ័យ')
    } else {
      addExpense(data)
      toast.success('បានបន្ថែមការចំណាយថ្មី')
    }
    
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-6 animate-fade-up border-primary/30">
      <h3 className="font-semibold mb-4">{initialData ? 'កែប្រែការចំណាយ' : 'បន្ថែមចំណាយថ្មី'}</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-text-secondary mb-1 block">ចំនួនទឹកប្រាក់ ($)</label>
          <Input type="number" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus />
        </div>

        <div>
          <label className="text-sm text-text-secondary mb-2 block">ប្រភេទ</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {EXPENSE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "p-2 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all",
                  category === cat.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-surface-hover"
                )}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-text-secondary mb-1 block">ចំណាំ (ស្រេចចិត្ត)</label>
          <Input placeholder="ឧ. ទិញកាហ្វេ..." value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="ghost" onClick={onClose}>បោះបង់</Button>
        <Button type="submit">{initialData ? 'រក្សាទុកការកែប្រែ' : 'រក្សាទុក'}</Button>
      </div>
    </form>
  )
}