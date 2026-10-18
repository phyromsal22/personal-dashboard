import { Wallet, Flame, CheckCircle2, Smile, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { AISummary } from '@/components/shared/AISummary'
import { WaterTracker } from '@/components/shared/WaterTracker' // បន្ថែម Water Tracker
import { BarChartCard } from '@/components/charts/BarChartCard'
import { PieChartCard } from '@/components/charts/PieChartCard'
import { useHabitsStore } from '@/store/habitsStore'
import { useExpensesStore } from '@/store/expensesStore'
import { useMoodStore } from '@/store/moodStore'
import { useSettingsStore } from '@/store/settingsStore'
import { getExpensesForLast7Days, getExpensesByCategory } from '@/features/expenses/utils'
import { formatCurrency, todayKey } from '@/lib/formatters'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const habits = useHabitsStore(state => state.habits)
  const expenses = useExpensesStore(state => state.expenses)
  const moods = useMoodStore(state => state.moods)
  const { monthlyBudget } = useSettingsStore()
  
  const today = todayKey()
  const currentMonth = today.slice(0, 7) // YYYY-MM
  
  const todayExpenses = expenses.filter(e => e.date.startsWith(today)).reduce((s, e) => s + e.amount, 0)
  const habitsDoneToday = habits.filter(h => h.completed_dates?.includes(today)).length
  const currentMood = moods[today] ? ['😢', '😟', '😐', '🙂', '😄'][moods[today] - 1] : '➖'
  
  // គណនាថវិកា
  const thisMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonth)).reduce((s, e) => s + e.amount, 0)
  const budgetPercentage = monthlyBudget > 0 ? Math.min((thisMonthExpenses / monthlyBudget) * 100, 100) : 0
  
  // កំណត់លក្ខខណ្ឌពណ៌ថវិកា
  const isOverBudget = monthlyBudget > 0 && thisMonthExpenses > monthlyBudget
  const isNearBudget = monthlyBudget > 0 && thisMonthExpenses >= (monthlyBudget * 0.8) && !isOverBudget
  
  let budgetColorClass = 'bg-success' 
  let textColorClass = 'text-success'
  let warningMessage = null

  if (isOverBudget) {
    budgetColorClass = 'bg-danger'
    textColorClass = 'text-danger'
    warningMessage = 'អ្នកបានចំណាយលើសថវិកាកំណត់ហើយ!'
  } else if (isNearBudget) {
    budgetColorClass = 'bg-warning'
    textColorClass = 'text-warning'
    warningMessage = 'ប្រយ័ត្ន! អ្នកជិតចំណាយដល់ដែនកំណត់ហើយ។'
  }

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

      {/* Budget Progress Bar */}
      {monthlyBudget > 0 && (
        <div className="card p-6 border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-text flex items-center gap-2">
              ថវិកាខែនេះ ({currentMonth})
            </h3>
            <span className={cn("font-bold", textColorClass)}>
              {formatCurrency(thisMonthExpenses)} / {formatCurrency(monthlyBudget)}
            </span>
          </div>
          <div className="h-3 w-full bg-surface-hover rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all duration-500", budgetColorClass)}
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
          
          {warningMessage && (
            <p className={cn("text-sm mt-2 flex items-center gap-1", textColorClass)}>
              <AlertTriangle className="h-4 w-4" /> {warningMessage}
            </p>
          )}
        </div>
      )}

      {/* បន្ថែម Water Tracker និង AI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <WaterTracker />
        </div>
        <div className="md:col-span-2">
          <AISummary expenses={expenses} />
        </div>
      </div>

      {/* ក្រាហ្វ Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartCard data={chartData} title="ចំណាយ ៧ ថ្ងៃចុងក្រោយ" />
        <PieChartCard data={pieData} title="ចំណាយតាមប្រភេទ" />
      </div>
    </div>
  )
}