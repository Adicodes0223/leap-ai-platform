
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { StartupProfile } from '../types';

interface StartupSetupModalProps {
    onClose: () => void;
}

const domains: StartupProfile['domain'][] = ['EdTech', 'FinTech', 'D2C', 'AgriTech', 'B2B SaaS', 'Web3', 'HealthTech', 'Other'];
const productTypes: StartupProfile['productType'][] = ['Software', 'Marketplace', 'B-school', 'AI tool', 'NGO', 'Service-based', 'Other'];
const stages: StartupProfile['stage'][] = ['Idea', 'Prototype', 'MVP', 'Early Traction', 'Scaling', 'Pre-Series A'];

const StartupSetupModal: React.FC<StartupSetupModalProps> = ({ onClose }) => {
    const { currentUser, updateCurrentUser } = useAuth();
    const [formData, setFormData] = useState<Partial<StartupProfile>>({
        name: '',
        oneLiner: '',
        domain: 'EdTech',
        productType: 'Software',
        targetAudience: '',
        stage: 'Idea',
        teamMembers: '1 founder',
        hasTechTeam: true,
        website: '',
        customerAcquisitionChannels: '',
        metrics: {
            weeklyActiveUsers: 0,
            monthlyActiveUsers: 0,
            totalUsers: 0,
            monthlyRevenue: 0,
            engagementRate: 0,
            userAcquisition: 0,
            churnRate: 0,
        }
    });
    const [logoName, setLogoName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        if (id === 'hasTechTeam') {
            setFormData(prev => ({ ...prev, hasTechTeam: value === 'true' }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };
    
    const handleMetricsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            metrics: {
                ...(prev.metrics!),
                [id]: Number(value) || 0
            }
        }));
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, logo: reader.result as string }));
                setLogoName(file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!formData.name || !formData.oneLiner) return;
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            updateCurrentUser({ startup: formData as StartupProfile });
            setIsLoading(false);
            onClose();
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="w-full max-w-2xl bg-slate-100 dark:bg-slate-900 rounded-2xl shadow-2xl animate-zoom-in border border-slate-300 dark:border-slate-700 max-h-[90vh] flex flex-col">
                <div className="p-6 text-center border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome, {currentUser?.fullName.split(' ')[0]}!</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Let's set up your startup profile. This helps our AI give you the best advice.</p>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div><label htmlFor="name" className="label">Startup Name <span className="text-red-500">*</span></label><input id="name" type="text" value={formData.name} onChange={handleChange} required className="input-field" /></div>
                    <div><label htmlFor="oneLiner" className="label">Brief One-Liner About the Startup <span className="text-red-500">*</span></label><textarea id="oneLiner" value={formData.oneLiner} onChange={handleChange} required className="input-field h-20" /></div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><label htmlFor="domain" className="label">Domain / Industry</label><select id="domain" value={formData.domain} onChange={handleChange} className="input-field">{domains.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                        <div><label htmlFor="productType" className="label">Product Type</label><select id="productType" value={formData.productType} onChange={handleChange} className="input-field">{productTypes.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                        <div><label htmlFor="targetAudience" className="label">Target Audience</label><input id="targetAudience" type="text" value={formData.targetAudience} onChange={handleChange} className="input-field" /></div>
                        <div><label htmlFor="stage" className="label">Current Stage</label><select id="stage" value={formData.stage} onChange={handleChange} className="input-field">{stages.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                        <div><label htmlFor="teamMembers" className="label">Number of Team Members</label><input id="teamMembers" type="text" value={formData.teamMembers} onChange={handleChange} className="input-field" /></div>
                        <div><label htmlFor="hasTechTeam" className="label">Do you have a tech team?</label><select id="hasTechTeam" value={String(formData.hasTechTeam)} onChange={handleChange} className="input-field"><option value="true">Yes</option><option value="false">No</option></select></div>
                        <div className="md:col-span-2"><label htmlFor="customerAcquisitionChannels" className="label">Customer Acquisition Channels (Optional)</label><input id="customerAcquisitionChannels" placeholder="e.g., SEO, Instagram Ads" type="text" value={formData.customerAcquisitionChannels} onChange={handleChange} className="input-field" /></div>
                        <div><label htmlFor="website" className="label">Website (Optional)</label><input id="website" type="text" value={formData.website} onChange={handleChange} className="input-field" /></div>
                        <div>
                             <label htmlFor="logo-upload" className="label">Upload Logo (Optional)</label>
                             <label htmlFor="logo-upload" className="w-full h-10 flex items-center justify-center gap-2 px-3 py-2 bg-white/50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-md cursor-pointer hover:border-purple-500">
                                <span className="text-sm truncate">{logoName || 'Choose file'}</span>
                            </label>
                            <input id="logo-upload" type="file" accept="image/*" className="sr-only" onChange={handleLogoUpload} />
                        </div>
                    </div>

                    {/* Metrics Section */}
                    <div className="pt-4 mt-4 border-t border-slate-300 dark:border-slate-700">
                        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Key Metrics</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Provide these metrics to unlock the AI Growth Dashboard. (You can edit these later).</p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div><label htmlFor="weeklyActiveUsers" className="label">Weekly Active Users</label><input id="weeklyActiveUsers" type="number" placeholder="e.g., 100" value={formData.metrics?.weeklyActiveUsers || ''} onChange={handleMetricsChange} className="input-field" /></div>
                            <div><label htmlFor="monthlyActiveUsers" className="label">Monthly Active Users</label><input id="monthlyActiveUsers" type="number" placeholder="e.g., 400" value={formData.metrics?.monthlyActiveUsers || ''} onChange={handleMetricsChange} className="input-field" /></div>
                            <div><label htmlFor="totalUsers" className="label">Total Users</label><input id="totalUsers" type="number" placeholder="e.g., 1000" value={formData.metrics?.totalUsers || ''} onChange={handleMetricsChange} className="input-field" /></div>
                            <div><label htmlFor="monthlyRevenue" className="label">Monthly Revenue (INR)</label><input id="monthlyRevenue" type="number" placeholder="e.g., 5000" value={formData.metrics?.monthlyRevenue || ''} onChange={handleMetricsChange} className="input-field" /></div>
                            <div><label htmlFor="userAcquisition" className="label">New Users / Week</label><input id="userAcquisition" type="number" placeholder="e.g., 25" value={formData.metrics?.userAcquisition || ''} onChange={handleMetricsChange} className="input-field" /></div>
                            <div><label htmlFor="engagementRate" className="label">Engagement Rate (%)</label><input id="engagementRate" type="number" placeholder="e.g., 15" value={formData.metrics?.engagementRate || ''} onChange={handleMetricsChange} className="input-field" /></div>
                            <div className="md:col-span-2"><label htmlFor="churnRate" className="label">Churn Rate (%)</label><input id="churnRate" type="number" placeholder="e.g., 5" value={formData.metrics?.churnRate || ''} onChange={handleMetricsChange} className="input-field" /></div>
                        </div>
                    </div>
                </div>
                 <style>{`.label { display: block; font-size: 0.875rem; font-weight: 500; color: #334155; margin-bottom: 0.25rem; } .dark .label { color: #d1d5db; } .input-field { width: 100%; padding: 0.5rem 0.75rem; background-color: rgba(255,255,255,0.5); border: 1px solid #cbd5e1; border-radius: 0.375rem; transition: all 0.2s; resize: vertical; } .dark .input-field { background-color: rgba(30,41,59,0.6); border-color: #475569; }`}</style>

                <div className="p-4 flex justify-end bg-slate-200/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={handleSave}
                        disabled={isLoading || !formData.name || !formData.oneLiner}
                        className="px-6 py-2.5 text-base font-semibold rounded-lg text-white bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300"
                    >
                        {isLoading ? 'Saving...' : 'Save and Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StartupSetupModal;