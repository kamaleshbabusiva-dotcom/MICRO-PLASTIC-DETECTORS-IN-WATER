import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MusicPlayer from './MusicPlayer';
import Chatbot from './Chatbot';
import { Droplets, Home, Camera, MessageSquare, User, Menu, Plus } from 'lucide-react';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-dark-950 text-white font-sans overflow-hidden">
            {/* Sidebar - Responsive Drawer */}
            <div className={`fixed inset-0 z-50 transition-opacity duration-300 lg:relative lg:z-0 lg:opacity-100 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none lg:pointer-events-auto'
                }`}>
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-0' : ''}`}>
                {/* Mobile Top Bar */}
                <div className="lg:hidden flex items-center justify-between p-4 bg-dark-950/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                            <Droplets className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-sm">AquaPure</span>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/10" />
                </div>

                {/* Desktop TopBar */}
                <div className="hidden lg:block">
                    <TopBar />
                </div>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6 pb-32 overflow-y-auto custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>

                {/* Bottom Mobile Nav (For native app flow) */}
                <div className="lg:hidden fixed bottom-4 left-4 right-4 h-16 bg-dark-900/90 backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center justify-around px-2 z-40 shadow-2xl">
                    <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 flex-1 py-1 transition-all ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                        <div className={`p-1 rounded-lg ${window.location.pathname === '/' ? 'bg-blue-500/10' : ''}`}>
                            <Home className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-tighter">Home</span>
                    </NavLink>
                    <NavLink to="/scanner" className={({ isActive }) => `flex flex-col items-center gap-1 flex-1 py-1 transition-all ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                        <div className={`p-1 rounded-lg ${window.location.pathname === '/scanner' ? 'bg-blue-500/10' : ''}`}>
                            <Camera className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-tighter">Scanner</span>
                    </NavLink>

                    {/* Floating Center Button for Action */}
                    <div className="relative -top-6">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/40 border-4 border-dark-950 text-white animate-bounce-slow">
                            <Plus className="w-6 h-6" />
                        </div>
                    </div>

                    <NavLink to="/social" className={({ isActive }) => `flex flex-col items-center gap-1 flex-1 py-1 transition-all ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                        <div className={`p-1 rounded-lg ${window.location.pathname === '/social' ? 'bg-blue-500/10' : ''}`}>
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-tighter">Social</span>
                    </NavLink>

                    <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center gap-1 flex-1 py-1 transition-all ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                        <div className={`p-1 rounded-lg ${window.location.pathname === '/profile' ? 'bg-blue-500/10' : ''}`}>
                            <User className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-tighter">Profile</span>
                    </NavLink>

                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${isSidebarOpen ? 'text-blue-400' : 'text-gray-500'}`}
                    >
                        <div className="p-1 rounded-lg">
                            <Menu className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-tighter">Menu</span>
                    </button>
                </div>

                {/* Music Player (Desktop Only or Mini Player) */}
                <div className="hidden lg:block">
                    <MusicPlayer />
                </div>

                {/* Floating Chatbot */}
                <Chatbot />
            </div>
        </div>
    );
};

export default Layout;
