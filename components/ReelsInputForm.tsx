import React, { useState } from 'react';
import { ReelsContentInput } from '../types';

interface ReelsInputFormProps {
  onSubmit: (inputs: ReelsContentInput) => void;
  isLoading: boolean;
}

const domains = ["EdTech", "FinTech", "HealthTech", "SaaS", "E-commerce", "AgriTech", "DeepTech", "Gaming", "Creator Economy", "Other"];
const stages: ReelsContentInput['stage'][] = ['Idea', 'MVP', 'Launch', 'Revenue'];
const allPlatforms: ReelsContentInput['platforms'][number][] = ['Instagram', 'LinkedIn', 'YouTube Shorts'];
const languages: ReelsContentInput['language'][] = ['English', 'Hindi', 'Hinglish'];


const ReelsInputForm: React.FC<ReelsInputFormProps> = ({ onSubmit, isLoading }) => {
  const [startupName, setStartupName] = useState('');
  const [domain, setDomain] = useState(domains[0]);
  const [stage, setStage] = useState<ReelsContentInput['stage']>(stages[0]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<ReelsContentInput['platforms']>(['Instagram']);
  const [language, setLanguage] = useState<ReelsContentInput['language']>(languages[0]);

  const handlePlatformChange = (platform: ReelsContentInput['platforms'][number]) => {
    setSelectedPlatforms(prev => 
        prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (startupName.trim() && selectedPlatforms.length > 0) {
      onSubmit({ startupName, domain, stage, platforms: selectedPlatforms, language });
    }
  };

  const isDisabled = !startupName.trim() || selectedPlatforms.length === 0 || isLoading;

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 dark:shadow-slate-900/50 transition-all duration-300 hover:shadow-slate-300/60 dark:hover:shadow-glow-white hover:-translate-y-1">
      <div className="space-y-6">
        <div>
          <label htmlFor="startupName" className="block text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
            Your Startup's Name
          </label>
          <input
            id="startupName"
            type="text"
            value={startupName}
            onChange={(e) => setStartupName(e.target.value)}
            placeholder="e.g., CampusConnect"
            className="w-full p-3 bg-white/50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="domain" className="block text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Domain</label>
            <select id="domain" value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full p-3 bg-white/50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 transition-all">
                {domains.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="stage" className="block text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Stage</label>
            <select id="stage" value={stage} onChange={(e) => setStage(e.target.value as ReelsContentInput['stage'])} className="w-full p-3 bg-white/50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 transition-all">
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Target Platforms</label>
          <div className="flex flex-wrap gap-3">
            {allPlatforms.map(platform => (
              <button
                type="button"
                key={platform}
                onClick={() => handlePlatformChange(platform)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                  selectedPlatforms.includes(platform)
                    ? 'bg-pink-500 border-pink-500 text-white'
                    : 'bg-white/50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-600 hover:border-pink-400'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

         <div>
            <label htmlFor="language" className="block text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Content Language</label>
            <select id="language" value={language} onChange={(e) => setLanguage(e.target.value as ReelsContentInput['language'])} className="w-full p-3 bg-white/50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 transition-all">
                {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
      </div>
      <div className="mt-8 flex flex-col items-center">
        <button
          type="submit"
          disabled={isDisabled}
          className="w-full sm:w-auto flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-pink-500 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/40"
        >
          {isLoading ? 'Generating Magic...' : '🎥 Generate Content Plan'}
        </button>
        <p className="text-center mt-4 text-sm text-slate-500 dark:text-slate-400">
             🎥 Reels-to-Riches Ready: Your startup story deserves to be seen. Let the world watch you build.
        </p>
      </div>
    </form>
  );
};

export default ReelsInputForm;
