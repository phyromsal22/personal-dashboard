import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useExpensesStore } from '@/store/expensesStore'
import { EXPENSE_CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Camera, Loader2, ClipboardPaste, Image as ImageIcon } from 'lucide-react'

export function ExpenseForm({ onClose, initialData }) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [currency, setCurrency] = useState('USD')
  const [note, setNote] = useState('')
  const [loadingScan, setLoadingScan] = useState(false)
  
  const addExpense = useExpensesStore((state) => state.addExpense)
  const updateExpense = useExpensesStore((state) => state.updateExpense)

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount)
      setCategory(initialData.category)
      setCurrency(initialData.currency || 'USD')
      setNote(initialData.note || '')
    }
  }, [initialData])

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
        const mimeType = file.type || 'image/jpeg'

        const response = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
          },
          body: JSON.stringify({
            model: 'deepseek-flash',
            messages: [
              {
                role: 'user',
                content: [
                  { 
                    type: 'text', 
                    text: "Analyze this receipt image. Extract the total amount (number only), guess the category (choose from: food, transport, shopping, other), detect if the currency is USD or KHR, and write a short note. Return ONLY a valid JSON object with keys: 'amount', 'category', 'currency', 'note'. Do not include markdown formatting." 
                  },
                  { 
                    type: 'image_url', 
                    image_url: { url: `data:${mimeType};base64,${base64Image}` } 
                  }
                ]
              }
            ],
            temperature: 0.1
          })
        })

        if (!response.ok) throw new Error('API request failed')

        const data = await response.json()
        let text = data.choices[0].message.content
        text = text.replace(/```json/g, '').replace(/```/g, '').trim()
        
        const result = JSON.parse(text)
        
        setAmount(result.amount?.toString() || '0')
        setCategory(result.category || 'other')
        setCurrency(result.currency === 'KHR' ? 'KHR' : 'USD')
        setNote(result.note || '')
        toast.success('ស្កេនវិក័យប័ត្រជោគជ័យ!')
      } catch (error) {
        console.error('Scan Error:', error)
        toast.error('មិនអាចអានរូបភាពបានទេ សូមព្យាយាមម្តងទៀត')
      } finally {
        setLoadingScan(false)
      }
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) processImage(file)
  }

  // មុខងារសម្រាប់ការ Paste តាមរយៈប៊ូតុង (ដំណើរការលើទូរស័ព្ទខ្លះ និងកុំព្យូទ័រ)
  const handlePasteButtonClick = async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.read) {
        return toast.error('ទូរស័ព្ទរបស់អ្នកមិនគាំទ្រការ Paste រូបភាពទេ។ សូមចុច "ជ្រើសរើសរូបភាព" ជំនួសវិញ។')
      }
      
      const items = await navigator.clipboard.read()
      for (const item of items) {
        const imageType = item.types.find(type => type.startsWith('image/'))
        if (imageType) {
          const blob = await item.getType(imageType)
          const file = new File([blob], "pasted-image.png", { type: imageType })
          processImage(file)
          return
        }
      }
      toast.error('រកមិនឃើញរូបភាពនៅក្នុង Clipboard ទេ។ សូម Copy រូបភាពជាមុនសិន។')
    } catch (error) {
      console.error('Paste error:', error)
      toast.error('សូមអនុញ្ញាតឱ្យចូលប្រើ Clipboard ឬជ្រើសរើសរូបភាពពី Gallery។')
    }
  }

  // មុខងារសម្រាប់ការ Paste ដោយប្រើ Keyboard (Ctrl+V) លើកុំព្យូទ័រ
  const handleKeyboardPaste = (e) => {
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

  useEffect(() => {
    document.addEventListener('paste', handleKeyboardPaste)
    return () => document.removeEventListener('paste', handleKeyboardPaste)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || isNaN(amount)) return
    const data = { amount: parseFloat(amount), category, currency, note }

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
      
      {!initialData && (
        <div className="mb-6">
          {loadingScan ? (
             <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-primary/50 bg-primary/5 rounded-lg">
               <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
               <span className="text-sm font-medium text-primary">AI កំពុងអានរូបភាព...</span>
             </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {/* ប៊ូតុងទី១៖ បើក Camera ឬ Gallery */}
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-surface-hover transition-colors">
                <ImageIcon className="h-8 w-8 text-text-muted mb-2" />
                <span className="text-sm font-medium text-text text-center px-2">ជ្រើសរើសរូបភាព</span>
                <span className="text-xs text-text-muted mt-1">(Gallery/Camera)</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>

              {/* ប៊ូតុងទី២៖ Paste ពី Clipboard */}
              <button 
                type="button"
                onClick={handlePasteButtonClick}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg hover:bg-surface-hover transition-colors"
              >
                <ClipboardPaste className="h-8 w-8 text-text-muted mb-2" />
                <span className="text-sm font-medium text-text text-center px-2">Paste រូបភាព</span>
                <span className="text-xs text-text-muted mt-1">(ពី Clipboard)</span>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm text-text-secondary mb-1 block">ចំនួនទឹកប្រាក់</label>
          <div className="flex gap-2">
            <Input 
              type="number" 
              name="amount"
              step="0.01" 
              placeholder="0.00" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              disabled={loadingScan}
              className="flex-1"
            />
            <div className="flex bg-surface border border-border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={cn("px-4 py-2 text-sm font-medium transition-colors", currency === 'USD' ? "bg-primary text-white" : "text-text-secondary hover:bg-surface-hover")}
              >
                $
              </button>
              <button
                type="button"
                onClick={() => setCurrency('KHR')}
                className={cn("px-4 py-2 text-sm font-medium transition-colors", currency === 'KHR' ? "bg-primary text-white" : "text-text-secondary hover:bg-surface-hover")}
              >
                ៛
              </button>
            </div>
          </div>
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