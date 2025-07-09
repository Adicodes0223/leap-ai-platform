import React from 'react';
import { LearningPath } from '../types';
import GoogleAttribution from './GoogleAttribution';

// Icons
const YouTubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>;
const TechIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
const CaseStudyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const RoadmapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 10V7m0 0L9 4" /></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;


const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="relative rounded-2xl shadow-lg dark:shadow-slate-900/20 overflow-hidden mb-8 backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 transition-all duration-300 hover:shadow-xl dark:hover:shadow-glow-white hover:-translate-y-1">
        <div className="p-6">
            <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center text-teal-600 dark:text-teal-400 ring-2 ring-slate-300 dark:ring-slate-700 shadow-inner">
                    {icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 ml-4">{title}</h3>
            </div>
            <div className="text-slate-600 dark:text-slate-300 space-y-4 prose prose-sm sm:prose-base max-w-none prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-li:text-slate-600 dark:prose-li:text-slate-300 prose-invert">
                {children}
            </div>
        </div>
    </div>
);

const LearningPathDisplay: React.FC<{ content: LearningPath }> = ({ content }) => {
    return (
        <div className="animate-slide-up">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-sky-600 to-purple-600 dark:from-teal-300 dark:via-sky-400 dark:to-purple-400">Your Zero-to-One Learning Path</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Here's a personalized roadmap to help you build your idea.</p>
            </div>
            
            <Section title="Curated YouTube Playlist" icon={<YouTubeIcon />}>
                <div className="space-y-4">
                    {content.youtubePlaylist.map((video, i) => (
                        <a key={i} href={video.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-slate-200/50 dark:bg-slate-900/70 rounded-lg border border-slate-300/50 dark:border-slate-700/50 hover:border-red-500/50 transition">
                             <p className="font-bold text-slate-700 dark:text-slate-100 flex items-center gap-2">{video.title} <LinkIcon/></p>
                             <p className="text-sm mt-1">{video.description}</p>
                        </a>
                    ))}
                </div>
            </Section>

            <Section title="Tech Stack Crash Course" icon={<TechIcon />}>
                <div className="space-y-4">
                    {content.techStackCrashCourse.map((tech, i) => (
                        <a key={i} href={tech.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-slate-200/50 dark:bg-slate-900/70 rounded-lg border border-slate-300/50 dark:border-slate-700/50 hover:border-sky-500/50 transition">
                            <p className="font-bold text-slate-700 dark:text-slate-100 flex items-center gap-2">{tech.name} <LinkIcon/></p>
                             <p className="text-sm mt-1">{tech.description}</p>
                        </a>
                    ))}
                </div>
            </Section>

            <Section title="Case Studies of Similar Startups" icon={<CaseStudyIcon />}>
                <div className="grid md:grid-cols-2 gap-4">
                     {content.caseStudies.map((study, i) => (
                        <div key={i} className="p-4 bg-slate-200/50 dark:bg-slate-900/70 rounded-lg border border-slate-300/50 dark:border-slate-700/50">
                            <h4 className="font-bold text-teal-600 dark:text-teal-400">{study.startupName}</h4>
                            <p className="text-sm my-2">{study.summary}</p>
                             <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Key Takeaways:</p>
                            <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
                                {study.keyTakeaways.map((takeaway, j) => <li key={j}>{takeaway}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="4-Week MVP Roadmap" icon={<RoadmapIcon />}>
                <div className="relative border-l-2 border-teal-500/30 dark:border-teal-400/30 pl-8 space-y-8">
                     {content.roadmap.map((step, i) => (
                        <div key={i} className="relative">
                            <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-teal-500 dark:bg-teal-400 ring-4 ring-slate-100 dark:ring-slate-900"></div>
                            <h4 className="font-bold text-lg text-slate-700 dark:text-slate-100">Week {step.week}: {step.title}</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                                {step.tasks.map((task, j) => <li key={j}>{task}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </Section>

            <div className="text-center mt-12">
                 <p className="text-lg font-semibold text-slate-600 dark:text-slate-200">🚀 Your Learning Path is Ready — Let’s turn this idea into a product.</p>
                 <GoogleAttribution className="mt-4" />
            </div>
        </div>
    );
};

export default LearningPathDisplay;
