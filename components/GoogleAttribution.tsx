import React from 'react';
import GeminiLogo from './GeminiLogo';

const GoogleAttribution: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <a 
            href="https://ai.google.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors ${className}`}>
            <GeminiLogo className="h-4 w-4" />
            <span>Powered by Gemini via Google AI Studio</span>
        </a>
    );
};

export default GoogleAttribution;
