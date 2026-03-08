import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { stepHistory, achievements, weeklySteps, monthlySteps } from '../data/mockData'
import { getZone } from '../utils/stepGoals'
import {
    User, Camera, Phone, MapPin, Edit3, Award, Flame, Target,
    Mail, Briefcase, Heart, Activity, Calendar, TrendingUp, Shield, Languages, Check
} from 'lucide-react'
import { DailyBarChart, MonthlyAreaChart } from '../components/StepChart'
import ProgressRing from '../components/ProgressRing'

export default function ProfilePage() {
    const { profile, userRole } = useAuth()
    const { t, currentLanguage, setCurrentLanguage, languages } = useLanguage()
    const [editing, setEditing] = useState(false)

    const userRank = 8
    const zone = getZone(userRank)
    const dailyGoal = profile?.stepGoal?.daily || 10
    const earnedAchievements = achievements.filter(a => a.earned)

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Profile Header Card */}
            <div className="glass-card p-8 relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10" />

                <div className="relative flex flex-col md:flex-row items-center gap-8">
                    {/* Avatar */}
                    <div className="relative group">
                        <img
                            src={profile?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun'}
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-blue-500/50 shadow-neon"
                        />
                        <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center border-2 border-dark-900 hover:scale-110 transition-transform">
                            <Camera className="w-5 h-5 text-white" />
                        </button>
                        <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-lg bg-gradient-to-r ${zone.gradient} text-xs font-bold text-white shadow-lg`}>
                            #{userRank}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <h1 className="font-display text-3xl font-bold text-white">{profile?.name || 'Arjun Mehta'}</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${zone.gradient} text-white`}>
                                {zone.emoji} {zone.name}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400 justify-center md:justify-start">
                            <span className="flex items-center gap-1"><Mail className="w-4 h-4" />{profile?.email || 'resident@neighborhood.com'}</span>
                            {userRole === 'admin' && (
                                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{t('profile.profession')}: {profile?.profession || 'Senior Inspector'}</span>
                            )}
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{t('profile.age')} {profile?.age || 28}</span>
                            <span className="flex items-center gap-1"><Activity className="w-4 h-4" />{t('profile.level')}: {profile?.level || 'Active Citizen'}</span>
                        </div>
                        <div className="flex items-center gap-6 mt-4 justify-center md:justify-start">
                            <div className="flex items-center gap-1 text-orange-400">
                                <Flame className="w-5 h-5" />
                                <span className="font-bold">{profile?.streak || 12} {t('profile.streak')}</span>
                            </div>
                            <div className="flex items-center gap-1 text-amber-400">
                                <Award className="w-5 h-5" />
                                <span className="font-bold">{earnedAchievements.length} {t('profile.achievements')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        {userRole === 'admin' && (
                            <div className="glass-card p-4 border-blue-500/20">
                                <div className="font-display text-xl font-bold text-blue-400">Stable</div>
                                <div className="flex items-center justify-center gap-1 text-xs text-emerald-400 mt-1">
                                    <span>+1.2m</span> <TrendingUp className="w-3 h-3" />
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Water Level</div>
                            </div>
                        )}
                        <div className="glass-card p-4">
                            <div className="font-display text-xl font-bold gradient-text">{stepHistory[stepHistory.length - 1]?.steps.toLocaleString()}%</div>
                            <div className="text-xs text-gray-500 mt-1">Daily Safety</div>
                        </div>
                        <div className="glass-card p-4">
                            <div className="font-display text-xl font-bold gradient-text">{weeklySteps.toLocaleString()}%</div>
                            <div className="text-xs text-gray-500 mt-1">Weekly Accuracy</div>
                        </div>
                        <div className="glass-card p-4">
                            <div className="font-display text-xl font-bold gradient-text">{monthlySteps.toLocaleString()}%</div>
                            <div className="text-xs text-gray-500 mt-1">Region Health</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Step Goals */}
                <div className="glass-card p-6">
                    <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-400" /> {t('profile.goals')}
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <span className="text-gray-400">{t('profile.daily_goal')}</span>
                            <span className="text-lg font-bold text-white">{dailyGoal.toLocaleString()} Samples</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <span className="text-gray-400">{t('profile.weekly_goal')}</span>
                            <span className="text-lg font-bold text-white">{(dailyGoal * 7).toLocaleString()} Reports</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <span className="text-gray-400">{t('profile.monthly_goal')}</span>
                            <span className="text-lg font-bold text-white">{(dailyGoal * 30).toLocaleString()} Checks</span>
                        </div>
                        <div className="glass-card p-3 text-sm text-gray-400">
                            <p>📊 {t('profile.calc_based')}</p>
                            <ul className="ml-4 mt-1 space-y-1">
                                <li>• {t('profile.age')}: {profile?.age || 28} years</li>
                                <li>• {t('profile.profession')}: {profile?.profession || 'IT / Software'}</li>
                                <li>• {t('profile.level')}: {profile?.level || 'Intermediate'}</li>
                                <li>• {t('profile.health')}: {profile?.disability || 'None'}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Language Settings */}
                <div className="glass-card p-6 flex flex-col h-full">
                    <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                        <Languages className="w-5 h-5 text-purple-400" /> {t('profile.lang_settings')}
                    </h3>
                    <div className="flex-1 space-y-3">
                        <p className="text-sm text-gray-400 mb-4">{t('profile.lang_desc')}:</p>
                        <div className="grid grid-cols-2 gap-3">
                            {languages.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => setCurrentLanguage(lang.code)}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${currentLanguage === lang.code
                                        ? 'bg-blue-500/10 border-blue-500/50 text-white font-bold'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="text-xl">{lang.flag}</span>
                                        <span className="text-sm">{lang.name}</span>
                                    </span>
                                    {currentLanguage === lang.code && <Check className="w-4 h-4 text-blue-400" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Emergency Contact & Safety */}
                <div className="glass-card p-6">
                    <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-red-400" /> {t('profile.safety')}
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Phone className="w-6 h-6 text-green-400" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-400">{t('profile.emergency')}</div>
                                <div className="font-semibold text-white">{profile?.emergencyName || 'Priya Mehta'}</div>
                                <div className="text-sm text-green-400 font-mono">{profile?.emergencyPhone || '+91-9876543210'}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-300">{t('profile.gps')} <span className="text-emerald-400 font-medium">{t('profile.gps_active')}</span></span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                            <Heart className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-gray-300">{profile?.favoritesCount || 3} {t('profile.locations')}</span>
                        </div>
                    </div>
                </div>

                {/* Eco Hero Badge Gallery */}
                <div className="glass-card p-6 lg:col-span-2 bg-gradient-to-br from-emerald-600/5 to-transparent border-emerald-500/20">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-display font-bold text-white flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-400" /> Eco Hero Badge System
                        </h3>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">3 New Badges Available</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { id: 'bp-1', title: 'Water Protector', icon: '🏅', desc: 'Report 5 contamination sources', earned: true, color: 'from-blue-600 to-cyan-500' },
                            { id: 'bp-2', title: 'Eco Hero', icon: '🌍', desc: 'Score 100% on a Safety Quiz', earned: true, color: 'from-emerald-600 to-teal-500' },
                            { id: 'bp-3', title: 'Plastic Reducer', icon: '♻', desc: 'Complete 10 awareness modules', earned: false, color: 'from-amber-600 to-orange-500' },
                        ].map(badge => (
                            <div
                                key={badge.id}
                                className={`relative p-6 rounded-2xl border transition-all overflow-hidden group ${badge.earned
                                    ? `bg-gradient-to-br ${badge.color}/10 border-${badge.color.split(' ')[0].split('-')[1]}-500/30 shadow-lg hover:scale-[1.02]`
                                    : 'bg-white/5 border-white/10 grayscale opacity-60'
                                    }`}
                            >
                                {badge.earned && (
                                    <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${badge.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
                                )}
                                <div className="flex items-center gap-4">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${badge.earned ? `bg-gradient-to-br ${badge.color}` : 'bg-white/5'}`}>
                                        {badge.icon}
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-white uppercase tracking-wider">{badge.title}</div>
                                        <div className="text-[10px] text-gray-400 mt-1 font-medium">{badge.desc}</div>
                                        {badge.earned ? (
                                            <div className="mt-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                                <Check className="w-3 h-3" /> Badge Earned
                                            </div>
                                        ) : (
                                            <div className="mt-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">In Progress</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Achievements Gallery (Existing) */}
                <div className="glass-card p-6 lg:col-span-2">
                    <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-400" /> {t('profile.gallery')}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
                        {achievements.map(a => (
                            <div
                                key={a.id}
                                className={`p-4 rounded-xl text-center transition-all ${a.earned
                                    ? 'bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20 hover:scale-105'
                                    : 'bg-white/5 opacity-50'
                                    }`}
                            >
                                <div className="text-3xl mb-2">{a.icon}</div>
                                <div className="text-xs font-medium text-white">{a.title}</div>
                                {!a.earned && a.progress !== undefined && (
                                    <div className="w-full h-1 rounded-full bg-white/10 mt-2">
                                        <div
                                            className="h-full rounded-full bg-blue-500"
                                            style={{ width: `${(a.progress / a.target) * 100}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Chart */}
                <div className="glass-card p-6 lg:col-span-2">
                    <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" /> {t('profile.history')}
                    </h3>
                    <div className="h-72">
                        <MonthlyAreaChart data={stepHistory} />
                    </div>
                </div>
            </div>
        </div>
    )
}
