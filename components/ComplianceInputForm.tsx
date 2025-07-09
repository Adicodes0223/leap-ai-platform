import React, { useState } from 'react';
import { ComplianceInput } from '../types';

interface ComplianceInputFormProps {
  onSubmit: (inputs: ComplianceInput) => void;
  isLoading: boolean;
}

const businessTypes = ["Tech", "Product", "Service", "Consultancy", "EdTech", "FinTech", "HealthTech", "AgriTech", "SaaS", "E-commerce", "Other"];
const registrationTypes: ComplianceInput['registrationType'][] = ['Not registered yet', 'Individual', 'Partnership', 'Private Limited (Pvt Ltd)', 'LLP'];
const customerTargets: ComplianceInput['targetCustomers'][] = ['India', 'International'];

const ComplianceInputForm: React.FC<ComplianceInputFormProps> = ({ onSubmit, isLoading }) => {
    const [inputs, setInputs] = useState<ComplianceInput>({
        startupName: '',
        numFounders: 1,
        businessType: businessTypes[0],
        targetCustomers: customerTargets[0],
        registrationType: registrationTypes[0],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value, type } = e.target;
        setInputs(prev => ({
            ...prev,
            [id]: type === 'number' ? parseInt(value) || 1 : value,
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (inputs.startupName.trim()) {
            onSubmit(inputs);
        }
    };

    const isDisabled = !inputs.startupName.trim() || isLoading;

    return (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 dark:shadow-slate-900/50 transition-all duration-300 hover:shadow-slate-300/60 dark:hover:shadow-glow-white hover:-translate-y-1">
            <div className="space-y-6">
                <div>
                    <label htmlFor="startupName" className="block text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Startup Name</label>
                    <input id="startupName" type="text" value={inputs.startupName} onChange={handleChange} placeholder="e.g., Bharat LegalTech" className="w-full p-3 input-field" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="numFounders" className="block text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Number of Founders</label>
                        <input id="numFounders" type="number" min="1" value={inputs.numFounders} onChange={handleChange} className="w-full p-3 input-field" />
                    </div>
                     <div>
                        <label htmlFor="businessType" className="block text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Type of Business</label>
                        <select id="businessType" value={inputs.businessType} onChange={handleChange} className="w-full p-3 input-field">
                            {businessTypes.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="targetCustomers" className="block text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Target Customers</label>
                        <select id="targetCustomers" value={inputs.targetCustomers} onChange={handleChange} className="w-full p-3 input-field">
                            {customerTargets.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="registrationType" className="block text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Registration Type</label>
                        <select id="registrationType" value={inputs.registrationType} onChange={handleChange} className="w-full p-3 input-field">
                            {registrationTypes.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </div>
             <style>{`.input-field { background-color: rgba(255, 255, 255, 0.5); border: 1px solid #cbd5e1; border-radius: 0.5rem; } .dark .input-field { background-color: rgba(30, 41, 59, 0.6); border-color: #475569; } .input-field:focus { outline: 2px solid transparent; outline-offset: 2px; --tw-ring-color: #10b981; box-shadow: 0 0 0 2px var(--tw-ring-color); border-color: var(--tw-ring-color); }`}</style>
            <div className="mt-8 flex flex-col items-center">
                <button
                    type="submit"
                    disabled={isDisabled}
                    className="w-full sm:w-auto flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-green-500 shadow-lg shadow-green-500/30 hover:shadow-green-500/40"
                >
                    {isLoading ? 'Generating Docs...' : '🛡️ Generate Compliance Pack'}
                </button>
                <p className="text-center mt-4 text-sm text-slate-500 dark:text-slate-400">
                    You're now startup-safe. No lawyer needed — just LEAP.
                </p>
            </div>
        </form>
    );
};

export default ComplianceInputForm;
