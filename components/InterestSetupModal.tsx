import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface InterestSetupModalProps {
    onClose: () => void;
}

const allInterests = ["Funding", "AI", "Startup News", "Product Launches", "EdTech", "AgriTech", "FinTech", "SaaS", "Tech India", "Web3"];

const InterestSetupModal: React.FC<InterestSetupModalProps> = ({ onClose }) => {
    const { currentUser, updateCurrentUser } = useAuth();
    const [selectedInterests, setSelectedInterests] = useState<string[]>(
        currentUser?.interests.split(',').map(i => i.trim()).filter(Boolean) || []
    );
    const [isLoading, setIsLoading] = useState(false);

    const handleInterestToggle = (interest: string) => {
        setSelectedInterests(prev => 
            prev.includes(interest)
            ? prev.filter(i => i !== interest)
            : [...prev, interest]
        );
    };

    const handleSave = () => {
        if (selectedInterests.length === 0) return;
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            updateCurrentUser({ interests: selectedInterests.join(', ') });
            setIsLoading(false);
            onClose();
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="w-full max-w-lg bg-slate-100 dark:bg-slate-900 rounded-2xl shadow-2xl animate-zoom-in border border-slate-300 dark:border-slate-700">
                <div className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">What topics excite you?</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Select your interests to get a personalized feed of live news and opportunities.</p>
                </div>
                <div className="p-6 border-t border-b border-slate-200 dark:border-slate-800">
                    <div className="flex flex-wrap justify-center gap-3">
                        {allInterests.map(interest => (
                            <button
                                key={interest}
                                onClick={() => handleInterestToggle(interest)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                                    selectedInterests.includes(interest)
                                        ? 'bg-teal-400 border-teal-400 text-slate-900'
                                        : 'bg-white/50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-600 hover:border-teal-400'
                                }`}
                            >
                                {interest}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-4 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isLoading || selectedInterests.length === 0}
                        className="px-6 py-2.5 text-base font-semibold rounded-lg text-white bg-teal-500 hover:bg-teal-600 dark:bg-teal-400 dark:text-slate-900 dark:hover:bg-teal-300 transition-all duration-300 shadow-lg shadow-teal-500/20 hover:shadow-glow-teal disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Saving...' : 'Save Interests'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterestSetupModal;