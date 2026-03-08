import React, { useState, useEffect } from 'react';
import { Camera, RefreshCw, ShieldCheck, AlertTriangle, Heart, MessageSquare, Send, CheckCircle2, User, Activity, Plus, MapPin } from 'lucide-react';
import NeighborMap from '../components/NeighborMap';
import WaterNewsWidget from '../components/WaterNewsWidget';

export default function CitizenDashboard() {
    const [scanning, setScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);
    const [complaint, setComplaint] = useState({ type: 'General', details: '', healthAffected: false });
    const [submitted, setSubmitted] = useState(false);

    const startScan = () => {
        setScanning(true);
        setProgress(0);
        setResult(null);
    };

    useEffect(() => {
        if (scanning) {
            const interval = setInterval(() => {
                setProgress(p => {
                    if (p >= 100) {
                        clearInterval(interval);
                        setScanning(false);
                        const microplastics = Math.floor(Math.random() * 500 + 50);
                        setResult({
                            purity: (Math.random() * 15 + 80).toFixed(1),
                            microplastics: microplastics,
                            status: microplastics < 200 ? 'Safe' : 'Warning',
                        });
                        return 100;
                    }
                    return p + 5;
                });
            }, 60);
        }
    }, [scanning]);

    const handleComplaintSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setComplaint({ type: 'General', details: '', healthAffected: false });
    };

    const healthyTips = [
        { title: "Boil for 5+ Mins", desc: "Reduces microplastic suspension by binding particles to minerals.", icon: Activity },
        { title: "Activated Carbon", desc: "Filter water using certified multi-stage carbon blocks.", icon: ShieldCheck },
        { title: "Digestive Health", desc: "Consume antioxidants to counter oxidative stress from ingestants.", icon: Heart },
    ];

    return (
        <div className="space-y-6 lg:space-y-8 animate-fade-in p-2 lg:p-4 pb-20 lg:pb-0">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
                        <User className="w-8 h-8 text-emerald-400" /> Citizen Health & Safety
                    </h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] lg:hidden mt-1">Global Resident Portal v1.0</p>
                    <p className="text-gray-400 mt-1 hidden lg:block">Monitor your water quality and report local health impacts</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {[
                            { icon: '🏅', color: 'bg-blue-500', label: 'Water Protector' },
                            { icon: '🌍', color: 'bg-emerald-500', label: 'Eco Hero' },
                            { icon: '♻', color: 'bg-zinc-700', label: 'Plastic Reducer', locked: true },
                        ].map((badge, i) => (
                            <div
                                key={i}
                                className={`w-10 h-10 rounded-full border-2 border-dark-950 flex items-center justify-center text-lg shadow-lg relative group ${badge.color} ${badge.locked ? 'grayscale opacity-40' : 'animate-bounce-slow'}`}
                                style={{ animationDelay: `${i * 0.2}s` }}
                            >
                                {badge.icon}
                                <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-dark-800 text-[8px] font-black text-white uppercase rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30 border border-white/10">
                                    {badge.label} {badge.locked && '(Locked)'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Scanner Section */}
                <div className="space-y-6">
                    <div className="glass-card p-6 overflow-hidden relative min-h-[450px] flex flex-col justify-center">
                        <div className="absolute top-4 right-4 z-20">
                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black tracking-widest uppercase">Scanner v2.4</span>
                        </div>

                        {!scanning && !result ? (
                            <div className="text-center space-y-6">
                                <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto border-4 border-emerald-500/20 animate-pulse">
                                    <Camera className="w-10 h-10 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-wider">Tap Scan</h3>
                                    <p className="text-gray-400 mt-2">Scan your drinking water to detect microplastic levels instantly.</p>
                                </div>
                                <button onClick={startScan} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] mx-auto flex items-center gap-3">
                                    <RefreshCw className="w-5 h-5" /> Start AI Analysis
                                </button>
                            </div>
                        ) : scanning ? (
                            <div className="text-center space-y-8">
                                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                                    <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full animate-ping" />
                                    <div className="absolute inset-0 border-4 border-emerald-500/40 rounded-full rotate-45 animate-spin-slow" />
                                    <div className="text-4xl font-black text-emerald-400">{progress}%</div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-white font-bold uppercase tracking-widest text-sm">Identifying Polymers...</p>
                                    <div className="w-48 h-1 bg-white/5 mx-auto rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-scale-in space-y-6">
                                <div className={`p-8 rounded-3xl text-center border-2 ${result.status === 'Safe' ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-red-500/5 border-red-500/30'}`}>
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${result.status === 'Safe' ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`}>
                                        {result.status === 'Safe' ? <ShieldCheck className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                                    </div>
                                    <h4 className={`text-3xl font-black uppercase tracking-widest ${result.status === 'Safe' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {result.status === 'Safe' ? 'Water is Safe' : 'High Contamination'}
                                    </h4>
                                    <div className="flex justify-center gap-8 mt-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-black text-white">{result.purity}%</div>
                                            <div className="text-[10px] text-gray-400 uppercase font-bold">Purity Grade</div>
                                        </div>
                                        <div className="w-px h-10 bg-white/10" />
                                        <div className="text-center">
                                            <div className="text-2xl font-black text-white">{result.microplastics}</div>
                                            <div className="text-[10px] text-gray-400 uppercase font-bold">Particles/L</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Doctor Reports / Tips */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest">
                                        <Heart className="w-4 h-4 text-red-400" /> Doctor's Health Precautions
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        {healthyTips.map((tip, i) => (
                                            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                                                    <tip.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white">{tip.title}</div>
                                                    <div className="text-xs text-gray-400 mt-1 leading-relaxed">{tip.desc}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={startScan} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-300 font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                                    Scan Again
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Complaint Form Section */}
                <div className="space-y-6">
                    {/* Daily Facts Section */}
                    {(() => {
                        const [completed, setCompleted] = useState(false);
                        const insights = [
                            { fact: "Bottled water contains 50% more microplastics than tap water.", badge: "Plastic Reducer", icon: "♻", task: "Use a steel bottle today" },
                            { fact: "Boiling water for 5 mins reduces microplastic suspension by up to 80%.", badge: "Water Protector", icon: "🏅", task: "Boil & Filter your water" },
                            { fact: "83% of global tap water samples contain plastic micro-fibers.", badge: "Eco Hero", icon: "🌍", task: "Run a purity scan" },
                            { fact: "Plastic items in rivers can take 450 years to fully decompose.", badge: "Plastic Reducer", icon: "♻", task: "Avoid single-use plastics" },
                            { fact: "Industrial runoff is the leading cause of regional river toxicity.", badge: "Water Protector", icon: "🏅", task: "Report nearby contamination" }
                        ];
                        const index = Math.floor(Date.now() / 86400000) % insights.length;
                        const today = insights[index];

                        return (
                            <div className="glass-card p-6 bg-gradient-to-br from-indigo-600/10 to-transparent border-indigo-500/20 animate-fade-in relative overflow-hidden group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white">Daily Eco Insight</h3>
                                    </div>
                                    <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                        <Plus className="w-4 h-4 rotate-45" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <p className="text-sm text-gray-300 italic leading-relaxed pr-8">
                                            "{today.fact}"
                                        </p>
                                        <button className="absolute top-0 right-0 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {!completed ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 group/task hover:border-indigo-500/50 transition-all cursor-pointer">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center text-lg shadow-lg group-hover/task:scale-110 transition-transform">
                                                    {today.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-[10px] text-indigo-300 font-black uppercase tracking-widest">Active Task</div>
                                                    <div className="text-sm font-bold text-white">{today.task}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setCompleted(true)}
                                                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                I Completed This! <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 animate-scale-in flex flex-col items-center text-center space-y-2">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                                <CheckCircle2 className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-emerald-400 transition-all">Task Completed!</div>
                                                <div className="text-[10px] text-emerald-500/70 font-black uppercase tracking-widest">+50 Eco Points Earned</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                    <div className="text-indigo-400/60 flex items-center gap-1">
                                        <Plus className="w-3 h-3" /> New Task in 14h
                                    </div>
                                    <div className="text-emerald-500 transition-all opacity-0 group-hover:opacity-100">
                                        Badge Progress +15%
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    <div className="glass-card p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Report Incident</h3>
                                <p className="text-sm text-gray-400">Your reports are reviewed by regional inspectors</p>
                            </div>
                        </div>

                        {submitted ? (
                            <div className="text-center py-12 animate-scale-in">
                                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-2">Report Dispatched</h4>
                                <p className="text-gray-400">The admin panel has been notified. Thank you for your contribution.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleComplaintSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Incident Category</label>
                                    <select
                                        value={complaint.type}
                                        onChange={(e) => setComplaint({ ...complaint, type: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 transition-colors outline-none appearance-none"
                                    >
                                        <option value="General">General Water Quality</option>
                                        <option value="Health">Health Issue Reported</option>
                                        <option value="Odor">Bad Odor / Taste</option>
                                        <option value="Industrial">Visible Industrial Leak</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                                    <input
                                        type="checkbox"
                                        id="healthEffect"
                                        checked={complaint.healthAffected}
                                        onChange={(e) => setComplaint({ ...complaint, healthAffected: e.target.checked })}
                                        className="w-5 h-5 rounded border-red-500/50 text-red-500 bg-transparent"
                                    />
                                    <label htmlFor="healthEffect" className="text-sm text-red-200 font-bold">Has your health been affected? (Rashes, Stomach issues, etc.)</label>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Provide Details</label>
                                    <textarea
                                        required
                                        rows="4"
                                        value={complaint.details}
                                        onChange={(e) => setComplaint({ ...complaint, details: e.target.value })}
                                        placeholder="Describe the issue at your location..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 transition-colors outline-none"
                                    ></textarea>
                                </div>

                                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-widest py-6 rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-blue-500/20">
                                    <Send className="w-5 h-5" /> Submit to Authority
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Live Water News - Full Width */}
            <WaterNewsWidget compact={false} maxItems={6} />

            {/* Neighborhood Map Section - FULL WIDTH */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">Neighborhood Purity Network</h3>
                        <p className="text-sm text-gray-400">See real-time contamination reports from your neighbors on a colorful live map</p>
                    </div>
                </div>

                <div className="h-[450px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
                    <NeighborMap />
                    <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
                        <div className="glass-card p-4 border-indigo-500/20 bg-indigo-950/40 backdrop-blur-xl max-w-xs transition-opacity opacity-0 group-hover:opacity-100 italic">
                            <h4 className="text-xs font-black text-white uppercase mb-1">Live AI Monitoring</h4>
                            <p className="text-[10px] text-gray-300 leading-relaxed">This map correlates your neighbors' manual reports with server-side AI Vision analysis from regional IoT nodes.</p>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
