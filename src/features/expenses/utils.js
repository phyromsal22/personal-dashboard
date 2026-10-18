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