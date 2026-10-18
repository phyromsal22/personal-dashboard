import { useMoodStore } from '@/store/moodStore'
import { todayKey } from '@/lib/formatters'
import { cn } from '@/lib/utils'

const MOODS = [
  { score: 1, emoji: '😢', label: 'Bad' },
  { score: 2, emoji: '😟', label: 'Low' },
  { score: 3, emoji: '😐', label: 'Okay' },
  { score: 4, emoji: '🙂', label: 'Good' },
  { score: 5, emoji: '😄', label: 'Great' },
]

export function MoodPicker() {
  const { moods, setMood } = useMoodStore()
  const today = todayKey()
  const currentMood = moods[today]

  return (
    <div className="card p-8 flex flex-col items-center animate-fade-up">
      <h3 className="text-lg font-semibold mb-6">តើអ្នកមានអារម្មណ៍យ៉ាងណានៅថ្ងៃនេះ?</h3>
      <div className="flex items-center gap-4 md:gap-6">
        {MOODS.map((mood) => (
          <button
            key={mood.score}
            onClick={() => setMood(today, mood.score)}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300",
              currentMood === mood.score ? "bg-primary/20 scale-110 shadow-glow" : "hover:bg-surface-hover grayscale hover:grayscale-0"
            )}
          >
            <span className="text-4xl">{mood.emoji}</span>
            <span className="text-xs font-medium text-text-secondary">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}