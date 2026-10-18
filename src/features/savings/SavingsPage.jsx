import { useState, useEffect } from 'react'
import { Target, Plus, Trash2, Wallet } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useSavingsStore } from '@/store/savingsStore'
import { formatCurrency } from '@/lib/formatters'
import { toast } from 'sonner'

export default function SavingsPage() {
  const { goals, loading, fetchGoals, addGoal, updateProgress, deleteGoal } = useSavingsStore()
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')

  useEffect(() => { fetchGoals() }, [fetchGoals])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name || !target) return
    await addGoal({ name, target_amount: Number(target) })
    setName('')
    setTarget('')
    toast.success('បានបង្កើតគោលដៅថ្មី!')
  }

  const handleAddMoney = async (id, current, targetAmount) => {
    const amount = prompt('បញ្ចូលចំនួនទឹកប្រាក់ដែលចង់សន្សំ ($):')
    if (!amount || isNaN(amount)) return
    const newTotal = current + Number(amount)
    await updateProgress(id, newTotal)
    if (newTotal >= targetAmount) toast.success('អបអរសាទរ! អ្នកសម្រេចគោលដៅបានហើយ! 🎉')
    else toast.success('បានបន្ថែមទឹកប្រាក់!')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader title="Savings Goals" subtitle="សន្សំលុយសម្រាប់អ្វីដែលអ្នកចង់បាន" />

      <Card>
        <form onSubmit={handleAdd} className="flex gap-3">
          <Input placeholder="ឈ្មោះគោលដៅ (ឧ. ទិញ Laptop)" value={name} onChange={e => setName(e.target.value)} />
          <Input type="number" placeholder="ចំនួនទឹកប្រាក់ ($)" value={target} onChange={e => setTarget(e.target.value)} className="w-32" />
          <Button type="submit"><Plus className="h-4 w-4" /> បង្កើត</Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map(goal => {
          const percent = Math.min((goal.current_amount / goal.target_amount) * 100, 100)
          return (
            <Card key={goal.id} className="relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-text">{goal.name}</h3>
                </div>
                <button onClick={() => deleteGoal(goal.id)} className="text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">សន្សំបាន: {formatCurrency(goal.current_amount)}</span>
                  <span className="text-text font-bold">{formatCurrency(goal.target_amount)}</span>
                </div>
                <div className="h-2 w-full bg-surface-hover rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${percent}%` }} />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-text-muted">{percent.toFixed(0)}% សម្រេច</span>
                  <Button size="sm" variant="secondary" onClick={() => handleAddMoney(goal.id, goal.current_amount, goal.target_amount)}>
                    <Wallet className="h-3 w-3 mr-1" /> បន្ថែមលុយ
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}