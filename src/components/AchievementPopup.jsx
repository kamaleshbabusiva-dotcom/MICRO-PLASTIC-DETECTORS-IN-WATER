import { useState, useEffect } from 'react'
import { X, Star, Flame, Trophy } from 'lucide-react'

export default function AchievementPopup({ achievement, onClose }) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        setTimeout(() => setShow(true), 100)
        const timer = setTimeout(() => {
            setShow(false)
            setTimeout(onClose, 300)
        }, 4000)
        return () => clearTimeout(timer)
    }, [])

    if (!achievement) return null

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative glass-card p-8 max-w-sm w-full text-center transition-all duration-500 ${show ? 'scale-100 translate-y-0' : 'scale-75 translate-y-10'}`}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>

                {/* Confetti effect */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 rounded-full animate-bounce"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'][i % 5],
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${1 + Math.random() * 2}s`,
                                opacity: 0.7,
                            }}
                        />
                    ))}
                </div>

                <div className="relative">
                    <div className="text-6xl mb-4 animate-bounce-in">{achievement.icon}</div>
                    <h3 className="font-display text-2xl font-bold text-white mb-2">Achievement Unlocked!</h3>
                    <h4 className="font-display text-xl gradient-text-gold font-bold mb-2">{achievement.title}</h4>
                    <p className="text-gray-400 mb-6">{achievement.description}</p>

                    <div className="flex items-center justify-center gap-2 text-amber-400">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="font-bold">+50 Bonus Points</span>
                        <Star className="w-5 h-5 fill-current" />
                    </div>
                </div>
            </div>
        </div>
    )
}
