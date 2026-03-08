import React from 'react';
import { MessageSquare, ScanLine, Trophy, Users, TrendingUp, Zap, Droplets } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SocialStats = () => {
    const { userRole } = useAuth();
    const stats = userRole === 'admin' ? [
        { label: 'Chat Messages', value: '1.2K', icon: MessageSquare, color: 'text-blue-400' },
        { label: 'Site Analysis', value: '450', icon: ScanLine, color: 'text-purple-400' },
        { label: 'Admin Challenges', value: '12', icon: Trophy, color: 'text-orange-400' },
        { label: 'Inspector Credits', value: '3.5K', icon: Zap, color: 'text-yellow-400' },
    ] : [
        { label: 'Hub Messages', value: '840', icon: MessageSquare, color: 'text-blue-400' },
        { label: 'Water Scans', value: '124', icon: Droplets, color: 'text-cyan-400' },
        { label: 'Echo Challenges', value: '8', icon: Trophy, color: 'text-emerald-400' },
        { label: 'Citizen Credits', value: '1.2K', icon: Zap, color: 'text-amber-400' },
    ];

    const engagement = userRole === 'admin' ? [
        { label: 'Protocol Part.', value: '85%', color: 'bg-emerald-500' },
        { label: 'Regional Feed', value: '92%', color: 'bg-blue-500' },
        { label: 'Site Safety', value: '98%', color: 'bg-purple-500' },
    ] : [
        { label: 'Group Goals', value: '72%', color: 'bg-emerald-500' },
        { label: 'Neighbourhood Chat', value: '88%', color: 'bg-blue-500' },
        { label: 'Scan Accuracy', value: '94%', color: 'bg-cyan-500' },
    ];

    return (
        <div className="grid lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, i) => (
                <div key={i} className="glass-card p-4 flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-white">{stat.value}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</div>
                    </div>
                </div>
            ))}

            <div className="glass-card p-4 lg:col-span-4 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-white uppercase tracking-widest">Live Social Engagement</span>
                </div>
                <div className="flex-1 flex gap-8 w-full md:w-auto">
                    {engagement.map((item, i) => (
                        <div key={i} className="flex-1 space-y-1.5">
                            <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold">
                                <span>{item.label}</span>
                                <span className="text-white">{item.value}</span>
                            </div>
                            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                <div
                                    className={`h-full ${item.color} transition-all duration-1000`}
                                    style={{ width: item.value }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SocialStats;
