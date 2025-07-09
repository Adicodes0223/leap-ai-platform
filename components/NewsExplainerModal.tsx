import React, { useState, useEffect } from 'react';
import { LiveNewsItem, NewsExplanation, NewsExplanationApiResponse } from '../types';
import { generateNewsExplanation } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import GoogleAttribution from './GoogleAttribution';

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.625l2.25-2.25m0 0l-2.25 2.25M13.5 12l2.25 2.25M13.5 12l-2.25-2.25" /></svg>;
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


interface NewsExplainerModalProps {
    newsItem: LiveNewsItem;
    onClose: () => void;
}

// Type guard
function isNewsExplanation(response: NewsExplanationApiResponse): response is NewsExplanation {
  return (response as NewsExplanation).whatHappened !== undefined;
}

const NewsExplainerModal: React.FC<NewsExplainerModalProps> = ({ newsItem, onClose }) => {
    const [explanation, setExplanation] = useState<NewsExplanation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchExplanation = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await generateNewsExplanation(newsItem.headline, newsItem.url);
                if (isNewsExplanation(result)) {
                    setExplanation(result);
                } else {
                    setError(result.clarificationNeeded);
                }
            } catch (e: any) {
                setError(e.message || "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchExplanation();
    }, [newsItem]);

    const copyableText = explanation 
      ? `🔍 What happened:\n${explanation.whatHappened}\n\n💡 Why it matters:\n${explanation.whyItMatters}\n\n🚀 What you can learn:\n- ${explanation.whatYouCanLearn.join('\n- ')}`
      : '';
    
    const handleCopy = () => {
        navigator.clipboard.writeText(copyableText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <LoadingSpinner />
                    <p className="mt-4 text-slate-400">AI is summarizing the article...</p>
                </div>
            );
        }

        if (error) {
            return (
                 <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="bg-red-900/50 border border-red-700 text-red-300 px-6 py-4 rounded-lg">
                        <p className="font-bold">Oops! Something went wrong.</p>
                        <p className="mt-1">{error}</p>
                    </div>
                </div>
            );
        }

        if (explanation) {
            return (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-3">🔍 What happened:</h3>
                        <p className="mt-2 text-slate-300">{explanation.whatHappened}</p>
                    </div>
                     <div>
                        <h3 className="text-xl font-bold flex items-center gap-3">💡 Why it matters:</h3>
                        <p className="mt-2 text-slate-300">{explanation.whyItMatters}</p>
                    </div>
                     <div>
                        <h3 className="text-xl font-bold flex items-center gap-3">🚀 What you can learn:</h3>
                        <ul className="mt-2 text-slate-300 list-disc list-inside space-y-2">
                            {explanation.whatYouCanLearn.map((lesson, i) => <li key={i}>{lesson}</li>)}
                        </ul>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-zoom-in text-white">
                 {/* Header */}
                <div className="flex items-start justify-between p-4 border-b border-white/10">
                    <div className="flex-1 pr-4">
                        <h2 className="font-bold text-lg">{newsItem.headline}</h2>
                        <p className="text-sm text-slate-400">{newsItem.source}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-white/10 transition-colors">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {renderContent()}
                </div>

                {/* Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-black/30 border-t border-white/10">
                     <GoogleAttribution />
                     <button onClick={handleCopy} disabled={!explanation || copied} className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-200 bg-slate-700/80 hover:bg-slate-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                        {copied ? <CheckIcon className="h-5 w-5 text-green-400" /> : <CopyIcon className="h-5 w-5" />}
                        {copied ? 'Copied!' : 'Copy Summary'}
                     </button>
                </div>
            </div>
        </div>
    );
};

export default NewsExplainerModal;
