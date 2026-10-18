import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (password.length < 6) return toast.error('លេខសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ ៦ តួអក្សរ')

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('បានផ្លាស់ប្តូរលេខសម្ងាត់ដោយជោគជ័យ! សូមចូលប្រើវិញ។')
      navigate('/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="card w-full max-w-md p-8 animate-fade-up">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text">កំណត់លេខសម្ងាត់ថ្មី</h1>
          <p className="text-text-secondary text-sm mt-2">សូមវាយលេខសម្ងាត់ថ្មីរបស់អ្នក</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="text-sm text-text-secondary mb-1 block">លេខសម្ងាត់ថ្មី</label>
            <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
          </Button>
        </form>
      </div>
    </div>
  )
}