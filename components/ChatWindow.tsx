

import React, { useState, useEffect, useRef } from 'react';
import { CollaboratorProfile, ChatMessage } from '../types';
import { useAuth } from '../contexts/AuthContext';

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

interface ChatWindowProps {
    collaborator: CollaboratorProfile & { id: string };
    onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ collaborator, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        // Start with the icebreaker message from the collaborator
        setMessages([{
            id: `msg-${Date.now()}`,
            senderId: collaborator.id,
            text: collaborator.icebreaker,
            sender: 'collaborator',
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }]);
    }, [collaborator.id, collaborator.icebreaker]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);
    
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;

        const userMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            text: newMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        
        // Simulate collaborator typing and response
        setIsTyping(true);
        setTimeout(() => {
            const cannedResponse: ChatMessage = {
                id: `msg-${Date.now() + 1}`,
                senderId: collaborator.id,
                text: "That sounds interesting! Tell me more about your idea.",
                sender: 'collaborator',
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
            setIsTyping(false);
            setMessages(prev => [...prev, cannedResponse]);
        }, 2000 + Math.random() * 1000); // Simulate realistic delay
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="w-full max-w-2xl h-[90vh] max-h-[700px] flex flex-col bg-slate-100 dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-zoom-in border border-slate-300 dark:border-slate-700">
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <img src={collaborator.avatarUrl} alt={collaborator.name} className="w-12 h-12 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                        <div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{collaborator.name}</h3>
                            <p className="text-sm text-green-600 dark:text-green-400">{isTyping ? 'typing...' : 'Online'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'collaborator' && (
                                <img src={collaborator.avatarUrl} alt={collaborator.name} className="w-8 h-8 rounded-full self-start" />
                            )}
                            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                                msg.sender === 'user' 
                                ? 'bg-teal-500 text-white rounded-br-none' 
                                : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
                            }`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-teal-100' : 'text-slate-400 dark:text-slate-500'} text-right`}>{msg.timestamp}</p>
                            </div>
                        </div>
                    ))}
                     {isTyping && (
                        <div className="flex items-end gap-2 justify-start">
                             <img src={collaborator.avatarUrl} alt={collaborator.name} className="w-8 h-8 rounded-full self-start" />
                             <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-700 rounded-bl-none">
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                                </div>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <div className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={`Message ${collaborator.name}...`}
                            className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition"
                        />
                        <button type="submit" className="flex-shrink-0 p-3 rounded-full bg-teal-500 hover:bg-teal-600 text-white transition-colors disabled:bg-slate-400" disabled={!newMessage.trim()}>
                            <SendIcon className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
