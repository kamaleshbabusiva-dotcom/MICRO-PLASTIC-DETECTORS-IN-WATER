import React from 'react';
import { useMusic } from '../context/MusicContext';
import { Play, Pause, Activity, Clock, Waves, Disc, ListChecks, Radio } from 'lucide-react';

const MusicPage = () => {
    const { playlist, currentTrack, isPlaying, selectTrack, togglePlay } = useMusic();

    const categories = [
        { name: 'Structural Integrity', icon: '🏗️', count: 12 },
        { name: 'Fluid Velocity', icon: '🌊', count: 8 },
        { name: 'Turbine Diagnostics', icon: '⚙️', count: 15 },
        { name: 'Depth Sonar', icon: '📡', count: 10 },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                        <Waves className="w-8 h-8 text-cyan-400" /> Acoustic Parameter Analytics
                    </h1>
                    <p className="text-gray-400 mt-1">Real-time spectral analysis of hydro-mechanical vibrations</p>
                </div>
            </div>

            {/* Featured Playlist */}
            <div className="relative h-64 rounded-3xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 group-hover:scale-105 transition-transform duration-700" />
                <img
                    src="/water_sonar_analytics_thumbnail_1772894352895.png"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
                    alt="Featured Analytics"
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <Disc className="w-5 h-5 animate-spin-slow" />
                        <span className="text-sm font-bold tracking-widest uppercase">Live Hydro-Acoustic Feed</span>
                    </div>
                    <h2 className="font-display text-4xl font-black mb-4">Deep Reservoir Resonance AH-92</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={togglePlay}
                            className="px-8 py-3 rounded-xl bg-cyan-500 text-white font-bold hover:bg-cyan-400 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                        >
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Radio className="w-5 h-5 animate-pulse" />}
                            {isPlaying ? 'Stop Analysis' : 'Start Signal Acquisition'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((cat, i) => (
                    <div key={i} className="glass-card-hover p-6 flex flex-col gap-3 group cursor-pointer">
                        <span className="text-4xl group-hover:scale-125 transition-transform duration-500 w-fit">{cat.icon}</span>
                        <div>
                            <h3 className="font-bold text-white">{cat.name}</h3>
                            <p className="text-xs text-gray-500">{cat.count} tracks</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Track List */}
            <div className="glass-card overflow-hidden">
                <div className="px-6 py-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-display font-bold text-white flex items-center gap-2">
                        <ListChecks className="w-5 h-5 text-cyan-400" /> Signal Parameter Analytics
                    </h3>
                    <span className="text-xs text-gray-500 tracking-wider font-bold">8 ACTIVE FILTERS • REAL-TIME SPECTRA</span>
                </div>

                <div className="divide-y divide-white/5">
                    {playlist.map((track, i) => {
                        const isCurrent = currentTrack.id === track.id;
                        return (
                            <div
                                key={track.id}
                                onClick={() => selectTrack(track)}
                                className={`flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-all group cursor-pointer ${isCurrent ? 'bg-white/5' : ''}`}
                            >
                                <div className="w-6 text-sm text-gray-600 text-center">
                                    {isCurrent && isPlaying ? <div className="flex items-center gap-0.5 justify-center"><div className="w-0.5 h-3 bg-blue-400 animate-pulse"></div><div className="w-0.5 h-4 bg-blue-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div><div className="w-0.5 h-2 bg-blue-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div></div> : i + 1}
                                </div>

                                <div className="w-10 h-10 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                    <Activity className="w-4 h-4 text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className={`text-sm font-bold truncate ${isCurrent ? 'text-blue-400' : 'text-white'}`}>
                                        {track.title}
                                    </div>
                                    <div className="text-xs text-gray-500">{track.artist}</div>
                                </div>

                                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-[10px] text-gray-400">
                                    <Clock className="w-3 h-3" /> {track.duration}
                                </div>

                                <div className="hidden lg:block w-32 text-center">
                                    <span className="text-[10px] font-bold tracking-widest text-gray-600 border border-white/10 px-2 py-1 rounded">
                                        FREQ: {track.bpm} Hz
                                    </span>
                                </div>

                                <button className={`p-2 rounded-full transition-all ${isCurrent && isPlaying ? 'bg-blue-500 text-white shadow-neon' : 'bg-white/5 text-gray-400 opacity-0 group-hover:opacity-100'}`}>
                                    {isCurrent && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MusicPage;
