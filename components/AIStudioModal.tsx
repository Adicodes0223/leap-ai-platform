

import React, { useState, useEffect, useCallback } from 'react';
import { ProjectPlan, ApiResponse, Clarification } from '../types';
import { generateProjectPlan } from '../services/geminiService';
import ProjectPlanDisplay from './ProjectPlanDisplay';
import LoadingSpinner from './LoadingSpinner';
import GoogleAttribution from './GoogleAttribution';

// Type guards
function isProjectPlan(response: ApiResponse): response is ProjectPlan {
  return (response as ProjectPlan).problemUnderstanding !== undefined;
}
function isClarification(response: ApiResponse): response is Clarification {
  return (response as Clarification).clarificationNeeded !== undefined;
}

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface AIStudioModalProps {
    idea: string;
    onClose: () => void;
    onExport: (plan: ProjectPlan) => void;
}

const AIStudioModal: React.FC<AIStudioModalProps> = ({ idea, onClose, onExport }) => {
    const [plan, setPlan] = useState<ProjectPlan | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const generatePlan = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setPlan(null);
        try {
            const result = await generateProjectPlan(idea);
            if (isProjectPlan(result)) {
                setPlan(result);
            } else if (isClarification(result)) {
                setError(`Let's refine your idea! ${result.clarificationNeeded}`);
            }
        } catch (e: any) {
            setError(e.message || "An unknown error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [idea]);

    useEffect(() => {
        generatePlan();
    }, [generatePlan]);
    
    const handleExport = () => {
        if (plan) {
            onExport(plan);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-40 p-2 sm:p-4 animate-fade-in">
            <div className="w-full max-w-5xl h-full flex flex-col bg-slate-100 dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-zoom-in border border-slate-300 dark:border-slate-700">
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                         <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">LEAP Project Builder</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    {isLoading && <LoadingSpinner />}
                    
                    {error && !isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg">
                                <p className="font-bold">Oops! Something went wrong.</p>
                                <p className="mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    {plan && !isLoading && <ProjectPlanDisplay plan={plan} />}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 flex flex-wrap items-center justify-between gap-4 p-4 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                    <GoogleAttribution />
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={generatePlan}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-700 bg-slate-200 hover:bg-slate-300 dark:text-slate-200 dark:bg-slate-700/80 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                        >
                           🔄 Regenerate
                        </button>
                         <button
                            onClick={handleExport}
                            disabled={!plan || isLoading}
                            className="px-6 py-2 text-sm font-semibold rounded-lg text-slate-900 bg-teal-400 hover:bg-teal-300 dark:bg-teal-300 dark:hover:bg-teal-200 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-all duration-300 shadow-lg shadow-teal-500/20 hover:shadow-glow-teal"
                         >
                            ⬇️ Export to Student Blueprint™
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIStudioModal;
