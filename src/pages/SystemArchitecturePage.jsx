import { useState, useEffect } from 'react'
import {
    Cpu, Globe, Zap, Bell, Cloud, Share2, Activity, Terminal,
    Camera, Database, Map as MapIcon, MessageSquare, ShieldCheck,
    Layers, RefreshCw, Smartphone, Monitor, ChevronRight, AlertCircle, Link as LinkIcon,
    Settings, Key, TrendingUp, Check
} from 'lucide-react'
import GeoNodesMap from '../components/GeoNodesMap'

export default function SystemArchitecturePage() {
    const [activeTab, setActiveTab] = useState('flow')
    const [systemStatus, setSystemStatus] = useState('operational')
    const [isPingingAll, setIsPingingAll] = useState(false)
    const [apis, setApis] = useState([
        { name: 'OpenAI Vision', category: 'AI Detection', status: 'Online', latency: '420ms', icon: Camera, color: 'text-emerald-400' },
        { name: 'ThingSpeak IoT', category: 'Sensor Data', status: 'Active', latency: '120ms', icon: Cpu, color: 'text-blue-400' },
        { name: 'Google Maps Engine', category: 'Mapping', status: 'Online', latency: '65ms', icon: Globe, color: 'text-amber-400' },
        { name: 'Twilio Gateway', category: 'Alerts', status: 'Standby', latency: '900ms', icon: Bell, color: 'text-red-400' },
        { name: 'OpenWeather API', category: 'Environmental', status: 'Updating', latency: '310ms', icon: Cloud, color: 'text-indigo-400' },
    ])

    const [activeStep, setActiveStep] = useState(0)
    const [isSyncing, setIsSyncing] = useState(false)
    const [showAlert, setShowAlert] = useState(false)

    const workflowSteps = [
        { id: 1, title: 'Edge Capture', desc: 'Sample collected via IoT Microcontroller (ESP32/Pi)', icon: Smartphone },
        { id: 2, title: 'AI Analysis', desc: 'Image sent to Vision API for particle classification', icon: Zap },
        { id: 3, title: 'Data Ingest', desc: 'ThingSpeak logs pH, Turbidity & TDS parameters', icon: Database },
        { id: 4, title: 'Geo-Tagging', desc: 'Coordinates mapped via Google Maps API', icon: MapIcon },
        { id: 5, title: 'Alert Dispatch', desc: 'Automatic WhatsApp/SMS via Notification API', icon: MessageSquare },
    ]

    const handleSystemSync = () => {
        setIsSyncing(true)
        setActiveStep(1)
        let step = 1
        const interval = setInterval(() => {
            step++
            setActiveStep(step)
            if (step > 5) {
                clearInterval(interval)
                setIsSyncing(false)
                setActiveStep(0)
            }
        }, 800)
    }

    return (
        <div className="space-y-8 animate-fade-in pb-20 relative">
            {/* Emergency Alert Overlay */}
            {showAlert && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-950/20 backdrop-blur-md animate-fade-in px-4">
                    <div className="max-w-md w-full glass-card p-8 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.3)] text-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto border border-red-500/50">
                            <AlertCircle className="w-8 h-8 text-red-500 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Critical Alert Dispatched</h2>
                            <p className="text-red-200 text-xs mt-2 leading-relaxed">High microplastic density detected at Sector 4. System has automatically triggered WhatsApp and SMS alerts to local authorities via Twilio Gateway.</p>
                        </div>
                        <button
                            onClick={() => setShowAlert(false)}
                            className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/20"
                        >
                            Acknowledge & Dismiss
                        </button>
                    </div>
                </div>
            )}
            {/* System Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <Layers className="w-8 h-8 text-white" />
                        </div>
                        Smart Microplastic Control System
                    </h1>
                    <p className="text-gray-400 mt-2 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        Full-Stack AI + IoT Infrastructure v4.3.0
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAlert(true)}
                        className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-sm flex items-center gap-2 hover:bg-red-500/20 transition-all"
                    >
                        <Bell className="w-4 h-4" /> Trigger Alert
                    </button>
                    <button
                        onClick={handleSystemSync}
                        disabled={isSyncing}
                        className={`btn-primary px-8 py-3 rounded-xl flex items-center gap-2 shadow-neon-blue transition-all ${isSyncing ? 'opacity-50 scale-95' : ''}`}
                    >
                        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? 'Scanning...' : 'System Sync'}
                    </button>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="flex gap-2 p-1.5 bg-dark-900 border border-white/5 rounded-2xl w-fit">
                {['flow', 'apis', 'diagnostics'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab
                            ? 'bg-white text-dark-900 shadow-xl'
                            : 'text-gray-500 hover:text-white'
                            }`}
                    >
                        {tab === 'flow' ? 'System Workflow' : tab === 'apis' ? 'Integrated APIs' : 'Infrastructure'}
                    </button>
                ))}
            </div>

            {activeTab === 'flow' && (
                <div className="grid lg:grid-cols-5 gap-4 animate-slide-up relative">
                    {isSyncing && (
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500 to-indigo-500/0 -translate-y-1/2 blur-sm animate-pulse" />
                    )}
                    {workflowSteps.map((step, i) => (
                        <div key={step.id} className="relative group">
                            <div className={`glass-card p-6 h-full flex flex-col items-center text-center space-y-4 transition-all duration-300 ${activeStep === step.id ? 'border-indigo-500 bg-indigo-500/10 scale-105' : 'border-white/5'
                                }`}>
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${activeStep === step.id ? 'bg-indigo-600 text-white' : 'bg-white/5 text-indigo-400'
                                    } shadow-xl`}>
                                    <step.icon className={`w-8 h-8 ${activeStep === step.id ? 'animate-bounce' : ''}`} />
                                </div>
                                <div>
                                    <div className={`text-[10px] font-black uppercase mb-1 tracking-tighter ${activeStep === step.id ? 'text-indigo-400' : 'text-indigo-500'
                                        }`}>Step 0{step.id}</div>
                                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                                    <p className="text-xs text-gray-400 leading-relaxed font-medium">{step.desc}</p>
                                </div>
                            </div>
                            {i < workflowSteps.length - 1 && (
                                <div className="hidden lg:flex absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 z-10">
                                    <ChevronRight className={`w-6 h-6 ${activeStep === step.id ? 'text-indigo-500 scale-125' : 'text-gray-700'}`} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'apis' && (
                <div className="grid lg:grid-cols-3 gap-6 animate-slide-up">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Interactive API Manager */}
                        <div className="glass-card p-6 border-indigo-500/10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-indigo-400" /> API Configuration Management
                                </h3>
                                <button className="text-[10px] font-black text-indigo-400 uppercase hover:underline">Documentation & SDKs</button>
                            </div>
                            <div className="space-y-4">
                                {apis.map((api, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl bg-dark-950 flex items-center justify-center ${api.color}`}>
                                                <api.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{api.name}</div>
                                                <div className="text-[10px] text-gray-500">Endpoint: <span className="text-indigo-400/80 font-mono">https://api.system.v1/{api.name.toLowerCase().replace(' ', '-')}</span></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="flex flex-col items-end">
                                                <div className="text-[10px] text-gray-400 mb-1">Monthly Usage</div>
                                                <div className="w-24 h-1 rounded-full bg-white/5">
                                                    <div className="h-full bg-emerald-500" style={{ width: `${60 + i * 8}%` }} />
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked={api.status === 'Online' || api.status === 'Active'} />
                                                <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Usage Metrics */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="glass-card p-6 bg-gradient-to-br from-purple-600/5 to-transparent border-purple-500/10">
                                <h4 className="text-sm font-bold text-white mb-4">Total Request Volume</h4>
                                <div className="text-3xl font-black text-white mb-1">1.2M</div>
                                <div className="text-xs text-emerald-400 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> +12.4% from last week
                                </div>
                                <div className="mt-4 flex gap-1 items-end h-16">
                                    {[20, 45, 30, 60, 40, 75, 50, 90, 65, 80].map((h, i) => (
                                        <div key={i} className="flex-1 bg-purple-500/20 rounded-t-sm hover:bg-purple-500/50 transition-colors" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                            </div>
                            <div className="glass-card p-6 bg-gradient-to-br from-emerald-600/5 to-transparent border-emerald-500/10">
                                <h4 className="text-sm font-bold text-white mb-4">Average Latency</h4>
                                <div className="text-3xl font-black text-white mb-1">242ms</div>
                                <div className="text-xs text-blue-400 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" /> Optimizing via Edge Nodes
                                </div>
                                <div className="mt-4 flex gap-1 items-end h-16">
                                    {[80, 65, 90, 50, 75, 40, 60, 30, 45, 20].map((h, i) => (
                                        <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm hover:bg-emerald-500/50 transition-colors" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* API Key Management */}
                        <div className="glass-card p-6">
                            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Key className="w-4 h-4" /> API Key Workstation
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'System Primary Key', key: 'sk_live_••••••••••••42fd' },
                                    { label: 'Hardware IoT Hook', key: 'ih_prod_••••••••••••99ab' },
                                    { label: 'Public Map Token', key: 'mt_pk_••••••••••••7c00' },
                                ].map((k, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">{k.label}</span>
                                            <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
                                                <Share2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <code className="text-[10px] text-white font-mono bg-black/40 px-2 py-1 rounded truncate flex-1">{k.key}</code>
                                            <button className="p-1.5 rounded-lg bg-white/5 text-gray-500 hover:text-white transition-all">
                                                <RefreshCw className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full py-3 rounded-xl border border-dashed border-indigo-500/30 text-indigo-400 text-xs font-black uppercase tracking-widest hover:bg-indigo-500/5 transition-all mt-2">
                                    + Generate New Access Token
                                </button>
                            </div>
                        </div>

                        {/* Webhook Center */}
                        <div className="glass-card p-6 bg-gradient-to-br from-indigo-600/10 to-transparent">
                            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4">Webhook Receiver</h3>
                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 mb-4">
                                <div className="text-[10px] text-emerald-400 font-bold mb-1 uppercase tracking-tighter">Status: Listening</div>
                                <div className="text-xs text-white truncate">https://aqua-pure.io/hooks/monitor</div>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { event: 'data.inbound', time: 'Just now' },
                                    { event: 'alert.high_density', time: '12m ago' },
                                    { event: 'system.health_check', time: '1h ago' },
                                ].map((ev, i) => (
                                    <div key={i} className="flex justify-between items-center text-[10px]">
                                        <span className="text-indigo-400 font-mono italic">{ev.event}</span>
                                        <span className="text-gray-600 uppercase font-black">{ev.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'diagnostics' && (
                <div className="grid lg:grid-cols-3 gap-6 animate-slide-up">
                    <div className="lg:col-span-2 glass-card p-8 border-indigo-500/10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <Activity className="w-5 h-5 text-emerald-400" /> Infrastructure Real-time Health
                            </h3>
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                99.98% Uptime
                            </span>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                            {[
                                { label: 'CPU Load', val: '14%', color: 'from-blue-500 to-cyan-500', width: '14%' },
                                { label: 'Memory', val: '2.4 GB', color: 'from-indigo-500 to-purple-500', width: '38%' },
                                { label: 'Net I/O', val: '42 MB/s', color: 'from-emerald-500 to-teal-500', width: '62%' },
                            ].map((stat, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all group">
                                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 group-hover:text-indigo-400">{stat.label}</div>
                                    <div className="text-2xl font-black text-white">{stat.val}</div>
                                    <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                                        <div className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-1000`} style={{ width: stat.width }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Terminal className="w-3 h-3" /> Active Edge Nodes
                            </h4>
                            <div className="grid gap-3">
                                {[
                                    { node: 'HUB-SR-01', location: 'Main Reservoir', load: 'Optimized', ping: '12ms' },
                                    { node: 'HUB-IB-04', location: 'Industrial Bypass', load: 'High', ping: '24ms' },
                                    { node: 'HUB-NI-09', location: 'North Intake', load: 'Optimized', ping: '14ms' },
                                ].map((node, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-all group cursor-default">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] group-hover:animate-ping" />
                                            <div>
                                                <div className="text-sm font-bold text-white font-mono group-hover:text-indigo-400 transition-colors">{node.node}</div>
                                                <div className="text-[10px] text-gray-500 uppercase font-black">{node.location}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Status</div>
                                                <div className={`text-xs font-black uppercase ${node.load === 'High' ? 'text-amber-500' : 'text-emerald-500'}`}>{node.load}</div>
                                            </div>
                                            <div className="text-right min-w-[50px]">
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Latency</div>
                                                <div className="text-xs font-mono text-white group-hover:text-blue-400 transition-colors">{node.ping}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="glass-card p-6 border-indigo-500/20 bg-gradient-to-br from-indigo-600/5 to-transparent">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Security Protocols
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'End-to-End Encryption', status: 'Active' },
                                    { label: 'Firewall Layer 7', status: 'Active' },
                                    { label: 'Intrusion Detection', status: 'Monitoring' },
                                ].map((p, i) => (
                                    <div key={i} className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-white/2">
                                        <span className="text-gray-400 font-medium">{p.label}</span>
                                        <span className="flex items-center gap-1.5 text-emerald-400 font-black uppercase tracking-tighter italic">
                                            <Check className="w-3 h-3" /> {p.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card p-6 bg-gradient-to-tr from-amber-600/10 to-transparent border-amber-500/20 group">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                                    <Zap className="w-4 h-4" /> Failover System
                                </h3>
                                <div className="px-1.5 py-0.5 rounded bg-amber-500/20 text-[8px] text-amber-400 font-black uppercase tracking-widest">Ready</div>
                            </div>
                            <p className="text-[11px] text-gray-400 leading-relaxed mb-6">Redundant server node in <span className="text-white font-bold">Bangalore-East</span> is on standby. Automatic switchover in case of 500ms+ latency.</p>
                            <button className="w-full py-3 rounded-xl border border-amber-500/30 text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all shadow-lg hover:shadow-amber-500/20">
                                Perform Failover Test
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
                {/* API Status Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-8 border-indigo-500/10 bg-gradient-to-br from-indigo-950/20 to-transparent">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <LinkIcon className="w-5 h-5 text-indigo-400" /> Primary API Ecosystem
                            </h3>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-emerald-500 uppercase animate-pulse">Live Connections</span>
                                <button
                                    onClick={() => {
                                        setIsPingingAll(true)
                                        setTimeout(() => {
                                            const newApis = apis.map(api => ({
                                                ...api,
                                                latency: `${Math.floor(Math.random() * 800 + 50)}ms`,
                                                status: Math.random() > 0.1 ? 'Online' : 'Degraded'
                                            }))
                                            setApis(newApis)
                                            setIsPingingAll(false)
                                        }, 1500)
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                                >
                                    <RefreshCw className={`w-3 h-3 ${isPingingAll ? 'animate-spin' : ''}`} />
                                    Ping All Nodes
                                </button>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            {apis.map((api, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl bg-dark-950 flex items-center justify-center ${api.color}`}>
                                            <api.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white flex items-center gap-2">
                                                {api.name}
                                                <span className="px-1.5 py-0.5 rounded bg-white/5 text-[8px] text-gray-500 uppercase">{api.category}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">Global Latency: <span className="text-white font-mono">{api.latency}</span></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="hidden md:flex flex-col items-end">
                                            <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${Math.floor(Math.random() * 40 + 40)}%` }} />
                                            </div>
                                            <span className="text-[8px] text-gray-600 mt-1 uppercase font-black tracking-widest">Traffic Load</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${api.status === 'Online' || api.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                <span className={`text-[10px] font-black uppercase ${api.status === 'Online' || api.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>{api.status}</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newApis = [...apis]
                                                    newApis[i] = { ...newApis[i], status: 'Testing...', latency: '---' }
                                                    setApis(newApis)
                                                    setTimeout(() => {
                                                        newApis[i] = {
                                                            ...newApis[i],
                                                            status: 'Online',
                                                            latency: `${Math.floor(Math.random() * 500 + 40)}ms`
                                                        }
                                                        setApis([...newApis])
                                                    }, 1000)
                                                }}
                                                className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                                                title="Re-test Connection"
                                            >
                                                <Zap className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sensor Data Deep Dive */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="glass-card p-6 bg-gradient-to-br from-blue-600/5 to-transparent border-blue-500/10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-white text-lg">ThingSpeak Ingest</h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: 'pH Level', val: '7.4', status: 'Optimal' },
                                    { label: 'Turbidity', val: '1.2 NTU', status: 'Good' },
                                    { label: 'TDS', val: '180 ppm', status: 'Normal' },
                                ].map((s, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                        <span className="text-xs text-gray-400">{s.label}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-mono font-bold text-white">{s.val}</span>
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-bold uppercase">{s.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card p-6 bg-gradient-to-br from-red-600/5 to-transparent border-red-500/10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-white text-lg">Alert Gateway</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] text-red-200">
                                    <span className="font-black">CRITICAL:</span> High polymer density detected in Sector 4. WhatsApp alert queued for local authorities.
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest px-1">
                                    <span>Twilio Status: Ready</span>
                                    <span className="text-emerald-500">Queue: 0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Specs Sidebar */}
                <div className="space-y-6">
                    <div className="glass-card p-6 border-indigo-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <ShieldCheck className="w-32 h-32 text-white" />
                        </div>
                        <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4">Architecture Specs</h4>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="text-[10px] text-gray-400 font-bold uppercase">UI Framework</div>
                                <div className="text-white font-bold flex items-center justify-between">
                                    React 18.2 <span className="text-[10px] text-emerald-500">Stable</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] text-gray-400 font-bold uppercase">Vision Model</div>
                                <div className="text-white font-bold">GPT-4o / Azure Custom</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] text-gray-400 font-bold uppercase">IoT Protocol</div>
                                <div className="text-white font-bold">MQTT over SSL / TLS</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] text-gray-400 font-bold uppercase">Visualization</div>
                                <div className="text-white font-bold">Grafana / Chart.js / Tableau</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 bg-gradient-to-br from-amber-600/5 to-transparent border-amber-500/10">
                        <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4">Env Correlation</h4>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                            <Cloud className="w-8 h-8 text-amber-400" />
                            <div>
                                <div className="text-xl font-bold text-white">32°C / 84% Hum</div>
                                <div className="text-[10px] text-gray-400 font-medium">High humidity may impact sensor condensation.</div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 rounded-lg bg-white/5 text-[10px] text-gray-500 leading-relaxed italic">
                            "System automatically adjusted pH calibration offset based on OpenWeather real-time temperature fluctuations."
                        </div>
                    </div>

                    <div className="glass-card p-6 overflow-hidden">
                        <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4">Geo-Map Nodes</h4>
                        <div className="h-48 relative rounded-xl overflow-hidden shadow-inner border border-white/5">
                            <GeoNodesMap />
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Syncing Live via Google Maps API</span>
                            <button className="text-[10px] text-blue-400 font-black uppercase tracking-widest hover:text-blue-300 transition-colors">
                                View Full Map
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
