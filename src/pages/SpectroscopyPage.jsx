import React, { useState } from 'react';
import { Database, Search, Filter, Fingerprint, Activity, Layers } from 'lucide-react';
import { spectroscopyDatabase } from '../data/mockData';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function SpectroscopyPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPolymer, setSelectedPolymer] = useState(spectroscopyDatabase[0]);

    const filteredData = spectroscopyDatabase.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Generate mock spectral curve for the selected polymer
    const generateCurve = () => {
        const labels = Array.from({ length: 60 }, (_, i) => 1600 + (i * 5)); // 1600nm to 1900nm
        const data = labels.map(wl => {
            const distance = Math.abs(wl - selectedPolymer.peakWavelength);
            // Simulate bell curve around peak
            return distance < 30 ? Math.exp(-(distance * distance) / 200) * 100 : Math.random() * 10 + 5;
        });

        return {
            labels,
            datasets: [{
                label: `Absorption Spectrum: ${selectedPolymer.id}`,
                data,
                borderColor: '#8b5cf6', // violet
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
            }]
        };
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false }
        },
        scales: {
            x: { title: { display: true, text: 'Wavelength (nm)', color: '#94a3b8' }, grid: { display: false }, ticks: { color: '#64748b' } },
            y: { title: { display: true, text: 'Absorption %', color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' }, max: 110, ticks: { color: '#64748b' } }
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                        <Database className="w-8 h-8 text-violet-400" /> Spectroscopy AI Database
                    </h1>
                    <p className="text-gray-400 mt-1">Reference library of microplastic spectral signatures used by our AI models</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Search & List */}
                <div className="glass-card p-6 flex flex-col max-h-[600px]">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search polymers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                        {filteredData.map(polymer => (
                            <button
                                key={polymer.id}
                                onClick={() => setSelectedPolymer(polymer)}
                                className={`w-full text-left p-3 rounded-xl border transition-all ${selectedPolymer.id === polymer.id
                                        ? 'bg-violet-500/20 border-violet-500/50 scale-105'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-white">{polymer.id}</span>
                                    <span className="text-[10px] uppercase font-bold text-violet-400">{polymer.peakWavelength} nm</span>
                                </div>
                                <div className="text-xs text-gray-400 truncate">{polymer.name}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Details & Chart */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-6">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                                    <Fingerprint className="w-6 h-6 text-violet-400" /> {selectedPolymer.name} ({selectedPolymer.id})
                                </h2>
                                <p className="text-gray-400 mt-1 text-sm">Common sources: {selectedPolymer.origin}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${selectedPolymer.riskLevel === 'High' || selectedPolymer.riskLevel === 'Critical'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-orange-500/20 text-orange-400'
                                }`}>
                                Risk: {selectedPolymer.riskLevel}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold mb-1">
                                    <Activity className="w-4 h-4 text-emerald-400" /> Match Confidence
                                </div>
                                <div className="text-2xl font-bold text-white">{selectedPolymer.matchConfidence}%</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold mb-1">
                                    <Layers className="w-4 h-4 text-blue-400" /> Peak Wavelength
                                </div>
                                <div className="text-2xl font-bold text-white text-blue-400">{selectedPolymer.peakWavelength} <span className="text-sm">nm</span></div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-white mb-4">Spectral Absorption Model</h3>
                            <div className="h-64">
                                <Line data={generateCurve()} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
