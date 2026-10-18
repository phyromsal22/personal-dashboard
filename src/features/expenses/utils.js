import { getLastNDays } from '@/lib/formatters'

export function getExpensesForLast7Days(expenses) {
  const last7Days = getLastNDays(7)
  
  return last7Days.map(date => {
    // បូកសរុបចំណាយតាមថ្ងៃនីមួយៗ
    const dailyTotal = expenses
      .filter(e => e.date.startsWith(date))
      .reduce((sum, e) => sum + e.amount, 0)
      
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      amount: dailyTotal
    }
  })
}

export function getExpensesByCategory(expenses) {
  const categories = {}
  expenses.forEach(e => {
    categories[e.category] = (categories[e.category] || 0) + e.amount
  })
  return Object.keys(categories).map(key => ({ name: key, value: categories[key] }))
}
// បន្ថែម Function នេះនៅខាងចុង File
export function exportToCSV(expenses) {
  if (!expenses || expenses.length === 0) return

  // កំណត់ក្បាលតារាង (Headers)
  const headers = ['Date', 'Category', 'Amount (USD)', 'Note']
  
  // បំប្លែងទិន្នន័យទៅជាជួរនីមួយៗ
  const rows = expenses.map((e) => [
    new Date(e.date).toLocaleDateString(),
    e.category,
    e.amount,
    `"${(e.note || '').replace(/"/g, '""')}"` // ការពារការច្រឡំសញ្ញាក្បៀស
  ])

  // ភ្ជាប់ចូលគ្នាទៅជាអត្ថបទ CSV
  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

  // បង្កើត File និងទាញយក
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }) // \uFEFF សម្រាប់ឱ្យ Excel អានភាសាខ្មែរបាន
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `expenses_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}