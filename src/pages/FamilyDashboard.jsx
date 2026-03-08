import React, { useState, useEffect } from 'react';
import { Users, Baby, User, Heart, Shield, AlertTriangle, Droplets, Clock, Bell, Zap, TrendingDown, ShoppingBag, Phone, MapPin, Trophy, Flame, Star, ChevronRight, CheckCircle2, XCircle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import WaterNewsWidget from '../components/WaterNewsWidget';

// Family member data
const FAMILY_MEMBERS = [
    { id: 1, name: 'Baby Ananya', emoji: '👶', age: 2, type: 'baby', threshold: 0.5, icon: Baby },
    { id: 2, name: 'Priya (Mother)', emoji: '👩', age: 32, type: 'adult', threshold: 3.0, icon: User },
    { id: 3, name: 'Rajan (Father)', emoji: '👨', age: 35, type: 'adult', threshold: 3.0, icon: User },
    { id: 4, name: 'Grandma Lakshmi', emoji: '🧓', age: 68, type: 'elder', threshold: 1.5, icon: Heart },
    { id: 5, name: 'Pet (Bruno)', emoji: '🐕', age: 4, type: 'pet', threshold: 2.0, icon: Heart },
];

const WATER_SOURCES = [
    { id: 'tap', name: 'Kitchen Tap', level: 2.1, tested: '2 hrs ago' },
    { id: 'ro', name: 'RO Filter', level: 0.3, tested: '1 hr ago' },
    { id: 'bottle', name: 'Bottled Water', level: 1.8, tested: '4 hrs ago' },
    { id: 'well', name: 'Well Water', level: 5.7, tested: 'Yesterday' },
];

const FILTER_RECOMMENDATIONS = [
    { name: 'TATA Swach Smart', price: '₹599', rating: 4.3, reduction: '92%', badge: 'Best Value' },
    { name: 'Eureka Forbes Aquaguard', price: '₹12,999', rating: 4.7, reduction: '99%', badge: 'Premium' },
    { name: 'Kent Super Star', price: '₹8,500', rating: 4.5, reduction: '97%', badge: 'Popular' },
    { name: 'Livpure Zinger', price: '₹6,490', rating: 4.2, reduction: '95%', badge: 'Mid-Range' },
];

const WEEKLY_DATA = [
    { day: 'Mon', level: 2.1 },
    { day: 'Tue', level: 1.8 },
    { day: 'Wed', level: 3.4 },
    { day: 'Thu', level: 2.7 },
    { day: 'Fri', level: 1.2 },
    { day: 'Sat', level: 0.9 },
    { day: 'Sun', level: 1.5 },
];

function getRiskLevel(level, threshold) {
    if (level <= threshold * 0.5) return { status: 'safe', color: 'emerald', emoji: '🟢', label: 'Safe' };
    if (level <= threshold) return { status: 'watch', color: 'yellow', emoji: '🟡', label: 'Watch' };
    return { status: 'danger', color: 'red', emoji: '🔴', label: 'Danger' };
}

function getSourceRisk(level) {
    if (level <= 1) return { status: 'safe', bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400' };
    if (level <= 3) return { status: 'watch', bg: 'bg-yellow-500/10 border-yellow-500/30', text: 'text-yellow-400' };
    return { status: 'danger', bg: 'bg-red-500/10 border-red-500/30', text: 'text-red-400' };
}

// Generate stable member levels (called once, not on every render)
function generateMemberLevels() {
    const sources = ['Kitchen Tap', 'RO Filter', 'Bottled Water', 'Well Water'];
    const times = ['30 min ago', '1 hr ago', '2 hrs ago', '3 hrs ago', '4 hrs ago'];
    return FAMILY_MEMBERS.map(m => ({
        ...m,
        currentLevel: parseFloat((Math.random() * 4 + 0.3).toFixed(1)),
        lastTested: times[Math.floor(Math.random() * times.length)],
        waterSource: sources[Math.floor(Math.random() * sources.length)],
    }));
}

export default function FamilyDashboard() {
    const [activeTab, setActiveTab] = useState('family');
    const [selectedMember, setSelectedMember] = useState(null);
    const [reminderSet, setReminderSet] = useState(false);
    const [offlineMode, setOfflineMode] = useState(false);
    const [streak] = useState(7);
    const [totalScans, setTotalScans] = useState(23);
    const [points, setPoints] = useState(340);
    const [rank] = useState(17);
    const [memberData, setMemberData] = useState(() => generateMemberLevels());
    const [lastScanTime, setLastScanTime] = useState(new Date().toLocaleTimeString());

    const rescanAll = () => {
        setMemberData(generateMemberLevels());
        setLastScanTime(new Date().toLocaleTimeString());
        setTotalScans(s => s + 1);
        setPoints(p => p + 10);
        setSelectedMember(null);
    };

    // Compute from stable data
    const safeCount = memberData.filter(m => m.currentLevel <= m.threshold * 0.5).length;
    const morningScore = Math.round((safeCount / memberData.length) * 100);
    const avgExposure = parseFloat((memberData.reduce((s, m) => s + m.currentLevel, 0) / memberData.length).toFixed(1));

    const tabs = [
        { id: 'family', label: 'Family', icon: Users },
        { id: 'sources', label: 'Sources', icon: Droplets },
        { id: 'weekly', label: 'Weekly', icon: TrendingDown },
        { id: 'gamify', label: 'Rewards', icon: Trophy },
    ];

    return (
        <div className="space-y-6 animate-fade-in p-2 lg:p-4 pb-24 lg:pb-4">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
                        <Users className="w-7 h-7 lg:w-8 lg:h-8 text-blue-400" /> Family Safety Hub
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm">Age-based thresholds • Actionable alerts • Weekly exposure tracking</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setOfflineMode(!offlineMode)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${offlineMode ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            }`}
                    >
                        {offlineMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                        {offlineMode ? 'Offline (42 cached)' : 'Online'}
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <div>
                            <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Morning Score</div>
                            <div className="text-lg font-black text-white leading-none">{morningScore}<span className="text-[10px] text-gray-400">%</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Reminder Banner */}
            {!reminderSet && (
                <div className="glass-card p-4 bg-gradient-to-r from-amber-600/10 to-orange-600/10 border-amber-500/20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">Morning Water Check Reminder</div>
                            <div className="text-[11px] text-gray-400">Set daily 7AM alert → "Test tap water today?" → Protect your family</div>
                        </div>
                    </div>
                    <button onClick={() => setReminderSet(true)} className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-black uppercase tracking-widest hover:bg-amber-400 transition-all flex-shrink-0">
                        <Clock className="w-3.5 h-3.5 inline mr-1" /> Set 7AM
                    </button>
                </div>
            )}
            {reminderSet && (
                <div className="glass-card p-3 bg-emerald-500/5 border-emerald-500/20 flex items-center gap-3 animate-scale-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm text-emerald-400 font-bold">Daily 7AM reminder set! You'll be notified to test your water.</span>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* ===================== FAMILY TAB ===================== */}
            {activeTab === 'family' && (
                <div className="space-y-6">
                    {/* Rescan Bar */}
                    <div className="flex items-center justify-between">
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            Last Scan: {lastScanTime} • {memberData.length} members tracked
                        </div>
                        <button onClick={rescanAll} className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20 hover:bg-blue-500/20 transition-all flex items-center gap-2">
                            <RefreshCw className="w-3 h-3" /> Rescan All
                        </button>
                    </div>

                    {/* Family Members Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {memberData.map(member => {
                            const risk = getRiskLevel(member.currentLevel, member.threshold);
                            return (
                                <div
                                    key={member.id}
                                    onClick={() => setSelectedMember(selectedMember?.id === member.id ? null : member)}
                                    className={`glass-card p-5 cursor-pointer transition-all hover:scale-[1.02] border ${risk.status === 'safe' ? 'border-emerald-500/20 hover:border-emerald-500/40' :
                                            risk.status === 'watch' ? 'border-yellow-500/20 hover:border-yellow-500/40' :
                                                'border-red-500/20 hover:border-red-500/40'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="text-3xl">{member.emoji}</div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{member.name}</div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                                                    {member.type === 'baby' ? 'Infant' : member.type === 'pet' ? 'Pet' : `Age ${member.age}`}
                                                    {' • '}Limit: {member.threshold}μg/L
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-2xl">{risk.emoji}</div>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <div className={`text-2xl font-black ${risk.status === 'safe' ? 'text-emerald-400' :
                                                    risk.status === 'watch' ? 'text-yellow-400' : 'text-red-400'
                                                }`}>{member.currentLevel} <span className="text-xs text-gray-500">μg/L</span></div>
                                            <div className="text-[9px] text-gray-600 mt-0.5">via {member.waterSource} • {member.lastTested}</div>
                                        </div>
                                        <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${risk.status === 'safe' ? 'bg-emerald-500/20 text-emerald-400' :
                                                risk.status === 'watch' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                            }`}>{risk.label}</div>
                                    </div>

                                    {/* Expanded Action */}
                                    {selectedMember?.id === member.id && (
                                        <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-scale-in">
                                            {risk.status === 'safe' && (
                                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                                    <span>👍 Water is safe for {member.name}. Next test recommended in 3 days.</span>
                                                </div>
                                            )}
                                            {risk.status === 'watch' && (
                                                <>
                                                    <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-[11px] text-yellow-400 flex items-center gap-2">
                                                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                                        <span>🪣 Boil water + use sediment filter before {member.type === 'baby' ? 'feeding' : 'drinking'}.</span>
                                                    </div>
                                                    <button className="w-full py-2 rounded-lg bg-yellow-500/10 text-yellow-400 text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500/20 transition-all flex items-center justify-center gap-1">
                                                        <ShoppingBag className="w-3 h-3" /> Buy: TATA Swach ₹599
                                                    </button>
                                                </>
                                            )}
                                            {risk.status === 'danger' && (
                                                <>
                                                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-400 flex items-center gap-2">
                                                        <XCircle className="w-4 h-4 flex-shrink-0" />
                                                        <span>🚨 STOP using this water for {member.name}! Switch to RO/filtered water immediately.</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button className="py-2 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 hover:bg-red-500/20 transition-all">
                                                            <Phone className="w-3 h-3" /> Call Helpline
                                                        </button>
                                                        <button className="py-2 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 hover:bg-red-500/20 transition-all">
                                                            <MapPin className="w-3 h-3" /> Report to CPCB
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Quick Safety Summary */}
                    <div className="glass-card p-5 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-blue-500/20">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Family Weekly Exposure Summary</div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-black text-white">{avgExposure}<span className="text-xs text-gray-500">μg</span></div>
                                <div className="text-[10px] text-gray-500">Avg Exposure</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-black text-emerald-400">{morningScore}<span className="text-xs">%</span></div>
                                <div className="text-[10px] text-gray-500">Family Safe Score</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-black text-blue-400">{totalScans}</div>
                                <div className="text-[10px] text-gray-500">Tests This Week</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-black text-purple-400">{memberData.length}</div>
                                <div className="text-[10px] text-gray-500">Members Protected</div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 text-center">
                            💡 Tip: "Boil + RO = 98% safe" — Use filtered water for cooking dal/rice
                        </div>
                    </div>
                </div>
            )}

            {/* ===================== SOURCES TAB ===================== */}
            {activeTab === 'sources' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {WATER_SOURCES.map(source => {
                            const risk = getSourceRisk(source.level);
                            return (
                                <div key={source.id} className={`glass-card p-5 border ${risk.bg} transition-all hover:scale-[1.02]`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${risk.bg}`}>
                                                <Droplets className={`w-5 h-5 ${risk.text}`} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{source.name}</div>
                                                <div className="text-[10px] text-gray-500">Tested: {source.tested}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div className={`text-3xl font-black ${risk.text}`}>
                                            {source.level} <span className="text-xs text-gray-500">μg/L</span>
                                        </div>
                                        <div>
                                            {risk.status === 'safe' && <div className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded">✅ Safe to drink</div>}
                                            {risk.status === 'watch' && <div className="text-[10px] text-yellow-400 font-bold bg-yellow-500/10 px-2 py-1 rounded">⚠️ Boil first</div>}
                                            {risk.status === 'danger' && <div className="text-[10px] text-red-400 font-bold bg-red-500/10 px-2 py-1 rounded">🚨 Don't use</div>}
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-white/5">
                                        {risk.status === 'safe' && (
                                            <div className="text-[11px] text-gray-400 flex items-center gap-2">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Safe for all family members including baby
                                            </div>
                                        )}
                                        {risk.status === 'watch' && (
                                            <div className="text-[11px] text-yellow-400 flex items-center gap-2">
                                                <AlertTriangle className="w-3.5 h-3.5" /> Don't use for baby food / dal / rice without filtering
                                            </div>
                                        )}
                                        {risk.status === 'danger' && (
                                            <div className="text-[11px] text-red-400 flex items-center gap-2">
                                                <XCircle className="w-3.5 h-3.5" />
                                                <span>STOP USE → Call Helpline: <span className="font-mono font-bold">1800-XXX-XXXX</span></span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Filter Recommendations */}
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <ShoppingBag className="w-5 h-5 text-blue-400" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recommended Filters</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {FILTER_RECOMMENDATIONS.map((filter, i) => (
                                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer group">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-sm font-bold text-white">{filter.name}</div>
                                        <span className="text-[8px] font-black px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 uppercase">{filter.badge}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[11px] text-gray-400">
                                        <span className="font-bold text-emerald-400">{filter.price}</span>
                                        <span>⭐ {filter.rating}</span>
                                        <span className="text-cyan-400">{filter.reduction} removal</span>
                                    </div>
                                    <div className="mt-2 text-[10px] text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                        Buy Now <ChevronRight className="w-3 h-3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ===================== WEEKLY TAB ===================== */}
            {activeTab === 'weekly' && (
                <div className="space-y-6">
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Weekly Exposure Trend</h3>
                                <p className="text-[11px] text-gray-500 mt-1">Your family's average plastic exposure over 7 days</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-black text-white">{avgExposure}<span className="text-xs text-gray-500">μg/L avg</span></div>
                                <div className="text-[10px] text-emerald-400 font-bold">↓ 18% vs last week</div>
                            </div>
                        </div>
                        <div className="flex items-end gap-3 h-40">
                            {WEEKLY_DATA.map((d, i) => {
                                const height = (d.level / 5) * 100;
                                const riskColor = d.level <= 1 ? 'emerald' : d.level <= 3 ? 'yellow' : 'red';
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="text-[9px] font-bold text-gray-400">{d.level}</div>
                                        <div className="w-full rounded-t-lg transition-all duration-500" style={{ height: `${Math.max(height, 8)}%` }}>
                                            <div className={`w-full h-full rounded-t-lg ${riskColor === 'emerald' ? 'bg-gradient-to-t from-emerald-600 to-emerald-400' :
                                                    riskColor === 'yellow' ? 'bg-gradient-to-t from-yellow-600 to-yellow-400' :
                                                        'bg-gradient-to-t from-red-600 to-red-400'
                                                }`} />
                                        </div>
                                        <div className="text-[10px] text-gray-500 font-bold">{d.day}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-6 text-[10px]">
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-emerald-500" /> {'Safe (<1μg)'}</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-yellow-500" /> Watch (1-3μg)</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-red-500" /> {'Danger (>3μg)'}</div>
                        </div>
                    </div>

                    <div className="glass-card p-6 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/20">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            📊 Weekly Family Report
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                <span className="text-[11px] text-gray-400">Total Family Exposure</span>
                                <span className="text-sm font-black text-white">{avgExposure} μg/L avg</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                <span className="text-[11px] text-gray-400">Safest Day</span>
                                <span className="text-sm font-black text-emerald-400">Saturday (0.9 μg/L) 🟢</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                <span className="text-[11px] text-gray-400">Most Contaminated</span>
                                <span className="text-sm font-black text-red-400">Wednesday (3.4 μg/L) 🔴</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                <span className="text-[11px] text-gray-400">Weekly Improvement</span>
                                <span className="text-sm font-black text-emerald-400">↓ 18% better</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <span className="text-[11px] text-emerald-400 font-bold">🛡️ Family safer by {morningScore}% this month</span>
                                <span className="text-[10px] text-gray-500">vs avg Indian household</span>
                            </div>
                        </div>
                    </div>

                    {/* News in Weekly Tab */}
                    <WaterNewsWidget compact={true} maxItems={3} />
                </div>
            )}

            {/* ===================== GAMIFY TAB ===================== */}
            {activeTab === 'gamify' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="glass-card p-4 text-center border-orange-500/20 bg-orange-500/5">
                            <Flame className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                            <div className="text-2xl font-black text-white">{streak} <span className="text-xs">days</span></div>
                            <div className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">🔥 Streak</div>
                        </div>
                        <div className="glass-card p-4 text-center border-blue-500/20 bg-blue-500/5">
                            <Droplets className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                            <div className="text-2xl font-black text-white">{totalScans}</div>
                            <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Tests Done</div>
                        </div>
                        <div className="glass-card p-4 text-center border-emerald-500/20 bg-emerald-500/5">
                            <Shield className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                            <div className="text-2xl font-black text-white">{memberData.length}</div>
                            <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Protected</div>
                        </div>
                        <div className="glass-card p-4 text-center border-purple-500/20 bg-purple-500/5">
                            <Trophy className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                            <div className="text-2xl font-black text-white">#{rank}</div>
                            <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Area Rank</div>
                        </div>
                    </div>

                    <div className="glass-card p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Eco Points</div>
                                <div className="text-3xl font-black text-white">{points} <span className="text-xs text-purple-400">pts</span></div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Level</div>
                                <div className="text-3xl font-black text-purple-400">{Math.floor(points / 100) + 1}</div>
                            </div>
                        </div>
                        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all" style={{ width: `${(points % 100)}%` }} />
                        </div>
                        <div className="flex justify-between mt-1 text-[10px] text-gray-500">
                            <span>Level {Math.floor(points / 100) + 1}</span>
                            <span>{points % 100}/100 pts to Level {Math.floor(points / 100) + 2}</span>
                        </div>
                    </div>

                    <div className="glass-card p-5">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400" /> Daily Challenges
                        </h3>
                        <div className="space-y-3">
                            {[
                                { task: 'Test 1 new water source today', points: 10, done: true },
                                { task: 'Share your area report with a neighbor', points: 20, done: false },
                                { task: 'Complete your family safety check', points: 15, done: false },
                                { task: 'Set a morning water test reminder', points: 5, done: reminderSet },
                            ].map((ch, i) => (
                                <div key={i} className={`flex items-center justify-between p-3 rounded-xl transition-all ${ch.done ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5 border border-white/10 hover:border-blue-500/30'}`}>
                                    <div className="flex items-center gap-3">
                                        {ch.done ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-600" />}
                                        <span className={`text-[12px] ${ch.done ? 'text-emerald-400 line-through' : 'text-white'}`}>{ch.task}</span>
                                    </div>
                                    <span className={`text-[10px] font-black ${ch.done ? 'text-emerald-400' : 'text-purple-400'}`}>+{ch.points} pts</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-5">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Earned Badges</h3>
                        <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
                            {[
                                { emoji: '🏅', name: 'Water Protector', unlocked: true },
                                { emoji: '🌍', name: 'Eco Hero', unlocked: true },
                                { emoji: '🔥', name: '7-Day Streak', unlocked: true },
                                { emoji: '🔬', name: 'Lab Expert', unlocked: false },
                                { emoji: '♻️', name: 'Zero Plastic', unlocked: false },
                            ].map((badge, i) => (
                                <div key={i} className={`flex flex-col items-center p-3 rounded-xl text-center transition-all ${badge.unlocked ? 'bg-white/5 border border-white/10' : 'bg-white/5 border border-white/5 grayscale opacity-40'}`}>
                                    <div className="text-3xl mb-1">{badge.emoji}</div>
                                    <div className="text-[9px] font-bold text-gray-400 leading-tight">{badge.name}</div>
                                    {!badge.unlocked && <div className="text-[8px] text-gray-600 mt-1">🔒 Locked</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
