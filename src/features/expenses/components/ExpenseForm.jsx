import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useExpensesStore } from '@/store/expensesStore'
import { EXPENSE_CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Camera, Loader2 } from 'lucide-react'

export function ExpenseForm({ onClose, initialData }) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')
  const [loadingScan, setLoadingScan] = useState(false)
  
  const addExpense = useExpensesStore((state) => state.addExpense)
  const updateExpense = useExpensesStore((state) => state.updateExpense)

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount)
      setCategory(initialData.category)
      setNote(initialData.note || '')
    }
  }, [initialData])

  // មុខងារស្កេនវិក័យប័ត្រដោយ AI (Gemini)
  const handleScanReceipt = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoadingScan(true)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    
    reader.onload = async () => {
      try {
        const base64Image = reader.result.split(',')[1]
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: "Analyze this receipt image. Extract the total amount (number only), guess the category (choose from: food, transport, shopping, other), and write a short note (e.g. coffee, taxi). Return ONLY a valid JSON object with keys: 'amount', 'category', 'note'. Do not include markdown formatting." },
                { inline_data: { mime_type: file.type, data: base64Image } }
              ]
            }]
          })
        })

        const data = await response.json()
        let text = data.candidates[0].content.parts[0].text
        text = text.replace(/```json/g, '').replace(/```/g, '').trim()
        
        const result = JSON.parse(text)
        
        setAmount(result.amount.toString())
        setCategory(result.category)
        setNote(result.note)
        toast.success('ស្កេនវិក័យប័ត្រជោគជ័យ!')
      } catch (error) {
        console.error(error)
        toast.error('មិនអាចអានរូបភាពបានទេ សូមព្យាយាមម្តងទៀត')
      } finally {
        setLoadingScan(false)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || isNaN(amount)) return
    const data = { amount: parseFloat(amount), category, note }

    if (initialData) {
      updateExpense(initialData.id, data)
      toast.success('បានកែប្រែការចំណាយដោយជោគជ័យ')
    } else {
      addExpense(data)
      toast.success('បានបន្ថែមការចំណាយថ្មី')
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-6 animate-fade-up border-primary/30">
      <h3 className="font-semibold mb-4">{initialData ? 'កែប្រែការចំណាយ' : 'បន្ថែមចំណាយថ្មី'}</h3>
      
      {/* ប៊ូតុងស្កេនវិក័យប័ត្រ */}
      {!initialData && (
        <div className="mb-4">
          <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-surface-hover transition-colors">
            <div className="flex flex-col items-center">
              {loadingScan ? <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" /> : <Camera className="h-6 w-6 text-text-muted mb-2" />}
              <span className="text-sm text-text-secondary">{loadingScan ? 'AI កំពុងអាន...' : 'ចុចដើម្បីស្កេនវិក័យប័ត្រ'}</span>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleScanReceipt} disabled={loadingScan} />
          </label>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm text-text-secondary mb-1 block">ចំនួនទឹកប្រាក់ ($)</label>
          <Input type="number" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>

        <div>
          <label className="text-sm text-text-secondary mb-2 block">ប្រភេទ</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {EXPENSE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "p-2 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all",
                  category === cat.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-surface-hover"
                )}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-text-secondary mb-1 block">ចំណាំ (ស្រេចចិត្ត)</label>
          <Input placeholder="ឧ. ទិញកាហ្វេ..." value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="ghost" onClick={onClose}>បោះបង់</Button>
        <Button type="submit" disabled={loadingScan}>{initialData ? 'រក្សាទុកការកែប្រែ' : 'រក្សាទុក'}</Button>
      </div>
    </form>
  )
}