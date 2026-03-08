import { useEffect, useRef, useState } from 'react'
import * as maptilersdk from '@maptiler/sdk'
import "@maptiler/sdk/dist/maptiler-sdk.css"
import { Users, Info, MapPin } from 'lucide-react'

// Center near the User's active node
const USER_LOCATION = [77.5946, 12.9716]

const NEIGHBOR_LOCATIONS = [
    { lng: 77.6000, lat: 12.9800, name: 'Aditi S.', report: 'Clear water, 82 Particles/L', status: 'Safe' },
    { lng: 77.5900, lat: 12.9600, name: 'Rahul V.', report: 'Murky color, 420 Particles/L', status: 'Warning' },
    { lng: 77.6100, lat: 12.9700, name: 'Priya K.', report: 'Odor detected, 210 Particles/L', status: 'Notice' },
]

export default function NeighborMap() {
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [mapLoaded, setMapLoaded] = useState(false)

    useEffect(() => {
        if (map.current) return

        maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY || 'get_your_own'

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.STREETS.DARK,
            center: USER_LOCATION,
            zoom: 13,
            navigationControl: false,
            geolocateControl: false,
        })

        map.current.on('load', () => {
            setMapLoaded(true)

            // User's Location
            const userEl = document.createElement('div');
            userEl.style.width = '20px';
            userEl.style.height = '20px';
            userEl.style.backgroundColor = '#3b82f6';
            userEl.style.borderRadius = '50%';
            userEl.style.boxShadow = '0 0 15px #3b82f6';
            userEl.style.border = '2px solid white';
            userEl.className = 'animate-pulse';

            new maptilersdk.Marker({ element: userEl })
                .setLngLat(USER_LOCATION)
                .setPopup(new maptilersdk.Popup({ offset: 25 }).setHTML(`
                    <div style="background: #0B0F1A; color: white; padding: 10px; border-radius: 8px;">
                        <h4 style="margin: 0; font-size: 12px; font-weight: bold; color: #3b82f6;">Your Location</h4>
                        <p style="margin: 5px 0 0; font-size: 10px; color: #9CA3AF;">Active Monitoring Station</p>
                    </div>
                `))
                .addTo(map.current)

            // Neighbor Locations
            NEIGHBOR_LOCATIONS.forEach(neighbor => {
                const color = neighbor.status === 'Safe' ? '#10b981' : neighbor.status === 'Warning' ? '#ef4444' : '#f59e0b';

                const el = document.createElement('div');
                el.style.width = '14px';
                el.style.height = '14px';
                el.style.backgroundColor = color;
                el.style.borderRadius = '50%';
                el.style.boxShadow = `0 0 10px ${color}`;
                el.style.cursor = 'pointer';

                new maptilersdk.Marker({ element: el })
                    .setLngLat([neighbor.lng, neighbor.lat])
                    .setPopup(new maptilersdk.Popup({ offset: 25 }).setHTML(`
                        <div style="background: #0B0F1A; color: white; padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                <div style="width: 24px; height: 24px; border-radius: 50%; background: #1f2937; display: flex; align-items: center; justify-content: center; font-size: 10px;">${neighbor.name[0]}</div>
                                <h4 style="margin: 0; font-size: 12px; font-weight: bold;">${neighbor.name}</h4>
                            </div>
                            <div style="font-[10px]; color: #9CA3AF; margin-bottom: 4px;">Latest Report:</div>
                            <div style="font-size: 11px; font-weight: 600; color: ${color};">${neighbor.report}</div>
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
        <div className="relative w-full h-full rounded-3xl overflow-hidden group shadow-2xl border border-white/10">
            {/* Colorful Map */}
            <div ref={mapContainer} className="absolute inset-0 w-full h-full brightness-110 saturate-150 contrast-110" />

            {/* HUD Overlays */}
            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between z-10">
                <div className="flex items-start justify-between">
                    <div className="bg-blue-600/90 backdrop-blur-md border border-blue-400/30 px-3 py-1.5 rounded-xl text-white flex items-center gap-2 shadow-lg shadow-blue-500/20">
                        <Users className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Neighborhood Purity Network</span>
                    </div>
                    <div className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 px-2 py-1 rounded-lg flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-[8px] font-bold text-emerald-400 uppercase">Live Community Data</span>
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex flex-col gap-2 pointer-events-auto shadow-2xl">
                        <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest border-b border-white/5 pb-1">Regional Map Key</div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-[9px] text-gray-300 font-bold">You</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                            <span className="text-[9px] text-gray-300 font-bold">Safe Neighbours</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                            <span className="text-[9px] text-gray-300 font-bold">Contaminated Area</span>
                        </div>
                    </div>

                    <div className="bg-indigo-600/20 backdrop-blur-md border border-indigo-500/30 p-2.5 rounded-2xl flex items-center gap-2 pointer-events-auto">
                        <Info className="w-4 h-4 text-indigo-400" />
                        <div className="text-[9px] font-medium text-white max-w-[120px] leading-tight">
                            Reports are verified by regional IoT gateways.
                        </div>
                    </div>
                </div>
            </div>

            {/* Scanning Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-gradient-to-b from-transparent via-white/20 to-transparent h-20 -translate-y-full animate-[scan_3s_linear_infinite]" />

            {!mapLoaded && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-dark-950/80 backdrop-blur-md">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Mapping Neighborhood...</p>
                    </div>
                </div>
            )}
        </div>
    )
}
