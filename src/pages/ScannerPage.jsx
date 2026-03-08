import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, Layers, ShieldCheck, AlertTriangle, Droplets, Zap, Eye, FlaskConical, Radar, Cpu, Activity, Send, MapPin, Wifi } from 'lucide-react';

// Polymer database for realistic detection
const POLYMER_DB = [
    { id: 'PET', name: 'Polyethylene Terephthalate', color: '#ef4444', risk: 'Medium', origin: 'Bottles, Packaging', peakWave: 1660 },
    { id: 'PP', name: 'Polypropylene', color: '#f59e0b', risk: 'Medium', origin: 'Containers, Textiles', peakWave: 1732 },
    { id: 'PE', name: 'Polyethylene', color: '#8b5cf6', risk: 'High', origin: 'Bags, Films', peakWave: 1730 },
    { id: 'PS', name: 'Polystyrene', color: '#ec4899', risk: 'High', origin: 'Foam, Insulation', peakWave: 1680 },
    { id: 'PVC', name: 'Polyvinyl Chloride', color: '#dc2626', risk: 'Critical', origin: 'Pipes, Industrial', peakWave: 1715 },
    { id: 'PA', name: 'Polyamide (Nylon)', color: '#06b6d4', risk: 'Medium', origin: 'Fishing Nets, Fabrics', peakWave: 1710 },
];

const PIPELINE_STAGES = [
    { id: 'intake', label: 'Sample Intake', icon: Droplets, duration: 800, detail: '10ml water sample loaded' },
    { id: 'filter', label: 'Pre-Filter & Dye', icon: FlaskConical, duration: 1200, detail: 'Nile Red fluorescent dye applied' },
    { id: 'scatter', label: 'Stage 1: Light Scattering', icon: Zap, duration: 1500, detail: 'Laser + photodiode particle count' },
    { id: 'fluoresce', label: 'Stage 2: Fluorescence', icon: Eye, duration: 2000, detail: 'UV/Blue LED → plastics glow red' },
    { id: 'ai', label: 'YOLOv8 Nano Classification', icon: Cpu, duration: 1800, detail: 'Polymer type + size identification' },
    { id: 'confirm', label: 'Cross-Validation', icon: Radar, duration: 1000, detail: 'Fluorescence ↔ AI confidence merge' },
    { id: 'alert', label: 'Alert & Report', icon: Send, duration: 600, detail: 'Threshold check → SMS/Dashboard' },
];

function generateDetections() {
    const count = Math.floor(Math.random() * 6) + 2;
    const detections = [];
    for (let i = 0; i < count; i++) {
        const polymer = POLYMER_DB[Math.floor(Math.random() * POLYMER_DB.length)];
        detections.push({
            id: i,
            polymer,
            size_um: Math.floor(Math.random() * 450 + 20),
            confidence: (Math.random() * 0.2 + 0.78).toFixed(2),
            glow_confidence: (Math.random() * 0.3 + 0.65).toFixed(2),
            bbox: { x: Math.random() * 60 + 10, y: Math.random() * 60 + 10, w: Math.random() * 15 + 5, h: Math.random() * 15 + 5 },
        });
    }
    const totalMass = detections.reduce((s, d) => s + d.size_um * 0.001, 0);
    const concentration = ((totalMass / 10) * 1000).toFixed(1);
    return { detections, concentration, totalParticles: detections.length };
}

