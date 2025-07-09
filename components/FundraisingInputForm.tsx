import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FundraisingInput, StartupProfile } from '../types';

interface FundraisingInputFormProps {
    onSubmit: (inputs: FundraisingInput) => void;
    isLoading: boolean;
}

const FundraisingInputForm: React.FC<FundraisingInputFormProps> = ({ onSubmit, isLoading }) => {
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState<FundraisingInput>({
        pitchDeckOutline: '',
        stage: 'Series A',
        sector: 'FinTech',
        mrr_arr: 0,
        dau_mau: 0,
        cac: 0,
        ltv: 0,
        retention: 0,
        growth_mom: 0,
        tractionSummary: ''
    });

    useEffect(() => {
        if (currentUser?.startup) {
            const { startup } = currentUser;
            setFormData(prev => ({
                ...prev,
                sector: startup.domain || 'FinTech',
                stage: startup.stage || 'Series A',
                tractionSummary: `Current stage: ${startup.stage}. One-liner: ${startup.oneLiner}. Targeting ${startup.targetAudience}.`,
                mrr_arr: startup.metrics?.monthlyRevenue ? startup.metrics.monthlyRevenue * 12 : 0,
                dau_mau: startup.metrics?.monthlyActiveUsers || 0,
                retention: startup.metrics?.churnRate ? 100 - startup.metrics.churnRate : 0,
            }));
        }
    }, [currentUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const isDisabled = isLoading || !formData.pitchDeckOutline.trim();
    const stages: StartupProfile['stage'][] = ['Pre-Series A', 'Series A', 'Series B', 'Series C'];
    const sectors: StartupProfile['domain'][] = ['EdTech', 'FinTech', 'HealthTech', 'B2B SaaS', 'D2C', 'AgriTech', 'Web3', 'Other'];

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-6 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">AI Fundraising Co-pilot</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Get an investor-grade analysis of your pitch and fundraising readiness.</p>
            </div>

            <div>
                <label htmlFor="pitchDeckOutline" className="label">Pitch Deck Outline or Text</label>
                <textarea
                    id="pitchDeckOutline"
                    value={formData.pitchDeckOutline}
                    onChange={handleChange}
                    rows={8}
                    className="input-field"
                    placeholder="Paste your pitch deck slide by slide, or provide a detailed text outline..."
                />
            </div>
            
             <div>
                <label htmlFor="tractionSummary" className="label">Traction Summary</label>
                <textarea
                    id="tractionSummary"
                    value={formData.tractionSummary}
                    onChange={handleChange}
                    rows={3}
                    className="input-field"
                    placeholder="Summarize your key achievements, user growth, and milestones."
                />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div><label htmlFor="stage" className="label">Stage</label><select id="stage" value={formData.stage} onChange={handleChange} className="input-field">{stages.map(s => <option key={s}>{s}</option>)}</select></div>
                <div><label htmlFor="sector" className="label">Sector</label><select id="sector" value={formData.sector} onChange={handleChange} className="input-field">{sectors.map(s => <option key={s}>{s}</option>)}</select></div>
                <div><label htmlFor="mrr_arr" className="label">MRR / ARR (₹)</label><input id="mrr_arr" type="number" value={formData.mrr_arr} onChange={handleChange} className="input-field" placeholder="e.g., 500000" /></div>
                <div><label htmlFor="dau_mau" className="label">DAUs / MAUs</label><input id="dau_mau" type="number" value={formData.dau_mau} onChange={handleChange} className="input-field" placeholder="e.g., 10000" /></div>
                <div><label htmlFor="cac" className="label">CAC (₹)</label><input id="cac" type="number" value={formData.cac} onChange={handleChange} className="input-field" placeholder="e.g., 500" /></div>
                <div><label htmlFor="ltv" className="label">LTV (₹)</label><input id="ltv" type="number" value={formData.ltv} onChange={handleChange} className="input-field" placeholder="e.g., 2500" /></div>
                <div><label htmlFor="retention" className="label">Retention (%)</label><input id="retention" type="number" value={formData.retention} onChange={handleChange} className="input-field" placeholder="e.g., 60" /></div>
                <div><label htmlFor="growth_mom" className="label">Growth (MoM %)</label><input id="growth_mom" type="number" value={formData.growth_mom} onChange={handleChange} className="input-field" placeholder="e.g., 20" /></div>
            </div>

            <div className="flex justify-end">
                 <button
                    type="submit"
                    disabled={isDisabled}
                    className="w-full sm:w-auto flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-slate-900 bg-yellow-400 hover:bg-yellow-300 dark:text-slate-900 dark:bg-yellow-300 dark:hover:bg-yellow-200 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 shadow-lg shadow-yellow-500/20"
                >
                    {isLoading ? 'Analyzing...' : '🚀 Generate Fundraising Plan'}
                </button>
            </div>
             <style>{`.label { display: block; font-size: 0.875rem; font-weight: 500; color: #334155; margin-bottom: 0.25rem; } .dark .label { color: #d1d5db; } .input-field { width: 100%; padding: 0.5rem 0.75rem; background-color: rgba(255,255,255,0.7); border: 1px solid #cbd5e1; border-radius: 0.375rem; transition: all 0.2s; resize: vertical; } .dark .input-field { background-color: rgba(30,41,59,0.8); border-color: #475569; }`}</style>
        </form>
    );
};

export default FundraisingInputForm;
