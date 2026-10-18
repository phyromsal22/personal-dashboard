import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Target, Plus, Trash2, Wallet, Camera, Loader2, ClipboardPaste, Share2, History, X } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useSavingsStore } from '@/store/savingsStore'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { toast } from 'sonner'

export default function SavingsPage() {
  const { goals, contributions, loading, fetchGoals, fetchContributions, addGoal, contributeToGoal, deleteGoal, joinGoal } = useSavingsStore()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [activeGoal, setActiveGoal] = useState(null) 
  const [historyGoal, setHistoryGoal] = useState(null) 
  
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [receiptFile, setReceiptFile] = useState(null)
  const [loadingScan, setLoadingScan] = useState(false)

  // ពិនិត្យមើល Link អញ្ជើញ
  useEffect(() => {
    const joinId = searchParams.get('join')
    if (!joinId) return;

    const processJoin = async () => {
      if (joinId.length > 50 || joinId.includes('@') || joinId.includes(' ')) {
        toast.error('Link អញ្ជើញនេះមិនត្រឹមត្រូវទេ!')
        setSearchParams({})
        return
      }
      const success = await joinGoal(joinId)
      if (success) toast.success('អ្នកបានចូលរួមក្នុងគោលដៅសន្សំនេះហើយ!')
      else toast.error('អ្នកប្រហែលជាចូលរួមរួចហើយ ឬ Link មិនត្រឹមត្រូវ។')
      setSearchParams({})
    }
    processJoin()
  }, [searchParams, joinGoal, setSearchParams])

  useEffect(() => { fetchGoals() }, [fetchGoals])

  // ពេលចុចមើលប្រវត្តិ ឱ្យវាទាញទិន្នន័យ
  useEffect(() => {
    if (historyGoal) {
      fetchContributions(historyGoal.id)
    }
  }, [historyGoal, fetchContributions])

  const handleAddGoal = async (e) => {
    e.preventDefault()
    if (!name || !target) return
    await addGoal({ name, target_amount: Number(target) })
    setName('')
    setTarget('')
    toast.success('បានបង្កើតគោលដៅថ្មី!')
  }

  const handleShare = async (goalId, goalName) => {
    const url = `${window.location.origin}/savings?join=${goalId}`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'ចូលរួមសន្សំលុយជាមួយខ្ញុំ!', text: `សូមចូលរួមដាក់លុយក្នុងគោលដៅ "${goalName}" របស់ខ្ញុំ!`, url: url })
      } catch (err) { console.log('Error sharing:', err) }
    } else {
      navigator.clipboard.writeText(url)
      toast.success('បានចម្លង Link អញ្ជើញ! សូមផ្ញើទៅមិត្តភក្តិរបស់អ្នក។')
    }
  }

  const processImage = async (file) => {
    if (!file || !file.type.startsWith('image/')) return toast.error('សូមជ្រើសរើសរូបភាព')
    setReceiptFile(file)
    setLoadingScan(true)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      try {
        const base64Image = reader.result.split(',')[1]
        const response = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}` },
          body: JSON.stringify({
            model: 'deepseek-flash',
            messages: [{ role: 'user', content: [{ type: 'text', text: "Extract the total amount (number only) and a short note from this receipt. Return ONLY a valid JSON object with keys: 'amount', 'note'. Do not include markdown formatting." }, { type: 'image_url', image_url: { url: `data:${file.type};base64,${base64Image}` } }] }],
            temperature: 0.1
          })
        })
        const data = await response.json()
        let text = data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim()
        const result = JSON.parse(text)
        setAmount(result.amount?.toString() || '')
        setNote(result.note || '')
        toast.success('AI អានវិក័យប័ត្រជោគជ័យ!')
      } catch (error) {
        toast.error('មិនអាចអានវិក័យប័ត្របានទេ')
      } finally {
        setLoadingScan(false)
      }
    }
  }

  const handleContribute = async (e) => {
    e.preventDefault()
    if (!amount) return toast.error('សូមបញ្ចូលចំនួនទឹកប្រាក់')
    await contributeToGoal(activeGoal.id, amount, note, receiptFile)
    toast.success('បានដាក់លុយចូលគោលដៅដោយជោគជ័យ!')
    setActiveGoal(null)
    setAmount('')
    setNote('')
    setReceiptFile(null)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader title="Savings Goals" subtitle="សន្សំលុយរួមគ្នាជាមួយមិត្តភក្តិ" />

      {/* បង្កើតគោលដៅថ្មី */}
      <Card>
        <form onSubmit={handleAddGoal} className="flex flex-col sm:flex-row gap-3">
          <Input placeholder="ឈ្មោះគោលដៅ (ឧ. ទិញ Laptop)" value={name} onChange={e => setName(e.target.value)} className="flex-1" />
          <Input type="number" placeholder="ចំនួនទឹកប្រាក់ ($)" value={target} onChange={e => setTarget(e.target.value)} className="w-full sm:w-32" />
          <Button type="submit"><Plus className="h-4 w-4" /> បង្កើត</Button>
        </form>
      </Card>

      {/* បញ្ជីគោលដៅ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map(goal => {
          const percent = Math.min((goal.current_amount / goal.target_amount) * 100, 100)
          return (
            <Card key={goal.id} className="relative flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-text">{goal.name}</h3>
                </div>
                {/* ប៊ូតុង Share និង Delete */}
                <div className="flex items-center gap-1">
                  <button onClick={() => handleShare(goal.id, goal.name)} className="text-text-muted hover:text-primary p-2 bg-surface-hover rounded-md" title="ចែករំលែក">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteGoal(goal.id)} className="text-text-muted hover:text-danger p-2 bg-surface-hover rounded-md" title="លុប">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">សន្សំបាន: {formatCurrency(goal.current_amount)}</span>
                  <span className="text-text font-bold">{formatCurrency(goal.target_amount)}</span>
                </div>
                <div className="h-2 w-full bg-surface-hover rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${percent}%` }} />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-text-muted">{percent.toFixed(0)}% សម្រេច</span>
                </div>
              </div>

              {/* ប៊ូតុងខាងក្រោម (បង្ហាញច្បាស់លើទូរស័ព្ទ) */}
              <div className="flex gap-2 w-full">
                <Button className="flex-1" variant="secondary" onClick={() => setActiveGoal(goal)}>
                  <Wallet className="h-4 w-4 mr-2" /> ដាក់លុយ
                </Button>
                <Button className="flex-1" variant="outline" onClick={() => setHistoryGoal(goal)}>
                  <History className="h-4 w-4 mr-2" /> ប្រវត្តិ
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Modal មើលប្រវត្តិ (History Modal) */}
      {historyGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-up">
          <div className="card w-full max-w-md bg-surface border-border flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
              <h3 className="text-lg font-semibold text-text">ប្រវត្តិ: {historyGoal.name}</h3>
              <button onClick={() => setHistoryGoal(null)} className="text-text-muted hover:text-text p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto pr-2 space-y-3">
              {contributions.length === 0 ? (
                <p className="text-center text-text-muted text-sm py-4">មិនទាន់មានការដាក់លុយនៅឡើយទេ។</p>
              ) : (
                contributions.map((c) => (
                  <div key={c.id} className="bg-surface-hover p-3 rounded-lg border border-border/50">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-success">+{formatCurrency(c.amount)}</span>
                      <span className="text-xs text-text-muted">{formatDate(c.created_at, 'short')}</span>
                    </div>
                    <p className="text-sm font-medium text-text mb-1">{c.contributor_email || 'អ្នកប្រើប្រាស់'}</p>
                    {c.note && <p className="text-sm text-text-secondary italic">"{c.note}"</p>}
                    
                    {c.receipt_url && (
                      <a href={c.receipt_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-2 inline-block">
                        មើលវិក័យប័ត្រ
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal ដាក់លុយ (Contribute Modal) */}
      {activeGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-up">
          <div className="card w-full max-w-md bg-surface border-border">
            <h3 className="text-lg font-semibold text-text mb-4">ដាក់លុយចូល: {activeGoal.name}</h3>
            <form onSubmit={handleContribute} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-surface-hover">
                  {loadingScan ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <Camera className="h-6 w-6 text-text-muted mb-1" />}
                  <span className="text-xs text-text text-center px-2">{loadingScan ? 'AI កំពុងអាន...' : 'ថតរូបវិក័យប័ត្រ'}</span>
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => processImage(e.target.files[0])} />
                </label>
                <button type="button" onClick={() => document.dispatchEvent(new ClipboardEvent('paste'))} className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border rounded-lg hover:bg-surface-hover">
                  <ClipboardPaste className="h-6 w-6 text-text-muted mb-1" />
                  <span className="text-xs text-text text-center px-2">Paste រូបភាព</span>
                </button>
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-1 block">ចំនួនទឹកប្រាក់ ($)</label>
                <Input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required />
              </div>
              <div>
                <label className="text-sm text-text-secondary mb-1 block">សារលើកទឹកចិត្ត (Note)</label>
                <Input value={note} onChange={e => setNote(e.target.value)} placeholder="សរសេរអ្វីមួយ..." />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={() => { setActiveGoal(null); setReceiptFile(null); }}>បោះបង់</Button>
                <Button type="submit">ដាក់លុយ</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}