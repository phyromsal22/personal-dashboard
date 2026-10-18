import { PageHeader } from '@/components/shared/PageHeader'
import { MoodPicker } from './components/MoodPicker'
import { useMoodStore } from '@/store/moodStore'
import { getLastNDays } from '@/lib/formatters'

export default function MoodPage() {
  const moods = useMoodStore((state) => state.moods)
  const last7Days = getLastNDays(7)
  
  const getEmoji = (score) => {
    const map = { 1: '😢', 2: '😟', 3: '😐', 4: '🙂', 5: '😄' }
    return map[score] || '➖'
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Mood" subtitle="តាមដានអារម្មណ៍របស់អ្នកជារៀងរាល់ថ្ងៃ" />
      
      <MoodPicker />

      <div className="mt-8">
        <h3 className="font-semibold mb-4 text-text">៧ ថ្ងៃចុងក្រោយ</h3>
        <div className="grid grid-cols-7 gap-2">
          {last7Days.map(date => (
            <div key={date} className="card p-3 flex flex-col items-center justify-center hover:bg-surface-hover transition">
              <span className="text-xs text-text-secondary mb-2">
                {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-2xl">{getEmoji(moods[date])}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}