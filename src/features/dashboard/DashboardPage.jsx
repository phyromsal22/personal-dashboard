import { Wallet, Flame, CheckCircle2, Smile } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { BarChartCard } from '@/components/charts/BarChartCard'
import { PieChartCard } from '@/components/charts/PieChartCard'
import { useHabitsStore } from '@/store/habitsStore'
import { useExpensesStore } from '@/store/expensesStore'
import { useMoodStore } from '@/store/moodStore'
import { getExpensesForLast7Days, getExpensesByCategory } from '@/features/expenses/utils'
import { formatCurrency, todayKey } from '@/lib/formatters'

export default function DashboardPage() {
  const habits = useHabitsStore(state => state.habits)
  const expenses = useExpensesStore(state => state.expenses)
  const moods = useMoodStore(state => state.moods)
  
  const today = todayKey()
  
  // គណនាទិន្នន័យសម្រាប់បង្ហាញ
  const todayExpenses = expenses.filter(e => e.date.startsWith(today)).reduce((s, e) => s + e.amount, 0)
  const habitsDoneToday = habits.filter(h => h.completedDates.includes(today)).length
  const currentMood = moods[today] ? ['😢', '😟', '😐', '🙂', '😄'][moods[today] - 1] : '➖'
  
  const chartData = getExpensesForLast7Days(expenses)
  const pieData = getExpensesByCategory(expenses)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader title="Dashboard" subtitle="Welcome back! នេះជាស្ថិតិរបស់អ្នកថ្ងៃនេះ។" />

      {/* 4 ប្រអប់ស្ថិតិធំៗ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="ចំណាយថ្ងៃនេះ" value={formatCurrency(todayExpenses)} icon={Wallet} color="text-danger" />
        <StatCard title="ទម្លាប់បានធ្វើ" value={`${habitsDoneToday}/${habits.length}`} icon={CheckCircle2} color="text-success" />
        <StatCard title="អារម្មណ៍ថ្ងៃនេះ" value={currentMood} icon={Smile} color="text-warning" />
        <StatCard title="ចំណាយសរុប" value={formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))} icon={Flame} color="text-primary" />
      </div>

      {/* ក្រាហ្វ Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartCard data={chartData} title="ចំណាយ ៧ ថ្ងៃចុងក្រោយ" />
        <PieChartCard data={pieData} title="ចំណាយតាមប្រភេទ" />
      </div>
    </div>
  )
}