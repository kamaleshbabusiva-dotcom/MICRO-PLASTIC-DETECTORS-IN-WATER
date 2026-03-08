import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    Camera, Video, VideoOff, Aperture, RotateCcw, ZoomIn, ZoomOut,
    Shield, AlertTriangle, CheckCircle2, XCircle, Cpu, Activity,
    Droplets, Eye, Upload, Image as ImageIcon, Maximize, Download, Layers,
    Wifi, WifiOff, Clock, Target, Zap, ChevronRight, FlaskConical
} from 'lucide-react';
import { runRoboflowInference, imageToBase64, POLYMER_RISK_MAP } from '../services/roboflowService';

export default function AICameraPage() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const overlayCanvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [scanHistory, setScanHistory] = useState([]);
    const [facingMode, setFacingMode] = useState('environment');
    const [zoomLevel, setZoomLevel] = useState(1);
    const [autoDetect, setAutoDetect] = useState(false);
    const [captureCount, setCaptureCount] = useState(0);
    const autoDetectRef = useRef(false);
    const streamRef = useRef(null);

    // Start camera
    const startCamera = async () => {
        try {
            setCameraError(null);
            const constraints = {
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setCameraActive(true);
        } catch (err) {
            console.error('Camera error:', err);
            setCameraError(err.message || 'Camera access denied. Please allow camera permissions.');
        }
    };

    // Stop camera
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
        setAutoDetect(false);
        autoDetectRef.current = false;
    };

    // Flip camera
    const flipCamera = () => {
        stopCamera();
        setFacingMode(f => f === 'environment' ? 'user' : 'environment');
        setTimeout(() => startCamera(), 300);
    };

    // Capture frame
    const captureFrame = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return null;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
        setCaptureCount(c => c + 1);
        return dataUrl;
    }, []);

    // Analyze captured image
    const analyzeImage = async (imageDataUrl) => {
        setAnalyzing(true);
        setResult(null);
        try {
            const base64 = imageDataUrl.split(',')[1];
            const detectionResult = await runRoboflowInference(base64);
            setResult(detectionResult);
            setScanHistory(prev => [{
                id: Date.now(),
                timestamp: new Date().toLocaleTimeString(),
                particles: detectionResult.totalParticles,
                concentration: detectionResult.concentration,
                risk: detectionResult.maxRisk,
                isLive: detectionResult.isLive,
            }, ...prev].slice(0, 10));
        } catch (err) {
            console.error('Analysis failed:', err);
        }
        setAnalyzing(false);
    };

    // Capture + Analyze
    const captureAndAnalyze = useCallback(async () => {
        const dataUrl = captureFrame();
        if (dataUrl) {
            await analyzeImage(dataUrl);
        }
    }, [captureFrame]);

    // Auto-detect loop
    useEffect(() => {
        autoDetectRef.current = autoDetect;
        if (!autoDetect || !cameraActive) return;

        const interval = setInterval(() => {
            if (autoDetectRef.current && !analyzing) {
                captureAndAnalyze();
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [autoDetect, cameraActive]);

    // Upload image
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setCapturedImage(ev.target.result);
            analyzeImage(ev.target.result);
        };
        reader.readAsDataURL(file);
    };

    // Draw detection overlays
    useEffect(() => {
        if (!result || !capturedImage || !overlayCanvasRef.current) return;
        const canvas = overlayCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new window.Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            result.detections.forEach(det => {
                const { bbox, polymer, confidence } = det;
                // Draw bounding box
                ctx.strokeStyle = polymer.color || '#00ff00';
                ctx.lineWidth = 3;
                ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);

                // Draw label background
                const label = `${polymer.id} ${(confidence * 100).toFixed(0)}%`;
                ctx.font = 'bold 14px Inter, sans-serif';
                const textWidth = ctx.measureText(label).width;
                ctx.fillStyle = polymer.color || '#00ff00';
                ctx.fillRect(bbox.x, bbox.y - 22, textWidth + 12, 22);

                // Draw label text
                ctx.fillStyle = '#ffffff';
                ctx.fillText(label, bbox.x + 6, bbox.y - 6);

                // Draw corner markers
                const markerSize = 8;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                // Top-left
                ctx.beginPath();
                ctx.moveTo(bbox.x, bbox.y + markerSize);
                ctx.lineTo(bbox.x, bbox.y);
                ctx.lineTo(bbox.x + markerSize, bbox.y);
                ctx.stroke();
                // Top-right
                ctx.beginPath();
                ctx.moveTo(bbox.x + bbox.width - markerSize, bbox.y);
                ctx.lineTo(bbox.x + bbox.width, bbox.y);
                ctx.lineTo(bbox.x + bbox.width, bbox.y + markerSize);
                ctx.stroke();
                // Bottom-left
                ctx.beginPath();
                ctx.moveTo(bbox.x, bbox.y + bbox.height - markerSize);
                ctx.lineTo(bbox.x, bbox.y + bbox.height);
                ctx.lineTo(bbox.x + markerSize, bbox.y + bbox.height);
                ctx.stroke();
                // Bottom-right
                ctx.beginPath();
                ctx.moveTo(bbox.x + bbox.width - markerSize, bbox.y + bbox.height);
                ctx.lineTo(bbox.x + bbox.width, bbox.y + bbox.height);
                ctx.lineTo(bbox.x + bbox.width, bbox.y + bbox.height - markerSize);
                ctx.stroke();
            });

            // Scan info overlay
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, canvas.height - 36, canvas.width, 36);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13px Inter, sans-serif';
            ctx.fillText(
                `${result.totalParticles} particles detected | ${result.concentration} μg/L | Model: ${result.model?.split('/')[0] || 'AI'}`,
                12,
                canvas.height - 12
            );
        };
        img.src = capturedImage;
    }, [result, capturedImage]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }
        };
    }, []);

    const riskStyle = (risk) => {
        switch (risk) {
            case 'Critical': return { bg: 'bg-red-500/10 border-red-500/30', text: 'text-red-400', pill: 'bg-red-500 text-white' };
            case 'High': return { bg: 'bg-orange-500/10 border-orange-500/30', text: 'text-orange-400', pill: 'bg-orange-500 text-white' };
            case 'Medium': return { bg: 'bg-yellow-500/10 border-yellow-500/30', text: 'text-yellow-400', pill: 'bg-yellow-500 text-black' };
            default: return { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', pill: 'bg-emerald-500 text-white' };
        }
    };

    return (
        <div className="space-y-6 animate-fade-in p-2 lg:p-4 pb-24 lg:pb-4">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
                        <Camera className="w-7 h-7 lg:w-8 lg:h-8 text-cyan-400" /> AI Sensor Camera
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm">Roboflow-powered microplastic detection • Real-time camera inference</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border ${result?.isLive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        }`}>
                        {result?.isLive ? <Wifi className="w-3.5 h-3.5" /> : <Cpu className="w-3.5 h-3.5" />}
                        {result?.isLive ? 'LIVE API' : 'AI Engine'}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-bold">
                        <Aperture className="w-3.5 h-3.5" />
                        {captureCount} captures
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Camera Feed / Left Column */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Camera Viewfinder */}
                    <div className="glass-card overflow-hidden relative">
                        <div className="aspect-video bg-black relative flex items-center justify-center">
                            {cameraActive ? (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover"
                                        style={{ transform: `scale(${zoomLevel})` }}
                                    />
                                    {/* Scan grid overlay */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="w-full h-full border-2 border-cyan-500/20 relative">
                                            <div className="absolute top-1/3 w-full h-px bg-cyan-500/10" />
                                            <div className="absolute top-2/3 w-full h-px bg-cyan-500/10" />
                                            <div className="absolute left-1/3 h-full w-px bg-cyan-500/10" />
                                            <div className="absolute left-2/3 h-full w-px bg-cyan-500/10" />
                                            {/* Corner brackets */}
                                            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
                                            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
                                            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
                                            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />
                                        </div>
                                    </div>
                                    {/* Auto-detect indicator */}
                                    {autoDetect && (
                                        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/90 text-white text-xs font-bold animate-pulse">
                                            <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                                            AUTO-SCANNING
                                        </div>
                                    )}
                                    {analyzing && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                                                <span className="text-cyan-400 text-sm font-bold">Analyzing with Roboflow AI...</span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : capturedImage && result ? (
                                <canvas ref={overlayCanvasRef} className="w-full h-full object-contain" />
                            ) : capturedImage ? (
                                <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
                            ) : (
                                <div className="flex flex-col items-center gap-4 text-gray-500">
                                    <div className="w-20 h-20 rounded-2xl bg-white/5 border-2 border-dashed border-gray-700 flex items-center justify-center">
                                        <Camera className="w-10 h-10 text-gray-600" />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm font-bold text-gray-400">AI Sensor Camera</div>
                                        <div className="text-[11px] text-gray-600 mt-1">Start camera or upload an image to detect microplastics</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Camera Controls Bar */}
                        <div className="p-4 bg-black/40 backdrop-blur flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                {!cameraActive ? (
                                    <button onClick={startCamera} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/20">
                                        <Video className="w-4 h-4" /> Start Camera
                                    </button>
                                ) : (
                                    <button onClick={stopCamera} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest transition-all">
                                        <VideoOff className="w-4 h-4" /> Stop
                                    </button>
                                )}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 text-xs font-bold transition-all border border-white/10"
                                >
                                    <Upload className="w-4 h-4" /> Upload
                                </button>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                            </div>

                            <div className="flex items-center gap-2">
                                {cameraActive && (
                                    <>
                                        <button onClick={() => setZoomLevel(z => Math.max(1, z - 0.25))} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-all">
                                            <ZoomOut className="w-4 h-4" />
                                        </button>
                                        <span className="text-[10px] text-gray-500 font-bold w-8 text-center">{zoomLevel}x</span>
                                        <button onClick={() => setZoomLevel(z => Math.min(3, z + 0.25))} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-all">
                                            <ZoomIn className="w-4 h-4" />
                                        </button>
                                        <button onClick={flipCamera} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-all" title="Flip Camera">
                                            <RotateCcw className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {cameraActive && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => { setAutoDetect(!autoDetect); }}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${autoDetect ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                                            }`}
                                    >
                                        <Target className="w-3 h-3" /> {autoDetect ? 'Stop Auto' : 'Auto Scan'}
                                    </button>
                                    <button
                                        onClick={captureAndAnalyze}
                                        disabled={analyzing}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/30 disabled:opacity-40"
                                    >
                                        <Aperture className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
                                        {analyzing ? 'Analyzing...' : 'Capture & Detect'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Camera Error */}
                    {cameraError && (
                        <div className="glass-card p-4 bg-red-500/5 border-red-500/20 flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <div>
                                <div className="text-sm font-bold text-red-400">Camera Error</div>
                                <div className="text-[11px] text-gray-400">{cameraError}</div>
                            </div>
                        </div>
                    )}

                    {/* Detection Results */}
                    {result && (
                        <div className="glass-card p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-cyan-400" /> AI Detection Results
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${result.isLive ? 'bg-emerald-500 text-white' : 'bg-yellow-500 text-black'}`}>
                                        {result.isLive ? 'LIVE API' : 'SIMULATED'}
                                    </span>
                                    <span className="text-[9px] text-gray-500 font-bold">{result.model}</span>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-3 rounded-xl bg-white/5 text-center">
                                    <div className="text-2xl font-black text-white">{result.totalParticles}</div>
                                    <div className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Particles</div>
                                </div>
                                <div className={`p-3 rounded-xl text-center ${riskStyle(result.maxRisk).bg} border`}>
                                    <div className={`text-2xl font-black ${riskStyle(result.maxRisk).text}`}>{result.concentration}</div>
                                    <div className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">μg/L</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 text-center">
                                    <div className={`text-lg font-black px-2 py-0.5 rounded inline-block ${riskStyle(result.maxRisk).pill}`}>
                                        {result.maxRisk}
                                    </div>
                                    <div className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mt-1">Risk Level</div>
                                </div>
                            </div>

                            {/* Detected Particles */}
                            <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Detected Particles</div>
                                <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2">
                                    {result.detections.map((det, i) => {
                                        const rs = riskStyle(det.polymer.risk);
                                        return (
                                            <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${rs.bg} border`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: det.polymer.color + '22' }}>
                                                        <FlaskConical className="w-4 h-4" style={{ color: det.polymer.color }} />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-white">{det.polymer.id} <span className="text-gray-500">— {det.polymer.fullName}</span></div>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[9px] text-gray-500">Size: {det.size_um}μm</span>
                                                            <span className="text-[9px] text-gray-600">•</span>
                                                            <span className="text-[9px] text-cyan-400">Confidence: {(det.confidence * 100).toFixed(1)}%</span>
                                                            <span className="text-[9px] text-gray-600">•</span>
                                                            <span className="text-[9px] text-gray-500">{det.polymer.origin}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${rs.pill}`}>{det.polymer.risk}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Actionable Traffic Light */}
                            <div className={`p-4 rounded-xl border ${parseFloat(result.concentration) <= 2 ? 'bg-emerald-500/5 border-emerald-500/20' :
                                    parseFloat(result.concentration) <= 5 ? 'bg-yellow-500/5 border-yellow-500/20' :
                                        'bg-red-500/5 border-red-500/20'
                                }`}>
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Recommended Action</div>
                                {parseFloat(result.concentration) <= 2 ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                                            <span className="text-lg">🟢</span> Water is Safe
                                        </div>
                                        <p className="text-[11px] text-gray-400">Safe for consumption. Next test recommended in 3 days.</p>
                                    </div>
                                ) : parseFloat(result.concentration) <= 5 ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
                                            <span className="text-lg">🟡</span> Caution — Filter Before Use
                                        </div>
                                        <p className="text-[11px] text-gray-400">Boil for 5 min + sediment filter. Don't use directly for babies.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                                            <span className="text-lg">🔴</span> DANGER — Stop Use Immediately
                                        </div>
                                        <p className="text-[11px] text-gray-400">🚨 Switch to RO/packaged water. Report contamination.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="space-y-4">
                    {/* How It Works */}
                    <div className="glass-card p-5">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-cyan-400" /> How It Works
                        </h3>
                        <div className="space-y-3">
                            {[
                                { step: 1, label: 'Place water sample under microscope/lens', icon: Droplets, color: 'text-blue-400' },
                                { step: 2, label: 'Camera captures magnified image', icon: Camera, color: 'text-cyan-400' },
                                { step: 3, label: 'Image sent to Roboflow AI model', icon: Cpu, color: 'text-purple-400' },
                                { step: 4, label: 'AI detects & classifies particles', icon: Target, color: 'text-emerald-400' },
                                { step: 5, label: 'Risk assessment & action plan', icon: Shield, color: 'text-orange-400' },
                            ].map(s => (
                                <div key={s.step} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                                    <div className={`w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black ${s.color}`}>
                                        {s.step}
                                    </div>
                                    <span className="text-[11px] text-gray-300">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* API Status */}
                    <div className="glass-card p-5">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-400" /> API Status
                        </h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                <span className="text-[11px] text-gray-400">Roboflow API</span>
                                <span className={`text-[10px] font-black ${result?.isLive ? 'text-emerald-400' : 'text-yellow-400'}`}>
                                    {result?.isLive ? '● Connected' : '● Demo Mode'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                <span className="text-[11px] text-gray-400">Model</span>
                                <span className="text-[10px] text-blue-400 font-bold font-mono">{result?.model || 'microplastics/1'}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                <span className="text-[11px] text-gray-400">Camera</span>
                                <span className={`text-[10px] font-black ${cameraActive ? 'text-emerald-400' : 'text-gray-500'}`}>
                                    {cameraActive ? '● Active' : '○ Inactive'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                <span className="text-[11px] text-gray-400">Total Scans</span>
                                <span className="text-[10px] text-white font-bold">{captureCount}</span>
                            </div>
                        </div>
                        {!import.meta.env.VITE_ROBOFLOW_API_KEY && (
                            <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                <div className="text-[10px] text-amber-400 font-bold mb-1">⚠ Demo Mode Active</div>
                                <div className="text-[9px] text-gray-500 leading-relaxed">
                                    Add <span className="font-mono text-blue-400">VITE_ROBOFLOW_API_KEY</span> to your <span className="font-mono text-blue-400">.env</span> file for live inference.
                                    Get one free at <span className="text-blue-400">app.roboflow.com</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Scan History */}
                    {scanHistory.length > 0 && (
                        <div className="glass-card p-5">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-400" /> Scan History
                            </h3>
                            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                                {scanHistory.map((scan, i) => (
                                    <div key={scan.id} className={`flex items-center justify-between p-2.5 rounded-xl ${i === 0 ? 'bg-cyan-500/5 border border-cyan-500/20' : 'bg-white/5'
                                        }`}>
                                        <div>
                                            <div className="text-[11px] text-white font-bold">{scan.particles} particles • {scan.concentration} μg/L</div>
                                            <div className="text-[9px] text-gray-500 flex items-center gap-1">
                                                <Clock className="w-2.5 h-2.5" /> {scan.timestamp}
                                                {scan.isLive && <span className="text-emerald-400 ml-1">LIVE</span>}
                                            </div>
                                        </div>
                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${riskStyle(scan.risk).pill}`}>
                                            {scan.risk}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tech Specs */}
                    <div className="glass-card p-5">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Tech Specs</h3>
                        <div className="space-y-2 text-[10px]">
                            {[
                                ['AI Model', 'YOLOv8 Nano (Roboflow)'],
                                ['Detection', 'Object Detection + Classification'],
                                ['Inference', 'Cloud API / Edge (planned)'],
                                ['Resolution', '1280×720 max'],
                                ['Min. Particle', '~20μm detectable'],
                                ['Polymer Types', 'PET, PP, PE, PS, PVC, PA'],
                                ['Latency', '<500ms per frame'],
                                ['Cost', '₹0 (free tier: 1000/mo)'],
                            ].map(([k, v], i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-gray-500 font-bold">{k}</span>
                                    <span className="text-gray-300 font-mono">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
