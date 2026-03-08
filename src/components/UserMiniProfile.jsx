import React from 'react';
import { X, Award, Flame, MapPin, Target, TrendingUp } from 'lucide-react';
import ProgressRing from './ProgressRing';

const UserMiniProfile = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative glass-card p-8 max-w-lg w-full animate-scale-in overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative">
                    <div className="relative">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-24 h-24 rounded-full border-4 border-blue-500/30"
                        />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-dark-900 border border-white/10 flex items-center justify-center text-sm shadow-lg">
                            {user.rank <= 10 ? '💎' : '🥇'}
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                        <p className="text-gray-400 text-sm">{user.profession}</p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                            <div className="flex items-center gap-1.5 text-orange-400">
                                <Flame className="w-4 h-4" />
                                <span className="text-sm font-bold">{user.streak} Days</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-blue-400">
                                <Award className="w-4 h-4" />
                                <span className="text-sm font-bold">12 Badges</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="glass-card bg-white/5 border-none p-4">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Average Steps</div>
                        <div className="text-xl font-bold text-white">8,432</div>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
                            <TrendingUp className="w-3 h-3" /> +12% this week
                        </div>
                    </div>
                    <div className="glass-card bg-white/5 border-none p-4">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Daily Goal</div>
                        <div className="text-xl font-bold text-white">7,000</div>
                        <div className="flex items-center gap-1 text-[10px] text-blue-400 mt-1">
                            <Target className="w-3 h-3" /> Consistent
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Favorite Locations</h4>
                    <div className="flex flex-wrap gap-2">
                        {['Cubbon Park', 'Office Terrace', 'Gym'].map((loc, i) => (
                            <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
                                <MapPin className="w-3 h-3 text-red-400" /> {loc}
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className="w-full btn-primary mt-8 py-3"
                    onClick={onClose}
                >
                    Close Profile
                </button>
            </div>
        </div>
    );
};

export default UserMiniProfile;
