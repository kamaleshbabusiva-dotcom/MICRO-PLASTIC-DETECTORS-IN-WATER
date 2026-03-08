import { Star, Flame, ChevronUp, ChevronDown, Minus, Award, TrendingUp, Zap } from 'lucide-react'

export default function LeaderboardCard({ user, rank, isCurrentUser, zone, promo, onClick }) {
    // Mock rank change for visual interest
    const rankChange = user.rankChange || (rank % 3 === 0 ? 2 : rank % 5 === 0 ? -1 : 0);

    return (
        <div
            onClick={onClick}
            className={`group grid grid-cols-12 gap-3 px-6 py-4 items-center transition-all cursor-pointer relative overflow-hidden
                ${isCurrentUser ? 'bg-blue-500/10 border-l-4 border-l-blue-500' : 'hover:bg-white/5'} 
                ${promo.isPromotion ? 'bg-emerald-500/5' : ''} 
                ${promo.isDemotion ? 'bg-red-500/5' : ''}
            `}
        >
            {/* Hover Glow Effect */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r ${zone.bg} pointer-events-none`} />

            {/* Rank & Change */}
            <div className="col-span-1 flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold relative z-10 ${rank <= 3
                    ? `bg-gradient-to-br ${zone.gradient} text-white shadow-lg`
                    : 'bg-white/10 text-gray-400'
                    }`}>
                    {rank}
                </div>
                {rankChange !== 0 && (
                    <div className={`text-[10px] font-bold flex items-center ${rankChange > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {rankChange > 0 ? <ChevronUp className="w-2 h-2" /> : <ChevronDown className="w-2 h-2" />}
                        {Math.abs(rankChange)}
                    </div>
                )}
            </div>

            {/* User Info */}
            <div className="col-span-4 flex items-center gap-3 relative z-10">
                <div className="relative">
                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-white/10 group-hover:border-white/30 transition-colors" />
                    {user.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0B0F1A] rounded-full animate-pulse" />
                    )}
                </div>
                <div>
                    <div className="text-sm font-medium text-white flex items-center gap-2">
                        {isCurrentUser && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                        {isCurrentUser ? 'You' : user.name}
                        {user.streak > 10 && <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" title="Hot Streak!" />}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                        {user.profession}
                        <span className="w-1 h-1 rounded-full bg-gray-700" />
                        <div className="flex gap-1 text-amber-500/50">
                            {user.achievements?.slice(0, 2).map((a, i) => (
                                <Award key={i} className="w-3 h-3" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Steps & Progress */}
            <div className="col-span-2 relative z-10">
                <div className="flex items-baseline gap-1">
                    <div className="text-sm font-bold text-white">{user.steps.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-500 font-medium">steps</div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 mt-1 overflow-hidden">
                    <div
                        className={`h-full rounded-full bg-gradient-to-r ${zone.gradient} relative`}
                        style={{ width: `${Math.min(100, (user.steps / 15000) * 100)}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                    </div>
                </div>
            </div>

            {/* Streak */}
            <div className="col-span-2 flex items-center gap-2 relative z-10">
                <div className="p-1.5 rounded-lg bg-orange-500/10">
                    <Flame className={`w-4 h-4 ${user.streak > 5 ? 'text-orange-500 animate-pulse' : 'text-orange-400/50'}`} />
                </div>
                <div>
                    <div className="text-sm font-bold text-gray-200">{user.streak}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-tighter">Day Streak</div>
                </div>
            </div>

            {/* Zone Badge */}
            <div className="col-span-1 relative z-10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-110 ${zone.bg} ${zone.border} border`}>
                    {zone.emoji}
                </div>
            </div>

            {/* Status */}
            <div className="col-span-2 relative z-10">
                <div className={`inline-flex flex-col px-3 py-1 rounded-xl text-xs font-bold ${promo.isPromotion
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : promo.isDemotion
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-white/5 text-gray-500 border border-white/10'
                    }`}>
                    <div className="flex items-center gap-1">
                        {promo.isPromotion && <TrendingUp className="w-3 h-3" />}
                        {promo.isDemotion && <ChevronDown className="w-3 h-3" />}
                        {!promo.isPromotion && !promo.isDemotion && <Minus className="w-3 h-3" />}
                        {promo.label}
                    </div>
                </div>
            </div>
        </div>
    )
}
