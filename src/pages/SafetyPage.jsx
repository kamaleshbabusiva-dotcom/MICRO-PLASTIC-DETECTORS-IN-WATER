import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
    AlertTriangle, Phone, MapPin, Droplets, Plus, Trash2, Clock, Send, Bell, Navigation, MessageSquare, ShieldAlert
} from 'lucide-react'
import LocationMap from '../components/LocationMap'

export default function SafetyPage() {
    const { profile, userRole } = useAuth()
    const isAdmin = userRole === 'admin'
    const [complaints, setComplaints] = useState([
        { id: 1, title: 'Chemical Runoff', site: 'Site-4 Ganges North', status: 'In Review', severity: 'High', date: 'Oct 24, 2024', user: 'Farmer Rohan', healthImpact: 'Skin Irritation' },
        { id: 2, title: 'Plastic Waste Spike', site: 'Bellandur Site', status: 'Investigating', severity: 'Medium', date: 'Oct 22, 2024', user: 'Citizen Priya', healthImpact: 'None' },
        { id: 3, title: 'Turbidity Alert', site: 'Hesaraghatta', status: 'Resolved', severity: 'Low', date: 'Oct 20, 2024', user: 'Local Resident', healthImpact: 'Nausea' },
    ])
    const [showAddComplaint, setShowAddComplaint] = useState(false)
    const [newComplaint, setNewComplaint] = useState({ title: '', site: '', healthImpact: '' })
    const [isSOSActive, setIsSOSActive] = useState(false)

    const authorityContact = {
        name: 'Central Pollution Board',
        phone: '1800-425-1234',
        department: 'Environmental Safety Division',
    }

    const reportHistory = [
        { time: '08:30 AM', event: 'Sensor Calibration', status: 'Completed' },
        { time: '10:15 AM', event: 'Turbidity Spike Detected', status: 'Alert Sent' },
        { time: '11:00 AM', event: 'Manual Sample Collected', status: 'In Lab' },
        { time: '02:45 PM', event: 'AI Model Verification', status: 'Verified' },
        { time: '06:30 PM', event: 'Daily Report Generated', status: 'Active' },
    ]

    const addComplaint = () => {
        if (newComplaint.title) {
            setComplaints([{
                id: Date.now(),
                title: newComplaint.title,
                site: newComplaint.site || 'General Site',
                status: 'Open',
                severity: 'New',
                user: 'You (Citizen)',
                healthImpact: newComplaint.healthImpact || 'None',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            }, ...complaints])
            setNewComplaint({ title: '', site: '', healthImpact: '' })
            setShowAddComplaint(false)
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                        <AlertTriangle className={`w-8 h-8 ${isAdmin ? 'text-amber-400' : 'text-blue-400'}`} />
                        {isAdmin ? 'Citizen Complaints Desk' : 'Incident Reports'}
                    </h1>
                    <p className="text-gray-400 mt-1">
                        {isAdmin ? 'Management of public health reports and pollution grievances' : 'Official reports, pollution alerts, and authority coordination'}
                    </p>
                </div>
                {/* {!isAdmin && (
                    <button
                        onClick={() => setShowAddComplaint(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Submit Incident Report
                    </button>
                )} */}
            </div>

            {/* Modal for adding incident (modified with health impact) */}
            {showAddComplaint && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/60 backdrop-blur-sm">
                    <div className="glass-card w-full max-w-md p-6 space-y-4 shadow-neon-blue border-blue-500/30">
                        <h2 className="text-xl font-bold text-white">Report Pollution & Health Issue</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold px-1">Issue Title</label>
                                <input
                                    type="text"
                                    value={newComplaint.title}
                                    onChange={e => setNewComplaint({ ...newComplaint, title: e.target.value })}
                                    placeholder="e.g., Water odor and skin rash"
                                    className="input-field w-full mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold px-1">Health Impact Noticed</label>
                                <input
                                    type="text"
                                    value={newComplaint.healthImpact}
                                    onChange={e => setNewComplaint({ ...newComplaint, healthImpact: e.target.value })}
                                    placeholder="e.g., Stomach ache, irritation"
                                    className="input-field w-full mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold px-1">Affected Site</label>
                                <select
                                    value={newComplaint.site}
                                    onChange={e => setNewComplaint({ ...newComplaint, site: e.target.value })}
                                    className="input-field w-full mt-1 bg-dark-900 text-white"
                                >
                                    <option value="">Select a site</option>
                                    <option value="Ganges North">Ganges North</option>
                                    <option value="Bellandur Lake">Bellandur Lake</option>
                                    <option value="Coastal Zone A">Coastal Zone A</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowAddComplaint(false)} className="btn-secondary flex-1">Cancel</button>
                            <button onClick={addComplaint} className="btn-primary flex-1 shadow-neon-blue">Submit Report</button>
                        </div>
                    </div>
                </div>
            )}

            {/* SOS Emergency Broadcast Modal */}
            {isSOSActive && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-red-950/90 backdrop-blur-md animate-fade-in">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse" />
                    <div className="glass-card w-full max-w-2xl p-10 space-y-8 bg-black/40 border-red-500 shadow-[0_0_50px_rgba(220,38,38,0.4)] relative z-10 text-center animate-scale-in">
                        <div className="absolute inset-0 border-4 border-red-500/50 rounded-2xl animate-pulse pointer-events-none" />

                        <div className="w-32 h-32 rounded-full bg-red-500 shadow-[0_0_30px_rgba(220,38,38,0.8)] flex items-center justify-center mx-auto relative animate-pulse">
                            <ShieldAlert className="w-16 h-16 text-white" />
                        </div>

                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-widest mb-3">Public Emergency Broadcast</h2>
                            <p className="text-red-400 text-xl font-bold uppercase tracking-widest animate-pulse">All Nearby Citizens Notified</p>
                        </div>

                        <div className="space-y-4 text-left bg-dark-950/80 p-6 rounded-xl border border-red-500/30">
                            <div className="flex items-center gap-4 text-white">
                                <Send className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                                <span>Cell Broadcast (SMS) dispatched to 12,450 local devices within a 5km radius.</span>
                            </div>
                            <div className="flex items-center gap-4 text-white">
                                <Bell className="w-6 h-6 text-orange-400 flex-shrink-0" />
                                <span>Civil Defense Sirens activated in Sector Alpha & Beta.</span>
                            </div>
                            <div className="flex items-center gap-4 text-white">
                                <Navigation className="w-6 h-6 text-blue-400 flex-shrink-0" />
                                <span>Emergency Response Teams and HAZMAT units dispatched. ETA: 4 mins.</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsSOSActive(false)}
                            className="bg-dark-900 hover:bg-dark-800 text-red-500 font-black uppercase tracking-widest px-8 py-4 rounded-xl w-full transition-all active:scale-95 border-2 border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                        >
                            STAND DOWN / FALSE ALARM
                        </button>
                    </div>
                </div>
            )}

            {isAdmin && (
                <div className="grid lg:grid-cols-4 gap-4 mb-6">
                    <div className="glass-card p-4 border-l-4 border-red-500">
                        <div className="text-2xl font-bold text-white">24</div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Unresolved Complaints</div>
                    </div>
                    <div className="glass-card p-4 border-l-4 border-amber-500">
                        <div className="text-2xl font-bold text-white">12</div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Health Impacts Reported</div>
                    </div>
                    <div className="glass-card p-4 border-l-4 border-blue-500">
                        <div className="text-2xl font-bold text-white">85%</div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Resolution Rate</div>
                    </div>
                    <div className="glass-card p-4 border-l-4 border-emerald-500">
                        <div className="text-2xl font-bold text-white">4.2m</div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Average Response Time</div>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Instant Alert Button */}
                <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 rounded-full bg-red-500/10 border-4 border-red-500/20 flex items-center justify-center mb-6 relative">
                        <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
                        <ShieldAlert className="w-12 h-12 text-red-500" />
                    </div>
                    <h3 className="font-display font-bold text-white mb-2 text-xl uppercase tracking-wider">Pollution SOS</h3>
                    <p className="text-gray-500 text-sm mb-6">Immediate notification to local response teams</p>
                    <button
                        onClick={() => setIsSOSActive(true)}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-black text-lg shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
                        ACTIVATE ALERT
                    </button>
                </div>

                {!isAdmin ? (
                    /* Regulatory Contact Card for Citizens */
                    <div className="glass-card p-6">
                        <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                            <Phone className="w-5 h-5 text-blue-400" /> Regulatory Authority
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                                    <ShieldAlert className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-white">{authorityContact.name}</div>
                                    <div className="text-sm text-gray-400">{authorityContact.department}</div>
                                    <div className="text-sm text-blue-400 font-mono mt-1">{authorityContact.phone}</div>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                                    <Bell className="w-4 h-4 text-orange-400" />
                                    <span className="text-gray-300">Auto-Report System: <span className="text-emerald-400 font-bold">ACTIVE</span></span>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                                    <Send className="w-4 h-4 text-blue-400" />
                                    <span className="text-gray-300">IoT Direct Feed: <span className="text-emerald-400 font-bold">CONNECTED</span></span>
                                </div>
                            </div>

                            <a
                                href={`tel:${authorityContact.phone}`}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                            >
                                <Phone className="w-4 h-4" /> Official Hotline
                            </a>
                        </div>
                    </div>
                ) : (
                    /* Admin: Health Statistics / Priority Breakdown */
                    <div className="glass-card p-6">
                        <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                            <Droplets className="w-5 h-5 text-amber-400" /> Regional Priority
                        </h3>
                        <div className="space-y-3">
                            {[
                                { region: 'Ganges North', level: 85, color: 'bg-red-500' },
                                { region: 'Bellandur', level: 62, color: 'bg-orange-500' },
                                { region: 'Kaveri Basin', level: 34, color: 'bg-blue-500' },
                                { region: 'Mumbai Coastal', level: 12, color: 'bg-emerald-500' },
                            ].map((r, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400">
                                        <span>{r.region}</span>
                                        <span className="text-white">{r.level}% Risk</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${r.color}`} style={{ width: `${r.level}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <div className="text-xs text-amber-500 font-bold uppercase mb-1">Critical Insight</div>
                            <p className="text-[10px] text-gray-400 leading-relaxed">
                                80% of complaints in Ganges North mention skin irritation after the recent industrial discharge.
                            </p>
                        </div>
                    </div>
                )}

                {/* Complaints List (Wider or scrollable list) */}
                <div className="glass-card p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-bold text-white flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-blue-400" /> {isAdmin ? 'Public Grievances' : 'My Reports'}
                        </h3>
                        {isAdmin && <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase">Critical</span>}
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px] custom-scrollbar">
                        {complaints.map(complaint => (
                            <div key={complaint.id} className={`p-4 rounded-xl border transition-all group ${isAdmin ? 'bg-amber-500/5 border-white/5 hover:border-amber-500/30' : 'bg-white/5 border-white/5 hover:border-blue-500/30'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{complaint.title}</div>
                                    <div className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${complaint.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                                        complaint.severity === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
                                            'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {complaint.severity}
                                    </div>
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                    <span>{complaint.site}</span>
                                    {isAdmin && <span className="text-amber-500/80">From: {complaint.user}</span>}
                                </div>
                                {complaint.healthImpact !== 'None' && (
                                    <div className="mt-2 text-[10px] text-red-400 font-bold bg-red-500/5 p-1 px-2 rounded-lg">
                                        ⚠️ Impact: {complaint.healthImpact}
                                    </div>
                                )}
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${complaint.status === 'Resolved' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-orange-500 animate-pulse'}`} />
                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{complaint.status}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-600 font-mono">{complaint.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Monitoring Logs & Feed */}
            <div className="glass-card p-6">
                <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" /> Verified Monitoring Feed
                </h3>
                <p className="text-sm text-gray-500 mb-6">Real-time blockchain-verified logs of sensor activity and incident triggers</p>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-white/5">
                        <LocationMap locations={profile?.favoriteLocations || []} />
                    </div>

                    <div className="relative">
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10" />

                        <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {reportHistory.map((point, i) => (
                                <div key={i} className="flex items-center gap-4 relative">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${point.status === 'Alert Sent'
                                        ? 'bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                        : point.status === 'Active'
                                            ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                                            : 'bg-white/10 border border-white/20'
                                        }`}>
                                        {point.status === 'Alert Sent' ? (
                                            <AlertTriangle className="w-5 h-5 text-white" />
                                        ) : point.status === 'Active' ? (
                                            <Navigation className="w-5 h-5 text-white" />
                                        ) : (
                                            <Clock className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 glass-card p-4 hover:bg-white/5 transition-colors border-white/5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-bold text-white">{point.event}</div>
                                                <div className="text-[10px] font-mono text-gray-500 uppercase mt-1">{point.time}</div>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tight ${point.status === 'Alert Sent' ? 'text-red-400' :
                                                point.status === 'Active' ? 'text-blue-400' :
                                                    point.status === 'Verified' ? 'text-emerald-400' :
                                                        'text-gray-500'
                                                }`}>
                                                {point.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
