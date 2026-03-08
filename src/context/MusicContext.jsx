import { createContext, useContext, useState, useRef, useEffect } from 'react'

const MusicContext = createContext({})

export const useMusic = () => useContext(MusicContext)

const playlist = [
    { id: 1, title: 'Deep Reservoir Resonance', artist: 'Sonar Buoy AH-92', duration: '4:12', bpm: 24, genre: 'Infrasonic' },
    { id: 2, title: 'Turbine Vibration Harmonic', artist: 'HPP Station Delta', duration: '5:04', bpm: 360, genre: 'Mechanical' },
    { id: 3, title: 'Filter Backwash Sequence', artist: 'Purification Unit 7', duration: '3:22', bpm: 1200, genre: 'Fluid Dynamics' },
    { id: 4, title: 'Silt Displacement Hum', artist: 'Riverbed Depth Sensor', duration: '6:15', bpm: 12, genre: 'Sediment' },
    { id: 5, title: 'Pipe Cavitation Profile', artist: 'Main Intake A14', duration: '2:45', bpm: 5200, genre: 'Anomaly' },
    { id: 6, title: 'Hydroelectric Pulse', artist: 'Dam Gate 4 Control', duration: '3:58', bpm: 60, genre: 'Induction' },
    { id: 7, title: 'Aquifer Flow Texture', artist: 'Borewell Node Beta', duration: '7:30', bpm: 5, genre: 'Subterranean' },
    { id: 8, title: 'Micro-Particulate Scour', artist: 'Spectro-Acoustic Unit', duration: '3:10', bpm: 14500, genre: 'Ultrasonic' },
]

export const MusicProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(playlist[0])
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [volume, setVolume] = useState(0.7)
    const [showPlayer, setShowPlayer] = useState(false)
    const intervalRef = useRef(null)

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        nextTrack()
                        return 0
                    }
                    return prev + 0.5
                })
            }, 1000)
        } else {
            clearInterval(intervalRef.current)
        }
        return () => clearInterval(intervalRef.current)
    }, [isPlaying, currentTrack])

    const togglePlay = () => {
        setIsPlaying(!isPlaying)
        setShowPlayer(true)
    }

    const nextTrack = () => {
        const idx = playlist.findIndex(t => t.id === currentTrack.id)
        setCurrentTrack(playlist[(idx + 1) % playlist.length])
        setProgress(0)
    }

    const prevTrack = () => {
        const idx = playlist.findIndex(t => t.id === currentTrack.id)
        setCurrentTrack(playlist[(idx - 1 + playlist.length) % playlist.length])
        setProgress(0)
    }

    const selectTrack = (track) => {
        setCurrentTrack(track)
        setProgress(0)
        setIsPlaying(true)
        setShowPlayer(true)
    }

    return (
        <MusicContext.Provider value={{
            currentTrack, isPlaying, progress, volume, playlist, showPlayer,
            togglePlay, nextTrack, prevTrack, selectTrack, setVolume, setShowPlayer, setProgress
        }}>
            {children}
        </MusicContext.Provider>
    )
}
