import React from 'react';
import { useMusic } from '../context/MusicContext';
import { Play, Pause, SkipForward, SkipBack, Volume2, List, Activity, Waves } from 'lucide-react';

const MusicPlayer = () => {
    const {
        currentTrack,
        isPlaying,
        progress,
        togglePlay,
        nextTrack,
        prevTrack,
        showPlayer
    } = useMusic();

    if (!showPlayer) return null;

    return (
        <div className="music-bar px-4 md:px-8 py-3 flex items-center justify-between shadow-glass animate-slide-up">
            {/* Signal Info */}
            <div className="flex items-center gap-4 w-1/4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 animate-glow shadow-lg shadow-cyan-500/20">
                    <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="hidden md:block overflow-hidden">
                    <div className="text-sm font-bold text-white truncate">{currentTrack.title}</div>
                    <div className="text-xs text-gray-400 truncate tracking-widest uppercase text-[10px]">{currentTrack.artist}</div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">
                <div className="flex items-center gap-6">
                    <button
                        onClick={prevTrack}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <SkipBack className="w-5 h-5" />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                    >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
                    </button>

                    <button
                        onClick={nextTrack}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <SkipForward className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full flex items-center gap-3">
                    <span className="text-[10px] text-gray-500 w-8 text-right">0:45</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/10 relative overflow-hidden group cursor-pointer">
                        <div
                            className="absolute left-0 top-0 bottom-0 bg-blue-500 transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="text-[10px] text-gray-500 w-8">{currentTrack.duration}</span>
                </div>
            </div>

            {/* Volume / List */}
            <div className="flex items-center justify-end gap-4 w-1/4">
                <div className="hidden md:flex items-center gap-2 group">
                    <Volume2 className="w-4 h-4 text-gray-400 group-hover:text-white" />
                    <div className="w-20 h-1 rounded-full bg-white/10 relative">
                        <div className="absolute left-0 top-0 bottom-0 bg-white/60 w-3/4 rounded-full" />
                    </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
                    <List className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default MusicPlayer;
