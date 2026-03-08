import { useState, useRef, useEffect } from 'react'
import { AlertTriangle, Phone } from 'lucide-react'

export default function SOSButton({ phone, contactName }) {
    const [isHolding, setIsHolding] = useState(false)
    const [progress, setProgress] = useState(0)
    const [activated, setActivated] = useState(false)
    const holdTimer = useRef(null)
    const progressInterval = useRef(null)

    const startHold = () => {
        setIsHolding(true)
        setProgress(0)

        progressInterval.current = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval.current)
                    setActivated(true)
                    // Trigger call
                    window.open(`tel:${phone}`, '_self')
                    return 100
                }
                return prev + 4
            })
        }, 50)
    }

    const endHold = () => {
        setIsHolding(false)
        setProgress(0)
        clearInterval(progressInterval.current)
    }

    const reset = () => {
        setActivated(false)
        setProgress(0)
        setIsHolding(false)
    }

    if (activated) {
        return (
            <div className="text-center animate-scale-in">
                <div className="w-32 h-32 rounded-full bg-red-500 flex items-center justify-center mx-auto shadow-lg shadow-red-500/50 animate-pulse">
                    <Phone className="w-12 h-12 text-white" />
                </div>
                <p className="text-red-400 font-bold mt-4">📞 Calling {contactName}...</p>
                <p className="text-gray-500 text-sm mt-1">Emergency SOS activated</p>
                <button onClick={reset} className="mt-4 text-sm text-gray-500 hover:text-white transition-colors">
                    Cancel
                </button>
            </div>
        )
    }

    return (
        <div className="relative">
            {/* Pulse rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-36 h-36 rounded-full border-2 border-red-500/20 animate-ping" style={{ animationDuration: '2s' }} />
                <div className="absolute w-44 h-44 rounded-full border border-red-500/10 animate-ping" style={{ animationDuration: '3s' }} />
            </div>

            <button
                onMouseDown={startHold}
                onMouseUp={endHold}
                onMouseLeave={endHold}
                onTouchStart={startHold}
                onTouchEnd={endHold}
                className="relative w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 sos-pulse"
                style={{
                    boxShadow: isHolding
                        ? `0 0 ${progress}px rgba(239, 68, 68, ${progress / 100})`
                        : '0 0 20px rgba(239, 68, 68, 0.4)',
                }}
            >
                {/* Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
                    <circle
                        cx="64" cy="64" r="60"
                        fill="none"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="4"
                        strokeDasharray={`${2 * Math.PI * 60}`}
                        strokeDashoffset={`${2 * Math.PI * 60 * (1 - progress / 100)}`}
                        strokeLinecap="round"
                    />
                </svg>

                <div className="text-center z-10">
                    <AlertTriangle className="w-10 h-10 text-white mx-auto" />
                    <span className="text-xs text-white/80 font-bold mt-1 block">
                        {isHolding ? `${Math.round(progress)}%` : 'HOLD'}
                    </span>
                </div>
            </button>
        </div>
    )
}
