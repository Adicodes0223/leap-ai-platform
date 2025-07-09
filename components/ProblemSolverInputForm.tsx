import React, { useState } from 'react';

interface ProblemSolverInputFormProps {
    onSubmit: (problem: string) => void;
    isLoading: boolean;
}

const examplePrompts = [
    "We’re losing users after onboarding.",
    "Can’t scale backend beyond 10K DAUs.",
    "Our CAC is higher than our LTV.",
    "We have traffic but no conversions.",
    "Our fundraising pitch failed, not sure why."
];

const ProblemSolverInputForm: React.FC<ProblemSolverInputFormProps> = ({ onSubmit, isLoading }) => {
    const [problem, setProblem] = useState('');
    const isDisabled = !problem.trim() || isLoading;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(problem);
    };

    return (
        <div className="p-6 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="problem-input" className="block text-xl font-medium text-slate-800 dark:text-slate-200 mb-2">
                        Describe your startup's biggest challenge
                    </label>
                    <textarea
                        id="problem-input"
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder="Be as specific as you can..."
                        rows={5}
                        className="w-full p-4 bg-white/50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-fuchsia-500 dark:focus:ring-fuchsia-400 transition-all duration-300 resize-none"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isDisabled}
                        className="flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 shadow-lg shadow-fuchsia-500/30"
                    >
                        {isLoading ? 'Diagnosing...' : 'Get AI Advice'}
                    </button>
                </div>
            </form>
            <div className="mt-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Need inspiration? Try one of these:</p>
                <div className="flex flex-wrap gap-2">
                    {examplePrompts.map(p => (
                        <button 
                            key={p}
                            onClick={() => setProblem(p)}
                            className="text-xs px-3 py-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProblemSolverInputForm;
