import React, { useMemo, useState, useRef, useEffect } from 'react';
import { trendingIdeasData } from '../mockDB';
import { useAuth } from '../contexts/AuthContext';
import { View } from '../types';
import { TrendingIdea } from '../types';

interface TrendingIdeasProps {
    onNavigate: (view: View) => void;
}

const TrendingCard: React.FC<{ idea: TrendingIdea; onCardClick: (domain: string) => void }> = ({ idea, onCardClick }) => (
    <button
        onClick={() => onCardClick(idea.domain)}
        className="group text-left flex-shrink-0 w-72 bg-white dark:bg-slate-800 rounded-2xl px-5 py-4 shadow-md transition-all duration-300 ease-in-out snap-start cursor-pointer border border-transparent hover:scale-105 hover:shadow-xl hover:backdrop-blur-md hover:bg-gradient-to-br from-purple-400/10 via-blue-400/10 to-cyan-200/10"
        style={{ willChange: 'transform, filter, backdrop-filter' }}
    >
        <div className="flex items-center gap-3">
            <span className="text-2xl transition-transform duration-300 ease-in-out group-hover:rotate-3 group-hover:scale-110">{idea.emoji}</span>
            <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-100">{idea.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{idea.description}</p>
            </div>
        </div>
    </button>
);


const ScrollHint: React.FC = () => (
    <div className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center pr-2 sm:pr-4 pointer-events-none z-20">
        <div className="w-10 h-10 rounded-full bg-slate-900/50 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center animate-bounce-horizontal shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
    </div>
);


const TrendingIdeas: React.FC<TrendingIdeasProps> = ({ onNavigate }) => {
    const { currentUser } = useAuth();
    const [showScrollHint, setShowScrollHint] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            // Hide hint if scrolled past the beginning or to the end
            if (scrollLeft > 20 || scrollLeft + clientWidth >= scrollWidth - 20) {
                setShowScrollHint(false);
            }
        }
    };
    
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            // Hide hint immediately if no scrollbar is present
            if (container.scrollWidth <= container.clientWidth) {
                setShowScrollHint(false);
                return;
            }
        }
        // Auto-hide scroll hint after a delay if user doesn't scroll
        const timer = setTimeout(() => {
            setShowScrollHint(false);
        }, 8000);

        return () => clearTimeout(timer);
    }, []);

    const ideas = useMemo(() => {
        const allIdeas = [...trendingIdeasData];
        if (currentUser && currentUser.interests) {
            const getFirstName = (fullName: string) => fullName.split(' ')[0];
            const interestsArray = currentUser.interests.split(',').map(i => i.trim());
            const mainInterest = interestsArray[0] || 'B2B SaaS';
            
            const personalizedIdea: TrendingIdea = {
                emoji: '💼',
                title: `${getFirstName(currentUser.fullName)}, explore ${mainInterest}`,
                description: `You’re 1 step away from launching an idea`,
                domain: mainInterest,
            };
            allIdeas.unshift(personalizedIdea);
        }
        return allIdeas;
    }, [currentUser]);

    const handleCardClick = (domain: string) => {
        onNavigate('project');
    };

    const getFirstName = (fullName: string) => fullName.split(' ')[0];

    return (
        <div className="my-12 relative">
             {/* Background glows for the section */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-6xl h-[400px] bg-violet-600/10 dark:bg-violet-800/20 rounded-full blur-[150px] pointer-events-none -z-10"></div>

            <div className="flex items-center gap-3 mb-6">
                 <h3 className="text-3xl font-bold">
                    {currentUser ? (
                         <span className="text-slate-800 dark:text-slate-100">
                           {getFirstName(currentUser.fullName)}, explore what’s trending 💡
                         </span>
                    ) : (
                         <span className="bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 text-transparent bg-clip-text">
                            🔥 Trending Ideas This Week
                         </span>
                    )}
                </h3>
            </div>
             {/* Scrollable container with edge fades using a mask */}
            <div
                className="relative -mx-4"
                style={{
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                    maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                }}
            >
                <div 
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex gap-4 pb-6 px-4 overflow-x-auto scroll-smooth snap-x snap-mandatory" 
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {ideas.map((idea, index) => (
                        <TrendingCard key={index} idea={idea} onCardClick={handleCardClick} />
                    ))}
                    <style>{`
                        .overflow-x-auto::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                </div>

                {showScrollHint && <ScrollHint />}
            </div>
            <p className="text-center mt-6 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                This is your weekly spark zone — dive into what’s trending and build what matters.
            </p>
        </div>
    );
};

export default TrendingIdeas;