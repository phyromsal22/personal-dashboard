import { useState, useEffect } from 'react'
import { useMoodStore } from '@/store/moodStore'
import { todayKey } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const MOODS = [
  { score: 1, emoji: '😢', label: 'Bad' },
  { score: 2, emoji: '😟', label: 'Low' },
  { score: 3, emoji: '😐', label: 'Okay' },
  { score: 4, emoji: '🙂', label: 'Good' },
  { score: 5, emoji: '😄', label: 'Great' },
]

export function MoodPicker() {
  const { moods, notes, setMood } = useMoodStore()
  const today = todayKey()
  const currentMood = moods[today]
  
  const [note, setNote] = useState(notes[today] || '')

  useEffect(() => {
    setNote(notes[today] || '')
  }, [notes, today])

  const handleSave = () => {
    if (!currentMood) return toast.error('សូមជ្រើសរើសអារម្មណ៍ជាមុនសិន')
    setMood(today, currentMood, note)
    toast.success('បានរក្សាទុកកំណត់ហេតុ!')
  }

  return (
    <div className="card p-8 flex flex-col items-center animate-fade-up">
      <h3 className="text-lg font-semibold mb-6">តើអ្នកមានអារម្មណ៍យ៉ាងណានៅថ្ងៃនេះ?</h3>
      <div className="flex items-center gap-4 md:gap-6 mb-8">
        {MOODS.map((mood) => (
          <button
            key={mood.score}
            onClick={() => setMood(today, mood.score, note)} // ចុចភ្លាម
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

      {/* ប្រអប់សរសេរ Note */}
      <div className="w-full max-w-lg">
        <textarea
          placeholder="សរសេរបន្ថែមពីអារម្មណ៍ថ្ងៃនេះ... (ស្រេចចិត្ត)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full h-24 p-3 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none mb-3"
        />
        <Button onClick={handleSave} className="w-full">រក្សាទុកកំណត់ហេតុ</Button>
      </div>
    </div>
  )
}