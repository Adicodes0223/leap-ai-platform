
import React from 'react';
import { ProjectPlan } from '../types';
import MermaidChart from './MermaidChart';

interface SectionCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children }) => (
    <div className="rounded-2xl shadow-lg dark:shadow-slate-900/20 overflow-hidden mb-8 backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 transition-all duration-300 hover:shadow-xl dark:hover:shadow-glow-white hover:-translate-y-1">
        <div className="p-6">
            <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center text-teal-600 dark:text-teal-400 ring-2 ring-slate-300 dark:ring-slate-700 shadow-inner shadow-black/5 dark:shadow-black/20">
                    {icon}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 ml-4">{title}</h2>
            </div>
            <div className="text-slate-600 dark:text-slate-300 space-y-4 prose prose-sm sm:prose-base max-w-none prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-li:text-slate-600 dark:prose-li:text-slate-300 prose-invert">
                {children}
            </div>
        </div>
    </div>
);

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);
const RocketIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);
const FlowchartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg>
);
const StackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
);
const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);
const GeminiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} fill="currentColor">
       <path d="M12 2l2.35 2.35-2.35 2.35-2.35-2.35L12 2zm0 17.65l-2.35 2.35L12 24l2.35-2.35L12 19.65zM2 12l2.35-2.35L2 7.3l-2.35 2.35L2 12zm17.65 0l2.35 2.35L24 12l-2.35-2.35L19.65 12zM12 6.7c-2.97 0-5.4 2.43-5.4 5.4s2.43 5.4 5.4 5.4 5.4-2.43 5.4-5.4-2.43-5.4-5.4-5.4z" />
    </svg>
);
const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);
const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);


interface ProjectPlanDisplayProps {
  plan: ProjectPlan;
}

const ProjectPlanDisplay: React.FC<ProjectPlanDisplayProps> = ({ plan }) => {
  return (
    <div className="animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
        <SectionCard title="Problem Understanding" icon={<LightbulbIcon />}>
            <p className="font-semibold text-slate-700 dark:text-slate-100">The Idea, Simplified:</p>
            <p>{plan.problemUnderstanding.rephrased}</p>
            <p className="font-semibold text-slate-700 dark:text-slate-100 mt-4">Who is this for?</p>
            <p>{plan.problemUnderstanding.targetAudience}</p>
        </SectionCard>

        <SectionCard title="Suggested MVP" icon={<RocketIcon />}>
            <p>{plan.suggestedMvp.description}</p>
            <p className="font-semibold text-slate-700 dark:text-slate-100 mt-4">Key Features:</p>
            <ul className="list-disc list-inside space-y-2">
                {plan.suggestedMvp.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                ))}
            </ul>
        </SectionCard>

        <SectionCard title="MVP Flowchart" icon={<FlowchartIcon />}>
            <MermaidChart chart={plan.mvpFlowchart} />
        </SectionCard>

        <SectionCard title="Tech Stack Recommendation" icon={<StackIcon />}>
            <p>{plan.techStack.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {plan.techStack.recommendations.map((item, index) => (
                    <div key={index} className="bg-slate-200/50 dark:bg-slate-900/70 p-4 rounded-lg border border-slate-300/50 dark:border-slate-700/50">
                        <p className="font-bold text-teal-600 dark:text-teal-400">{item.name}: <span className="text-slate-700 dark:text-slate-200">{item.tool}</span></p>
                        <p className="text-sm mt-1">{item.reason}</p>
                    </div>
                ))}
            </div>
        </SectionCard>

        <SectionCard title="Starter Code Snippet" icon={<CodeIcon />}>
            <p className="font-semibold text-slate-700 dark:text-slate-100">{plan.codeSnippet.title}</p>
            <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 my-2 overflow-x-auto border border-slate-300/50 dark:border-slate-700/50">
                <pre><code className={`language-${plan.codeSnippet.language} text-sm`}>{plan.codeSnippet.code}</code></pre>
            </div>
        </SectionCard>
        
        <SectionCard title="Gemini Integration" icon={<GeminiIcon />}>
            <p>{plan.geminiIntegration.suggestion}</p>
            <p className="mt-4 font-semibold text-slate-700 dark:text-slate-100">API/Endpoint:</p>
            <p className="font-mono bg-slate-200/50 dark:bg-slate-900/70 p-2 rounded-md text-teal-600 dark:text-teal-300 inline-block text-sm border border-slate-300/50 dark:border-slate-700/50">{plan.geminiIntegration.apiEndpoint}</p>
        </SectionCard>

        <SectionCard title="Learning Resources" icon={<BookIcon />}>
            <p>Here are some resources to help you get started with the recommended technologies:</p>
            <ul className="list-none space-y-2 mt-4">
                {plan.learningResources.map((resource, index) => (
                    <li key={index}>
                        <a 
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg bg-slate-200/50 dark:bg-slate-900/70 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300/50 dark:border-slate-700/50 transition-all"
                        >
                            <span className="text-sky-500"><LinkIcon/></span>
                            <span className="font-medium text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400">{resource.title}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </SectionCard>
    </div>
  );
};

export default ProjectPlanDisplay;