import React from 'react';
import { User, View } from '../types';

interface UserCardProps {
    user: User;
    onStartChat: (userId: string) => void;
    onNavigate: (view: View, profileId?: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onStartChat, onNavigate }) => {
    const interests = user.interests.split(',').map(s => s.trim()).slice(0, 3); // Show max 3 interests as tags

    return (
        <div 
            className="flex flex-col p-5 rounded-2xl shadow-lg backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 transition-all duration-300 hover:shadow-xl dark:hover:shadow-glow-white hover:-translate-y-1 cursor-pointer"
            onClick={() => onNavigate('profile', user.id)}
        >
            <div className="flex items-center gap-4 mb-3">
                <img src={user.profilePictureUrl} alt={user.fullName} className="w-16 h-16 rounded-full border-2 border-white/50 dark:border-slate-700" />
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{user.fullName}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{user.role}</p>
                </div>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 h-10 overflow-hidden">{user.bio}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
                {interests.map(interest => (
                    <span key={interest} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                        #{interest}
                    </span>
                ))}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card's onClick from firing
                        onStartChat(user.id);
                    }} 
                    className="w-full text-center bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 px-3 py-2 rounded-lg hover:bg-sky-200 dark:hover:bg-sky-500/30 text-sm font-semibold transition-colors"
                >
                    💬 Message
                </button>
            </div>
        </div>
    );
};

export default UserCard;