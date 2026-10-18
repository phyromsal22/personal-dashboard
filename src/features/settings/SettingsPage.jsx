import { useState, useEffect } from 'react'
import { User, Mail, KeyRound, Target, Palette } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { useSettingsStore } from '@/store/settingsStore'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const [email, setEmail] = useState('កំពុងផ្ទុក...')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  // ទាញយក Settings ពី Store
  const { monthlyBudget, setBudget, accentColor, setAccentColor } = useSettingsStore()
  const [budgetInput, setBudgetInput] = useState(monthlyBudget)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setEmail(user.email)
    })
  }, [])

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) return toast.error('លេខសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ ៦ តួអក្សរ')
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) toast.error(error.message)
    else {
      toast.success('បានផ្លាស់ប្តូរលេខសម្ងាត់ដោយជោគជ័យ!')
      setNewPassword('')
    }
    setLoading(false)
  }

  const handleSaveBudget = (e) => {
    e.preventDefault()
    setBudget(Number(budgetInput))
    toast.success('បានកំណត់ថវិកាប្រចាំខែដោយជោគជ័យ!')
  }

  // ពណ៌ដែលអាចជ្រើសរើសបាន
  const colors = [
    { id: 'indigo', name: 'ស្វាយ', bg: 'bg-[#6366F1]' },
    { id: 'emerald', name: 'បៃតង', bg: 'bg-[#10B981]' },
    { id: 'rose', name: 'ផ្កាឈូក', bg: 'bg-[#F43F5E]' },
    { id: 'amber', name: 'មាស', bg: 'bg-[#F59E0B]' },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader title="Settings" subtitle="គ្រប់គ្រងគណនី និងការកំណត់របស់អ្នក" />

      {/* ព័ត៌មានគណនី */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-primary" /> ព័ត៌មានគណនី
        </h3>
        <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-hover border border-border">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
            {email.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-text-secondary">អ៊ីមែលរបស់អ្នក</p>
            <p className="font-medium text-text flex items-center gap-2">
              <Mail className="h-4 w-4 text-text-muted" /> {email}
            </p>
          </div>
        </div>
      </Card>

      {/* ជ្រើសរើសពណ៌ App (Theme) */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" /> ពណ៌របស់ App
        </h3>
        <div className="flex gap-3">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => {
                setAccentColor(color.id)
                toast.success(`បានប្តូរពណ៌ទៅជា ${color.name}`)
              }}
              className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center transition-all",
                color.bg,
                accentColor === color.id ? "ring-4 ring-primary/40 scale-110" : "opacity-70 hover:opacity-100"
              )}
              title={color.name}
            />
          ))}
        </div>
      </Card>

      {/* កំណត់ថវិកាប្រចាំខែ */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-success" /> កំណត់ថវិកាប្រចាំខែ
        </h3>
        <form onSubmit={handleSaveBudget} className="flex gap-3 max-w-sm">
          <Input 
            type="number" 
            placeholder="ឧ. 200" 
            value={budgetInput} 
            onChange={(e) => setBudgetInput(e.target.value)} 
            min="0"
          />
          <Button type="submit" variant="secondary">រក្សាទុក</Button>
        </form>
      </Card>

      {/* ប្តូរលេខសម្ងាត់ */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-warning" /> ប្តូរលេខសម្ងាត់
        </h3>
        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-sm">
          <Input 
            type="password" 
            placeholder="លេខសម្ងាត់ថ្មី..." 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកលេខសម្ងាត់'}
          </Button>
        </form>
      </Card>
    </div>
  )
}