export default function ScannerPage() {
    const [pipelineActive, setPipelineActive] = useState(false);
    const [currentStage, setCurrentStage] = useState(-1);
    const [stageProgress, setStageProgress] = useState(0);
    const [completedStages, setCompletedStages] = useState([]);
    const [result, setResult] = useState(null);
    const [liveParticles, setLiveParticles] = useState([]);
    const [scanCount, setScanCount] = useState(0);
    const canvasRef = useRef(null);

    // Simulated particle animation during scan
    useEffect(() => {
        if (!pipelineActive) return;
        const interval = setInterval(() => {
            setLiveParticles(prev => {
                const newP = [...prev.slice(-20), {
                    id: Date.now(),
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 8 + 2,
                    isPlastic: Math.random() > 0.5,
                    glowing: currentStage >= 3,
                }];
                return newP;
            });
        }, 150);
        return () => clearInterval(interval);
    }, [pipelineActive, currentStage]);

    const startPipeline = () => {
        setPipelineActive(true);
        setCurrentStage(0);
        setStageProgress(0);
        setCompletedStages([]);
        setResult(null);
        setLiveParticles([]);
        runPipeline(0);
    };

    const runPipeline = (stageIdx) => {
        if (stageIdx >= PIPELINE_STAGES.length) {
            const res = generateDetections();
            setResult(res);
            setPipelineActive(false);
            setCurrentStage(-1);
            setScanCount(c => c + 1);
            return;
        }

        setCurrentStage(stageIdx);
        setStageProgress(0);

        const stage = PIPELINE_STAGES[stageIdx];
        const steps = 20;
        const stepTime = stage.duration / steps;
        let step = 0;

        const interval = setInterval(() => {
            step++;
            setStageProgress((step / steps) * 100);
            if (step >= steps) {
                clearInterval(interval);
                setCompletedStages(prev => [...prev, stageIdx]);
                setTimeout(() => runPipeline(stageIdx + 1), 200);
            }
        }, stepTime);
    };

    const riskColor = (risk) => {
        if (risk === 'Critical') return 'text-red-500 bg-red-500/10 border-red-500/30';
        if (risk === 'High') return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="font-display text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
                        <Camera className="w-7 h-7 lg:w-8 lg:h-8 text-cyan-400" /> Scan-Confirm-Alert Pipeline
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm">Dual-sensing AI detection: Light Scattering → Nile Red Fluorescence → YOLOv8 Classification</p>
                </div>
                <div className="flex items-center gap-3">
                    {scanCount > 0 && (
                        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                            {scanCount} Scan{scanCount > 1 ? 's' : ''} Complete
                        </div>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Pipeline Visualization */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Live Detection Viewport */}
                    <div className="glass-card p-6 relative overflow-hidden min-h-[320px]">
                        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${pipelineActive ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`} />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                {pipelineActive ? 'LIVE ANALYSIS' : result ? 'SCAN COMPLETE' : 'VIEWPORT IDLE'}
                            </span>
                        </div>

                        {/* Particle Field */}
                        <div className="absolute inset-0 overflow-hidden">
                            {liveParticles.map(p => (
                                <div
                                    key={p.id}
                                    className={`absolute rounded-full transition-all duration-500 ${p.glowing && p.isPlastic
                                        ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.7)]'
                                        : p.isPlastic
                                            ? 'bg-orange-400/60'
                                            : 'bg-cyan-400/30'
                                        }`}
                                    style={{
                                        left: `${p.x}%`, top: `${p.y}%`,
                                        width: `${p.size}px`, height: `${p.size}px`,
                                    }}
                                />
                            ))}
                            {/* Scan beam effect */}
                            {pipelineActive && currentStage >= 2 && (
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 animate-[scan-beam_2s_linear_infinite]" />
                                </div>
                            )}
                            {/* UV glow overlay */}
                            {pipelineActive && currentStage >= 3 && (
                                <div className="absolute inset-0 bg-purple-900/20 animate-pulse border border-purple-500/20 rounded-xl" />
                            )}
                        </div>

                        {/* Center Content */}
                        <div className="relative z-10 flex flex-col items-center justify-center min-h-[280px]">
                            {!pipelineActive && !result ? (
                                <div className="text-center">
                                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 flex items-center justify-center mx-auto mb-5 border-2 border-cyan-500/20 group hover:scale-105 transition-transform cursor-pointer" onClick={startPipeline}>
                                        <Camera className="w-12 h-12 text-cyan-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Ready for Dual-Scan Analysis</h3>
                                    <p className="text-sm text-gray-400 mb-6 max-w-md">Place 10ml water sample → System applies Nile Red dye → Dual optical scan → AI polymer identification in {'<'}10 seconds</p>
                                    <button onClick={startPipeline} className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-sm hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 mx-auto">
                                        <Zap className="w-4 h-4" /> Start Scan-Confirm-Alert
                                    </button>
                                </div>
                            ) : pipelineActive ? (
                                <div className="text-center space-y-4">
                                    <div className="relative w-36 h-36 mx-auto">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#scanGrad)" strokeWidth="6" strokeLinecap="round"
                                                strokeDasharray={`${(stageProgress / 100) * 283} 283`} className="transition-all duration-100" />
                                            <defs>
                                                <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#06b6d4" />
                                                    <stop offset="100%" stopColor="#8b5cf6" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            {React.createElement(PIPELINE_STAGES[currentStage]?.icon || Camera, { className: 'w-8 h-8 text-cyan-400 mb-1' })}
                                            <div className="text-lg font-black text-white">{Math.round(stageProgress)}%</div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-cyan-400 font-black uppercase tracking-widest text-[11px] animate-pulse">
                                            {PIPELINE_STAGES[currentStage]?.label}
                                        </p>
                                        <p className="text-[10px] text-gray-500 mt-1">{PIPELINE_STAGES[currentStage]?.detail}</p>
                                    </div>
                                    <div className="text-[10px] text-gray-600">
                                        Stage {currentStage + 1} of {PIPELINE_STAGES.length}
                                    </div>
                                </div>
                            ) : result ? (
                                /* Results Display */
                                <div className="w-full space-y-4">
                                    {/* Top Stats */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className={`p-4 rounded-xl border text-center ${parseFloat(result.concentration) > 5 ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Concentration</div>
                                            <div className={`text-2xl font-black ${parseFloat(result.concentration) > 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                {result.concentration}
                                            </div>
                                            <div className="text-[10px] text-gray-500">μg/L</div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Particles</div>
                                            <div className="text-2xl font-black text-white">{result.totalParticles}</div>
                                            <div className="text-[10px] text-gray-500">Detected</div>
                                        </div>
                                        <div className={`p-4 rounded-xl border text-center ${parseFloat(result.concentration) > 5 ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Status</div>
                                            <div className="flex items-center justify-center gap-1">
                                                {parseFloat(result.concentration) > 5
                                                    ? <AlertTriangle className="w-6 h-6 text-red-400" />
                                                    : <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                                }
                                            </div>
                                            <div className={`text-[10px] font-bold ${parseFloat(result.concentration) > 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                {parseFloat(result.concentration) > 5 ? 'ALERT' : 'SAFE'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detected Polymers */}
                                    <div className="space-y-2">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Identified Polymers</div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {result.detections.map(det => (
                                                <div key={det.id} className={`p-3 rounded-xl border flex items-center gap-3 ${riskColor(det.polymer.risk)}`}>
                                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-black" style={{ backgroundColor: det.polymer.color + '20', color: det.polymer.color }}>
                                                        {det.polymer.id}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-xs font-bold text-white truncate">{det.polymer.name}</div>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[10px] text-gray-400">{det.size_um}μm</span>
                                                            <span className="text-[10px] text-gray-600">•</span>
                                                            <span className="text-[10px] text-gray-400">AI: {(det.confidence * 100).toFixed(0)}%</span>
                                                            <span className="text-[10px] text-gray-600">•</span>
                                                            <span className="text-[10px] text-purple-400">Glow: {(det.glow_confidence * 100).toFixed(0)}%</span>
                                                        </div>
                                                    </div>
                                                    <div className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${det.polymer.risk === 'Critical' ? 'bg-red-500 text-white' : det.polymer.risk === 'High' ? 'bg-orange-500 text-white' : 'bg-yellow-500 text-black'}`}>
                                                        {det.polymer.risk}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Traffic Light Action Panel */}
                                    <div className={`p-4 rounded-xl border ${parseFloat(result.concentration) <= 2 ? 'bg-emerald-500/5 border-emerald-500/20' :
                                            parseFloat(result.concentration) <= 5 ? 'bg-yellow-500/5 border-yellow-500/20' :
                                                'bg-red-500/5 border-red-500/20'
                                        }`}>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Recommended Action</div>
                                        {parseFloat(result.concentration) <= 2 ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                                                    <span className="text-lg">🟢</span> Water is Safe — Continue Normal Use
                                                </div>
                                                <p className="text-[11px] text-gray-400">👍 Great results! Next recommended test: 3 days. Keep monitoring weekly.</p>
                                            </div>
                                        ) : parseFloat(result.concentration) <= 5 ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
                                                    <span className="text-lg">🟡</span> Caution — Boil + Filter Before Use
                                                </div>
                                                <p className="text-[11px] text-gray-400">🪣 Boil for 5 min + use sediment filter. Don't use directly for baby food or cooking.</p>
                                                <div className="flex gap-2 mt-1">
                                                    <button className="flex-1 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 text-[10px] font-black uppercase tracking-wider hover:bg-yellow-500/20 transition-all text-center">
                                                        🛒 Buy: TATA Swach ₹599
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                                                    <span className="text-lg">🔴</span> DANGER — Stop Use Immediately
                                                </div>
                                                <p className="text-[11px] text-gray-400">🚨 Do NOT drink this water. Switch to RO/packaged water. Report contamination.</p>
                                                <div className="flex gap-2 mt-1">
                                                    <button className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-wider hover:bg-red-500/20 transition-all text-center">
                                                        📞 Helpline: 1800-XXX-XXXX
                                                    </button>
                                                    <button className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-wider hover:bg-red-500/20 transition-all text-center">
                                                        📍 Report to CPCB
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button onClick={startPipeline} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-sm hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center justify-center gap-2">
                                        <RefreshCw className="w-4 h-4" /> Scan Another Sample
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Pipeline Steps Tracker */}
                    <div className="glass-card p-5">
                        <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2 text-sm">
                            <Activity className="w-4 h-4 text-cyan-400" /> Detection Pipeline Progress
                        </h3>
                        <div className="flex items-center gap-1 overflow-x-auto pb-2">
                            {PIPELINE_STAGES.map((stage, i) => {
                                const isCompleted = completedStages.includes(i);
                                const isCurrent = currentStage === i;
                                const StageIcon = stage.icon;
                                return (
                                    <React.Fragment key={stage.id}>
                                        <div className={`flex flex-col items-center min-w-[70px] transition-all ${isCurrent ? 'scale-110' : ''}`}>
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${isCompleted ? 'bg-emerald-500/20 border border-emerald-500/40'
                                                : isCurrent ? 'bg-cyan-500/20 border border-cyan-500/40 animate-pulse'
                                                    : 'bg-white/5 border border-white/10'
                                                }`}>
                                                <StageIcon className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : isCurrent ? 'text-cyan-400' : 'text-gray-600'}`} />
                                            </div>
                                            <span className={`text-[8px] mt-1.5 font-bold text-center leading-tight ${isCompleted ? 'text-emerald-400' : isCurrent ? 'text-cyan-400' : 'text-gray-600'
                                                }`}>{stage.label.split(':').pop().trim()}</span>
                                        </div>
                                        {i < PIPELINE_STAGES.length - 1 && (
                                            <div className={`flex-shrink-0 w-6 h-0.5 rounded ${isCompleted ? 'bg-emerald-500/50' : 'bg-white/10'}`} />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right: Protocol & Tech Specs */}
                <div className="space-y-6">
                    {/* Dual-Sensing Protocol */}
                    <div className="glass-card p-5">
                        <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2 text-sm">
                            <Layers className="w-4 h-4 text-purple-400" /> Dual-Sensing Protocol
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                                <div className="flex items-center gap-2 mb-1">
                                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                                    <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Stage 1: Quick Count</span>
                                </div>
                                <p className="text-[11px] text-gray-400 leading-relaxed">Laser + photodiode light scattering detects all suspended particles instantly. Counts total particle density in turbid water.</p>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
                                <div className="flex items-center gap-2 mb-1">
                                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Stage 2: Confirm Plastics</span>
                                </div>
                                <p className="text-[11px] text-gray-400 leading-relaxed">Nile Red dye + UV/blue LED fluorescence. Only plastic particles glow red — organic matter stays dark. 95% accuracy.</p>
                            </div>
                            <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                                <div className="flex items-center gap-2 mb-1">
                                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Stage 3: AI Classify</span>
                                </div>
                                <p className="text-[11px] text-gray-400 leading-relaxed">YOLOv8 Nano on TFLite classifies polymer type (PET/PP/PE/PS/PVC/PA) by shape, contour, and spectral signature. {'<'}1s inference.</p>
                            </div>
                        </div>
                    </div>

                    {/* Tech Specs */}
                    <div className="glass-card p-5">
                        <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2 text-sm">
                            <Radar className="w-4 h-4 text-emerald-400" /> System Specifications
                        </h3>
                        <div className="space-y-2">
                            {[
                                { label: 'Detection Range', value: '10 - 5000 μm' },
                                { label: 'AI Model', value: 'YOLOv8n (TFLite)' },
                                { label: 'Inference Time', value: '<1s per frame' },
                                { label: 'Fluorescence Dye', value: 'Nile Red (UV)' },
                                { label: 'Sample Volume', value: '10 ml' },
                                { label: 'Accuracy', value: '95%+ (dual-confirm)' },
                                { label: 'Hardware Cost', value: '₹2,000 prototype' },
                                { label: 'Edge Platform', value: 'ESP32 / RPi 4' },
                            ].map((spec, i) => (
                                <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-white/5 text-xs">
                                    <span className="text-gray-500 font-bold uppercase tracking-wider">{spec.label}</span>
                                    <span className="text-white font-mono font-bold">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alert System */}
                    <div className="glass-card p-5 border-amber-500/20 bg-amber-500/5">
                        <h3 className="font-display font-bold text-white mb-3 flex items-center gap-2 text-sm">
                            <Send className="w-4 h-4 text-amber-400" /> Alert System
                        </h3>
                        <div className="space-y-2 text-[11px] text-gray-400">
                            <div className="flex items-center gap-2">
                                <Wifi className="w-3 h-3 text-green-400" />
                                <span>IoT Swarm: Multiple units map rivers (Firebase + GPS)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Send className="w-3 h-3 text-blue-400" />
                                <span>SMS/WhatsApp alert if concentration {'>'} threshold (Twilio API)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-red-400" />
                                <span>GPS-tagged hotspot mapping for authorities</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scan beam animation */}
            <style>{`
                @keyframes scan-beam {
                    0% { top: 0; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
}
