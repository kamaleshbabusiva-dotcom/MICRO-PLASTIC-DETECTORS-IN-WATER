import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'
import {
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    sendPhoneOTP,
    verifyPhoneOTP,
    setupRecaptcha,
    firebaseSignOut,
    extractUserInfo
} from '../firebase/auth'
import { supabase, isSupabaseConfigured } from '../supabase/client'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

// Demo users (preserved as fallback)
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

// ── Sync Firebase user to Supabase ──────────────────────────────
async function syncUserToSupabase(firebaseUser, provider = 'email') {
    if (!isSupabaseConfigured || !firebaseUser) return null

    const userInfo = extractUserInfo(firebaseUser, provider)

    try {
        const { data, error } = await supabase.rpc('upsert_firebase_user', {
            p_firebase_uid: userInfo.firebaseUid,
            p_email: userInfo.email,
            p_full_name: userInfo.fullName,
            p_avatar_url: userInfo.avatarUrl,
            p_phone: userInfo.phone,
            p_auth_provider: userInfo.authProvider
        })

        if (error) {
            console.warn('Supabase sync error (RPC):', error.message)
            // Fallback: try direct insert/update
            const { data: profile, error: directErr } = await supabase
                .from('profiles')
                .upsert({
                    firebase_uid: userInfo.firebaseUid,
                    email: userInfo.email,
                    full_name: userInfo.fullName,
                    display_name: userInfo.fullName,
                    avatar_url: userInfo.avatarUrl,
                    phone: userInfo.phone,
                    auth_provider: userInfo.authProvider,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'firebase_uid' })
                .select()
                .single()

            if (directErr) {
                console.warn('Supabase direct sync also failed:', directErr.message)
                return null
            }
            return profile
        }
        return typeof data === 'string' ? JSON.parse(data) : data
    } catch (err) {
        console.warn('Supabase sync failed:', err.message)
        return null
    }
}

// ── Fetch profile from Supabase ─────────────────────────────────
async function fetchSupabaseProfile(firebaseUid) {
    if (!isSupabaseConfigured) return null
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('firebase_uid', firebaseUid)
            .single()
        if (error) return null
        return data
    } catch {
        return null
    }
}

