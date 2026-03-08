import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProgressRing from '../components/ProgressRing'
import { DailyBarChart } from '../components/StepChart'
import AchievementPopup from '../components/AchievementPopup'
import { stepHistory, todaySteps, weeklySteps, monthlySteps, achievements, leaderboardUsers } from '../data/mockData'
import { getZone } from '../utils/stepGoals'
import WaterNewsWidget from '../components/WaterNewsWidget'
import {
    Droplets, Shield, Award, Target, BarChart3, History,
    ChevronRight, Zap, Clock, MapPin, Star, AlertTriangle, Waves, Globe, MessageSquare,
    Cpu, Terminal, Activity as ActivityIcon, Code
} from 'lucide-react'

export default function DashboardPage() {
    const { profile } = useAuth()
    const [showAchievement, setShowAchievement] = useState(null)
    const [apiLogs, setApiLogs] = useState([
        { id: 1, method: 'POST', endpoint: '/api/v1/scan', status: 200, time: '14:20:05', zone: 'Sector 7' },
        { id: 2, method: 'GET', endpoint: '/api/v1/sensors', status: 200, time: '14:18:22', zone: 'Central' },
        { id: 3, method: 'POST', endpoint: '/api/v1/scan', status: 429, time: '14:15:10', zone: 'Sector 4' },
    ])
    const [isTesting, setIsTesting] = useState(false)

    const dailyGoal = 95 // Purity Goal %
    const currentPurity = todaySteps.steps
    const microplasticsCount = Math.floor((100 - currentPurity) * 45)
    const progress = Math.min(100, (currentPurity / dailyGoal) * 100)
    const regionalRank = 4
    const zone = getZone(regionalRank)

    const quickStats = [
        { label: 'Current Purity', value: `${currentPurity}%`, icon: Droplets, color: 'from-blue-500 to-cyan-500', sub: `${progress.toFixed(1)}% of safety target` },
        { label: 'Weekly Avg', value: `${weeklySteps}%`, icon: History, color: 'from-purple-500 to-pink-500', sub: `Target: ${dailyGoal}%` },
        { label: 'Microplastic Density', value: `${microplasticsCount.toLocaleString()} p/L`, icon: AlertTriangle, color: 'from-red-500 to-orange-500', sub: 'Detected Micro-fragments' },
        { label: 'Region Rank', value: `#${regionalRank}`, icon: Award, color: zone.gradient, sub: `${zone.name} Standard ${zone.emoji}` },
    ]

    const recentAchievements = achievements.filter(a => a.earned).slice(-3)

    return (
        <div className="space-y-6 lg:space-y-8 animate-fade-in pb-20 lg:pb-0">
            {showAchievement && (
                <AchievementPopup achievement={showAchievement} onClose={() => setShowAchievement(null)} />
            )}

            {/* Welcome Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight">
                        Site Operational Dashboard
                    </h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] lg:hidden">Mobile Command Center v4.2</p>
                    <div className="flex items-center gap-4 mt-2 lg:mt-3">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="hidden lg:inline">Shift Active:</span> 08:00 - 18:00
                        </div>
                        <div className="text-gray-500 text-xs flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5 text-blue-400" /> Authorized: {(profile?.name || 'Inspector Arjun').split(' ')[0]}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                        <span className="text-sm font-bold text-blue-400">🛡️ {profile?.bonusPoints || 850} Trust Score</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickStats.map((stat, i) => (
                    <div key={i} className="glass-card-hover p-5 group">
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs text-gray-500">{stat.label}</span>
                        </div>
                        <div className="font-display text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-gray-500 mt-1">{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Progress Ring - Left Column */}
                <div className="glass-card p-6 flex flex-col items-center justify-center">
                    <h3 className="font-display font-bold text-white mb-6">Purity Target</h3>
                    <ProgressRing progress={progress} size={200} strokeWidth={14} color={currentPurity >= dailyGoal ? '#10b981' : '#0c8ee9'}>
                        <div className="text-center">
                            <div className="font-display text-3xl font-black text-white">{currentPurity}%</div>
                            <div className="text-xs text-gray-400 mt-1">Water Purity</div>
                        </div>
                    </ProgressRing>
                    <div className="mt-6 w-full space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Regional Standard</span>
                            <span className="text-white font-medium">{dailyGoal}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Current Site</span>
                            <span className="text-blue-400 font-medium">{profile?.profession || 'Urban Reservoir'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Last Calibrated</span>
                            <span className="text-emerald-400 font-medium">2 hours ago</span>
                        </div>
                    </div>
                </div>

                {/* Weekly Chart - Middle Two Columns */}
                <div className="glass-card p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-bold text-white">Purity Trends (30 Days)</h3>
                        <Link to="/stats" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            Live Feed <Waves className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="h-64">
                        <DailyBarChart data={stepHistory} />
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Achievements */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-bold text-white flex items-center gap-2">
                            <Award className="w-5 h-5 text-blue-400" /> Environmental Certificates
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {recentAchievements.map(a => (
                            <button
                                key={a.id}
                                onClick={() => setShowAchievement(a)}
                                className="w-full flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left"
                            >
                                <span className="text-2xl">{a.icon}</span>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-white">{a.title}</div>
                                    <div className="text-xs text-gray-500">{a.description}</div>
                                </div>
                                <span className="text-xs text-gray-600">{a.date}</span>
                            </button>
                        ))}
                    </div>
                    {/* Upcoming Achievements */}
                    <h4 className="text-sm font-semibold text-gray-400 mt-4 mb-3">Monitoring Milestones</h4>
                    <div className="space-y-3">
                        {achievements.filter(a => !a.earned).slice(0, 2).map(a => (
                            <div key={a.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                                <span className="text-2xl opacity-50">{a.icon}</span>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-gray-400">{a.title}</div>
                                    <div className="w-full h-1.5 rounded-full bg-white/10 mt-2">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                            style={{ width: `${(a.progress / a.target) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-xs text-gray-600">{typeof a.progress === 'number' && a.target > 100 ? `${(a.progress / 1000).toFixed(0)}K/${(a.target / 1000).toFixed(0)}K` : `${a.progress}/${a.target}`}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Regional Leaderboard */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-bold text-white flex items-center gap-2">
                            <Globe className="w-5 h-5 text-emerald-400" /> Regional Purity Standards
                        </h3>
                        <Link to="/leaderboard" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            Global Map <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {leaderboardUsers.slice(0, 5).map((u, i) => {
                            const z = getZone(u.rank)
                            const isCurrentUser = i === regionalRank - 1
                            return (
                                <div
                                    key={u.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isCurrentUser ? 'bg-blue-500/10 border border-blue-500/30' : 'hover:bg-white/5'
                                        }`}
                                >
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${i < 3 ? `bg-gradient-to-br ${z.gradient} text-white` : 'bg-white/10 text-gray-400'
                                        }`}>
                                        {i + 1}
                                    </div>
                                    <img src={u.avatar} alt="" className="w-8 h-8 rounded-full bg-white/10" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-white truncate">
                                            {isCurrentUser ? '⭐ Current Site' : u.name}
                                        </div>
                                    </div>
                                    <div className="text-sm font-bold text-gray-300">{u.purity}% Purity</div>
                                    <span className="text-xs">{z.emoji}</span>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-8 border-t border-white/5 pt-6">
                        <h3 className="font-display font-bold text-white flex items-center gap-2 mb-4">
                            <MessageSquare className="w-5 h-5 text-indigo-400" /> Citizen Impact Reports
                        </h3>
                        <div className="space-y-3">
                            {[
                                { user: 'Rajesh K.', msg: 'Multiple residents reporting skin irritation after using tap water.', type: 'Health', time: '10m ago', urgent: true },
                                { user: 'Anita S.', msg: 'Odd plastic-like odor detected near Sector 4 intake.', type: 'Odor', time: '45m ago', urgent: false },
                                { user: 'Worker Hive 9', msg: 'Industrial runoff upstream color change detected.', type: 'General', time: '2h ago', urgent: true },
                            ].map((report, i) => (
                                <div key={i} className={`p-3 rounded-xl border ${report.urgent ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{report.user} • {report.time}</span>
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${report.type === 'Health' ? 'bg-red-500 text-white' : 'bg-indigo-500 text-white'}`}>{report.type}</span>
                                    </div>
                                    <p className="text-xs text-gray-300 line-clamp-2">{report.msg}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI Water Scanner API Center */}
                <div className="glass-card p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                <Cpu className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">AI Water Scanner API Center</h3>
                                <p className="text-sm text-gray-400">Infrastructure & Model Endpoint Management</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                Model v4.2.1 Stable
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* API Diagnostics */}
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Endpoint Status</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] text-emerald-400 font-bold uppercase">Online</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Latency (Avg)</span>
                                        <span className="text-white font-mono">142ms</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Peak Load</span>
                                        <span className="text-white font-mono">1.2k req/min</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsTesting(true)
                                        setTimeout(() => setIsTesting(false), 2000)
                                    }}
                                    disabled={isTesting}
                                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isTesting ? <ActivityIcon className="w-3 h-3 animate-spin" /> : <Terminal className="w-3 h-3" />}
                                    {isTesting ? 'Running Stress Test...' : 'Run Endpoint Diagnostics'}
                                </button>
                            </div>

                            <div className="p-4 rounded-2xl bg-dark-950 border border-white/5 font-mono text-[10px] space-y-2">
                                <div className="text-indigo-400 flex items-center gap-2">
                                    <Code className="w-3 h-3" /> Latest Scan Payload
                                </div>
                                <div className="text-gray-500 whitespace-pre">
                                    {`{
  "timestamp": "${new Date().toISOString()}",
  "location": [12.9716, 77.5946],
  "polymer_density": 142.5,
  "confidence_score": 0.982,
  "detected_polymers": ["PET", "HDPE"],
  "health_risk": "Low"
}`}
                                </div>
                            </div>
                        </div>

                        {/* API Traffic Log */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Traffic Logs</span>
                                <span className="text-[10px] text-indigo-400 font-bold">Auto-Refreshing</span>
                            </div>
                            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                {apiLogs.map(log => (
                                    <div key={log.id} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded leading-tight ${log.method === 'POST' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'}`}>
                                                {log.method}
                                            </span>
                                            <div>
                                                <div className="text-[10px] font-bold text-white font-mono">{log.endpoint}</div>
                                                <div className="text-[8px] text-gray-500">{log.zone} • {log.time}</div>
                                            </div>
                                        </div>
                                        <div className={`text-[10px] font-black ${log.status === 200 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {log.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Water News Section */}
            <WaterNewsWidget compact={false} maxItems={5} />
        </div>
    )
}
