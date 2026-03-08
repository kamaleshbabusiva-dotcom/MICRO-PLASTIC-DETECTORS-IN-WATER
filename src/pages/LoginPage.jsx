import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { signInWithGoogle } from '../supabase/auth'
import { isSupabaseConfigured } from '../supabase/client'
import { Droplets, Globe, Users, MessageSquare, Activity, TrendingUp, Zap, Heart, ChevronRight, Languages, Check, Waves, ShieldAlert } from 'lucide-react'

export default function LoginPage() {
    const { adminDemoLogin, citizenDemoLogin, demoLogout } = useAuth()
    const { t, currentLanguage, setCurrentLanguage, languages } = useLanguage()
    const [isLoading, setIsLoading] = useState(false)
    const [showLangMenu, setShowLangMenu] = useState(false)

    const features = [
        { icon: Droplets, title: t('features.title1'), desc: t('features.desc1'), color: 'from-blue-500 to-cyan-500' },
        { icon: Globe, title: t('features.title2'), desc: t('features.desc2'), color: 'from-emerald-500 to-teal-500' },
        { icon: Users, title: t('features.title3'), desc: t('features.desc3'), color: 'from-purple-500 to-pink-500' },
        { icon: MessageSquare, title: t('features.title4'), desc: t('features.desc4'), color: 'from-blue-600 to-indigo-600' },
        { icon: Activity, title: t('features.title5'), desc: t('features.desc5'), color: 'from-cyan-400 to-blue-500' },
        { icon: TrendingUp, title: t('features.title6'), desc: t('features.desc6'), color: 'from-indigo-500 to-violet-500' },
    ]

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        try {
            await signInWithGoogle()
        } catch (err) {
            console.error('Auth Error:', err.message)
            adminDemoLogin()
        }
        setIsLoading(false)
    }

    const handleDemoLogin = () => {
        demoLogin()
    }

    return (
        <div className="min-h-screen bg-hero-gradient relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
                <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
                <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />

                {/* Grid pattern */}
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <nav className="flex items-center justify-between px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                            <Waves className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-display text-2xl font-bold text-white">AquaPure Detect</span>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLangMenu(!showLangMenu)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                            >
                                <Languages className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-medium">
                                    {languages.find(l => l.code === currentLanguage)?.flag} {languages.find(l => l.code === currentLanguage)?.name}
                                </span>
                            </button>

                            {showLangMenu && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
                                    <div className="absolute right-0 mt-2 w-48 bg-dark-900 border border-white/10 rounded-2xl p-2 shadow-2xl z-50 animate-fade-in origin-top-right">
                                        {languages.map(lang => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    setCurrentLanguage(lang.code)
                                                    setShowLangMenu(false)
                                                }}
                                                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all ${currentLanguage === lang.code
                                                    ? 'bg-blue-500/10 text-blue-400 font-bold'
                                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                    }`}
                                            >
                                                <span className="flex items-center gap-3">
                                                    <span>{lang.flag}</span>
                                                    <span>{lang.name}</span>
                                                </span>
                                                {currentLanguage === lang.code && <Check className="w-3.5 h-3.5" />}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="hidden md:flex items-center gap-2">
                            <span className="text-sm text-gray-400">Advanced Purity Intelligence</span>
                            <Droplets className="w-4 h-4 text-blue-400" />
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="flex-1 flex items-center justify-center px-4 py-8">
                    <div className="max-w-6xl w-full mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left - Content */}
                        <div className="text-center lg:text-left animate-fade-in">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                                <Zap className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-gray-300">{t('rev_wellness')}</span>
                            </div>

                            <h1 className="font-display text-5xl lg:text-7xl font-black tracking-tight mb-6">
                                <span className="text-white">{t('hero_title_1')}</span>
                                <br />
                                <span className="gradient-text">{t('hero_title_2')}</span>
                            </h1>

                            <p className="text-lg text-gray-400 mb-10 max-w-lg">
                                {t('hero_desc')}
                            </p>

                            {/* Login Buttons */}
                            <div className="flex flex-col gap-4 max-w-sm mx-auto lg:mx-0">
                                <button
                                    id="admin-login-btn"
                                    onClick={adminDemoLogin}
                                    className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105"
                                >
                                    <ShieldAlert className="w-5 h-5 text-blue-200" />
                                    Enter as Water Inspector
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    id="citizen-login-btn"
                                    onClick={citizenDemoLogin}
                                    className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white font-bold text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
                                >
                                    <Users className="w-5 h-5 text-emerald-400" />
                                    Enter as Concerned Citizen
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <div className="mt-4 border-t border-white/5 pt-4">
                                    <button
                                        id="google-login-btn"
                                        onClick={handleGoogleLogin}
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold text-sm transition-all hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        {isLoading ? t('connecting') : t('continue_google')}
                                    </button>
                                </div>
                            </div>

                            <p className="text-sm text-gray-500 mt-4">
                                {t('setup_info')}
                                {!isSupabaseConfigured && (
                                    <span className="block mt-2 text-amber-400/80 text-xs italic">
                                        Note: IoT connection fallback to simulator for demo mode.
                                    </span>
                                )}
                            </p>

                        </div>

                        {/* Right - Feature Cards */}
                        <div className="grid grid-cols-2 gap-4 animate-slide-up">
                            {features.map((feature, i) => (
                                <div
                                    key={i}
                                    className="glass-card-hover p-5 group"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-display font-bold text-white text-sm mb-1">{feature.title}</h3>
                                    <p className="text-gray-400 text-xs leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Stats Bar */}
                <div className="border-t border-white/5 px-8 py-4">
                    <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8 text-center">
                        {[
                            { value: '15,000+', label: t('stats.users') },
                            { value: '42%', label: t('stats.steps') },
                            { value: '94%', label: t('stats.active') },
                            { value: '0.002%', label: t('stats.sick') },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col">
                                <span className="font-display text-2xl font-bold gradient-text">{stat.value}</span>
                                <span className="text-xs text-gray-500">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
