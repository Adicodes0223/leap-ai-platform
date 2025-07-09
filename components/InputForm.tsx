
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface InputFormProps {
  idea: string;
  setIdea: (idea: string) => void;
  onOpenStudio: () => void;
}

const InputForm: React.FC<InputFormProps> = ({ idea, setIdea, onOpenStudio }) => {
  const { currentUser } = useAuth();

  useEffect(() => {
    // Pre-fill the idea from the user's startup profile if it exists
    if (currentUser?.startup?.oneLiner) {
      setIdea(currentUser.startup.oneLiner);
    }
  }, [currentUser, setIdea]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      onOpenStudio();
    }
  };

  return (
    <div className="p-6 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 dark:shadow-slate-900/50 transition-all duration-300 hover:shadow-slate-300/60 dark:hover:shadow-glow-white hover:-translate-y-1">
      <label htmlFor="idea-input" className="block text-xl font-medium text-slate-800 dark:text-slate-200 mb-3">
        What do you want to build today?
      </label>
      <textarea
        id="idea-input"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g., An app to track my college attendance and notify me if I'm running low."
        className="w-full h-32 p-4 bg-white/50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition-all duration-300 resize-none"
      />
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm text-slate-500 dark:text-slate-500 mb-3 sm:mb-0">
          Press <kbd className="font-sans font-semibold">Ctrl + Enter</kbd> to submit
        </p>
        <button
          onClick={onOpenStudio}
          disabled={!idea.trim()}
          className="w-full sm:w-auto flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-slate-900 bg-teal-400 hover:bg-teal-300 dark:text-slate-900 dark:bg-teal-300 dark:hover:bg-teal-200 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-teal-400 dark:focus:ring-teal-300 shadow-lg shadow-teal-500/20 hover:shadow-teal-400/40 dark:hover:shadow-glow-teal"
        >
          🚀 Build Your Blueprint
        </button>
      </div>
    </div>
  );
};

export default InputForm;
