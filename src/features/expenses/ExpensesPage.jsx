import { useState } from 'react'
import { Plus, Wallet, Filter } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useExpensesStore } from '@/store/expensesStore'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseItem } from './components/ExpenseItem'
import { formatCurrency } from '@/lib/formatters'
import { EXPENSE_CATEGORIES } from '@/lib/constants'

export default function ExpensesPage() {
  const expenses = useExpensesStore((state) => state.expenses)
  const loading = useExpensesStore((state) => state.loading)
  
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  
  // បន្ថែម State សម្រាប់ Filter
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7)) // យកខែបច្ចុប្បន្ន (YYYY-MM)
  const [filterCategory, setFilterCategory] = useState('all')

  // គណនាទឹកប្រាក់សរុបដោយផ្អែកលើ Filter
  const filteredExpenses = expenses.filter((expense) => {
    const matchMonth = expense.date.startsWith(filterMonth)
    const matchCategory = filterCategory === 'all' || expense.category === filterCategory
    return matchMonth && matchCategory
  })

  const total = filteredExpenses.reduce((sum, item) => sum + item.amount, 0)

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

      {/* ប្រអប់សរុបចំណាយ */}
      <div className="card mb-6 flex items-center justify-between bg-primary/5 border-primary/20">
        <div>
          <p className="text-sm text-text-secondary mb-1">ចំណាយសរុប (តាមការជ្រើសរើស)</p>
          <h2 className="text-3xl font-bold text-text">{formatCurrency(total)}</h2>
        </div>
        <Wallet className="h-10 w-10 text-primary/50" />
      </div>

      {/* ប្រអប់ Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2">
          <Filter className="h-4 w-4 text-text-muted" />
          <select 
            value={filterMonth} 
            onChange={(e) => setFilterMonth(e.target.value)}
            className="bg-transparent text-text text-sm focus:outline-none w-full"
          >
            <option value={new Date().toISOString().slice(0, 7)}>ខែនេះ</option>
            {/* បង្កើតជម្រើស ៦ ខែថយក្រោយ */}
            {[...Array(6)].map((_, i) => {
              const d = new Date()
              d.setMonth(d.getMonth() - (i + 1))
              const val = d.toISOString().slice(0, 7)
              return <option key={val} value={val}>{val}</option>
            })}
          </select>
        </div>

        <div className="flex-1 flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-transparent text-text text-sm focus:outline-none w-full"
          >
            <option value="all">គ្រប់ប្រភេទ</option>
            {EXPENSE_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {showForm && <ExpenseForm onClose={handleCloseForm} initialData={editingExpense} />}

      <div className="space-y-3">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))
        ) : filteredExpenses.length === 0 && !showForm ? (
          <EmptyState 
            icon={Wallet}
            title="គ្មានទិន្នន័យ"
            description="មិនមានការចំណាយសម្រាប់ខែ ឬប្រភេទដែលអ្នកបានជ្រើសរើសឡើយ។"
            action={<Button onClick={() => setShowForm(true)}>បន្ថែមចំណាយ</Button>}
          />
        ) : (
          filteredExpenses.map((expense) => (
            <ExpenseItem key={expense.id} expense={expense} onEdit={handleEdit} />
          ))
        )}
      </div>
    </div>
  )
}