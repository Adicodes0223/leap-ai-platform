import React from 'react';

type Tool = 'project' | 'pitch' | 'learning';

interface ToolSwitcherProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
}

const ToolButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}> = ({ label, isActive, onClick, icon }) => {
  const baseClasses = "w-full flex items-center justify-center gap-3 px-4 py-3 text-sm sm:text-base font-bold rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900";
  const activeClasses = "bg-teal-400 text-slate-900 shadow-lg shadow-teal-500/30 dark:bg-teal-300 dark:shadow-glow-teal scale-105";
  const inactiveClasses = "bg-white/40 text-slate-600 hover:bg-white/80 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800/80";

  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      {icon}
      {label}
    </button>
  );
};

const ProjectIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
const PitchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.518" /></svg>;
const LearningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;


const ToolSwitcher: React.FC<ToolSwitcherProps> = ({ activeTool, onToolChange }) => {
  return (
    <div className="my-8 p-1.5 rounded-xl backdrop-blur-lg bg-white/30 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 shadow-lg grid grid-cols-3 gap-2 max-w-xl mx-auto">
      <ToolButton
        label="Project Builder"
        isActive={activeTool === 'project'}
        onClick={() => onToolChange('project')}
        icon={<ProjectIcon />}
      />
      <ToolButton
        label="Pitch Generator"
        isActive={activeTool === 'pitch'}
        onClick={() => onToolChange('pitch')}
        icon={<PitchIcon />}
      />
      <ToolButton
        label="Learning Path"
        isActive={activeTool === 'learning'}
        onClick={() => onToolChange('learning')}
        icon={<LearningIcon />}
      />
    </div>
  );
};

export default ToolSwitcher;