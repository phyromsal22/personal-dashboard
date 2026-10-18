// គណនា Streak (ចំនួនថ្ងៃជាប់គ្នាដែលបានធ្វើ)
export function calcStreak(completedDates) {
  if (!completedDates || completedDates.length === 0) return 0
  
  let streak = 0
  let currentDate = new Date()
  
  // បើថ្ងៃនេះមិនទាន់ធ្វើ សាកមើលថ្ងៃម្សិលមិញ
  const today = currentDate.toISOString().slice(0, 10)
  if (!completedDates.includes(today)) {
    currentDate.setDate(currentDate.getDate() - 1)
  }

  while (true) {
    const dateStr = currentDate.toISOString().slice(0, 10)
    if (completedDates.includes(dateStr)) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}