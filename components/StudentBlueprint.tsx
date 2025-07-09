import React, { useState, useMemo } from 'react';
import { ProjectPlan } from '../types';
import MermaidChart from './MermaidChart';
import { useAuth } from '../contexts/AuthContext';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);
const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.625l2.25-2.25m0 0l-2.25 2.25M13.5 12l2.25 2.25M13.5 12l-2.25-2.25" />
    </svg>
);
const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);
const FlowchartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg>
);
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const StudentBlueprint: React.FC<{ plan: ProjectPlan }> = ({ plan }) => {
    const { currentUser } = useAuth();
    const [copied, setCopied] = useState(false);
    const [hasShared, setHasShared] = useState(false);
    const blueprintId = useMemo(() => `LP-PROOF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`, []);
    const buildDate = useMemo(() => new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }), []);

    const blueprintUrl = useMemo(() => {
        const titleSlug = plan.studentBlueprint.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return `https://leap.in/blueprint/${currentUser?.username || 'user'}/${titleSlug}`;
    }, [plan.studentBlueprint.title, currentUser]);

    const shareText = useMemo(() => {
        const techStackText = plan.techStack.recommendations.map(t => t.tool).join(', ');
        const problemStatement = plan.problemUnderstanding.rephrased;
        return `🚀 Just built my project blueprint on LEAP!

Project: "${plan.studentBlueprint.title}"
${plan.studentBlueprint.tagline}

I've mapped out an MVP using ${techStackText} to solve "${problemStatement}" for ${plan.problemUnderstanding.targetAudience}. You can see the full plan here:
${blueprintUrl}

#MadeWithLEAP #StudentBuilder #IndiaFuture #BuildingInPublic`;
    }, [plan, blueprintUrl]);
    

    const handleCopy = () => {
        navigator.clipboard.writeText(shareText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    const handleShare = () => {
        navigator.clipboard.writeText(shareText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
        setHasShared(true);
    };


    return (
        <div className="mt-16 animate-slide-up" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 dark:from-purple-400 dark:via-pink-500 dark:to-orange-400">Student Blueprint™</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto">This is your shareable portfolio page. Showcase your project to friends, mentors, or on social media!</p>
            </div>
            
            <div className="p-1 rounded-2xl shadow-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-orange-500/20 dark:shadow-black/30 relative overflow-hidden backdrop-blur-lg">
                <div className="relative bg-slate-50/80 dark:bg-slate-800/80 rounded-xl p-6 sm:p-8">

                    {/* Ribbon */}
                    <div className="absolute top-4 -right-16 sm:-right-12">
                         <div className="w-48 h-8 bg-green-500 dark:bg-green-400/90 flex items-center justify-center text-white dark:text-slate-900 font-bold text-sm transform rotate-45 shadow-lg">
                            Published
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center border-b border-slate-300 dark:border-slate-700 pb-6 mb-6">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">{plan.studentBlueprint.title}</h1>
                        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">{plan.studentBlueprint.tagline}</p>
                    </div>

                    {/* Student Info */}
                    <div className="flex items-center space-x-4 bg-slate-100 dark:bg-slate-900/50 p-3 rounded-lg mb-8 border border-slate-200 dark:border-slate-700/50">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal-400 to-sky-500 flex items-center justify-center text-white ring-2 ring-white/50">
                           <UserIcon />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{currentUser?.fullName || 'A LEAP Builder'}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{currentUser ? `${currentUser.degree} @ ${currentUser.institution}` : 'Aspiring Student from India'}</p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-3 space-y-8">
                            {/* What I Built */}
                            <div>
                                <h3 className="font-bold text-xl text-teal-600 dark:text-teal-400 mb-3">What I Built</h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-4">{plan.problemUnderstanding.rephrased}</p>
                                <ul className="space-y-2">
                                    {plan.suggestedMvp.features.map((feature, i) => (
                                        <li key={i} className="flex items-start">
                                            <svg className="w-5 h-5 mr-3 text-teal-500 dark:text-teal-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                            <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Tech Stack */}
                            <div>
                                <h3 className="font-bold text-xl text-teal-600 dark:text-teal-400 mb-3">Tech Stack Used</h3>
                                <div className="flex flex-wrap gap-3">
                                    {plan.techStack.recommendations.map((tech, i) => (
                                        <span key={i} className="bg-slate-200 text-sky-800 dark:bg-slate-700/50 dark:text-sky-300 text-sm font-medium px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-600/80">{tech.tool}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-8">
                            {/* Flowchart */}
                            <div>
                                <h3 className="font-bold text-xl text-teal-600 dark:text-teal-400 mb-3 flex items-center"><FlowchartIcon /> MVP Flowchart</h3>
                                <MermaidChart chart={plan.mvpFlowchart} />
                            </div>
                             {/* Code */}
                             <div>
                                <h3 className="font-bold text-xl text-teal-600 dark:text-teal-400 mb-3 flex items-center"><CodeIcon /> Starter Code Snippet</h3>
                                <div className="bg-slate-100 dark:bg-slate-900 rounded-lg overflow-x-auto border border-slate-300/50 dark:border-slate-700/50">
                                   <pre className="p-4"><code className={`language-${plan.codeSnippet.language} text-sm`}>{plan.codeSnippet.code}</code></pre>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex justify-center items-center gap-2 mb-2">
                            <LockIcon />
                            <span>This project was built on <b>{buildDate}</b> and protected via LEAP Proof-of-Build™.</span>
                        </div>
                        <p>Hash ID: <span className="font-mono">{blueprintId}</span></p>
                    </div>

                </div>
            </div>

            {/* Share options */}
             <div className="mt-8 text-center backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 rounded-lg p-6 max-w-2xl mx-auto">
                 <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">Showcase Your Project!</h4>
                 <p className="text-slate-500 dark:text-slate-400 mt-1 mb-4 text-sm">Copy the text below to share your blueprint.</p>
                 
                 <div className="text-left bg-slate-100 dark:bg-slate-800/50 rounded-md p-4 border border-slate-300 dark:border-slate-700">
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{shareText}</p>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-4 justify-center mt-5">
                    <button 
                        onClick={handleCopy}
                        className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 text-sm font-semibold rounded-lg text-slate-800 dark:text-slate-200 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700/80 dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-50"
                        disabled={copied}
                    >
                        <CopyIcon className="h-5 w-5 mr-2" />
                        {copied ? 'Copied to Clipboard!' : 'Copy Text'}
                    </button>
                 </div>
            </div>

             <div className="text-center mt-8">
                 <p className="text-lg font-semibold text-slate-600 dark:text-slate-200">🎉 Your Student Blueprint™ is now live. Share it with the world and let people know what you’ve built!</p>
            </div>
        </div>
    );
};

export default StudentBlueprint;