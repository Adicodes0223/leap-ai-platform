import React, { useState } from 'react';

interface LearningPathInputFormProps {
  onSubmit: (inputs: { idea: string, domain: string }) => void;
  isLoading: boolean;
}

const domains = ["EdTech", "FinTech", "HealthTech", "AgriTech", "SaaS", "E-commerce", "AI/ML", "Gaming", "Other"];

const LearningPathInputForm: React.FC<LearningPathInputFormProps> = ({ onSubmit, isLoading }) => {
  const [idea, setIdea] = useState('');
  const [domain, setDomain] = useState('EdTech');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (idea.trim()) {
      onSubmit({ idea, domain });
    }
  };

  const isDisabled = !idea.trim() || isLoading;

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 dark:shadow-slate-900/50 transition-all duration-300 hover:shadow-slate-300/60 dark:hover:shadow-glow-white hover:-translate-y-1">
      <div className="space-y-4">
        <div>
          <label htmlFor="learning-idea" className="block text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
            Describe the startup you want to build
          </label>
          <textarea
            id="learning-idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g., An AI-powered app to create personalized study plans for college students."
            className="w-full h-24 p-3 bg-white/50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-300 resize-none"
          />
        </div>
        <div>
            <label htmlFor="domain" className="block text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
              Select a domain (optional)
            </label>
            <select
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full p-3 bg-white/50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all"
            >
                {domains.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
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
              Generating Path...
            </>
          ) : '🗺️ Create Learning Path'}
        </button>
      </div>
    </form>
  );
};

export default LearningPathInputForm;
