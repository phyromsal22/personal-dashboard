import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EXPENSE_CATEGORIES } from '@/lib/constants'

export function AISummary({ expenses }) {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)

  const generateSummary = async () => {
    if (expenses.length === 0) {
      return setSummary('មិនទាន់មានទិន្នន័យចំណាយសម្រាប់ឱ្យ AI វិភាគឡើយ។ សូមបន្ថែមចំណាយជាមុនសិន។')
    }

    setLoading(true)
    setSummary('')

    try {
      const total = expenses.reduce((s, e) => s + e.amount, 0)
      const expenseList = expenses.map(e => {
        const cat = EXPENSE_CATEGORIES.find(c => c.id === e.category)?.label || e.category
        return `${cat}: $${e.amount}`
      }).join(', ')

      const prompt = `Here is the user's expense data for this month: ${expenseList}. Total spent: $${total}.`

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { 
              role: 'system', 
              content: 'You are a friendly personal financial advisor. Provide a short, encouraging, and practical financial advice in Khmer (maximum 3 sentences). Point out where they spent the most and give one specific tip to save money. Do not use English words.' 
            },
            { 
              role: 'user', 
              content: prompt 
            }
          ],
          temperature: 0.7
        })
      })

      const data = await response.json()
      const aiText = data.choices[0].message.content
      setSummary(aiText)

    } catch (error) {
      console.error(error)
      setSummary('សូមទោស AI មិនអាចវិភាគបានទេពេលនេះ។ សូមព្យាយាមម្តងទៀត។')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-text">AI វិភាគការចំណាយ (DeepSeek)</h3>
        </div>
        <Button onClick={generateSummary} disabled={loading} variant="secondary" size="sm">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'វិភាគឥឡូវនេះ'}
        </Button>
      </div>
      
      {summary ? (
        <p className="text-sm text-text leading-relaxed bg-surface/50 p-4 rounded-lg border border-border">
          {summary}
        </p>
      ) : (
        <p className="text-sm text-text-muted">
          ចុចប៊ូតុងខាងលើ ដើម្បីឱ្យ DeepSeek ជួយវិភាគទម្លាប់នៃការចំណាយរបស់អ្នក។
        </p>
      )}
    </Card>
  )
}