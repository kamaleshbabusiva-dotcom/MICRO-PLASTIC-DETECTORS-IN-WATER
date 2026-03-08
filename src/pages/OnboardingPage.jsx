import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { calculateStepGoal } from '../utils/stepGoals'
import { ChevronRight, ChevronLeft, User, Droplets, Activity, Shield, FlaskConical, Camera, Phone, Check, Waves, ShieldAlert } from 'lucide-react'

const steps = ['Identity', 'Specialty', 'Expertise', 'Mode', 'Protocol', 'Ready']

export default function OnboardingPage() {
    const { completeOnboarding, user } = useAuth()
    const [step, setStep] = useState(0)
    const [formData, setFormData] = useState({
        name: user?.user_metadata?.full_name || user?.user_metadata?.name || 'Arjun Mehta',
        experience: 5,
        profession: 'Urban Reservoir Specialist',
        level: 'Senior Inspector',
        sensitivity: 'High Precision',
        authorityName: 'Central Pollution Board',
        authorityPhone: '1800-425-1234',
        authorityRelation: 'Official Agency',
    })

    const update = (key, value) => setFormData({ ...formData, [key]: value })

    const handleComplete = () => {
        // Mocking goal calculation for water purity
        const goals = {
            daily: 95,
            weekly: 92,
            monthly: 90,
            professionLabel: formData.profession,
            sittingHours: 0
        }
        completeOnboarding({
            ...formData,
            stepGoal: goals,
            avatar: user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
            email: user?.email || 'arjun.mehta@waterwatch.org',
            isOnboarded: true
        })
    }

    const canProceed = () => {
        if (step === 0) return formData.name.length > 2
        return true
    }

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                                <User className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">Inspector Identity</h2>
                            <p className="text-gray-400">Verifying your credentials for the AquaPure Network</p>
                        </div>
                        <div className="space-y-4 max-w-md mx-auto">
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 px-1">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => update('name', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g. Inspector Arjun Mehta"
                                />
                            </div>
                            <div className="glass-card p-4 border-blue-500/10">
                                <p className="text-sm text-blue-300 leading-relaxed">
                                    🛡️ Your identity is verified on the blockchain to ensure all water quality reports are legally admissible.
                                </p>
                            </div>
                        </div>
                    </div>
                )

            case 1:
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                                <Droplets className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="font-display text-3xl font-bold text-white mb-2">Water Specialty</h2>
                            <p className="text-gray-400">Select the primary ecosystem you monitor</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                            {['Urban Reservoir', 'Industrial River', 'Coastal Ocean', 'Arctic Melt', 'Groundwater', 'Marshlands'].map(prof => (
                                <button
                                    key={prof}
                                    onClick={() => update('profession', prof)}
                                    className={`p-4 rounded-xl text-left transition-all duration-300 ${formData.profession === prof
                                        ? 'bg-blue-600/20 border border-blue-500/50 text-white shadow-lg'
                                        : 'bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="text-xs font-bold uppercase tracking-tight">{prof}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                                <FlaskConical className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="font-display text-3xl font-bold text-white mb-2">Expertise Level</h2>
                            <p className="text-gray-400">Certification level defines your data weighting</p>
                        </div>
                        <div className="space-y-4 max-w-md mx-auto">
                            {['Junior Watcher', 'Certified Inspector', 'Senior Overseer'].map((lvl, i) => {
                                const descriptions = [
                                    'Crowdsourced data • Lower reliability weight • Community focused',
                                    'Professional sensor kit • Standard verified feed • Government integrated',
                                    'Advanced lab-grade IoT • Deep chemical analysis • Authority status',
                                ]
                                return (
                                    <button
                                        key={lvl}
                                        onClick={() => update('level', lvl)}
                                        className={`w-full p-5 rounded-xl text-left transition-all duration-300 ${formData.level === lvl
                                            ? `bg-blue-600/20 border border-blue-400/50 text-white shadow-lg`
                                            : 'bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="font-display font-bold text-lg">{lvl}</div>
                                        <div className="text-xs opacity-60 mt-1 leading-relaxed">{descriptions[i]}</div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4">
                                <Activity className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="font-display text-3xl font-bold text-white mb-2">Detection Mode</h2>
                            <p className="text-gray-400">Adjust sensor sensitivity for microplastic fragments</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                            {['Eco-Saver', 'Standard', 'High-Precision', 'Molecular Spike'].map(d => (
                                <button
                                    key={d}
                                    onClick={() => update('sensitivity', d)}
                                    className={`p-4 rounded-xl text-left transition-all duration-300 ${formData.sensitivity === d
                                        ? 'bg-emerald-600/20 border border-emerald-500/50 text-white shadow-lg'
                                        : 'bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <span className="text-xs font-bold uppercase tracking-widest">{d}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                                <ShieldAlert className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="font-display text-3xl font-bold text-white mb-2">Authority Protocol</h2>
                            <p className="text-gray-400">Regulatory agency to receive your incident reports</p>
                        </div>
                        <div className="space-y-4 max-w-md mx-auto">
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 px-1">Agency Name</label>
                                <input
                                    type="text"
                                    value={formData.authorityName}
                                    onChange={e => update('authorityName', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g. Central Pollution Board"
                                />
                            </div>
                            <div className="glass-card p-4 bg-blue-500/5 border-blue-500/10">
                                <p className="text-xs text-blue-300 leading-relaxed font-medium">
                                    🚨 All critical spikes (&gt;500 p/L) will be auto-reported to this agency via an encrypted tunnel.
                                </p>
                            </div>
                        </div>
                    </div>
                )

            case 5:
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div className="text-center">
                            <div className="w-24 h-24 rounded-full bg-blue-600 mt-4 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] animate-pulse">
                                <Waves className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="font-display text-4xl font-black text-white mb-2 tracking-tighter mt-8">PROTOCOL READY</h2>
                            <p className="text-gray-400 uppercase tracking-widest text-xs font-black">AquaPure Detect Activation Sequence Complete</p>
                        </div>
                        <div className="max-w-md mx-auto space-y-4">
                            <div className="glass-card p-6 border-blue-500/20">
                                <h3 className="font-display font-bold text-white mb-4 text-center">Monitoring Targets</h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="font-display text-2xl font-black text-blue-400">95%</div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase mt-1">Daily Goal</div>
                                    </div>
                                    <div>
                                        <div className="font-display text-2xl font-black text-cyan-400">0.05</div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase mt-1">ppb Limit</div>
                                    </div>
                                    <div>
                                        <div className="font-display text-2xl font-black text-emerald-400">IoT</div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase mt-1">Status</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 flex flex-col items-center">
                                <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest">
                                    <Shield className="w-3 h-3" /> Encrypted Feed Hash: 0x8a2...3f
                                </div>
                            </div>
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="min-h-screen bg-hero-gradient flex flex-col items-center justify-center p-4">
            {/* Progress Bar */}
            <div className="w-full max-w-lg mb-8">
                <div className="flex items-center justify-between mb-3">
                    {steps.map((s, i) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${i <= step
                                ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/40'
                                : 'bg-white/10 text-gray-600'
                                }`}>
                                {i < step ? '✓' : i + 1}
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`w-8 sm:w-16 h-0.5 mx-1 transition-all duration-500 ${i < step ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-white/10'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{steps[step]}</div>
            </div>

            {/* Step Content */}
            <div className="glass-card p-10 w-full max-w-2xl min-h-[550px] flex flex-col border-white/5 shadow-2xl">
                <div className="flex-1">
                    {renderStep()}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
                    <button
                        onClick={() => setStep(Math.max(0, step - 1))}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${step === 0 ? 'invisible' : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>
                    {step < steps.length - 1 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            disabled={!canProceed()}
                            className="bg-blue-600 px-8 py-3 rounded-xl text-white font-black text-xs uppercase tracking-widest hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-30 flex items-center gap-2"
                        >
                            Continue
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleComplete}
                            className="px-10 py-4 rounded-xl font-black text-white text-xs uppercase tracking-[0.2em] transition-all duration-500 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 flex items-center gap-3"
                        >
                            Initialize Monitor <Waves className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
