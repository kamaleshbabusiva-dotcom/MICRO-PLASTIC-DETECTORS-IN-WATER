import { useState, useRef, useEffect } from 'react'
import { Hash, UserPlus, MessageCircle, Send, Plus } from 'lucide-react'

export default function ChatPanel({ selectedGroup, messages, newMessage, setNewMessage, sendMessage, messagesEndRef }) {
    return (
        <div className="flex-1 glass-card flex flex-col min-h-full">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
                <Hash className="w-5 h-5 text-gray-500" />
                <div>
                    <div className="font-medium text-white">{selectedGroup.name}</div>
                    <div className="text-xs text-gray-500">{selectedGroup.members} members online</div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
                        <img src={msg.avatar} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
                        <div className={`max-w-md ${msg.isOwn ? 'text-right' : ''}`}>
                            <div className="flex items-center gap-2 mb-1">
                                {!msg.isOwn && <span className="text-xs font-medium text-gray-300">{msg.user}</span>}
                                <span className="text-xs text-gray-600">{msg.time}</span>
                            </div>
                            <div className={`inline-block px-4 py-2 rounded-2xl text-base ${msg.isOwn
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-sm'
                                : 'bg-white/10 text-gray-200 rounded-bl-sm'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/5">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="input-field flex-1"
                    />
                    <button
                        onClick={sendMessage}
                        className="btn-primary px-4"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
