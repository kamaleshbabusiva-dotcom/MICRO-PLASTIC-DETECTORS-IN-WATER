import { useEffect, useRef, useState } from 'react'
import * as maptilersdk from '@maptiler/sdk'
import "@maptiler/sdk/dist/maptiler-sdk.css"
import { Monitor } from 'lucide-react'

const MAP_CENTER = [77.5946, 12.9716] // [lng, lat] for Bangalore

const HOTSPOT_NODES = [
    { lng: 77.5946, lat: 12.9716, label: 'Main Reservoir Node', color: '#10b981', density: 'Low' },
    { lng: 77.6200, lat: 12.9500, label: 'Industrial Bypass A', color: '#ef4444', density: 'High' },
    { lng: 77.5800, lat: 13.0000, label: 'North Intake Node', color: '#f59e0b', density: 'Medium' },
]

export default function GeoNodesMap() {
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [mapLoaded, setMapLoaded] = useState(false)

    useEffect(() => {
        if (map.current) return

        maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY || 'get_your_own'

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.STREETS.DARK,
            center: MAP_CENTER,
            zoom: 10,
            navigationControl: false,
            geolocateControl: false,
        })

        map.current.on('load', () => {
            setMapLoaded(true)

            HOTSPOT_NODES.forEach(node => {
                const el = document.createElement('div');
                el.className = 'marker';
                el.style.width = '12px';
                el.style.height = '12px';
                el.style.backgroundColor = node.color;
                el.style.borderRadius = '50%';
                el.style.boxShadow = `0 0 15px ${node.color}`;
                el.style.cursor = 'pointer';
                el.classList.add('animate-pulse');

                new maptilersdk.Marker({ element: el })
                    .setLngLat([node.lng, node.lat])
                    .setPopup(new maptilersdk.Popup({ offset: 25 }).setHTML(`
                        <div style="background: #0B0F1A; color: white; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                            <h4 style="margin: 0; font-size: 12px; font-weight: bold; color: ${node.color};">${node.label}</h4>
                            <p style="margin: 5px 0 0; font-size: 10px; color: #9CA3AF;">Polymer Density: <strong>${node.density}</strong></p>
                        </div>
                    `))
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

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden group border border-white/10 shadow-2xl">
            {/* Map Container - Removed grayscale for colorful look */}
            <div ref={mapContainer} className="absolute inset-0 w-full h-full brightness-110 saturate-150" />

            {/* Map Overlay HUD - Colorful API Style */}
            <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600/90 border border-indigo-400/30 backdrop-blur-md shadow-lg shadow-indigo-500/20 pointer-events-auto">
                            <Monitor className="w-3.5 h-3.5 text-white animate-pulse" />
                            <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">API Geo-Node Grid</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            <span className="text-[8px] font-bold text-emerald-400 uppercase">Live Data Streams</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pointer-events-auto">
                    <div className="p-3 rounded-xl bg-black/60 border border-white/10 backdrop-blur-xl space-y-2 translate-y-0 group-hover:-translate-y-1 transition-transform">
                        <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest border-b border-white/5 pb-1 mb-2">Node Legend</div>
                        {[
                            { label: 'Secure', color: '#10b981' },
                            { label: 'Analyzing', color: '#3b82f6' },
                            { label: 'High Alert', color: '#ef4444' }
                        ].map(item => (
                            <div key={item.label} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 5px ${item.color}` }} />
                                <span className="text-[8px] font-bold text-gray-300 uppercase">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scanning Grid Overlay Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }} />

            {!mapLoaded && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-dark-950/80 backdrop-blur-md">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] animate-pulse">Initializing API Map...</div>
                    </div>
                </div>
            )}
        </div>
    )
}
