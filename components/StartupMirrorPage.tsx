import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FounderCheckinInput, FounderLogEntry, FounderReflectionResponse, View } from '../types';
import { generateFounderReflection } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import GoogleAttribution from './GoogleAttribution';

// Type Guard
function isFounderReflection(response: any): response is FounderReflectionResponse {
    return response && response.analysis && response.lesson;
}

const CheckinForm: React.FC<{
    onSubmit: (data: FounderCheckinInput) => void;
    isLoading: boolean;
}> = ({ onSubmit, isLoading }) => {
    const [wentWrong, setWentWrong] = useState('');
    const [biggestBlocker, setBiggestBlocker] = useState('');
    const [systemToFix, setSystemToFix] = useState('');
    const disabled = !wentWrong.trim() || !biggestBlocker.trim() || !systemToFix.trim() || isLoading;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ wentWrong, biggestBlocker, systemToFix });
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-6 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70">
            <div>
                <label htmlFor="wentWrong" className="block text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">❓ What went wrong this week?</label>
                <textarea id="wentWrong" value={wentWrong} onChange={e => setWentWrong(e.target.value)} rows={3} className="textarea-field" placeholder="e.g., We missed our deadline for the user authentication feature..."></textarea>
            </div>
            <div>
                <label htmlFor="biggestBlocker" className="block text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">🚧 What's your biggest blocker right now?</label>
                <textarea id="biggestBlocker" value={biggestBlocker} onChange={e => setBiggestBlocker(e.target.value)} rows={3} className="textarea-field" placeholder="e.g., Team communication is a bit slow, leading to rework."></textarea>
            </div>
            <div>
                <label htmlFor="systemToFix" className="block text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">🛠️ What’s one system/process you can fix next week?</label>
                <textarea id="systemToFix" value={systemToFix} onChange={e => setSystemToFix(e.target.value)} rows={3} className="textarea-field" placeholder="e.g., I will set up a daily 10-minute async stand-up on Slack."></textarea>
            </div>
            <div className="flex justify-end">
                <button type="submit" disabled={disabled} className="px-8 py-3 font-semibold rounded-lg text-white bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 transition-colors">
                    {isLoading ? 'Reflecting...' : 'Submit Reflection'}
                </button>
            </div>
            <style>{`.textarea-field { width: 100%; padding: 0.75rem; background-color: rgba(255,255,255,0.7); border: 1px solid #cbd5e1; border-radius: 0.5rem; transition: all 0.2s; resize: vertical; } .dark .textarea-field { background-color: rgba(30,41,59,0.8); border-color: #475569; }`}</style>
        </form>
    );
};

const JournalView: React.FC<{ logs: FounderLogEntry[], onRestart: () => void }> = ({ logs, onRestart }) => {
    const chartData = logs.map(log => ({
        date: new Date(log.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        burnoutScore: log.analysis.burnoutScore
    })).reverse();
    
    return (
        <div className="space-y-8">
            <div className="p-6 rounded-2xl shadow-xl backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70">
                 <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Your Burnout Score Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="date" stroke="currentColor" />
                        <YAxis stroke="currentColor" domain={[0, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid #475569', borderRadius: '0.5rem' }} />
                        <Legend />
                        <Line type="monotone" dataKey="burnoutScore" stroke="#a855f7" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
             <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-8">Your Founder Journal</h3>
            {logs.map(log => (
                <div key={log.id} className="p-6 rounded-2xl shadow-xl backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70">
                    <p className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">Reflection from {new Date(log.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                     <div className="mt-4 p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="font-semibold text-slate-700 dark:text-slate-300">This week's challenge:</p>
                        <p className="italic text-slate-600 dark:text-slate-400">"{log.checkin.wentWrong}"</p>
                     </div>
                     <div className="mt-4 p-4 bg-purple-100/50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                         <p className="font-semibold text-purple-800 dark:text-purple-300">AI Analysis:</p>
                         <p className="text-purple-700 dark:text-purple-300">{log.analysis.burnoutAnalysis}</p>
                         <GoogleAttribution className="mt-3" />
                     </div>
                     <div className="mt-4 p-4 bg-sky-100/50 dark:bg-sky-900/30 rounded-lg border border-sky-200 dark:border-sky-700">
                         <p className="font-semibold text-sky-800 dark:text-sky-300">Unicorn Founder Lesson:</p>
                         <p className="text-sky-700 dark:text-sky-300"><strong>{log.lesson.title}</strong>: {log.lesson.actionableSuggestion}</p>
                     </div>
                </div>
            ))}
             <div className="text-center mt-8">
                <button onClick={onRestart} className="px-6 py-2 font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                    Check In Again Next Week
                </button>
            </div>
        </div>
    );
};

const StartupMirrorPage: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
    const { currentUser, updateCurrentUser } = useAuth();
    const [checkinDue, setCheckinDue] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!currentUser) return;
        const lastLog = currentUser.founderLogs?.[0];
        if (!lastLog) {
            setCheckinDue(true);
        } else {
            const lastLogDate = new Date(lastLog.date);
            const diffTime = Math.abs(new Date().getTime() - lastLogDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setCheckinDue(diffDays > 6);
        }
        setIsLoading(false);
    }, [currentUser]);

    const handleCheckinSubmit = async (data: FounderCheckinInput) => {
        if (!currentUser?.startup) {
            setError("Please complete your startup profile first.");
            // Here you could trigger the setup modal from App.tsx
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateFounderReflection(data, currentUser.startup);
            if (isFounderReflection(result)) {
                const newLog: FounderLogEntry = {
                    id: `log-${Date.now()}`,
                    date: new Date().toISOString(),
                    checkin: data,
                    analysis: result.analysis,
                    lesson: result.lesson
                };
                const updatedLogs = [newLog, ...(currentUser.founderLogs || [])];
                updateCurrentUser({ founderLogs: updatedLogs });
                setCheckinDue(false);
            } else {
                 setError(result.clarificationNeeded || "The AI returned an unexpected response.");
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!currentUser) return null;

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Startup Mirror</h2>
                <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">Your private space for reflection, resilience, and growth.</p>
            </div>
            
            {isLoading && <LoadingSpinner />}

            {!isLoading && error && (
                 <div className="text-center p-8">
                    <p className="text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">{error}</p>
                </div>
            )}

            {!isLoading && !error && (
                checkinDue 
                ? <CheckinForm onSubmit={handleCheckinSubmit} isLoading={isLoading} />
                : <JournalView logs={currentUser.founderLogs || []} onRestart={() => setCheckinDue(true)} />
            )}
        </div>
    );
};

export default StartupMirrorPage;
