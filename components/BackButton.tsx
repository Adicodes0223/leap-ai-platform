import React from 'react';

interface BackButtonProps {
  onGoHome: () => void;
}

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
);

const BackButton: React.FC<BackButtonProps> = ({ onGoHome }) => {
  return (
    <div className="mb-8">
      <button
        onClick={onGoHome}
        className="flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-slate-600 bg-slate-200/70 hover:bg-slate-300/80 dark:text-slate-300 dark:bg-slate-800/60 dark:hover:bg-slate-700/80 transition-all duration-200"
      >
        <BackIcon />
        Back to Dashboard
      </button>
    </div>
  );
};

export default BackButton;
