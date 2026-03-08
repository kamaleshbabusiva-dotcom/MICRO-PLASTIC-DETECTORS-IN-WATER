import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DailyBarChart, WeeklyLineChart, MonthlyAreaChart } from '../components/StepChart';
import { stepHistory, achievements } from '../data/mockData';
import { Activity, Waves, TrendingUp, Calendar, Target, Award, Info, Droplets, FlaskConical } from 'lucide-react';

const StatsPage = () => {
    const { profile } = useAuth();
    const [timeRange, setTimeRange] = useState('weekly');

    const dailyGoal = 95; // Purity Target %

    const stats = [
        { label: 'Avg. Daily Purity', value: '94.2%', change: '+1.4%', positive: true },
        { label: 'Detection Accuracy', value: '99.8%', change: '+0.2%', positive: true },
        { label: 'Microplastics Filtered', value: '1,245k', change: '+15%', positive: true },
        { label: 'Chemical Stability', value: 'High', change: 'Stable', positive: true },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                        <Activity className="w-8 h-8 text-blue-400" /> Purity Analytics
                    </h1>
                    <p className="text-gray-400 mt-1">Detailed breakdown of water quality trends and contamination alerts</p>
                </div>

                <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 shadow-inner">
                    {['daily', 'weekly', 'monthly'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${timeRange === range
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-card p-5 border-white/5 hover:border-blue-500/20 transition-all group">
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2 group-hover:text-blue-400 transition-colors">{stat.label}</div>
                        <div className="flex items-end gap-3">
                            <div className="text-3xl font-black text-white">{stat.value}</div>
                            <div className={`text-[10px] font-black uppercase mb-1 ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                                {stat.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="glass-card p-6 border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-display font-bold text-white flex items-center gap-2">
                            <Waves className="w-5 h-5 text-blue-400" /> Weekly Purity Flux
                        </h3>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Purity %</span>
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white/10 border border-white/20"></span> Target</span>
                        </div>
                    </div>
                    <div className="h-80">
                        <WeeklyLineChart data={stepHistory} />
                    </div>
                </div>

                <div className="glass-card p-6 border-white/5">
                    <h3 className="font-display font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" /> Contamination Trend (30 Days)
                    </h3>
                    <div className="h-80">
                        <MonthlyAreaChart data={stepHistory} />
                    </div>
                </div>
            </div>

            {/* In-depth Analysis */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-6 border-white/5">
                    <h3 className="font-display font-bold text-white mb-6 flex items-center gap-2">
                        <FlaskConical className="w-5 h-5 text-indigo-400" /> Site Impact Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Analysis for <span className="text-white font-bold">{profile?.profession || 'Urban Reservoir'}</span> sites indicates a higher vulnerability to micro-fragment runoff during rainfall.
                            </p>
                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300">
                                <Info className="w-4 h-4 inline mr-2 -mt-0.5" />
                                <span className="font-medium">Protocol Tip:</span> Increase sensor sensitivity by 15% during high-turbidity cycles to capture smaller microplastic fibers.
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                                    <span>Stable Phase</span>
                                    <span>Incident Risk</span>
                                </div>
                                <div className="h-3 rounded-full bg-white/5 overflow-hidden flex border border-white/5">
                                    <div className="h-full bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.3)]" style={{ width: '82%' }}></div>
                                    <div className="h-full bg-red-400/80 shadow-[0_0_10px_rgba(248,113,113,0.3)]" style={{ width: '18%' }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="glass-card bg-blue-500/5 border-white/10 p-5 flex flex-col justify-between">
                            <div className="text-center">
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-3">Global Quality Index</div>
                                <div className="text-5xl font-black text-white tracking-tighter">Tier-1</div>
                                <div className="text-xs text-emerald-400 font-bold mt-3 px-4 py-1 rounded-full bg-emerald-400/10 inline-block">Region is in Top 5% Globally</div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-medium">Site Average</span>
                                <span className="text-blue-400 font-black">94.2%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 border-white/5">
                    <h3 className="font-display font-bold text-white mb-6 flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-400" /> Strategic Goals
                    </h3>
                    <div className="space-y-5">
                        {[
                            { label: 'Purity Target', value: 92, color: 'from-blue-500 to-cyan-500' },
                            { label: 'Detection Goal', value: 98, color: 'from-indigo-500 to-blue-500' },
                            { label: 'Reduction Target', value: 85, color: 'from-emerald-500 to-teal-500' }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-2.5">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-400 uppercase tracking-wider">{item.label}</span>
                                    <span className="text-white">{item.value}% Achieved</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-white/5 border border-white/5">
                                    <div
                                        className={`h-full bg-gradient-to-r ${item.color} rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]`}
                                        style={{ width: `${item.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsPage;
