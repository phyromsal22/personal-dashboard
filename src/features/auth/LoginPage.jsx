import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ 
          email: email.trim(), 
          password: password.trim() 
        })
        if (error) throw error
        toast.success('ចូលប្រើប្រាស់ជោគជ័យ!')
        window.location.href = '/' 
      } else {
        const { error } = await supabase.auth.signUp({ 
          email: email.trim(), 
          password: password.trim() 
        })
        if (error) throw error
        toast.success('បង្កើតគណនីជោគជ័យ! សូមចូលប្រើ។')
        setIsLogin(true)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) return toast.error('សូមវាយ Email របស់អ្នកជាមុនសិន')
    
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/update-password`,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('បានផ្ញើ Link កំណត់លេខសម្ងាត់ទៅកាន់ Email របស់អ្នកហើយ!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="card w-full max-w-md p-8 animate-fade-up">
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            D
          </div>
          <h1 className="text-2xl font-bold text-text">
            {isLogin ? 'សូមស្វាគមន៍ការត្រឡប់មកវិញ' : 'បង្កើតគណនីថ្មី'}
          </h1>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-sm text-text-secondary mb-1 block">អ៊ីមែល</label>
            <Input type="email" placeholder="sokha@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-text-secondary mb-1 block">លេខសម្ងាត់</label>
            <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          
          {isLogin && (
            <div className="flex justify-end">
              <button type="button" onClick={handleForgotPassword} className="text-xs text-primary hover:underline">
                ភ្លេចលេខសម្ងាត់?
              </button>
            </div>
          )}

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? 'សូមរង់ចាំ...' : (isLogin ? 'ចូលប្រើ' : 'ចុះឈ្មោះ')}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-text-secondary">
          {isLogin ? 'មិនទាន់មានគណនីមែនទេ? ' : 'មានគណនីរួចហើយមែនទេ? '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
            {isLogin ? 'ចុះឈ្មោះឥឡូវនេះ' : 'ចូលប្រើវិញ'}
          </button>
        </div>
      </div>
    </div>
  )
}