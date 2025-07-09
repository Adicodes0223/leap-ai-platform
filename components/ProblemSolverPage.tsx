import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { View, ProblemSolverResponse, ProblemSolverSession, Clarification } from '../types';
import { generateProblemSolution } from '../services/geminiService';
import ProblemSolverInputForm from './ProblemSolverInputForm';
import ProblemSolverDisplay from './ProblemSolverDisplay';
import LoadingSpinner from './LoadingSpinner';

// Type Guard
function isProblemSolverResponse(response: any): response is ProblemSolverResponse {
    return response && response.rootCause !== undefined;
}

const ProblemSolverPage: React.FC<{ onNavigate: (view: View, profileId?: string) => void }> = ({ onNavigate }) => {
    const { currentUser, updateCurrentUser } = useAuth();
    const [problem, setProblem] = useState('');
    const [solution, setSolution] = useState<ProblemSolverResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    const history = currentUser?.problemSolverHistory || [];

    const handleSolveProblem = async (problemText: string) => {
        if (!currentUser) return;
        setIsLoading(true);
        setError(null);
        setSolution(null);
        setProblem(problemText);
        setIsSaved(false);

        try {
            const result = await generateProblemSolution(problemText, currentUser);
            if (isProblemSolverResponse(result)) {
                setSolution(result);
            } else {
                setError((result as Clarification).clarificationNeeded || "The AI returned an unexpected response format.");
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveSolution = () => {
        if (!solution || !currentUser) return;
        const newSession: ProblemSolverSession = {
            id: `solver-${Date.now()}`,
            date: new Date().toISOString(),
            problem: problem,
            solution: solution,
        };
        const updatedHistory = [newSession, ...(currentUser.problemSolverHistory || [])];
        updateCurrentUser({ problemSolverHistory: updatedHistory });
        setIsSaved(true);
    };

    const loadHistoricSolution = (session: ProblemSolverSession) => {
        setProblem(session.problem);
        setSolution(session.solution);
        setIsSaved(true); // It's already saved if it's in history
        window.scrollTo(0, 0); // Scroll to top to see the result
    };
    
    // Access Control
    if (currentUser?.role !== 'Founder') {
        return (
            <div className="text-center p-8 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                <h3 className="text-2xl font-bold">Exclusive Founder Tool</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">The Startup Problem-Solver is only available for users with the 'Founder' role.</p>
                <button onClick={() => onNavigate('profile', currentUser?.id)} className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg">Update Profile</button>
            </div>
        )
    }
    
    if (!currentUser.startup) {
         return (
            <div className="text-center p-8 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                <h3 className="text-2xl font-bold">Complete Your Profile</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">Please complete your startup profile to use the Problem-Solver.</p>
                 <button onClick={() => onNavigate('profile', currentUser?.id)} className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg">Go to Profile</button>
            </div>
        )
    }

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Startup Problem-Solver</h2>
                <p className="mt-2 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Welcome to your 24/7 Growth Consultant — let’s fix what’s broken and build what scales.</p>
            </div>
            
            {/* Display solution if available, otherwise show input form */}
            {isLoading ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="text-center p-4 bg-red-100 dark:bg-red-900/50 rounded-lg text-red-600 dark:text-red-300">
                    <p className="font-bold">An error occurred:</p>
                    <p>{error}</p>
                </div>
            ) : solution ? (
                <ProblemSolverDisplay problem={problem} solution={solution} onSave={handleSaveSolution} isSaved={isSaved} />
            ) : (
                <ProblemSolverInputForm onSubmit={handleSolveProblem} isLoading={isLoading} />
            )}

            {/* History Section */}
            {history.length > 0 && (
                <div className="mt-16">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Past Solutions</h3>
                    <div className="space-y-3">
                        {history.map(session => (
                            <button
                                key={session.id}
                                onClick={() => loadHistoricSolution(session)}
                                className="w-full text-left p-4 rounded-lg bg-white/40 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/70 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <p className="font-semibold text-slate-700 dark:text-slate-200 truncate">{session.problem}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(session.date).toLocaleString()}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProblemSolverPage;