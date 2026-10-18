import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    // ១. ទាញយកអ្នកប្រើប្រាស់ទាំងអស់ពី Database
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers()
    if (userError) throw userError

    // កំណត់ថ្ងៃចាប់ផ្តើម (៧ ថ្ងៃមុន)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const startDate = oneWeekAgo.toISOString()

    // ២. វិលជុំផ្ញើ Email ទៅកាន់អ្នកប្រើម្នាក់ៗ
    for (const user of users) {
      if (!user.email) continue

      // ទាញយកការចំណាយរបស់គាត់ក្នុងរយៈពេល ១ សប្តាហ៍
      const { data: expenses } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate)

      const totalSpent = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0

      // បង្កើតអត្ថបទ HTML សម្រាប់ Email
      const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0F1115; color: #F8FAFC; padding: 20px; border-radius: 10px;">
          <h2 style="color: #6366F1;">📊 របាយការណ៍ប្រចាំសប្តាហ៍របស់អ្នក</h2>
          <p>សួស្តី! នេះជាស្ថិតិរបស់អ្នកសម្រាប់សប្តាហ៍នេះ៖</p>
          
          <div style="background: #1A1D24; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">💰 ការចំណាយសរុប</h3>
            <p style="font-size: 24px; font-weight: bold; color: #EF4444;">$${totalSpent.toFixed(2)}</p>
          </div>

          <p>សូមបន្តតាមដានការចំណាយ និងទម្លាប់របស់អ្នកនៅក្នុង App របស់យើងណា!</p>
          <a href="https://personal-dashboard-sigma-lake.vercel.app/dashboard" style="display: inline-block; background: #6366F1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">បើក Dashboard</a>
        </div>
      `

      // ៣. ផ្ញើ Email តាមរយៈ Resend API
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev', // អាសយដ្ឋានសាកល្បងរបស់ Resend
          to: 'tongtong123erty@gmail.com',
          subject: '📊 របាយការណ៍ប្រចាំសប្តាហ៍របស់អ្នក',
          html: htmlContent
        })
      })
    }

    return new Response(JSON.stringify({ message: "Emails sent successfully" }), { headers: { "Content-Type": "application/json" } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
})