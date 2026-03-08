import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Minimize2, Maximize2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Chatbot = () => {
    const { t, currentLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Initialize welcome message when language changes or on mount
    useEffect(() => {
        setMessages([
            { id: Date.now(), text: t('chatbot.welcome'), sender: 'bot', timestamp: new Date() }
        ]);
    }, [currentLanguage]);

    // Draggable state
    const [position, setPosition] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 200 });
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Handle dragging
    const onMouseDown = (e) => {
        setIsDragging(true);
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    useEffect(() => {
        const onMouseMove = (e) => {
            if (!isDragging) return;

            // Calculate new position
            let newX = e.clientX - dragOffset.current.x;
            let newY = e.clientY - dragOffset.current.y;

            // Constrain to window bounds
            const padding = 20;
            const width = isOpen ? 384 : 64; // w-96 is 384px, circle is 64px
            const height = isOpen ? (isMinimized ? 56 : 500) : 64;

            newX = Math.max(padding, Math.min(newX, window.innerWidth - width - padding));
            newY = Math.max(padding, Math.min(newY, window.innerHeight - height - padding));

            setPosition({ x: newX, y: newY });
        };

        const onMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [isDragging, isOpen, isMinimized]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            const botResponse = {
                id: Date.now() + 1,
                text: getBotResponse(inputValue),
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const getBotResponse = (query) => {
        const q = query.toLowerCase();
        if (q.includes('hello') || q.includes('hi') || q.includes('வணக்கம்') || q.includes('नमस्ते')) return t('chatbot.responses.hi');
        if (q.includes('workout') || q.includes('plan') || q.includes('பயிற்சி')) return t('chatbot.responses.workout');
        if (q.includes('music') || q.includes('song') || q.includes('இசை') || q.includes('acoustic') || q.includes('sonar')) return t('chatbot.responses.music');
        if (q.includes('stats') || q.includes('progress') || q.includes('புள்ளிவிவரம்') || q.includes('trends')) return t('chatbot.responses.stats');
        if (q.includes('leaderboard') || q.includes('rank')) return t('chatbot.responses.leaderboard');
        if (q.includes('water') || q.includes('purity') || q.includes('report') || q.includes('தண்ணீர்') || q.includes('community') || q.includes('clean')) return t('chatbot.responses.water');
        if (q.includes('health') || q.includes('safe') || q.includes('boil') || q.includes('ஆரோக்கியம்') || q.includes('filter') || q.includes('filtration') || q.includes('bottle') || q.includes('steel') || q.includes('glass')) return t('chatbot.responses.health');
        if (q.includes('microplastic') || q.includes('plastic') || q.includes('spectroscopy')) return t('chatbot.responses.microplastics');
        return t('chatbot.responses.default');
    };

    if (!isOpen) {
        return (
            <button
                onMouseDown={onMouseDown}
                onClick={() => !isDragging && setIsOpen(true)}
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
                className={`fixed bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg shadow-blue-500/20 transition-transform active:scale-95 z-50 group cursor-move ${isDragging ? 'scale-110' : 'hover:scale-110'}`}
            >
                <div className="absolute -top-12 right-0 bg-dark-800 text-xs px-3 py-1 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {t('chatbot.need_help')}
                </div>
                <MessageCircle size={28} />
            </button>
        );
    }

    return (
        <div
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
            className={`fixed w-96 flex flex-col bg-dark-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden ${isMinimized ? 'h-14' : 'h-[500px]'} ${isDragging ? 'cursor-grabbing select-none transition-none' : 'transition-all'}`}
        >
            {/* Header */}
            <div
                onMouseDown={onMouseDown}
                className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 cursor-grab active:cursor-grabbing"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <Bot size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">{t('chatbot.header')}</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            <span className="text-[10px] text-zinc-400">{t('chatbot.online')}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2" onMouseDown={e => e.stopPropagation()}>
                    <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-zinc-400">
                        {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-zinc-400">
                        <X size={16} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white/10 text-zinc-200 rounded-tl-none border border-white/5'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1 items-center">
                                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white/5 border-t border-white/10">
                        <div className="relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={t('chatbot.placeholder')}
                                className="w-full bg-dark-950 border border-white/10 rounded-xl py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                            <button
                                onClick={handleSend}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Chatbot;
