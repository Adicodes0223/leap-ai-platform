

import React from 'react';
import { ProjectPlan, CollaboratorProfile } from '../types';

const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293M17.707 5.293L15.414 7.586m5.657 2.414L19.414 12l1.657 1.657m-3.414 4.343l2.293 2.293m-5.656 0l2.293-2.293m-2.293 2.293L12 19.586l-2.293 2.293m-5.657-4.343L7.586 15.414 5.293 17.707m-2-5.414L3 12m0 0l-2.293-2.293" />
    </svg>
);
const PinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);


const Tag: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${className}`}>
        {children}
    </span>
);

interface CollabMatchProps {
    plan: ProjectPlan;
}

const CollabMatch: React.FC<CollabMatchProps> = ({ plan }) => {

    if (!plan.collaboratorMatches || plan.collaboratorMatches.length === 0) {
        return null; // Don't render if no matches are found
    }

    const getTagColor = (matchType: string) => {
        switch (matchType) {
            case 'Tech Collaborator': return 'bg-sky-100 text-sky-800 dark:bg-sky-900/70 dark:text-sky-300';
            case 'Design Partner': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/70 dark:text-purple-300';
            case 'Idea Co-founder': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/70 dark:text-amber-300';
            case 'Marketing/Outreach Partner': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/70 dark:text-pink-300';
            case 'Data/ML Collaborator': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/70 dark:text-indigo-300';
            default: return 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
        }
    };

    return (
        <div className="mt-16 animate-slide-up" style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}>
             <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500">CollabMatch™</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xl mx-auto">Find your perfect teammate from the LEAP community to build faster, together.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {plan.collaboratorMatches.map((match, index) => (
                    <div key={index} className="backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 rounded-xl flex flex-col overflow-hidden shadow-2xl dark:shadow-black/30 group hover:shadow-border-glow-cyan transition-all duration-300">
                        <div className="p-6 flex-grow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <img src={match.avatarUrl} alt={match.name} className="w-10 h-10 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{match.name}</h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        <PinIcon />
                                        <span>{match.location}</span>
                                        <span className="mx-2">·</span>
                                        <span>LEAP Score: <span className="font-bold text-green-600 dark:text-green-400">{match.leapScore}</span></span>
                                    </div>
                                </div>
                                <Tag className={getTagColor(match.matchType)}>{match.matchType}</Tag>
                            </div>

                            <p className="text-slate-600 dark:text-slate-300 italic border-l-4 border-teal-500/50 pl-4 pr-2 py-2 bg-slate-100/50 dark:bg-slate-900/50 rounded-r-md text-sm mb-5">"{match.matchReason}"</p>

                            <div>
                                <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2 text-sm">Top Skills:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {match.topSkills.map(skill => (
                                        <Tag key={skill} className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">{skill}</Tag>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-100/50 dark:bg-slate-900/60 p-5 mt-auto border-t border-slate-200 dark:border-slate-700/70">
                             <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2 text-sm flex items-center"><SparkleIcon />Suggested Icebreaker:</h4>
                             <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{match.icebreaker}</p>
                             <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    disabled
                                    title="Chat is available for real users. Find builders in the Explore tab!"
                                    className="w-full flex justify-center items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                                >
                                    <ChatIcon /> Start Chat
                                </button>
                             </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 rounded-lg p-6">
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">Safety First!</h4>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto text-sm">We recommend a short "First Build Together" session to get to know your new collaborator. After your project, rate your experience to help us improve future matches!</p>
            </div>
        </div>
    );
};

export default CollabMatch;