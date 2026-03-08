import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Lock, Unlock, AlertTriangle, FileText, Activity } from 'lucide-react';

export default function PlannerPage() {
    const [sosProtocolActive, setSosProtocolActive] = useState(false);

    // Normal Protocols
    const normalProtocols = [
        { id: 1, title: 'Routine Sensor Calibration', time: '08:00 AM', status: 'Completed' },
        { id: 2, title: 'Check Turbidity Filters', time: '11:30 AM', status: 'Pending' },
        { id: 3, title: 'Update AI Spectroscopy Models', time: '02:00 PM', status: 'Pending' },
        { id: 4, title: 'Daily Shift Log Submission', time: '06:00 PM', status: 'Pending' }
    ];

    // Emergency Protocols
    const emergencyProtocols = [
        { id: 101, title: 'SHUT DOWN INTAKE VALVES', type: 'Critical' },
        { id: 102, title: 'ACTIVATE FILTRATION OVERDRIVE', type: 'Critical' },
        { id: 103, title: 'EVACUATE PERIMETER C', type: 'High' },
        { id: 104, title: 'NOTIFY HAZMAT REGULATORS', type: 'High' }
    ];

    return (
        <div className={`min-h-full transition-all duration-700 ${sosProtocolActive ? 'bg-red-950/20' : ''}`}>
            {sosProtocolActive && (
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none animate-pulse" />
            )}

            <div className="space-y-6 relative z-10 animate-fade-in p-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className={`font-display text-3xl font-bold flex items-center gap-3 ${sosProtocolActive ? 'text-red-500' : 'text-white'}`}>
                            {sosProtocolActive ? <ShieldAlert className="w-8 h-8 animate-pulse" /> : <FileText className="w-8 h-8 text-blue-400" />}
                            {sosProtocolActive ? 'EMERGENCY PROTOCOL ACTIVE' : 'Standard Operating Protocols'}
                        </h1>
                        <p className={sosProtocolActive ? 'text-red-400 mt-1 font-bold tracking-widest uppercase' : 'text-gray-400 mt-1'}>
                            {sosProtocolActive ? 'ALL STANDARD OPERATIONS SUSPENDED. FOLLOW DIRECTIVES.' : 'Daily checklists and operational workflow'}
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {sosProtocolActive ? (
                            <div className="space-y-4">
                                {emergencyProtocols.map(proto => (
                                    <div key={proto.id} className="glass-card p-6 border-red-500/50 bg-red-500/10 flex items-center justify-between animate-slide-up relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-red-500/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className="w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-500 text-red-500 flex items-center justify-center">
                                                <AlertTriangle className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="font-black text-white text-xl uppercase tracking-widest">{proto.title}</div>
                                                <div className="text-red-400 text-sm font-bold uppercase mt-1">Priority: {proto.type}</div>
                                            </div>
                                        </div>
                                        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all active:scale-95">
                                            EXECUTE
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {normalProtocols.map(proto => (
                                    <div key={proto.id} className="glass-card p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${proto.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-500'
                                                }`}>
                                                {proto.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{proto.title}</div>
                                                <div className="text-gray-400 text-sm mt-1">{proto.time}</div>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${proto.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                            }`}>
                                            {proto.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className={`glass-card p-6 border-2 transition-colors duration-500 ${sosProtocolActive ? 'border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.3)]' : 'border-white/5'}`}>
                            <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                                <Lock className="w-5 h-5" /> Override Control
                            </h3>
                            <p className="text-sm text-gray-400 mb-6">
                                Central command override toggle. Activating SOS mode will lock all normal protocols and instantly broadcast critical directives.
                            </p>

                            <button
                                onClick={() => setSosProtocolActive(!sosProtocolActive)}
                                className={`w-full py-4 rounded-xl font-black text-lg tracking-widest uppercase transition-all duration-300 relative overflow-hidden ${sosProtocolActive
                                        ? 'bg-dark-900 text-emerald-500 border-2 border-emerald-500/50 hover:bg-emerald-950/30'
                                        : 'bg-red-600 text-white hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                                    }`}
                            >
                                {sosProtocolActive ? (
                                    <span className="flex items-center justify-center gap-2"><Unlock className="w-5 h-5" /> RESTORE NORMALCY</span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2 animate-pulse"><ShieldAlert className="w-5 h-5" /> INITIATE SOS LOCKDOWN</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
