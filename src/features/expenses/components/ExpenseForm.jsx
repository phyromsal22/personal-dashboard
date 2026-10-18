import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useExpensesStore } from '@/store/expensesStore'
import { EXPENSE_CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Camera, Loader2, ClipboardPaste } from 'lucide-react'

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

  // មុខងារកណ្តាលសម្រាប់យករូបភាពទៅឱ្យ AI អាន
  const processImage = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      return toast.error('សូមជ្រើសរើស ឬ Paste តែរូបភាពប៉ុណ្ណោះ')
    }

    setLoadingScan(true)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    
    reader.onload = async () => {
      try {
        const base64Image = reader.result.split(',')[1]
        // កំណត់ mime_type ឱ្យបានច្បាស់លាស់ (បើ file.type ទទេ ឱ្យប្រើ image/jpeg)
        const mimeType = file.type || 'image/jpeg'

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: "Analyze this receipt image. Extract the total amount (number only), guess the category (choose from: food, transport, shopping, other), and write a short note (e.g. coffee, taxi). Return ONLY a valid JSON object with keys: 'amount', 'category', 'note'. Do not include markdown formatting." },
                  { 
                    inline_data: { 
                      mime_type: mimeType, 
                      data: base64Image 
                    } 
                  }
                ]
              }]
            })
          }
        )

        // ពិនិត្យមើលថាតើ Response មានបញ្ហាឬអត់
        if (!response.ok) {
          const errData = await response.json()
          console.error('Gemini API Error:', errData)
          throw new Error(errData.error?.message || 'API request failed')
        }

        const data = await response.json()
        
        // ពិនិត្យមើលថាតើមាន candidates ឬអត់
        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
          throw new Error('AI មិនអាចអានរូបភាពនេះបានទេ')
        }

        let text = data.candidates[0].content.parts[0].text
        // សម្អាត Markdown formatting ដែល AI អាចបន្ថែមមក
        text = text.replace(/```json/g, '').replace(/```/g, '').trim()
        
        const result = JSON.parse(text)
        
        setAmount(result.amount?.toString() || '0')
        setCategory(result.category || 'other')
        setNote(result.note || '')
        toast.success('ស្កេនវិក័យប័ត្រជោគជ័យ!')
      } catch (error) {
        console.error('Scan Error:', error)
        toast.error(error.message || 'មិនអាចអានរូបភាពបានទេ សូមព្យាយាមម្តងទៀត')
      } finally {
        setLoadingScan(false)
      }
    }
  }

  // មុខងារសម្រាប់ការជ្រើសរើសរូបភាពពី File
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) processImage(file)
  }

  // មុខងារសម្រាប់ការ Paste រូបភាព (Ctrl+V)
  const handlePaste = (e) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile()
        processImage(file)
        break
      }
    }
  }

  // ភ្ជាប់ Event Listener សម្រាប់ការ Paste ពេល Form បើក
  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
      
      {/* ប្រអប់ស្កេនវិក័យប័ត្រ (គាំទ្រទាំងការចុច និងការ Paste) */}
      {!initialData && (
        <div className="mb-4">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-surface-hover transition-colors">
            <div className="flex flex-col items-center text-center p-4">
              {loadingScan ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              ) : (
                <div className="flex gap-2 mb-2 text-text-muted">
                  <Camera className="h-8 w-8" />
                  <span className="text-2xl font-light">/</span>
                  <ClipboardPaste className="h-8 w-8" />
                </div>
              )}
              <span className="text-sm font-medium text-text">
                {loadingScan ? 'AI កំពុងអានរូបភាព...' : 'ចុចដើម្បីស្កេន ឬ Paste (Ctrl+V)'}
              </span>
              <span className="text-xs text-text-muted mt-1">អ្នកអាច Copy រូបភាពវិក័យប័ត្រ រួចចុច Ctrl+V នៅទីនេះ</span>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={loadingScan} />
          </label>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm text-text-secondary mb-1 block">ចំនួនទឹកប្រាក់ ($)</label>
          <Input 
            type="number" 
            name="amount"
            step="0.01" 
            placeholder="0.00" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            disabled={loadingScan}
          />
        </div>

        <div>
          <label className="text-sm text-text-secondary mb-2 block">ប្រភេទ</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {EXPENSE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                disabled={loadingScan}
                className={cn(
                  "p-2 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all",
                  category === cat.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-surface-hover",
                  loadingScan && "opacity-50 cursor-not-allowed"
                )}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-text-secondary mb-1 block">ចំណាំ (ស្រេចចិត្ត)</label>
          <Input 
            name="note"
            placeholder="ឧ. ទិញកាហ្វេ..." 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            disabled={loadingScan}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="ghost" onClick={onClose} disabled={loadingScan}>បោះបង់</Button>
        <Button type="submit" disabled={loadingScan}>
          {initialData ? 'រក្សាទុកការកែប្រែ' : 'រក្សាទុក'}
        </Button>
      </div>
    </form>
  )
}