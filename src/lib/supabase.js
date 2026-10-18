import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // រក្សាទុក Session ក្នុងទូរស័ព្ទ
    autoRefreshToken: true, // បន្ថែមពេលវេលាឱ្យ Session ដោយស្វ័យប្រវត្តិ
    detectSessionInUrl: true
  }
})