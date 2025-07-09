

import React, { useEffect } from 'react';
import { AIEvaluation } from '../types';
import GoogleAttribution from './GoogleAttribution';

interface AIExaminerResultsProps {
    evaluation: AIEvaluation;
    videoBlobUrl: string;
    onRestart: () => void;
}

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 45; // 2 * pi * radius
    const [offset, setOffset] = React.useState(circumference);

    useEffect(() => {
      const strokeDashoffset = circumference - (score / 100) * circumference;
      // Timeout to ensure the transition is visible
      const timer = setTimeout(() => setOffset(strokeDashoffset), 100);
      return () => clearTimeout(timer);
    }, [score, circumference]);

    const getColor = (s: number) => {
        if (s < 50) return "text-red-500";
        if (s < 75) return "text-yellow-500";
        return "text-green-500";
    };

    return (
        <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-slate-200 dark:text-slate-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                <circle
                    className={getColor(score)}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1.5s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-bold ${getColor(score)}`}>{score}</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ 100</span>
            </div>
        </div>
    );
};

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="rounded-2xl shadow-lg dark:shadow-slate-900/20 p-6 backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70">
        <div className="flex items-center mb-4">
            <div className="text-indigo-500">{icon}</div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 ml-3">{title}</h3>
        </div>
        {children}
    </div>
);

const UpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const DownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;

const AIExaminerResults: React.FC<AIExaminerResultsProps> = ({ evaluation, videoBlobUrl, onRestart }) => {
    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">Your AI Evaluation is Ready!</h2>
                <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">Here's a breakdown of your performance.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Video and Score */}
                <div className="lg:col-span-1 flex flex-col items-center gap-8">
                    <div className="w-full">
                        <h3 className="text-xl font-bold text-center mb-4">Your Interview Recording</h3>
                        <video src={videoBlobUrl} controls className="w-full rounded-lg shadow-lg aspect-video" />
                        <a 
                            href={videoBlobUrl} 
                            download="leap-ai-interview.webm" 
                            className="block w-full text-center mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                           🎥 Download Recording
                        </a>
                    </div>
                     <div className="flex flex-col items-center">
                        <h3 className="text-xl font-bold text-center mb-4">Overall Score</h3>
                        <ScoreCircle score={evaluation.overallScore} />
                    </div>
                </div>

                {/* Right Column: Feedback Details */}
                <div className="lg:col-span-2 space-y-8">
                    <Section title="Strengths" icon={<UpIcon />}>
                        <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300">
                            {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </Section>
                    <Section title="Areas for Improvement" icon={<DownIcon />}>
                        <div className="space-y-4">
                            {evaluation.areasForImprovement.map((item, i) => (
                                <div key={i} className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{item.area}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{item.suggestion}</p>
                                </div>
                            ))}
                        </div>
                    </Section>
                    <Section title="Suggested Resources" icon={<BookIcon />}>
                         <div className="space-y-3">
                            {evaluation.suggestedResources.map((res, i) => (
                                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="block p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                                    <p className="font-semibold text-sky-600 dark:text-sky-400">{res.title}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{res.description}</p>
                                </a>
                            ))}
                        </div>
                    </Section>
                </div>
            </div>
             <div className="text-center mt-12">
                <button onClick={onRestart} className="px-6 py-3 font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                    🔄 Take Another Interview
                </button>
                <GoogleAttribution className="mt-6" />
            </div>
        </div>
    );
};

export default AIExaminerResults;
