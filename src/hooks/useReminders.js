import { useEffect } from 'react'
import { useHabitsStore } from '@/store/habitsStore'
import { toast } from 'sonner'

export function useReminders() {
  const habits = useHabitsStore((state) => state.habits)

  useEffect(() => {
    // សុំការអនុញ្ញាតពី Browser ដើម្បីបង្ហាញ Notification
    if (Notification.permission !== 'granted') {
      Notification.requestPermission()
    }

    const interval = setInterval(() => {
      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      
      habits.forEach(habit => {
        if (habit.reminder_time === currentTime) {
          // បង្ហាញ Notification
          if (Notification.permission === 'granted') {
            new Notification('ដល់ម៉ោងហើយ! ⏰', {
              body: `កុំភ្លេចធ្វើទម្លាប់៖ ${habit.name}`,
              icon: '/vite.svg'
            })
          }
          // បង្ហាញ Toast ក្នុង App ផងដែរ
          toast.info(`ដល់ម៉ោងធ្វើ "${habit.name}" ហើយ!`)
        }
      })
    }, 60000) // ពិនិត្យរាល់ ១ នាទីម្តង

    return () => clearInterval(interval)
  }, [habits])
}