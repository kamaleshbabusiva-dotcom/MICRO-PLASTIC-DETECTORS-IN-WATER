import { useEffect, useRef, useState } from 'react'
import * as maptilersdk from '@maptiler/sdk'
import "@maptiler/sdk/dist/maptiler-sdk.css"
import { Navigation, Layers, Crosshair, Compass } from 'lucide-react'

const MAP_CENTER = [77.5946, 12.9716] // [lng, lat] for Bangalore, KA

const LOCATION_PINS = [
    { lng: 77.6243, lat: 12.9352, label: 'Office – TechCorp HQ', color: '#f59e0b' },
    { lng: 77.6408, lat: 12.9784, label: 'Home', color: '#a78bfa' },
    { lng: 77.6146, lat: 12.9344, label: 'Gym – FitZone', color: '#ec4899' },
]

export default function LocationMap() {
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [mapLoaded, setMapLoaded] = useState(false)
    const [isSatellite, setIsSatellite] = useState(false)

    useEffect(() => {
        if (map.current) return // stops map from initializing more than once

        maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY || ''

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.STREETS.DARK,
            center: MAP_CENTER,
            zoom: 12,
            navigationControl: false,
            geolocateControl: false,
            terrainControl: false,
            fullscreenControl: false,
        })

        map.current.on('load', () => {
            setMapLoaded(true)

            // Add user marker
            new maptilersdk.Marker({
                color: "#3b82f6",
                scale: 1.2
            })
                .setLngLat(MAP_CENTER)
                .setPopup(new maptilersdk.Popup({ offset: 25 }).setHTML('<h3>You are here</h3>'))
                .addTo(map.current)

            // Add favorite pins
            LOCATION_PINS.forEach(pin => {
                new maptilersdk.Marker({
                    color: pin.color,
                    scale: 0.8
                })
                    .setLngLat([pin.lng, pin.lat])
                    .setPopup(new maptilersdk.Popup({ offset: 25 }).setHTML(`<h3>${pin.label}</h3>`))
                    .addTo(map.current)
            })
        })

        return () => {
            if (map.current) {
                map.current.remove()
                map.current = null
            }
        }
    }, [])

    const toggleSatellite = () => {
        if (!map.current) return
        const newStyle = isSatellite ? maptilersdk.MapStyle.STREETS.DARK : maptilersdk.MapStyle.SATELLITE
        map.current.setStyle(newStyle)
        setIsSatellite(!isSatellite)
    }

    const recenter = () => {
        if (!map.current) return
        map.current.flyTo({
            center: MAP_CENTER,
            zoom: 12,
            essential: true
        })
    }

    const zoomIn = () => map.current?.zoomIn()
    const zoomOut = () => map.current?.zoomOut()

    return (
        <div className="relative w-full h-96 rounded-3xl overflow-hidden border border-white/5 shadow-2xl group select-none">
            {/* Map Container */}
            <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

            {/* Overlay HUD */}
            <div className="absolute inset-0 pointer-events-none z-10 p-4 flex flex-col justify-between">
                {/* Top HUD */}
                <div className="flex items-center justify-between pointer-events-auto">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600/90 border border-blue-500/40 text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-xl shadow-lg shadow-blue-500/20">
                        <Navigation className="w-3.5 h-3.5 animate-pulse" /> Live Satellite Tracking
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={toggleSatellite}
                            className={`p-2.5 rounded-2xl border border-white/10 transition-all backdrop-blur-md shadow-lg ${isSatellite ? 'bg-blue-600/50 text-white' : 'bg-black/60 text-gray-300'}`}
                            title="Toggle Layers"
                        >
                            <Layers className="w-4 h-4" />
                        </button>
                        <button
                            onClick={recenter}
                            className="p-2.5 rounded-2xl bg-black/60 border border-white/10 text-gray-300 hover:text-white transition-all backdrop-blur-md shadow-lg"
                            title="Recenter"
                        >
                            <Crosshair className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Bottom HUD */}
                <div className="flex items-end justify-between pointer-events-auto">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/70 border border-white/5 backdrop-blur-xl">
                        <Compass className="w-4 h-4 text-gray-400" />
                        <div>
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Coordinates</span>
                            <span className="text-[10px] font-mono text-blue-400 font-bold">12.9716° N, 77.5946° E</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={zoomIn}
                            className="w-10 h-10 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all font-bold text-lg backdrop-blur-md"
                        >+</button>
                        <button
                            onClick={zoomOut}
                            className="w-10 h-10 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all font-bold text-lg backdrop-blur-md"
                        >-</button>
                    </div>
                </div>
            </div>

            {/* Loading Overlay */}
            {!mapLoaded && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-dark-950/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                        <p className="text-gray-400 text-sm font-medium">Initializing Tracker...</p>
                    </div>
                </div>
            )}
        </div>
    )
}
