import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import {
    Waves, UserPlus, Mail, Lock, Eye, EyeOff, User,
    ArrowRight, Loader2, AlertCircle, CheckCircle2, ChevronLeft
} from 'lucide-react'

export default function RegisterPage() {
    const { registerEmail, authError } = useAuth()
    const navigate = useNavigate()

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const passwordChecks = [
        { label: 'At least 6 characters', valid: password.length >= 6 },
        { label: 'Passwords match', valid: password && password === confirmPassword },
    ]

    const handleRegister = async (e) => {
        e.preventDefault()
        setError('')

        if (!fullName.trim()) { setError('Please enter your full name'); return }
        if (!email.trim()) { setError('Please enter your email'); return }
        if (password.length < 6) { setError('Password must be at least 6 characters'); return }
        if (password !== confirmPassword) { setError('Passwords do not match'); return }

        setIsLoading(true)
        try {
            await registerEmail(email, password, fullName.trim())
            setSuccess(true)
            // Firebase onAuthStateChanged will handle the redirect
        } catch (err) {
            const messages = {
                'auth/email-already-in-use': 'An account with this email already exists. Try signing in instead.',
                'auth/invalid-email': 'Invalid email address format.',
                'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
            }
            setError(messages[err.code] || err.message || 'Registration failed. Please try again.')
        }
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-hero-gradient relative overflow-hidden flex items-center justify-center p-4">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
                <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <div className="relative z-10 w-full max-w-md animate-fade-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
                        <Waves className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="font-display text-3xl font-black text-white tracking-tight">Create Account</h1>
                    <p className="text-gray-400 mt-1 text-sm">Join AquaPure Detect and start monitoring water quality</p>
                </div>

                {/* Success state */}
                {success ? (
                    <div className="glass-card p-8 text-center animate-scale-in">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h2 className="font-display text-2xl font-bold text-white mb-2">Welcome Aboard!</h2>
                        <p className="text-gray-400 text-sm mb-6">Account created successfully. Redirecting to setup...</p>
                        <div className="w-8 h-8 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
                    </div>
                ) : (
                    <div className="glass-card p-8 border-white/10">
                        {/* Error */}
                        {error && (
                            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2 animate-fade-in">
                                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                <p className="text-sm text-red-300">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        id="register-name"
                                        type="text"
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        placeholder="Dr. Arjun Mehta"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all text-sm"
                                        autoComplete="name"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        id="register-email"
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all text-sm"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        id="register-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all text-sm"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        id="register-confirm-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all text-sm"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            {/* Password Strength */}
                            {password && (
                                <div className="space-y-1.5 animate-fade-in">
                                    {passwordChecks.map((check, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs">
                                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${check.valid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-600'}`}>
                                                {check.valid && <CheckCircle2 className="w-2.5 h-2.5" />}
                                            </div>
                                            <span className={check.valid ? 'text-emerald-400' : 'text-gray-500'}>{check.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                id="register-submit-btn"
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        {/* Login Link */}
                        <p className="text-center text-sm text-gray-500 mt-5">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                )}

                {/* Back to login */}
                <div className="text-center mt-6">
                    <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
