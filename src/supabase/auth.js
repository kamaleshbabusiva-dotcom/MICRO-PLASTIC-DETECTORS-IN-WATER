import { supabase, isSupabaseConfigured } from './client'

export const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
        console.warn('Supabase is not configured. Redirecting to demo mode.')
        throw new Error('SUPABASE_NOT_CONFIGURED')
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
    })
    if (error) throw error
    return data
}

export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

export const getCurrentUser = async () => {
    if (!isSupabaseConfigured) return null
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export const getSession = async () => {
    if (!isSupabaseConfigured) return null
    const { data: { session } } = await supabase.auth.getSession()
    return session
}
