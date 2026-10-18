import { useState } from 'react'
import { Plus, Wallet, Filter, Download, Search } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useExpensesStore } from '@/store/expensesStore'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseItem } from './components/ExpenseItem'
import { formatCurrency } from '@/lib/formatters'
import { EXPENSE_CATEGORIES } from '@/lib/constants'
import { exportToCSV } from './utils'

export default function ExpensesPage() {
  const expenses = useExpensesStore((state) => state.expenses)
  const loading = useExpensesStore((state) => state.loading)
  
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  
  // Filter State
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7))
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date_desc')

  // គណនាទិន្នន័យ (Filter + Search + Sort)
  const filteredExpenses = expenses
    .filter((expense) => {
      const matchMonth = expense.date.startsWith(filterMonth)
      const matchCategory = filterCategory === 'all' || expense.category === filterCategory
      const matchSearch = (expense.note || '').toLowerCase().includes(searchTerm.toLowerCase())
      return matchMonth && matchCategory && matchSearch
    })
    .sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.date) - new Date(a.date)
      if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date)
      if (sortBy === 'amount_desc') return b.amount - a.amount
      if (sortBy === 'amount_asc') return a.amount - b.amount
      return 0
    })

  // បំបែកការគណនាតាមរូបិយប័ណ្ណ
  const totalUSD = filteredExpenses.filter(e => e.currency !== 'KHR').reduce((sum, item) => sum + item.amount, 0)
  const totalKHR = filteredExpenses.filter(e => e.currency === 'KHR').reduce((sum, item) => sum + item.amount, 0)

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
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => exportToCSV(filteredExpenses)}>
              <Download className="h-4 w-4" /> <span className="hidden sm:inline">ទាញយក</span>
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" /> បន្ថែម
            </Button>
          </div>
        }
      />

      {/* ប្រអប់សរុបចំណាយ */}
      <div className="card mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-primary/5 border-primary/20 gap-4">
        <div>
          <p className="text-sm text-text-secondary mb-1">ចំណាយសរុប (តាមការជ្រើសរើស)</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <h2 className="text-3xl font-bold text-text">{formatCurrency(totalUSD, 'USD')}</h2>
            {totalKHR > 0 && <h2 className="text-3xl font-bold text-text">{formatCurrency(totalKHR, 'KHR')}</h2>}
          </div>
        </div>
        <Wallet className="h-10 w-10 text-primary/50 hidden sm:block" />
      </div>

      {/* ប្រអប់ Search និង Filter */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input 
              placeholder="ស្វែងរកតាមចំណាំ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-3 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="date_desc">ថ្មីបំផុតមុន</option>
            <option value="date_asc">ចាស់បំផុតមុន</option>
            <option value="amount_desc">តម្លៃច្រើនមុន</option>
            <option value="amount_asc">តម្លៃតិចមុន</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2">
            <Filter className="h-4 w-4 text-text-muted" />
            <select 
              value={filterMonth} 
              onChange={(e) => setFilterMonth(e.target.value)}
              className="bg-transparent text-text text-sm focus:outline-none w-full"
            >
              <option value={new Date().toISOString().slice(0, 7)}>ខែនេះ</option>
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
            description="មិនមានការចំណាយសម្រាប់ការស្វែងរករបស់អ្នកឡើយ។"
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