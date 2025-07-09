
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface PitchInputFormProps {
  onSubmit: (inputs: { idea: string, targetUser: string, industry: string }) => void;
  isLoading: boolean;
}

const PitchInputForm: React.FC<PitchInputFormProps> = ({ onSubmit, isLoading }) => {
  const { currentUser } = useAuth();
  const [idea, setIdea] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const [industry, setIndustry] = useState('');

  useEffect(() => {
    if (currentUser?.startup) {
        setIdea(currentUser.startup.oneLiner);
        setTargetUser(currentUser.startup.targetAudience);
        setIndustry(currentUser.startup.domain);
    }
  }, [currentUser]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (idea.trim() && targetUser.trim() && industry.trim()) {
      onSubmit({ idea, targetUser, industry });
    }
  };

  const isDisabled = !idea.trim() || !targetUser.trim() || !industry.trim() || isLoading;

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 dark:shadow-slate-900/50 transition-all duration-300 hover:shadow-slate-300/60 dark:hover:shadow-glow-white hover:-translate-y-1">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Pitch Generator</h2>
        <p className="text-slate-500 dark:text-slate-400">Your startup info is pre-filled. Click generate or edit details below.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="pitch-idea" className="block text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
            What's your startup idea?
          </label>
          <textarea
            id="pitch-idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g., A hyperlocal delivery service for student essentials on campus."
            className="w-full h-24 p-3 bg-white/50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-300 resize-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="target-user" className="block text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
              Who is the target user?
            </label>
            <input
              id="target-user"
              type="text"
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              placeholder="e.g., College students in hostels"
              className="w-full p-3 bg-white/50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all"
            />
          </div>
          <div>
            <label htmlFor="industry" className="block text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
              What industry is it in?
            </label>
            <input
              id="industry"
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., EdTech, FinTech, Logistics"
              className="w-full p-3 bg-white/50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all"
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isDisabled}
          className="w-full sm:w-auto flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-slate-900 bg-teal-400 hover:bg-teal-300 dark:text-slate-900 dark:bg-teal-300 dark:hover:bg-teal-200 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-teal-400 dark:focus:ring-teal-300 shadow-lg shadow-teal-500/20 hover:shadow-teal-400/40 dark:hover:shadow-glow-teal"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : '🚀 Generate Pitch'}
        </button>
      </div>
    </form>
  );
};

export default PitchInputForm;
