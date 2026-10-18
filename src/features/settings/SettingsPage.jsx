import { useState, useEffect } from 'react'
import { User, Mail, Shield } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const [email, setEmail] = useState('កំពុងផ្ទុក...')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setEmail(user.email)
    })
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Settings" subtitle="គ្រប់គ្រងគណនី និងការកំណត់របស់អ្នក" />

      <div className="space-y-6">
        {/* ផ្នែកព័ត៌មានគណនី */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> ព័ត៌មានគណនី
          </h3>
          <div className="space-y-4">
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
            
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Shield className="h-4 w-4 text-success" /> គណនីរបស់អ្នកត្រូវបានការពារដោយសុវត្ថិភាពពី Supabase។
            </div>
          </div>
        </Card>

        {/* ផ្នែកព័ត៌មានប្រព័ន្ធ */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">អំពី App នេះ</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            នេះគឺជា Personal Dashboard ដែលបង្កើតឡើងដើម្បីជួយអ្នកក្នុងការតាមដានទម្លាប់ ការចំណាយ និងអារម្មណ៍ប្រចាំថ្ងៃ។ 
            ទិន្នន័យទាំងអស់ត្រូវបានរក្សាទុកដោយសុវត្ថិភាពនៅលើ Cloud។
          </p>
        </Card>
      </div>
    </div>
  )
}