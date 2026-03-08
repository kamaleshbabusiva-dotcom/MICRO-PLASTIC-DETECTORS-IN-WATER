import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

const adminUser = {
    id: 'admin-001',
    email: 'admin@aquapure.net',
    role: 'admin',
    user_metadata: {
        full_name: 'Inspector Arjun Mehta',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
        name: 'Inspector Arjun'
    }
}

const citizenUser = {
    id: 'citizen-001',
    email: 'citizen@local.net',
    role: 'citizen',
    user_metadata: {
        full_name: 'Local Resident',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Citizen',
        name: 'Local Resident'
    }
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState(null)
    const [isOnboarded, setIsOnboarded] = useState(false)
    const [userRole, setUserRole] = useState(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
        })

        return () => subscription?.unsubscribe()
    }, [])

    const adminDemoLogin = () => {
        setUserRole('admin')
        setUser(adminUser)
        setSession({ user: adminUser })
        setIsOnboarded(true)
        setProfile({
            name: 'Inspector Arjun Mehta',
            profession: 'Senior Water Inspector',
            streak: 15,
            bonusPoints: 1250,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun'
        })
        setLoading(false)
    }

    const citizenDemoLogin = () => {
        setUserRole('citizen')
        setUser(citizenUser)
        setSession({ user: citizenUser })
        setIsOnboarded(true)
        setProfile({
            name: 'Local Resident',
            profession: 'Neighborhood Resident',
            streak: 4,
            bonusPoints: 320,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Citizen'
        })
        setLoading(false)
    }

    const demoLogout = () => {
        setUser(null)
        setSession(null)
        setProfile(null)
        setUserRole(null)
        setIsOnboarded(false)
    }

    const completeOnboarding = (profileData) => {
        setProfile(profileData)
        setIsOnboarded(true)
    }

    const value = {
        user,
        session,
        loading,
        profile,
        isOnboarded,
        userRole,
        adminDemoLogin,
        citizenDemoLogin,
        demoLogout,
        completeOnboarding,
        setProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
