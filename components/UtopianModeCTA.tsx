

import React, { useMemo, useState } from 'react';
import { ProjectPlan } from '../types';
import GeminiLogo from './GeminiLogo';
import { View } from '../types';
import GoogleAttribution from './GoogleAttribution';

const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.625l2.25-2.25m0 0l-2.25 2.25M13.5 12l2.25 2.25M13.5 12l-2.25-2.25" />
    </svg>
);
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

interface UtopianModeCTAProps {
    plan: ProjectPlan;
    onNavigate: (view: View) => void;
}

const UtopianModeCTA: React.FC<UtopianModeCTAProps> = ({ plan, onNavigate }) => {
    const [promptCopied, setPromptCopied] = useState(false);

    const utopianPrompt = useMemo(() => {
        // Generate a concise summary of the plan to be used as a prompt
        const techStackText = plan.techStack.recommendations.map(t => t.tool).join(', ');
        return `
I am building a project called "${plan.studentBlueprint.title}".
Tagline: "${plan.studentBlueprint.tagline}"

The core problem it solves is: "${plan.problemUnderstanding.rephrased}" for ${plan.problemUnderstanding.targetAudience}.

The MVP features are:
- ${plan.suggestedMvp.features.join('\n- ')}

The proposed tech stack is: ${techStackText}.

I have a basic code snippet for: ${plan.codeSnippet.title}.
I also have a Mermaid flowchart for the MVP flow:
\`\`\`mermaid
${plan.mvpFlowchart}
\`\`\`

Now, let's take this to the next level. Can you help me:
1. Flesh out the architecture in more detail?
2. Write more advanced code for the backend?
3. Suggest a database schema?
4. Create a more detailed UI/UX wireframe description?
        `.trim();
    }, [plan]);

    const handleCopyPrompt = () => {
        navigator.clipboard.writeText(utopianPrompt).then(() => {
            setPromptCopied(true);
            setTimeout(() => setPromptCopied(false), 2500);
        });
    };

    return (
        <div className="mt-16 animate-slide-up" style={{ animationDelay: '800ms', animationFillMode: 'backwards' }}>
            <div className="text-center backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto shadow-2xl dark:shadow-black/30">
                <h2 className="text-3xl font-bold mb-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600">
                        What's Next?
                    </span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6 max-w-xl mx-auto">
                    You have a plan. Dive deeper by iterating with AI Studio or explore Google's developer resources.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="https://ai.google.dev/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 text-sm font-semibold rounded-lg text-white bg-slate-800 hover:bg-slate-950 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition-all duration-300"
                    >
                        🔄 Continue on Google AI Studio
                    </a>
                </div>
                 <div className="mt-8">
                     <button
                        onClick={handleCopyPrompt}
                        disabled={promptCopied}
                        className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors flex items-center gap-2 mx-auto"
                    >
                        {promptCopied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                        {promptCopied ? 'Copied!' : 'Copy Prompt for AI Studio'}
                    </button>
                 </div>

                 <div className="mt-6 pt-4 border-t border-slate-300/50 dark:border-slate-700/50">
                    <GoogleAttribution />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                         ✨ This AI feature is proudly powered by Gemini & Google AI Studio. We’re using Google AI for R&D support. LEAP is committed to responsible and collaborative innovation.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UtopianModeCTA;
