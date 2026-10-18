import { useState } from 'react'
import { Plus, Wallet } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useExpensesStore } from '@/store/expensesStore'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseItem } from './components/ExpenseItem'
import { formatCurrency } from '@/lib/formatters'

export default function ExpensesPage() {
  const expenses = useExpensesStore((state) => state.expenses)
  const loading = useExpensesStore((state) => state.loading)
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  
  const total = expenses.reduce((sum, item) => sum + item.amount, 0)

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingExpense(null)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader 
        title="Expenses" 
        subtitle="តាមដានការចំណាយរបស់អ្នក" 
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> បន្ថែម
          </Button>
        }
      />

      <div className="card mb-6 flex items-center justify-between bg-primary/5 border-primary/20">
        <div>
          <p className="text-sm text-text-secondary mb-1">ចំណាយសរុប</p>
          <h2 className="text-3xl font-bold text-text">{formatCurrency(total)}</h2>
        </div>
        <Wallet className="h-10 w-10 text-primary/50" />
      </div>

      {showForm && <ExpenseForm onClose={handleCloseForm} initialData={editingExpense} />}

      <div className="space-y-3">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))
        ) : expenses.length === 0 && !showForm ? (
          <EmptyState 
            icon={Wallet}
            title="មិនទាន់មានការចំណាយ"
            description="កត់ត្រាការចំណាយដំបូងរបស់អ្នកដើម្បីគ្រប់គ្រងថវិកា។"
            action={<Button onClick={() => setShowForm(true)}>បន្ថែមចំណាយ</Button>}
          />
        ) : (
          expenses.map((expense) => (
            <ExpenseItem key={expense.id} expense={expense} onEdit={handleEdit} />
          ))
        )}
      </div>
    </div>
  )
}