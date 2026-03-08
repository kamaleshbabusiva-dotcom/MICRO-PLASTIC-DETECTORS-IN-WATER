import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { chatGroups, chatMessages as initialMessages, neighborhoodGroups, neighborhoodMessages, groupChallenges } from '../data/mockData'
import { MessageCircle, Send, Users, Swords, Trophy, ChevronRight, Plus, Hash, UserPlus, AlertTriangle, ShieldAlert, Droplets, Target, LayoutGrid } from 'lucide-react'
import { checkContent } from '../utils/safetyFilter'
import { generateResponse } from '../utils/chatResponder'
import ChessGame from '../components/ChessGame'
import ChatPanel from '../components/ChatPanel'
import SocialStats from '../components/SocialStats'

export default function SocialPage() {
    const { userRole } = useAuth()
    const groups = userRole === 'admin' ? chatGroups : neighborhoodGroups
    const initialMsgs = userRole === 'admin' ? initialMessages : neighborhoodMessages

    const [activeTab, setActiveTab] = useState('chat')
    const [selectedGroup, setSelectedGroup] = useState(groups[0])
    const [messages, setMessages] = useState(initialMsgs)
    const [newMessage, setNewMessage] = useState('')
    const [showSafetyAlert, setShowSafetyAlert] = useState(false)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = () => {
        if (!newMessage.trim()) return

        // Safety Filter check
        const { isSafe } = checkContent(newMessage)
        if (!isSafe) {
            setShowSafetyAlert(true)
            return
        }

        const msg = {
            id: messages.length + 1,
            user: 'You',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
            text: newMessage,
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            isOwn: true,
        }
        setMessages((prevMsgs) => [...prevMsgs, msg])
        setNewMessage('')

        // Simulate an automated response
        setTimeout(() => {
            const replyData = generateResponse(selectedGroup.id, msg.text)
            const simulatedReply = {
                id: messages.length + 2 + Math.random(), // Ensure unique ID
                user: replyData.user,
                avatar: replyData.avatar,
                text: replyData.text,
                time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                isOwn: false,
            }
            setMessages((prevMsgs) => [...prevMsgs, simulatedReply])
        }, 1500 + Math.random() * 2000) // Delay between 1.5s and 3.5s
    }

    const tabs = userRole === 'admin' ? [
        { id: 'chat', label: 'Work Chat', icon: MessageCircle },
        { id: 'chess', label: 'Inspector Lounge', icon: LayoutGrid },
        { id: 'challenges', label: 'Site Operations', icon: Trophy },
    ] : [
        { id: 'chat', label: 'Neighbourhood Chat', icon: MessageCircle },
        { id: 'chess', label: 'Purity Puzzles', icon: Droplets },
        { id: 'challenges', label: 'Community Goals', icon: Target },
    ];

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col animate-fade-in pb-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                    <Users className="w-8 h-8 text-purple-400" />
                    {userRole === 'admin' ? 'Power Stations Community' : 'Neighborhood Hub'}
                </h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* <SocialStats /> Optional: Hide or move this if it takes up too much vertical space, but for now we'll keep it */}
            <SocialStats />

            {/* Chat Tab */}
            {activeTab === 'chat' && (
                <div className="flex gap-4 flex-1 min-h-[500px]">
                    {/* Group List */}
                    <div className="w-72 flex-shrink-0 glass-card p-4 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-display font-bold text-white text-sm">Channels</h3>
                            <button className="p-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                <Plus className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-1 flex-1 overflow-y-auto">
                            {groups.map(group => (
                                <button
                                    key={group.id}
                                    onClick={() => setSelectedGroup(group)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${selectedGroup.id === group.id
                                        ? 'bg-purple-500/20 border border-purple-500/30'
                                        : 'hover:bg-white/5'
                                        }`}
                                >
                                    <Hash className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-white truncate">{group.name}</div>
                                        <div className="text-xs text-gray-500">{group.members} members</div>
                                    </div>
                                    {group.unread > 0 && (
                                        <span className="w-5 h-5 rounded-full bg-purple-500 text-[10px] text-white flex items-center justify-center font-bold">
                                            {group.unread}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <button className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-gray-400 text-sm">
                            <UserPlus className="w-4 h-4" />
                            New DM
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <ChatPanel
                        selectedGroup={selectedGroup}
                        messages={messages}
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        sendMessage={sendMessage}
                        messagesEndRef={messagesEndRef}
                    />
                </div>
            )}

            {/* Chess Tab */}
            {activeTab === 'chess' && (
                <div className="flex-1 min-h-0 flex flex-col">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            {userRole === 'admin' ? <LayoutGrid className="w-5 h-5 text-indigo-400" /> : <Droplets className="w-5 h-5 text-cyan-400" />}
                            {userRole === 'admin' ? 'Strategic Inspector Lounge' : 'Hydration & Purity Puzzles'}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {userRole === 'admin' ? 'Analyze complex patterns through strategic board simulation' : 'Test your water chemistry knowledge through interactive puzzles'}
                        </p>
                    </div>
                    <ChessGame />
                </div>
            )}

            {/* Challenges Tab */}
            {activeTab === 'challenges' && (
                <div className="space-y-4 flex-1 overflow-y-auto">
                    <div className="flex items-center justify-between">
                        <h3 className="font-display font-bold text-white">
                            {userRole === 'admin' ? 'Site Operational Challenges' : 'Regional Restoration Projects'}
                        </h3>
                        <button className="btn-primary text-sm flex items-center gap-2 shadow-neon-blue">
                            <Plus className="w-4 h-4" /> {userRole === 'admin' ? 'Issue Protocol' : 'Propose Project'}
                        </button>
                    </div>
                    {groupChallenges.map(challenge => (
                        <div key={challenge.id} className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-display font-bold text-white">{challenge.name}</h4>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${challenge.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                    }`}>
                                    {challenge.status === 'active' ? '🔥 Active' : '⏰ Upcoming'}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-4 items-center">
                                {/* Team A */}
                                <div className="text-center">
                                    <div className="text-3xl mb-2">{challenge.teamA.avatar}</div>
                                    <div className="text-sm font-bold text-white">{challenge.teamA.name}</div>
                                    <div className="text-xs text-gray-500">{challenge.teamA.members} members</div>
                                    <div className="text-lg font-display font-bold text-blue-400 mt-2">
                                        {challenge.teamA.purity || challenge.teamA.steps}%
                                    </div>
                                </div>

                                {/* VS */}
                                <div className="text-center">
                                    <div className="font-display text-2xl font-black text-gray-600">VS</div>
                                    <div className="text-xs text-gray-500 mt-1">Ends in {challenge.endsIn}</div>
                                    <div className="text-xs text-amber-400 mt-1">🏆 {challenge.prize}</div>
                                </div>

                                {/* Team B */}
                                <div className="text-center">
                                    <div className="text-3xl mb-2">{challenge.teamB.avatar}</div>
                                    <div className="text-sm font-bold text-white">{challenge.teamB.name}</div>
                                    <div className="text-xs text-gray-500">{challenge.teamB.members} members</div>
                                    <div className="text-lg font-display font-bold text-purple-400 mt-2">
                                        {challenge.teamB.purity || challenge.teamB.steps}%
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {challenge.status === 'active' && (
                                <div className="mt-4">
                                    <div className="h-3 rounded-full bg-white/10 overflow-hidden flex">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000"
                                            style={{ width: `${((challenge.teamA.purity || challenge.teamA.steps) / ((challenge.teamA.purity || challenge.teamA.steps) + (challenge.teamB.purity || challenge.teamB.steps))) * 100}%` }}
                                        />
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                                            style={{ width: `${((challenge.teamB.purity || challenge.teamB.steps) / ((challenge.teamA.purity || challenge.teamA.steps) + (challenge.teamB.purity || challenge.teamB.steps))) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 flex gap-3">
                                <button className="flex-1 btn-secondary text-sm">
                                    View Details
                                </button>
                                <button className="flex-1 btn-primary text-sm shadow-neon-blue">
                                    {challenge.status === 'active' ? 'Claim Prize 🎁' : 'Join Challenge'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Danger Alert UI */}
            {showSafetyAlert && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="glass-card max-w-md w-full p-8 border-red-500/30 shadow-2xl shadow-red-500/20 animate-scale-in">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                                <ShieldAlert className="w-12 h-12 text-red-500 animate-pulse" />
                            </div>
                            <h2 className="font-display text-2xl font-bold text-white mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-6 h-6 text-amber-500" /> DANGER ALERT
                            </h2>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                Our safety filter has detected inappropriate content in your message. This violates our community guidelines regarding harassment and inappropriate behavior.
                            </p>
                            <div className="w-full space-y-3">
                                <button
                                    onClick={() => setShowSafetyAlert(false)}
                                    className="w-full py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all hover:scale-[1.02]"
                                >
                                    I Understand
                                </button>
                                <p className="text-[10px] text-gray-600">
                                    Repeated violations may lead to account suspension.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
