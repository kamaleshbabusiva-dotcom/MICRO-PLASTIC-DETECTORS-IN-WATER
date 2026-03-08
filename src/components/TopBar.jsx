import { Bell, Search, AlertTriangle, Droplets } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function TopBar() {
    const { profile } = useAuth()

    return (
        <header className="h-16 bg-dark-950/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search sites, sensors, reports..."
                        className="pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 w-64 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Today's purity stat */}
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-bold text-white">94.8%</span>
                    <span className="text-xs text-gray-500 uppercase font-black tracking-tighter">Site Purity</span>
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-[10px] text-white flex items-center justify-center font-bold">5</span>
                </button>

                {/* Complaints Quick Access */}
                <Link
                    to="/safety"
                    className="p-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 transition-colors group"
                    title="Active Complaints"
                >
                    <AlertTriangle className="w-5 h-5 text-orange-400 group-hover:text-orange-300" />
                </Link>

                {/* Inspector Greeting */}
                <div className="hidden lg:block text-right">
                    <div className="text-sm font-bold text-white tracking-tight">
                        Protocol Active 👋
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{profile?.name || 'Inspector Arjun'}</div>
                </div>
            </div>
        </header>
    )
}
