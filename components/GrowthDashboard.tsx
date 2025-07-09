import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { generateGrowthInsights } from '../services/geminiService';
import { StartupDataInput, GrowthDashboardResponse, Clarification, FunnelData, View, StartupProfile, GrowthProjection } from '../types';
import LoadingSpinner from './LoadingSpinner';
import GoogleAttribution from './GoogleAttribution';
import { ResponsiveContainer, LineChart, BarChart, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Type guard
function isGrowthDashboardResponse(response: any): response is GrowthDashboardResponse {
  return response && response.growthExperiments !== undefined;
}

// Icons
const ExperimentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.512 1.414L5.621 13.75h12.758l-3.617-3.518a2.25 2.25 0 01-.512-1.414V3.104M15 3.104L9 3.104m6 0v.01M9 3.104v.01M12 21h-1.25a2.25 2.25 0 01-2.25-2.25V15.5h5.5v3.25a2.25 2.25 0 01-2.25 2.25H12z" /></svg>;
const RetentionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ReferralIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>;
const MonetizationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0l.879-.659M7.5 14.25l.879.659c1.171.879 3.07.879 4.242 0l.879-.659M7.5 12l.879.659c1.171.879 3.07.879 4.242 0l.879-.659M7.5 9.75l.879.659c1.171.879 3.07.879 4.242 0l.879-.659M7.5 7.5l.879.659c1.171.879 3.07.879 4.242 0l.879-.659M7.5 5.25l.879.659c1.171.879 3.07.879 4.242 0l.879-.659" /></svg>;
const FunnelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.572a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>;
const ABTestIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>;
const TeamOpsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.625l2.25-2.25m0 0l-2.25 2.25M13.5 12l2.25 2.25M13.5 12l-2.25-2.25" /></svg>;
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


const FunnelChart: React.FC<{ data: FunnelData, analysis: GrowthDashboardResponse['funnelAnalysis'] }> = ({ data, analysis }) => {
    const stages = Object.keys(data) as (keyof FunnelData)[];
    
    const getStageColor = (stage: keyof FunnelData) => {
        if (stage.toLowerCase() === analysis.weakestStage.toLowerCase()) {
            return 'bg-red-500/20 border-red-500';
        }
        return 'bg-sky-500/10 border-sky-500';
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0">
                {stages.map((stage, i) => (
                    <React.Fragment key={stage}>
                        <div className={`relative p-3 rounded-lg border-2 w-full md:w-auto ${getStageColor(stage)}`}>
                            <div className="text-center">
                                <p className="font-bold capitalize text-slate-800 dark:text-slate-100">{stage}</p>
                                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{data[stage]}</p>
                            </div>
                        </div>
                        {i < stages.length - 1 && <div className="text-2xl text-slate-400 dark:text-slate-500 mx-2">→</div>}
                    </React.Fragment>
                ))}
            </div>
            <div className="p-4 mt-4 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-300 dark:border-indigo-700 text-center">
                <h4 className="font-bold text-indigo-800 dark:text-indigo-200">AI Funnel Analysis</h4>
                <p className="text-indigo-700 dark:text-indigo-300 mt-1">{analysis.suggestion}</p>
            </div>
        </div>
    );
};

const RenderProjectionChart: React.FC<{ projection: GrowthProjection }> = ({ projection }) => {
    const ChartComponent = projection.chartType === 'line' ? LineChart : BarChart;

    return (
        <div className="mt-4">
            <h5 className="font-semibold text-sm text-indigo-700 dark:text-indigo-300">Projected Impact: {projection.change} in {projection.metric}</h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{projection.rationale}</p>
            <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <ChartComponent data={projection.data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                        <YAxis stroke="currentColor" fontSize={12} allowDecimals={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid #475569', borderRadius: '0.5rem', fontSize: '12px' }} />
                        {projection.chartType === 'line' ? (
                            <Line type="monotone" dataKey="value" name={projection.metric} fill="#818cf8" stroke="#6366f1" strokeWidth={2} />
                        ) : (
                            <Bar dataKey="value" name={projection.metric} fill="#818cf8" stroke="#6366f1" />
                        )}
                    </ChartComponent>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


const CopyCodeButton: React.FC<{ code: string }> = ({ code }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 rounded-md text-slate-500 bg-slate-200/50 hover:bg-slate-300/80 dark:text-slate-400 dark:bg-slate-800/50 dark:hover:bg-slate-700/80 transition-all" >
            {copied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
        </button>
    );
};

const InsightCard: React.FC<{children: React.ReactNode, projection?: GrowthProjection}> = ({children, projection}) => {
    const [status, setStatus] = useState<'todo' | 'done' | 'saved'>('todo');

    return (
        <div className={`group relative p-4 rounded-xl shadow-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/70 transition-all duration-300 hover:shadow-xl dark:hover:shadow-glow-blue ${status === 'done' ? 'opacity-60' : ''}`}>
             <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10"></div>
            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-li:my-0.5">
                {children}
            </div>
            {projection && <RenderProjectionChart projection={projection} />}
            <div className="flex gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/50">
                <button onClick={() => setStatus('done')} className={`btn-xs ${status === 'done' ? 'btn-green' : 'btn-secondary'}`}>Mark Done</button>
                <button onClick={() => setStatus('saved')} className={`btn-xs ${status === 'saved' ? 'btn-yellow' : 'btn-secondary'}`}>Save for Later</button>
            </div>
             <style>{`
                .btn-xs { padding: 4px 10px; font-size: 12px; font-weight: 600; border-radius: 6px; transition: all 0.2s; }
                .btn-secondary { background-color: #e2e8f0; color: #475569; } .dark .btn-secondary { background-color: #334155; color: #cbd5e1; }
                .btn-green { background-color: #10b981; color: white; }
                .btn-yellow { background-color: #f59e0b; color: white; }
            `}</style>
        </div>
    );
}

// Main Component
const GrowthDashboard: React.FC<{ onNavigate: (view: View, profileId?: string) => void }> = ({ onNavigate }) => {
    const { currentUser } = useAuth();
    const [insights, setInsights] = useState<GrowthDashboardResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('Funnel');

    const tabs = [
        { name: 'Funnel', icon: <FunnelIcon /> },
        { name: 'Experiments', icon: <ExperimentIcon /> },
        { name: 'Retention', icon: <RetentionIcon /> },
        { name: 'Referral', icon: <ReferralIcon /> },
        { name: 'Monetization', icon: <MonetizationIcon /> },
        { name: 'A/B Tests', icon: <ABTestIcon /> },
        { name: 'Alerts', icon: <AlertIcon /> },
        { name: 'TeamOps', icon: <TeamOpsIcon /> },
    ];

    useEffect(() => {
        const handleGenerate = async (startupProfile: StartupProfile) => {
            if (!startupProfile.metrics || Object.values(startupProfile.metrics).every(v => v === 0)) {
                setError("Please complete your startup metrics in your profile to generate growth insights.");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const fullStartupData: StartupDataInput = {
                    ...startupProfile,
                    weeklyActiveUsers: startupProfile.metrics.weeklyActiveUsers,
                    userAcquisition: startupProfile.metrics.userAcquisition,
                    engagementRate: startupProfile.metrics.engagementRate,
                    churnRate: startupProfile.metrics.churnRate,
                    monthlyRevenue: startupProfile.metrics.monthlyRevenue,
                };

                const result = await generateGrowthInsights(fullStartupData);
                if (isGrowthDashboardResponse(result)) {
                    setInsights(result);
                } else {
                    setError((result as Clarification).clarificationNeeded || "The AI returned an unexpected response.");
                }
            } catch (e: any) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (currentUser?.startup && !insights) {
            handleGenerate(currentUser.startup);
        } else if (!currentUser?.startup) {
            setIsLoading(false);
        }
    }, [currentUser?.startup, insights]);


    if (isLoading) {
        return <LoadingSpinner />;
    }
    
    if (error) {
        return (
            <div className="text-center p-8">
                <p className="text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">{error}</p>
                <button onClick={() => onNavigate('profile', currentUser?.id)} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg">Go to Profile Settings</button>
            </div>
        );
    }
    
    if (!currentUser?.startup) {
        return <div className="text-center p-8">Please complete your startup profile to use the Growth Dashboard.</div>
    }

    if (insights) {
        const funnelChartData: FunnelData = {
            acquisition: currentUser.startup.metrics?.userAcquisition || 0,
            activation: Math.round((currentUser.startup.metrics?.weeklyActiveUsers || 0) * ((currentUser.startup.metrics?.engagementRate || 0) / 100)),
            retention: Math.round((currentUser.startup.metrics?.weeklyActiveUsers || 0) * (1 - (currentUser.startup.metrics?.churnRate || 0) / 100)),
            revenue: currentUser.startup.metrics?.monthlyRevenue || 0,
            referral: Math.round((currentUser.startup.metrics?.userAcquisition || 0) * 0.05) // Assuming 5% referral rate
        };

        return (
            <div className="animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Growth Plan for {currentUser.startup.name}</h2>
                    <button onClick={() => onNavigate('profile', currentUser.id)} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Edit Startup Profile</button>
                </div>
                <div className="flex flex-wrap gap-x-2 gap-y-1 border-b border-slate-300 dark:border-slate-700 mb-6">
                    {tabs.map(tab => (
                        <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`flex items-center gap-2 px-3 py-2.5 text-sm font-bold transition-all ${activeTab === tab.name ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>
                            {tab.icon} {tab.name}
                        </button>
                    ))}
                </div>

                <div className="space-y-6">
                    {activeTab === 'Funnel' && <FunnelChart data={funnelChartData} analysis={insights.funnelAnalysis} />}
                    {activeTab === 'Experiments' && insights.growthExperiments.map((exp, i) => (
                        <InsightCard key={i} projection={exp.projection}>
                            <h4 className="font-bold text-indigo-600 dark:text-indigo-400">{exp.title}</h4>
                            <p><strong>Hypothesis:</strong> {exp.hypothesis}</p>
                            <p><strong>Expected Impact:</strong> {exp.expectedImpact}</p>
                            <p><strong>Tools:</strong> {exp.toolsNeeded.join(', ')}</p>
                            <details className="mt-2 text-xs"><summary className="cursor-pointer font-semibold">Execution Steps & Content</summary>
                                <ul className="list-decimal list-inside mt-1">
                                    {exp.executionSteps.map((step, j) => <li key={j}>{step}</li>)}
                                </ul>
                                <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800/50 rounded">
                                    <p className="font-bold">{exp.contentSample.title}</p>
                                    <p>{exp.contentSample.body}</p>
                                </div>
                            </details>
                        </InsightCard>
                    ))}
                    {activeTab === 'Retention' && insights.retentionLevers.map((lever, i) => (
                        <InsightCard key={i} projection={lever.projection}>
                            <h4 className="font-bold text-indigo-600 dark:text-indigo-400">{lever.title} ({lever.type})</h4>
                            <p>{lever.description}</p>
                            <p><strong>Idea:</strong> {lever.implementationIdea}</p>
                        </InsightCard>
                    ))}
                     {activeTab === 'Referral' && (
                        <InsightCard>
                             <h4 className="font-bold text-indigo-600 dark:text-indigo-400">Referral Strategy: {insights.referralStrategy.recommendedModel}</h4>
                             <p><strong>Rationale:</strong> {insights.referralStrategy.rationale}</p>
                             <p><strong>Tools:</strong> {insights.referralStrategy.suggestedTools.join(', ')}</p>
                             <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800/50 rounded">
                                 <p className="font-bold">{insights.referralStrategy.referralCopy.headline}</p>
                                 <p>{insights.referralStrategy.referralCopy.body}</p>
                                 <p className="font-bold mt-1">CTA: {insights.referralStrategy.referralCopy.cta}</p>
                             </div>
                        </InsightCard>
                    )}
                    {activeTab === 'Monetization' && insights.monetizationPlaybooks.map((playbook, i) => (
                        <InsightCard key={i} projection={playbook.projection}>
                            <h4 className="font-bold text-indigo-600 dark:text-indigo-400">{playbook.title} ({playbook.type})</h4>
                            <p>{playbook.description}</p>
                            <p><strong>Idea:</strong> {playbook.implementationIdea}</p>
                        </InsightCard>
                    ))}
                    {activeTab === 'A/B Tests' && insights.abTests.map((test, i) => (
                        <InsightCard key={i}>
                            <h4 className="font-bold text-indigo-600 dark:text-indigo-400">{test.title}</h4>
                            <p><strong>Location:</strong> {test.location}</p>
                            <p><strong>Hypothesis:</strong> {test.hypothesis}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div className="relative p-2 bg-slate-100 dark:bg-slate-800/50 rounded">
                                    <p className="font-semibold">Variant A (Control)</p>
                                    <p className="text-xs">{test.variantA.description}</p>
                                    {test.variantA.codeSnippet && <CopyCodeButton code={test.variantA.codeSnippet} />}
                                </div>
                                 <div className="relative p-2 bg-slate-100 dark:bg-slate-800/50 rounded">
                                    <p className="font-semibold">Variant B (Test)</p>
                                    <p className="text-xs">{test.variantB.description}</p>
                                     {test.variantB.codeSnippet && <CopyCodeButton code={test.variantB.codeSnippet} />}
                                </div>
                            </div>
                        </InsightCard>
                    ))}
                    {activeTab === 'Alerts' && insights.alerts.map((alert, i) => (
                        <InsightCard key={i}>
                            <h4 className={`font-bold ${alert.severity === 'High' ? 'text-red-500' : alert.severity === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>{alert.title}</h4>
                            <p><strong>Metric:</strong> {alert.metric}</p>
                            <p><strong>Observation:</strong> {alert.observation}</p>
                            <p><strong>Suggestion:</strong> {alert.suggestion}</p>
                        </InsightCard>
                    ))}
                    {activeTab === 'TeamOps' && insights.teamOps && (
                        <>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Documentation Templates</h3>
                            {insights.teamOps.templates.map((template, i) => (
                                <InsightCard key={`template-${i}`}>
                                    <h4 className="font-bold text-indigo-600 dark:text-indigo-400">{template.title}</h4>
                                    <p>{template.description}</p>
                                    <details className="mt-2 text-xs"><summary className="cursor-pointer font-semibold">View Template</summary><pre className="mt-1 p-2 bg-slate-100 dark:bg-slate-800/50 rounded whitespace-pre-wrap">{template.content}</pre></details>
                                </InsightCard>
                            ))}
                             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-6">Collaboration Boosters</h3>
                             {insights.teamOps.collaborationBoosters.map((booster, i) => (
                                <InsightCard key={`booster-${i}`}>
                                    <h4 className="font-bold text-indigo-600 dark:text-indigo-400">{booster.title} ({booster.type})</h4>
                                    <p>{booster.description}</p>
                                     <details className="mt-2 text-xs"><summary className="cursor-pointer font-semibold">View Guide</summary><pre className="mt-1 p-2 bg-slate-100 dark:bg-slate-800/50 rounded whitespace-pre-wrap">{booster.content}</pre></details>
                                </InsightCard>
                            ))}
                             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-6">Brainstorm Starters</h3>
                             {insights.teamOps.brainstormPrompts.map((prompt, i) => (
                                <InsightCard key={`prompt-${i}`}>
                                    <h4 className="font-bold text-indigo-600 dark:text-indigo-400">{prompt.title}</h4>
                                    <p className="italic">"{prompt.prompt}"</p>
                                </InsightCard>
                            ))}
                        </>
                    )}
                </div>
                 <div className="mt-12 text-center p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <GoogleAttribution />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        This dashboard is powered by your startup's metrics and generated by Gemini.
                    </p>
                </div>
            </div>
        );
    }
    
    return null; // Should not be reached
};

export default GrowthDashboard;