// ═══════════════════════════════════════════════════════════════
// AuthProvider
// ═══════════════════════════════════════════════════════════════
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [firebaseUser, setFirebaseUser] = useState(null)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState(null)
    const [isOnboarded, setIsOnboarded] = useState(false)
    const [userRole, setUserRole] = useState(null)
    const [authProvider, setAuthProvider] = useState(null)
    const [authError, setAuthError] = useState(null)

    // ── Firebase auth state listener ────────────────────────────
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                setFirebaseUser(fbUser)

                // Determine provider
                const providerData = fbUser.providerData?.[0]
                let provider = 'email'
                if (providerData?.providerId === 'google.com') provider = 'google'
                else if (providerData?.providerId === 'phone') provider = 'phone'
                setAuthProvider(provider)

                // Build user object compatible with existing app
                const appUser = {
                    id: fbUser.uid,
                    email: fbUser.email || fbUser.phoneNumber || '',
                    role: 'citizen', // default, updated from Supabase profile
                    user_metadata: {
                        full_name: fbUser.displayName || fbUser.email || fbUser.phoneNumber || 'User',
                        avatar_url: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
                        name: fbUser.displayName || 'User'
                    }
                }

                setUser(appUser)
                setSession({ user: appUser })

                // Sync to Supabase and fetch full profile
                const supabaseProfile = await syncUserToSupabase(fbUser, provider)
                if (supabaseProfile) {
                    appUser.role = supabaseProfile.role || 'citizen'
                    setUserRole(supabaseProfile.role || 'citizen')
                    setIsOnboarded(supabaseProfile.is_onboarded || false)
                    setProfile({
                        name: supabaseProfile.full_name || appUser.user_metadata.full_name,
                        profession: supabaseProfile.specialty || 'Citizen Monitor',
                        streak: supabaseProfile.streak_count || 0,
                        bonusPoints: supabaseProfile.bonus_points || 0,
                        avatar: supabaseProfile.avatar_url || appUser.user_metadata.avatar_url,
                        email: supabaseProfile.email || appUser.email,
                        supabaseId: supabaseProfile.id
                    })
                    setUser({ ...appUser, role: supabaseProfile.role || 'citizen' })
                } else {
                    // No Supabase data — set defaults (treat as new user)
                    setUserRole('citizen')
                    setIsOnboarded(false)
                    setProfile({
                        name: appUser.user_metadata.full_name,
                        profession: 'Citizen Monitor',
                        streak: 0,
                        bonusPoints: 0,
                        avatar: appUser.user_metadata.avatar_url,
                        email: appUser.email
                    })
                }
            } else {
                // User signed out
                setFirebaseUser(null)
                setUser(null)
                setSession(null)
                setProfile(null)
                setUserRole(null)
                setIsOnboarded(false)
                setAuthProvider(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    // ── Auth methods ────────────────────────────────────────────

    const loginWithGoogle = async () => {
        try {
            setAuthError(null)
            setLoading(true)
            await signInWithGoogle()
            // State is handled by onAuthStateChanged
        } catch (err) {
            setAuthError(err.message)
            setLoading(false)
            throw err
        }
    }

    const loginWithEmail = async (email, password) => {
        try {
            setAuthError(null)
            setLoading(true)
            await signInWithEmail(email, password)
        } catch (err) {
            setAuthError(err.message)
            setLoading(false)
            throw err
        }
    }

    const registerEmail = async (email, password, displayName) => {
        try {
            setAuthError(null)
            setLoading(true)
            await registerWithEmail(email, password, displayName)
        } catch (err) {
            setAuthError(err.message)
            setLoading(false)
            throw err
        }
    }

    const loginWithPhone = async (phoneNumber, recaptchaElementId) => {
        try {
            setAuthError(null)
            const verifier = setupRecaptcha(recaptchaElementId)
            const confirmation = await sendPhoneOTP(phoneNumber, verifier)
            return confirmation
        } catch (err) {
            setAuthError(err.message)
            throw err
        }
    }

    const confirmOTP = async (confirmationResult, otp) => {
        try {
            setAuthError(null)
            setLoading(true)
            await verifyPhoneOTP(confirmationResult, otp)
        } catch (err) {
            setAuthError(err.message)
            setLoading(false)
            throw err
        }
    }

    const logout = async () => {
        try {
            await firebaseSignOut()
        } catch (err) {
            console.error('Logout error:', err)
        }
        // Also clear demo state
        setUser(null)
        setFirebaseUser(null)
        setSession(null)
        setProfile(null)
        setUserRole(null)
        setIsOnboarded(false)
        setAuthProvider(null)
    }

    // ── Demo logins (preserved) ─────────────────────────────────

    const adminDemoLogin = () => {
        setUserRole('admin')
        setUser(adminUser)
        setSession({ user: adminUser })
        setIsOnboarded(true)
        setAuthProvider('demo')
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
        setAuthProvider('demo')
        setProfile({
            name: 'Local Resident',
            profession: 'Neighborhood Resident',
            streak: 4,
            bonusPoints: 320,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Citizen'
        })
        setLoading(false)
    }

    const demoLogout = () => logout()

    const completeOnboarding = async (profileData) => {
        setProfile(profileData)
        setIsOnboarded(true)

        // Sync onboarding data to Supabase
        if (isSupabaseConfigured && firebaseUser) {
            try {
                await supabase
                    .from('profiles')
                    .update({
                        is_onboarded: true,
                        full_name: profileData.name,
                        display_name: profileData.name,
                        specialty: profileData.profession || profileData.stepGoal?.professionLabel,
                        updated_at: new Date().toISOString()
                    })
                    .eq('firebase_uid', firebaseUser.uid)
            } catch (err) {
                console.warn('Failed to sync onboarding:', err)
            }
        }
    }

    // ── Context value ───────────────────────────────────────────

    const value = {
        user,
        firebaseUser,
        session,
        loading,
        profile,
        isOnboarded,
        userRole,
        authProvider,
        authError,
        // Firebase auth methods
        loginWithGoogle,
        loginWithEmail,
        registerEmail,
        loginWithPhone,
        confirmOTP,
        logout,
        // Demo methods (preserved)
        adminDemoLogin,
        citizenDemoLogin,
        demoLogout,
        // Onboarding
        completeOnboarding,
        setProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
