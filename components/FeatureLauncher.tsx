import React from 'react';
import { View } from '../types';
import TrendingIdeas from './TrendingIdeas';
import TestimonialsSlider from './TestimonialsSlider';
import StatsCounter from './StatsCounter';
import HowItWorks from './HowItWorks';
import { useAuth } from '../contexts/AuthContext';


interface FeatureLauncherProps {
  onNavigate: (view: View) => void;
}

const ProjectIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
const LaptopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const LearningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const ReelsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>;
const TowerIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 6.75zM9 12.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5a.375.375 0 01.375-.375z" /></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.016h-.008v-.016z" /></svg>;
const GrowthIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const MirrorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5C12 4.5 9.071 4.5 7.5 4.5C4.462 4.5 2 6.962 2 10V18C2 20.209 3.791 22 6 22H18C20.209 22 22 20.209 22 18V10C22 6.962 19.538 4.5 16.5 4.5C14.929 4.5 12 4.5 12 4.5ZM12 4.5V2" /></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.07a2.25 2.25 0 01-2.25 2.25H5.92a2.25 2.25 0 01-2.25-2.25v-4.07m16.5 0a2.25 2.25 0 00-2.25-2.25H5.92a2.25 2.25 0 00-2.25 2.25m16.5 0v-2.25A2.25 2.25 0 0018 9.75h-1.5a2.25 2.25 0 00-2.25 2.25v2.25m-7.5 0v-2.25A2.25 2.25 0 006.75 9.75H5.25a2.25 2.25 0 00-2.25 2.25v2.25" /></svg>;
const SolverIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5l.415-.415a.375.375 0 01.53 0l.415.415a.375.375 0 010 .53l-.415.415a.375.375 0 01-.53 0L8.25 8.03a.375.375 0 010-.53z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5l.415-.415a.375.375 0 01.53 0l.415.415a.375.375 0 010 .53l-.415.415a.375.375 0 01-.53 0L15.75 8.03a.375.375 0 010-.53z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 12h.008v.008H9.75V12zm3 0h.008v.008H12.75V12zm3 0h.008v.008H15.75V12zm-3-4.5h.008v.008H12.75V7.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3s4.5 4.03 4.5 9-2.015 9-4.5 9z" /></svg>;


const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  className: string;
}> = ({ title, description, icon, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={`group p-6 rounded-2xl shadow-xl backdrop-blur-lg border border-slate-200/80 dark:border-slate-700/70 dark:shadow-slate-900/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 text-left ${className}`}
        >
            <div className={`p-3 rounded-full inline-block mb-4 transition-all duration-300 group-hover:scale-110 ${className.replace('bg-','bg-opacity-20 ')}`}>
               {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">{description}</p>
        </button>
    );
};


const FeatureLauncher: React.FC<FeatureLauncherProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  return (
    <div className="my-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">What will you build today?</h2>
        <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">Choose a tool to get started on your journey.</p>
      </div>

      <TrendingIdeas onNavigate={onNavigate} />
      
      <HowItWorks onNavigate={onNavigate} />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          title="🛠️ Project Blueprint"
          description="Answer a few questions to generate a complete technical plan for your MVP."
          icon={<ProjectIcon />}
          onClick={() => onNavigate('project')}
          className="bg-sky-200/50 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300 hover:shadow-glow-cyan"
        />
        {currentUser?.role === 'Founder' && (
             <FeatureCard
              title="🤔 Startup Problem-Solver"
              description="Your 24/7 growth consultant. Input a challenge, get actionable advice."
              icon={<SolverIcon />}
              onClick={() => onNavigate('solver')}
              className="bg-fuchsia-200/50 dark:bg-fuchsia-900/50 text-fuchsia-600 dark:text-fuchsia-300 hover:shadow-fuchsia-500/20"
            />
        )}
        <FeatureCard
          title="💰 AI Fundraising Co-pilot"
          description="Get investor-grade feedback, an enhanced pitch deck, and outreach templates."
          icon={<BriefcaseIcon />}
          onClick={() => onNavigate('fundraising')}
          className="bg-yellow-200/50 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-300 hover:shadow-yellow-500/20"
        />
        <FeatureCard
          title="💻 Pitch Deck Generator"
          description="Create an investor-ready pitch deck, one-liner, and even a video script."
          icon={<LaptopIcon />}
          onClick={() => onNavigate('pitch')}
          className="bg-orange-200/50 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300 hover:shadow-orange-500/20"
        />
         <FeatureCard
          title="🧠 Startup Mirror"
          description="A private, weekly reflection journal for founder wellness & clarity."
          icon={<MirrorIcon />}
          onClick={() => onNavigate('mirror')}
          className="bg-purple-200/50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 hover:shadow-glow-blue"
        />
        <FeatureCard
          title="📚 Curated Learning Path"
          description="Get a personalized roadmap with videos and resources to learn new skills."
          icon={<LearningIcon />}
          onClick={() => onNavigate('learning')}
          className="bg-teal-200/50 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300 hover:shadow-glow-teal"
        />
        <FeatureCard
          title="📈 AI Growth Dashboard"
          description="Get weekly, data-driven growth experiments & strategies for your startup."
          icon={<GrowthIcon />}
          onClick={() => onNavigate('growth')}
          className="bg-indigo-200/50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 hover:shadow-indigo-500/20"
        />
        <FeatureCard
          title="🎥 Reels-to-Riches AI"
          description="Generate viral content ideas, scripts, and storyboards for social media."
          icon={<ReelsIcon />}
          onClick={() => onNavigate('reels')}
          className="bg-pink-200/50 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300 hover:shadow-pink-500/20"
        />
        <FeatureCard
          title="🛡️ Startup Compliance AI"
          description="Generate legal docs like Co-founder Agreements & NDAs for your startup."
          icon={<ShieldIcon />}
          onClick={() => onNavigate('compliance')}
          className="bg-green-200/50 dark:bg-green-900/50 text-green-600 dark:text-green-300 hover:shadow-glow-green"
        />
         <FeatureCard
          title="🤝 Explore Builders"
          description="Discover and connect with other student builders on the platform."
          icon={<UsersIcon />}
          onClick={() => onNavigate('explore')}
          className="bg-gray-200/50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 hover:shadow-gray-500/20"
        />
        <FeatureCard
          title="🏢 Community Hub"
          description="Connect with builders, share progress, and get feedback in the feed."
          icon={<TowerIcon className="h-8 w-8" />}
          onClick={() => onNavigate('hub')}
          className="bg-rose-200/50 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 hover:shadow-rose-500/20"
        />
      </div>
      
      <StatsCounter />

      <TestimonialsSlider />

    </div>
  );
};

export default FeatureLauncher;