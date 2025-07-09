import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TestimonialsSlider from './TestimonialsSlider';

interface SignupPageProps {
    onSwitchToLogin: () => void;
}

const allInterests = ["Funding", "AI", "Startup News", "Product Launches", "EdTech", "AgriTech", "FinTech", "SaaS", "Tech India", "Web3"];

const SignupPage: React.FC<SignupPageProps> = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        educationLevel: 'Under-Graduate' as 'High School' | 'Under-Graduate' | 'Post-Graduate' | 'Other',
        institution: '',
        degree: '',
        graduationYear: '',
        skills: '',
        role: 'Student Founder',
        location: '',
    });
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleInterestToggle = (interest: string) => {
        setSelectedInterests(prev => 
            prev.includes(interest)
            ? prev.filter(i => i !== interest)
            : [...prev, interest]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const { username, email, password, fullName, educationLevel, institution, degree, graduationYear, skills, role, location } = formData;
            if (!username || !email || !password || !fullName || !institution || !degree || !graduationYear || !skills || !role || !location || selectedInterests.length === 0) {
                throw new Error("Please fill out all fields, including at least one interest.");
            }
            await signup({ username, email, password, fullName, educationLevel, institution, degree, graduationYear, skills, interests: selectedInterests.join(', '), role, location });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-2xl p-8 space-y-6 backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">Create Your LEAP Profile</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Join the community of builders. This helps us personalize your experience.</p>
                </div>
                {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                            <input id="fullName" type="text" value={formData.fullName} onChange={handleChange} required className="w-full mt-1 input-field" />
                        </div>
                         <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
                            <input id="username" type="text" value={formData.username} onChange={handleChange} required className="w-full mt-1 input-field" />
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                            <input id="email" type="email" value={formData.email} onChange={handleChange} required className="w-full mt-1 input-field" />
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                            <input id="password" type="password" value={formData.password} onChange={handleChange} required className="w-full mt-1 input-field" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-300 dark:border-slate-700">
                        <div>
                           <label htmlFor="educationLevel" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Education Level</label>
                           <select id="educationLevel" value={formData.educationLevel} onChange={handleChange} required className="w-full mt-1 input-field">
                               <option>Under-Graduate</option>
                               <option>Post-Graduate</option>
                               <option>High School</option>
                               <option>Other</option>
                           </select>
                        </div>
                         <div>
                            <label htmlFor="institution" className="block text-sm font-medium text-slate-700 dark:text-slate-300">College/Institution Name</label>
                            <input id="institution" type="text" value={formData.institution} onChange={handleChange} required className="w-full mt-1 input-field" />
                        </div>
                         <div>
                            <label htmlFor="degree" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Branch / Degree</label>
                            <input id="degree" type="text" value={formData.degree} onChange={handleChange} required placeholder="e.g., B.Tech in CSE" className="w-full mt-1 input-field" />
                        </div>
                         <div>
                            <label htmlFor="graduationYear" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Year of Study / Graduation</label>
                            <input id="graduationYear" type="text" value={formData.graduationYear} onChange={handleChange} required placeholder="e.g., 3rd Year or 2025" className="w-full mt-1 input-field" />
                        </div>
                         <div>
                            <label htmlFor="role" className="block text-sm font-medium text-slate-700 dark:text-slate-300">I am a...</label>
                            <select id="role" value={formData.role} onChange={handleChange} required className="w-full mt-1 input-field">
                                <option>Student Founder</option>
                                <option>Developer</option>
                                <option>Designer</option>
                                <option>AI Researcher</option>
                                <option>Student</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
                            <input id="location" type="text" value={formData.location} onChange={handleChange} required placeholder="e.g., Mumbai, India" className="w-full mt-1 input-field" />
                        </div>
                    </div>
                     <div className="pt-4 border-t border-slate-300 dark:border-slate-700">
                        <label htmlFor="skills" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Top 3 Skills</label>
                        <input id="skills" type="text" value={formData.skills} onChange={handleChange} required placeholder="e.g., UI/UX, Python, Marketing" className="w-full mt-1 input-field" />
                    </div>
                     <div className="pt-4 border-t border-slate-300 dark:border-slate-700">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">What topics excite you most?</label>
                        <div className="flex flex-wrap gap-2">
                            {allInterests.map(interest => (
                                 <button
                                    type="button"
                                    key={interest}
                                    onClick={() => handleInterestToggle(interest)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
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

                    <style>{`.input-field { background-color: rgba(255, 255, 255, 0.5); border: 1px solid #cbd5e1; border-radius: 0.375rem; padding: 0.5rem 0.75rem; transition: all 0.2s; } .dark .input-field { background-color: rgba(30, 41, 59, 0.6); border-color: #475569; } .input-field:focus { outline: 2px solid transparent; outline-offset: 2px; --tw-ring-color: #14b8a6; box-shadow: 0 0 0 2px var(--tw-ring-color); border-color: var(--tw-ring-color); }`}</style>
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-900 bg-teal-400 hover:bg-teal-300 dark:text-slate-900 dark:bg-teal-300 dark:hover:bg-teal-200 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                       {isLoading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300">
                        Log in
                    </button>
                </p>
            </div>

            <div className="w-full max-w-5xl mt-8">
                <TestimonialsSlider />
            </div>
        </div>
    );
};

export default SignupPage;