import { useState } from 'react'
import { Sparkles, Send, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EXPENSE_CATEGORIES } from '@/lib/constants'

export function AISummary({ expenses }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const total = expenses.reduce((s, e) => s + e.amount, 0)
      const expenseList = expenses.map(e => {
        const cat = EXPENSE_CATEGORIES.find(c => c.id === e.category)?.label || e.category
        return `${cat}: $${e.amount}`
      }).join(', ')

      const context = `Here is the user's expense data: ${expenseList || 'No expenses yet'}. Total spent: $${total}.`

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: `You are a helpful financial advisor for a personal dashboard app. Answer in Khmer. Context: ${context}` },
            ...messages,
            { role: 'user', content: userMsg }
          ],
          temperature: 0.7
        })
      })

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.choices[0].message.content }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'សូមទោស ខ្ញុំមានបញ្ហាក្នុងការឆ្លើយតប។' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20 flex flex-col h-[400px]">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-text">AI Financial Assistant</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 && (
          <p className="text-center text-sm text-text-muted mt-10">សួរខ្ញុំអំពីការចំណាយរបស់អ្នកបានហើយ! (ឧ. ខែនេះខ្ញុំចំណាយច្រើនលើអ្វី?)</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-surface border border-border text-text'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-text-muted text-sm animate-pulse">AI កំពុងវាយ...</div>}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <Input placeholder="សួរអំពីការចំណាយ..." value={input} onChange={e => setInput(e.target.value)} disabled={loading} />
        <Button type="submit" size="icon" disabled={loading}><Send className="h-4 w-4" /></Button>
      </form>
    </Card>
  )
}