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
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success('ចូលប្រើប្រាស់ជោគជ័យ!')
        navigate('/')
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
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
          <p className="text-text-secondary text-sm mt-2">
            {isLogin ? 'ចូលដើម្បីបន្តការងាររបស់អ្នក' : 'ចាប់ផ្តើមគ្រប់គ្រងជីវិតរបស់អ្នក'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-sm text-text-secondary mb-1 block">អ៊ីមែល</label>
            <Input 
              type="email" 
              placeholder="sokha@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="text-sm text-text-secondary mb-1 block">លេខសម្ងាត់</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? 'សូមរង់ចាំ...' : (isLogin ? 'ចូលប្រើ' : 'ចុះឈ្មោះ')}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-text-secondary">
          {isLogin ? 'មិនទាន់មានគណនីមែនទេ? ' : 'មានគណនីរួចហើយមែនទេ? '}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-primary font-medium hover:underline"
          >
            {isLogin ? 'ចុះឈ្មោះឥឡូវនេះ' : 'ចូលប្រើវិញ'}
          </button>
        </div>
      </div>
    </div>
  )
}