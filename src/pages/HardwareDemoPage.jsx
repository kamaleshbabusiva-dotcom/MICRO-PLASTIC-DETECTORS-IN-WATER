import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Activity, Waves, Power, Settings, Settings2, Eye, FlaskConical, Radar, Wifi, Thermometer, Droplets, BarChart3 } from 'lucide-react';

const SENSOR_READINGS = {
    idle: { flowRate: 0, laserPower: 0, uvIntensity: 0, temperature: 22.1, turbidity: 0, particleCount: 0 },
    active: { flowRate: 1.2, laserPower: 85, uvIntensity: 92, temperature: 23.4, turbidity: 34, particleCount: 0 },
};

export default function HardwareDemoPage() {
    const [systemActive, setSystemActive] = useState(false);
    const [particles, setParticles] = useState([]);
    const [readings, setReadings] = useState(SENSOR_READINGS.idle);
    const [detectedCount, setDetectedCount] = useState(0);
    const [plasticCount, setPlasticCount] = useState(0);
    const [uvMode, setUvMode] = useState(false);
    const [scanLog, setScanLog] = useState([]);

    // Simulate flowing water particles
    useEffect(() => {
        if (!systemActive) return;

        const interval = setInterval(() => {
            const id = Date.now();
            const isPlastic = Math.random() > 0.65;
            setParticles(prev => [
                ...prev.slice(-18),
                { id, x: 0, y: Math.random() * 80 + 10, isPlastic, size: Math.random() * 6 + 2, polymer: ['PET', 'PP', 'PE', 'PS', 'PVC'][Math.floor(Math.random() * 5)] }
            ]);
            setDetectedCount(c => c + 1);
            if (isPlastic) {
                setPlasticCount(c => c + 1);
                setScanLog(prev => [...prev.slice(-8), {
                    id, time: new Date().toLocaleTimeString(), polymer: ['PET', 'PP', 'PE', 'PS', 'PVC'][Math.floor(Math.random() * 5)],
                    size: Math.floor(Math.random() * 400 + 20), confidence: (Math.random() * 20 + 80).toFixed(1)
                }]);
            }
        }, 400);

        return () => clearInterval(interval);
    }, [systemActive]);

    // Sensor readings simulation
    useEffect(() => {
        if (!systemActive) {
            setReadings(SENSOR_READINGS.idle);
            return;
        }
        const interval = setInterval(() => {
            setReadings({
                flowRate: (1.2 + Math.random() * 0.3 - 0.15).toFixed(1),
                laserPower: Math.floor(85 + Math.random() * 10),
                uvIntensity: Math.floor(88 + Math.random() * 10),
                temperature: (23 + Math.random() * 2).toFixed(1),
                turbidity: Math.floor(30 + Math.random() * 15),
                particleCount: detectedCount,
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [systemActive, detectedCount]);

    // Toggle UV mode after system is on for a while
    useEffect(() => {
        if (systemActive) {
            const timer = setTimeout(() => setUvMode(true), 3000);
            return () => clearTimeout(timer);
        }
        setUvMode(false);
    }, [systemActive]);

    const handleToggle = () => {
        if (systemActive) {
            setSystemActive(false);
            setDetectedCount(0);
            setPlasticCount(0);
            setScanLog([]);
            setParticles([]);
        } else {
            setSystemActive(true);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="font-display text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
                        <Cpu className="w-7 h-7 lg:w-8 lg:h-8 text-emerald-400" /> Hardware Simulation Lab
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm">Interactive dual-sensor optical flow cell with Nile Red fluorescence & laser scattering</p>
                </div>
                <div className="flex items-center gap-3">
                    {systemActive && (
                        <div className="flex items-center gap-4 text-xs">
                            <div className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
                                Total: {detectedCount}
                            </div>
                            <div className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 font-bold border border-red-500/20">
                                Plastics: {plasticCount}
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleToggle}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${systemActive
                                ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
                                : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500'
                            }`}
                    >
                        <Power className={`w-4 h-4 ${systemActive ? 'text-red-400' : 'text-emerald-200'}`} />
                        {systemActive ? 'Shut Down' : 'Power On'}
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Hardware Diagram */}
                <div className="lg:col-span-2 glass-card p-6 lg:p-8 min-h-[450px] flex flex-col justify-center relative overflow-hidden">
                    <h3 className="absolute top-5 left-5 font-display font-bold text-gray-500 uppercase tracking-widest text-[10px] z-10">
                        Dual-Sensor Optical Flow Cell
                    </h3>

                    {/* UV Mode indicator */}
                    {uvMode && systemActive && (
                        <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">UV Fluorescence Active</span>
                        </div>
                    )}

                    {/* Water Flow Channel */}
                    <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-28 border-y overflow-hidden transition-all duration-1000 ${uvMode && systemActive ? 'bg-purple-900/15 border-purple-500/20' : 'bg-blue-900/10 border-blue-500/10'
                        }`}>
                        {systemActive && (
                            <div className="absolute inset-0 opacity-10">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="absolute w-full h-px bg-cyan-400/30" style={{ top: `${i * 20}%`, animationDelay: `${i * 0.3}s` }} />
                                ))}
                            </div>
                        )}
                        {/* Particles */}
                        {particles.map((p, i) => (
                            <div
                                key={p.id}
                                className={`absolute rounded-full transition-all ease-linear shadow-lg ${uvMode && p.isPlastic
                                        ? 'bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.8)] scale-125'
                                        : p.isPlastic
                                            ? 'bg-orange-400 shadow-orange-500/40'
                                            : 'bg-cyan-400/60 shadow-cyan-500/30'
                                    }`}
                                style={{
                                    width: `${p.size + 2}px`, height: `${p.size + 2}px`,
                                    left: `${Math.min(i * 6, 95)}%`,
                                    top: `${p.y}%`,
                                    transition: 'left 2.5s linear, background-color 0.5s, box-shadow 0.5s',
                                }}
                            />
                        ))}
                    </div>

                    {/* Hardware Components */}
                    <div className="relative z-10 flex items-center justify-between px-4 lg:px-8">
                        {/* Water Inlet */}
                        <div className="text-center group">
                            <div className={`w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-xl border-2 flex items-center justify-center mb-3 transition-all ${systemActive ? 'bg-blue-500/10 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-dark-900 border-white/10'
                                }`}>
                                <Droplets className={`w-7 h-7 lg:w-8 lg:h-8 ${systemActive ? 'text-blue-400' : 'text-gray-600'}`} />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">Intake</div>
                            {systemActive && <div className="text-[9px] text-blue-400 font-mono mt-1">{readings.flowRate} L/min</div>}
                        </div>

                        {/* Connector */}
                        <div className="flex-1 h-0.5 mx-2">
                            {systemActive && <div className="w-full h-1 bg-blue-400/30 rounded animate-pulse" />}
                        </div>

                        {/* Laser Source */}
                        <div className="text-center group">
                            <div className={`w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-xl border-2 flex items-center justify-center mb-3 transition-all ${systemActive ? 'bg-yellow-500/10 border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'bg-dark-900 border-white/10'
                                }`}>
                                <Zap className={`w-7 h-7 lg:w-8 lg:h-8 ${systemActive ? 'text-yellow-400' : 'text-gray-600'}`} />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">Laser</div>
                            {systemActive && <div className="text-[9px] text-yellow-400 font-mono mt-1">{readings.laserPower}% PWR</div>}
                        </div>

                        {/* Laser Beam */}
                        <div className="flex-1 h-0.5 mx-2 flex items-center">
                            {systemActive && <div className="w-full h-1 bg-gradient-to-r from-yellow-400/60 to-yellow-400/10 animate-pulse shadow-[0_0_15px_rgba(250,204,21,0.4)]" />}
                        </div>

                        {/* UV LED + Fluorescence */}
                        <div className="text-center group">
                            <div className={`w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-xl border-2 flex items-center justify-center mb-3 transition-all ${uvMode && systemActive ? 'bg-purple-500/20 border-purple-500/50 shadow-[0_0_25px_rgba(139,92,246,0.3)]' : systemActive ? 'bg-purple-500/5 border-purple-500/20' : 'bg-dark-900 border-white/10'
                                }`}>
                                <Eye className={`w-7 h-7 lg:w-8 lg:h-8 ${uvMode && systemActive ? 'text-purple-400 animate-pulse' : systemActive ? 'text-purple-400/50' : 'text-gray-600'}`} />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">UV LED</div>
                            {systemActive && <div className={`text-[9px] font-mono mt-1 ${uvMode ? 'text-purple-400' : 'text-gray-600'}`}>{uvMode ? `${readings.uvIntensity}% UV` : 'Warming...'}</div>}
                        </div>

                        {/* Data Link */}
                        <div className="flex-1 h-0.5 mx-2 border-t-2 border-dashed border-gray-700 relative">
                            {systemActive && (
                                <div className="absolute top-[-4px] left-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-[bounce-right_1.5s_infinite] shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                            )}
                        </div>

                        {/* Edge AI */}
                        <div className="text-center group">
                            <div className={`w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-xl border-2 flex items-center justify-center mb-3 transition-all ${systemActive ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_20px_rgba(52,211,153,0.2)]' : 'bg-dark-900 border-white/10'
                                }`}>
                                <Cpu className={`w-7 h-7 lg:w-8 lg:h-8 ${systemActive ? 'text-emerald-400' : 'text-gray-600'}`} />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">YOLOv8 AI</div>
                            {systemActive && <div className="text-[9px] text-emerald-400 font-mono mt-1">Classifying</div>}
                        </div>
                    </div>
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                    {/* Live Sensor Readings */}
                    <div className="glass-card p-5">
                        <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2 text-sm">
                            <Activity className="w-4 h-4 text-emerald-400" /> Live Sensor Readings
                        </h3>
                        <div className="space-y-2">
                            {[
                                { label: 'Flow Rate', value: `${readings.flowRate} L/min`, icon: Waves, active: systemActive, color: 'text-blue-400' },
                                { label: 'Laser Power', value: `${readings.laserPower}%`, icon: Zap, active: systemActive, color: 'text-yellow-400' },
                                { label: 'UV Intensity', value: `${readings.uvIntensity}%`, icon: Eye, active: uvMode && systemActive, color: 'text-purple-400' },
                                { label: 'Water Temp', value: `${readings.temperature}°C`, icon: Thermometer, active: systemActive, color: 'text-red-400' },
                                { label: 'Turbidity', value: `${readings.turbidity} NTU`, icon: Droplets, active: systemActive, color: 'text-cyan-400' },
                                { label: 'Particle Count', value: detectedCount, icon: BarChart3, active: systemActive, color: 'text-emerald-400' },
                            ].map((r, i) => (
                                <div key={i} className="flex justify-between items-center p-2.5 rounded-lg bg-white/5 text-xs">
                                    <span className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-wider">
                                        <r.icon className={`w-3.5 h-3.5 ${r.active ? r.color : 'text-gray-600'}`} />
                                        {r.label}
                                    </span>
                                    <span className={`font-mono font-bold ${r.active ? 'text-white' : 'text-gray-600'}`}>{r.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detection Log */}
                    <div className="glass-card p-5">
                        <h3 className="font-display font-bold text-white mb-3 flex items-center gap-2 text-sm">
                            <Radar className="w-4 h-4 text-red-400" /> Detection Log
                        </h3>
                        <div className="space-y-1.5 max-h-[200px] overflow-y-auto custom-scrollbar">
                            {scanLog.length === 0 ? (
                                <p className="text-xs text-gray-600 italic">No detections yet. Power on the system.</p>
                            ) : (
                                scanLog.map(log => (
                                    <div key={log.id} className="flex items-center justify-between p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-[10px]">
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded">{log.polymer}</span>
                                            <span className="text-gray-400">{log.size}μm</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <span className="text-emerald-400 font-bold">{log.confidence}%</span>
                                            <span>{log.time}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="glass-card p-5 border-emerald-500/20 bg-emerald-500/5">
                        <h3 className="font-display font-bold text-white mb-3 flex items-center gap-2 text-sm">
                            <Settings2 className="w-4 h-4 text-emerald-400" /> ₹2,000 Prototype BOM
                        </h3>
                        <div className="space-y-1.5 text-[11px]">
                            {[
                                { part: 'ESP32 Dev Board', cost: '₹450' },
                                { part: 'Laser Diode + Photodiode', cost: '₹200' },
                                { part: 'UV/Blue LED Module', cost: '₹150' },
                                { part: 'Peristaltic Pump', cost: '₹350' },
                                { part: 'Nile Red Dye (100ml)', cost: '₹300' },
                                { part: 'Optical Flow Cell (3D Print)', cost: '₹200' },
                                { part: 'Misc (Wires, Cuvette)', cost: '₹350' },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-gray-400">
                                    <span>{item.part}</span>
                                    <span className="font-mono font-bold text-emerald-400">{item.cost}</span>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-2 mt-2 border-t border-emerald-500/20 text-white font-bold">
                                <span>Total</span>
                                <span className="text-emerald-400 font-mono">₹2,000</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animations */}
            <style>{`
                @keyframes bounce-right {
                    0% { left: 0; opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { left: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
}
