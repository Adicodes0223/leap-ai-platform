import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { View } from '../types';

interface HowItWorksProps {
    onNavigate: (view: View) => void;
}

const StepCard: React.FC<{
    icon: string;
    title: string;
    description: string;
    step: number;
}> = ({ icon, title, description, step }) => {
    return (
        <div 
            className="flex-1 p-6 rounded-2xl shadow-xl backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group animate-slide-up"
            style={{ animationDelay: `${step * 150}ms`, willChange: 'transform' }}
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="relative text-4xl w-16 h-16 flex items-center justify-center rounded-xl bg-slate-200/50 dark:bg-slate-800/50 ring-2 ring-slate-300 dark:ring-slate-700 shadow-inner">
                    {icon}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
                </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    );
};


const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
    const { currentUser } = useAuth();

    const getFirstName = (fullName: string | undefined) => fullName?.split(' ')[0] || 'there';

    const steps = [
        {
            icon: '💡',
            title: 'Step 1: Enter Your Idea',
            description: 'Tell us what you want to build. Just a sentence is enough.'
        },
        {
            icon: '🤖',
            title: 'Step 2: AI Builds Your MVP',
            description: 'Our AI instantly generates the blueprint, content, and resources.'
        },
        {
            icon: '🚀',
            title: 'Step 3: Launch with Your Team',
            description: 'Launch and grow with your team — instantly share, export or deploy.'
        }
    ];

    return (
        <section className="my-16 sm:my-24 text-center animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                {currentUser 
                    ? `Hey ${getFirstName(currentUser.fullName)}, here’s how we’ll bring your idea to life` 
                    : "How It Works"
                }
            </h2>
             <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
                Go from a simple thought to a fully-realized project in just three simple steps.
            </p>

            <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
                {steps.map((step, index) => (
                    <StepCard 
                        key={index}
                        step={index + 1}
                        icon={step.icon}
                        title={step.title}
                        description={step.description}
                    />
                ))}
            </div>

            <div className="mt-12">
                <p className="text-lg text-slate-600 dark:text-slate-300">
                    Got an idea? Let’s build it together. 
                    <button onClick={() => onNavigate('project')} className="font-bold text-teal-600 dark:text-teal-400 hover:underline ml-2">
                         Start Now →
                    </button>
                </p>
                 <p className="mt-8 text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-sky-500">
                    From idea to launch — let your vision come alive with LEAP 🚀
                </p>
            </div>
        </section>
    );
};

export default HowItWorks;