import React, { useState, useEffect, useMemo } from 'react';
import { liveNewsData } from '../mockDB';
import { User, LiveNewsItem } from '../types';

interface LiveNewsFeedProps {
    currentUser: User | null;
    onNewsClick: (item: LiveNewsItem) => void;
}

const LiveNewsFeed: React.FC<LiveNewsFeedProps> = ({ currentUser, onNewsClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLeaving, setIsLeaving] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const userInterests = useMemo(() => {
        return currentUser?.interests?.split(',').map(i => i.trim()).filter(Boolean) || [];
    }, [currentUser]);

    const relevantNews = useMemo(() => {
        if (userInterests.length === 0) return [];
        // Show general "Startup News" and "Funding" news to everyone with any interest, plus their specific interests
        const generalInterests = ['Startup News', 'Funding'];
        const interestsToShow = [...new Set([...generalInterests, ...userInterests])];
        return liveNewsData.filter(item => item.domain && interestsToShow.includes(item.domain));
    }, [userInterests]);

    useEffect(() => {
        if (isPaused || relevantNews.length === 0) return;

        const cycleTimeout = setTimeout(() => {
            setIsLeaving(true); // Start leaving animation
            
            const changeTimeout = setTimeout(() => {
                setIsLeaving(false); // Reset animation state
                setCurrentIndex((prev) => (prev + 1) % relevantNews.length);
            }, 500); // Must be same as fade-out animation duration
            
            return () => clearTimeout(changeTimeout);
        }, 10000); // Time item is visible

        return () => clearTimeout(cycleTimeout);
    }, [currentIndex, isPaused, relevantNews]);

    if (relevantNews.length === 0) {
        return null;
    }

    const item = relevantNews[currentIndex];
    const animationClass = isLeaving ? 'animate-fade-out' : 'animate-slide-in-right';

    return (
        <div 
            key={currentIndex} // Re-trigger entry animation when item changes
            className={`fixed bottom-4 right-4 w-full max-w-xs z-50 ${animationClass}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            role="alert"
            aria-live="polite"
        >
            <div 
                onClick={() => onNewsClick(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNewsClick(item); }}
                className="block p-4 rounded-2xl shadow-xl shadow-violet-500/10 bg-black/80 backdrop-blur-md hover:bg-gradient-to-br from-blue-500/20 to-violet-500/20 transition-all group cursor-pointer"
                style={{
                    boxShadow: '0 0 25px rgba(139, 92, 246, 0.1), 0 10px 20px rgba(0,0,0,0.2)',
                    outline: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                <div className="flex items-start gap-3">
                    <span className="relative flex h-8 w-8 items-center justify-center flex-shrink-0">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex rounded-full h-8 w-8 items-center justify-center bg-slate-700 text-lg">
                            {item.icon}
                        </span>
                    </span>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-white group-hover:underline leading-tight">{item.headline}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.source}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveNewsFeed;