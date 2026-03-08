import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const isSupabaseConfigured = 
    supabaseUrl !== 'https://your-project.supabase.co' && 
    supabaseUrl !== 'https://placeholder.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key-here' &&
    supabaseAnonKey !== 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
