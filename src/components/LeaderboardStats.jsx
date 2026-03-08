import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Users, Globe, Zap, TrendingUp, Crown, Target, Award } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const LeaderboardStats = () => {
    const data = {
        labels: ['Emerald', 'Platinum', 'Gold', 'Silver', 'Bronze'],
        datasets: [
            {
                label: 'Users in Zone',
                data: [10, 18, 35, 52, 145],
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
                    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
                    return gradient;
                },
                borderColor: '#3b82f6',
                borderWidth: 2,
                borderRadius: 12,
                hoverBackgroundColor: '#60a5fa',
                barPercentage: 0.6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                titleFont: { size: 14, weight: 'bold' },
                padding: 12,
                cornerRadius: 12,
                displayColors: false,
                callbacks: {
                    label: (context) => `${context.raw} active warriors`,
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.03)', drawBorder: false },
                ticks: { color: '#64748b', font: { size: 10 } },
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8', font: { weight: '600' } },
            },
        },
    };

    const globalStats = [
        { label: 'Steps Today', value: '1.2M', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Active Users', value: '250', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Calories Burnt', value: '45K', icon: Zap, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        { label: 'Avg Steps', value: '4.8K', icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    ];

    return (
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
            {/* Chart Area */}
            <div className="lg:col-span-2 glass-card p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                    <TrendingUp className="w-32 h-32 text-blue-500" />
                </div>
                <h3 className="font-display font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" /> Zone Distribution
                </h3>
                <div className="h-48">
                    <Bar data={data} options={options} />
                </div>
            </div>

            {/* Daily MVP */}
            <div className="glass-card p-6 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 mt-[-10px] mr-[-10px]">
                    <Crown className="w-16 h-16 text-amber-500 opacity-10 rotate-12" />
                </div>
                <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" /> Daily MVP
                </h3>
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="MVP" className="w-12 h-12 rounded-full border-2 border-amber-400" />
                        <div className="absolute -bottom-1 -right-1 bg-amber-400 rounded-full p-1">
                            <Zap className="w-2 h-2 text-black fill-black" />
                        </div>
                    </div>
                    <div>
                        <div className="text-white font-bold">Felix Chen</div>
                        <div className="text-xs text-amber-400/70">Elite Emerald</div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Steps Today</span>
                        <span className="text-white font-mono font-bold">24,502</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 w-[95%] animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-2">
                        <TrendingUp className="w-3 h-3" />
                        <span>Breaking personal record!</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {globalStats.map((stat, i) => (
                    <div key={i} className="glass-card p-4 flex flex-col justify-between group hover:border-white/20 transition-all">
                        <div className={`p-2 rounded-lg ${stat.bg} w-fit mb-2 group-hover:scale-110 transition-transform`}>
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-white tracking-tight">{stat.value}</div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeaderboardStats;
