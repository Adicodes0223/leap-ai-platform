import React, { useState } from 'react';
import { ReelsContentResponse, ContentIdea } from '../types';
import GoogleAttribution from './GoogleAttribution';

// Icons
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.442c-3.117 0-3.483.01-4.71.068-2.88.132-4.11 1.34-4.243 4.243-.058 1.226-.068 1.57-.068 4.71s.01 3.483.068 4.71c.133 2.904 1.363 4.113 4.243 4.243 1.227.058 1.593.068 4.71.068s3.483-.01 4.71-.068c2.88-.132 4.11-1.34 4.243-4.243.058-1.226.068-1.57.068-4.71s-.01-3.483-.068-4.71c-.133-2.904-1.363-4.113-4.243-4.243-1.227-.058-1.593-.068-4.71-.068zm0 4.162c-2.403 0-4.35 1.947-4.35 4.35s1.947 4.35 4.35 4.35 4.35-1.947 4.35-4.35-1.947-4.35-4.35-4.35zm0 7.25c-1.598 0-2.9-1.302-2.9-2.9s1.302-2.9 2.9-2.9 2.9 1.302 2.9 2.9-1.302 2.9-2.9 2.9zm4.965-7.825c-.78 0-1.415.635-1.415 1.415s.635 1.415 1.415 1.415 1.415-.635 1.415-1.415-.635-1.415-1.415-1.415z"/></svg>;
const LinkedInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
const YouTubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>;

const platformIcons = {
    Instagram: <InstagramIcon />,
    LinkedIn: <LinkedInIcon />,
    YouTube: <YouTubeIcon />,
};

const CopyButton: React.FC<{ textToCopy: string; className?: string }> = ({ textToCopy, className = '' }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <button onClick={handleCopy} className={`p-1.5 rounded-md text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 transition-all ${className}`} >
            {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            )}
        </button>
    );
};


const ContentCard: React.FC<{ content: ContentIdea }> = ({ content }) => {
    return (
        <div className="rounded-2xl shadow-lg dark:shadow-slate-900/20 overflow-hidden backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70">
            <div className="p-6 space-y-6">
                 {/* Idea */}
                <div>
                    <h4 className="font-bold text-lg text-rose-600 dark:text-rose-400 mb-2">🧠 Idea: {content.idea.title}</h4>
                    <p className="text-sm"><strong className="text-slate-600 dark:text-slate-300">Hook:</strong> {content.idea.hook}</p>
                    <p className="text-sm"><strong className="text-slate-600 dark:text-slate-300">Purpose:</strong> {content.idea.purpose}</p>
                </div>

                {/* Script */}
                <div>
                     <h4 className="font-bold text-lg text-rose-600 dark:text-rose-400 mb-2">✍️ Script & Caption</h4>
                     <div className="space-y-3">
                        <div className="p-3 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                             <div className="flex justify-between items-center mb-1">
                                <h5 className="font-semibold text-sm text-slate-700 dark:text-slate-200">Caption</h5>
                                <CopyButton textToCopy={content.platform === 'LinkedIn' ? content.script.longDescription : content.script.shortCaption} />
                             </div>
                             <p className="text-sm whitespace-pre-wrap">{content.platform === 'LinkedIn' ? content.script.longDescription : content.script.shortCaption}</p>
                        </div>
                        <div className="p-3 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-center mb-1">
                                 <h5 className="font-semibold text-sm text-slate-700 dark:text-slate-200">Hashtags</h5>
                                <CopyButton textToCopy={content.script.hashtags.join(' ')} />
                            </div>
                            <p className="text-sm text-blue-600 dark:text-blue-400">{content.script.hashtags.join(' ')}</p>
                        </div>
                     </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                     {/* Audio */}
                     <div>
                        <h4 className="font-bold text-lg text-rose-600 dark:text-rose-400 mb-2">🎧 Audio</h4>
                        <p className="text-sm">{content.audio.recommendation}</p>
                     </div>
                     {/* CTA */}
                     <div>
                        <h4 className="font-bold text-lg text-rose-600 dark:text-rose-400 mb-2">⏳ Call to Action</h4>
                        <p className="text-sm">{content.cta.suggestion}</p>
                     </div>
                </div>

                {/* Storyboard */}
                <div>
                    <h4 className="font-bold text-lg text-rose-600 dark:text-rose-400 mb-2">🎥 Storyboard</h4>
                    <div className="p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
                         <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                            <p><strong className="text-slate-600 dark:text-slate-300">Mood:</strong> {content.storyboard.moodboard}</p>
                            <p><strong className="text-slate-600 dark:text-slate-300">Transitions:</strong> {content.storyboard.transitions}</p>
                         </div>
                        <ul className="list-decimal list-inside space-y-2 text-sm">
                            {content.storyboard.scenes.map((scene, i) => <li key={i}>{scene}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};


interface ReelsDisplayProps {
  content: ReelsContentResponse;
}

const ReelsDisplay: React.FC<ReelsDisplayProps> = ({ content }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="animate-slide-up">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500">Your Content Plan is Here!</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Here are the AI-generated ideas for each platform.</p>
            </div>

            <div className="mb-6 flex justify-center border-b border-slate-300 dark:border-slate-700">
                {content.map((item, index) => {
                    const platformName = item.platform === 'YouTube Shorts' ? 'YouTube' : item.platform;
                    return (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all ${
                                activeTab === index
                                    ? 'text-pink-600 dark:text-pink-400 border-b-2 border-pink-500'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            {platformIcons[platformName as keyof typeof platformIcons]}
                            {item.platform}
                        </button>
                    )
                })}
            </div>

            <div>
                {content.map((item, index) => (
                    <div key={index} className={activeTab === index ? 'block animate-fade-in' : 'hidden'}>
                        <ContentCard content={item} />
                    </div>
                ))}
            </div>

            <div className="text-center mt-12">
                 <p className="text-lg font-semibold text-slate-600 dark:text-slate-200">✅ Your startup's story is ready for the spotlight. Go create!</p>
                 <GoogleAttribution className="mt-4" />
            </div>
        </div>
    );
};

export default ReelsDisplay;
