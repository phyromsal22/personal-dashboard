import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useExpensesStore } from '@/store/expensesStore'
import { EXPENSE_CATEGORIES } from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'

export function ExpenseItem({ expense }) {
  const deleteExpense = useExpensesStore((state) => state.deleteExpense)
  const [showConfirm, setShowConfirm] = useState(false)
  
  const category = EXPENSE_CATEGORIES.find((c) => c.id === expense.category) || EXPENSE_CATEGORIES[3]

  const handleDelete = () => {
    deleteExpense(expense.id)
    toast.success('បានលុបការចំណាយរួចរាល់')
  }

  return (
    <>
      <div className="card p-4 flex items-center justify-between group hover:border-primary/30 transition-all">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-surface-hover flex items-center justify-center text-xl">
            {category.icon}
          </div>
          <div>
            <h4 className="font-medium text-text">{expense.note || category.label}</h4>
            <p className="text-xs text-text-muted mt-0.5">{formatDate(expense.date, 'time')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="font-semibold text-danger">-{formatCurrency(expense.amount)}</span>
          <button onClick={() => setShowConfirm(true)} className="text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all p-2">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="លុបការចំណាយ?"
        description="តើអ្នកប្រាកដជាចង់លុបទិន្នន័យចំណាយនេះមែនទេ?"
      />
    </>
  )
}