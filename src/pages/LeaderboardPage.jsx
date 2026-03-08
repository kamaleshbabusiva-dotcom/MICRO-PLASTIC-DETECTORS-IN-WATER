import { useState } from 'react'
import { leaderboardUsers } from '../data/mockData'
import { getZone, getPromotionStatus } from '../utils/stepGoals'
import { Globe, ChevronUp, ChevronDown, Minus, ShieldCheck, Star, Zap, Search, Filter, Crown, TrendingUp, Calendar, Droplets, Waves } from 'lucide-react'
// import LeaderboardStats from '../components/LeaderboardStats' // Might need to update this too
// import UserMiniProfile from '../components/UserMiniProfile'
// import LeaderboardCard from '../components/LeaderboardCard'

const CURRENT_SITE_RANK = 4

const zoneConfig = [
    { name: 'Crystal', emoji: '💎', range: '1-10', gradient: 'from-cyan-400 to-blue-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
    { name: 'Alpine', emoji: '🏔️', range: '11-20', gradient: 'from-blue-500 to-indigo-600', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
    { name: 'Oceanic', emoji: '🌊', range: '21-50', gradient: 'from-blue-600 to-blue-800', bg: 'bg-blue-600/10', border: 'border-blue-600/30' },
    { name: 'Riverine', emoji: '🌿', range: '51-100', gradient: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    { name: 'Delta', emoji: '🌾', range: '101+', gradient: 'from-amber-600 to-orange-700', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
]

export default function LeaderboardPage() {
    const [selectedZone, setSelectedZone] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [showFreezeModal, setShowFreezeModal] = useState(false)

    const filteredUsers = leaderboardUsers.filter(u => {
        if (searchQuery && !u.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
        if (selectedZone === 'all') return true
        const zone = getZone(u.rank)
        // Adjusting zone names for filtering
        const zoneNameMap = {
            'emerald': 'crystal',
            'platinum': 'alpine',
            'gold': 'oceanic',
            'silver': 'riverine',
            'bronze': 'delta'
        }
        return zoneNameMap[zone.name.toLowerCase()] === selectedZone
    })

    const topThree = leaderboardUsers.slice(0, 3)

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-6 bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10 shadow-lg shadow-blue-500/5">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20">
                        <Globe className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="font-display text-4xl font-bold text-white tracking-tight">
                            Global Standings
                        </h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 uppercase tracking-widest">
                                <Waves className="w-3 h-3" /> Live Purity Index
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                <Calendar className="w-3 h-3" /> Next Audit in 4h 12m
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowFreezeModal(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/5 group"
                    >
                        <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Protect Data (100 🛡️)</span>
                    </button>
                    <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pb-8 pt-4">
                {/* 2nd Place */}
                <div className="order-2 md:order-1 glass-card p-6 border-blue-400/20 bg-gradient-to-b from-blue-400/10 to-transparent relative group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold shadow-xl border-4 border-[#0B0F1A]">
                        2
                    </div>
                    <div className="text-center pt-4">
                        <img src={topThree[1].avatar} className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-blue-400/50 p-1 bg-white/5" alt="" />
                        <h4 className="text-white font-bold text-lg">{topThree[1].name}</h4>
                        <p className="text-blue-400 text-sm font-black mb-4">{topThree[1].purity}% Purity</p>
                        <span className="px-3 py-1 rounded-full bg-blue-400/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-400/20">Crystal Tier</span>
                    </div>
                </div>

                {/* 1st Place */}
                <div className="order-1 md:order-2 glass-card p-8 border-cyan-400/40 bg-gradient-to-b from-cyan-400/20 to-transparent relative z-10 scale-105 shadow-2xl shadow-cyan-500/10 group hover:scale-[1.08] transition-transform">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-2xl border-4 border-[#0B0F1A]">
                        <Crown className="w-8 h-8" />
                    </div>
                    <div className="text-center pt-6">
                        <div className="relative inline-block mb-4">
                            <img src={topThree[0].avatar} className="w-24 h-24 rounded-full border-4 border-cyan-400 shadow-xl p-1 bg-white/5" alt="" />
                            <div className="absolute -bottom-2 -right-2 bg-cyan-400 text-black font-black p-1.5 rounded-lg text-[8px] animate-bounce uppercase tracking-tighter shadow-lg shadow-cyan-400/40">Cleanest</div>
                        </div>
                        <h4 className="text-white font-display text-2xl font-black tracking-tight">{topThree[0].name}</h4>
                        <p className="text-cyan-400 text-xl font-mono font-black mb-4">{topThree[0].purity}% Purity</p>
                        <span className="px-5 py-2 rounded-full bg-cyan-400 text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-cyan-400/20">Global Sovereign</span>
                    </div>
                </div>

                {/* 3rd Place */}
                <div className="order-3 glass-card p-6 border-indigo-500/20 bg-gradient-to-b from-indigo-500/10 to-transparent relative group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-xl border-4 border-[#0B0F1A]">
                        3
                    </div>
                    <div className="text-center pt-4">
                        <img src={topThree[2].avatar} className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-indigo-500/50 p-1 bg-white/5" alt="" />
                        <h4 className="text-white font-bold text-lg">{topThree[2].name}</h4>
                        <p className="text-indigo-400 text-sm font-black mb-4">{topThree[2].purity}% Purity</p>
                        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">Crystal Tier</span>
                    </div>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="glass-card p-4">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedZone('all')}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedZone === 'all'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 border border-blue-400/30'
                                : 'bg-white/5 text-gray-500 hover:bg-white/10'
                                }`}
                        >
                            All Water Bodies
                        </button>
                        {zoneConfig.map(z => (
                            <button
                                key={z.name}
                                onClick={() => setSelectedZone(z.name.toLowerCase())}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${selectedZone === z.name.toLowerCase()
                                    ? `${z.bg} text-white ${z.border} border shadow-lg`
                                    : 'bg-white/5 text-gray-500 hover:bg-white/10'
                                    }`}
                            >
                                <span>{z.emoji}</span>
                                <span>{z.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Find specific site..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-600 font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Site List */}
            <div className="glass-card overflow-hidden border-white/5">
                <div className="grid grid-cols-12 gap-3 px-8 py-5 bg-blue-500/5 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] border-b border-white/5">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-4">Site Identity</div>
                    <div className="col-span-2 text-center">Purity Index</div>
                    <div className="col-span-2 text-center">Stability</div>
                    <div className="col-span-3 text-right">Region Status</div>
                </div>

                <div className="divide-y divide-white/5">
                    {filteredUsers.slice(0, 40).map((user, idx) => {
                        const isCurrentUser = user.rank === CURRENT_SITE_RANK
                        return (
                            <div key={user.id} className={`grid grid-cols-12 gap-3 px-8 py-4 items-center transition-all hover:bg-white/5 ${isCurrentUser ? 'bg-blue-500/5 border-l-4 border-blue-500' : ''}`}>
                                <div className="col-span-1">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${idx < 3 ? 'bg-blue-500/20 text-blue-400' : 'text-gray-600'
                                        }`}>
                                        #{user.rank}
                                    </div>
                                </div>
                                <div className="col-span-4 flex items-center gap-3">
                                    <img src={user.avatar} className="w-10 h-10 rounded-full bg-white/5 border border-white/10" alt="" />
                                    <div>
                                        <div className="text-sm font-bold text-white tracking-tight">{user.name}</div>
                                        <div className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">{user.profession}</div>
                                    </div>
                                </div>
                                <div className="col-span-2 text-center">
                                    <div className="text-sm font-black text-blue-400">{user.purity}%</div>
                                    <div className="text-[10px] text-gray-600 font-mono">{(user.purity * 1.02).toFixed(1)} pH</div>
                                </div>
                                <div className="col-span-2 flex justify-center">
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                        <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Stable</span>
                                    </div>
                                </div>
                                <div className="col-span-3 text-right">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${idx < 10 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-400'
                                            }`}>
                                            Site Verified
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Droplets className="w-3 h-3 text-blue-400" />
                                            <span className="text-[10px] text-gray-500 font-bold uppercase">{user.steps} p/L</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
