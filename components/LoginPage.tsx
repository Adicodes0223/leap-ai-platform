import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TestimonialsSlider from './TestimonialsSlider';

interface LoginPageProps {
    onSwitchToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(username, password);
            // On success, App component will handle showing the dashboard
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-md p-8 space-y-6 backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">Welcome Back</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Log in to continue your journey on LEAP.</p>
                </div>
                {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full mt-1 px-3 py-2 bg-white/50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-teal-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full mt-1 px-3 py-2 bg-white/50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-teal-500 transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-900 bg-teal-400 hover:bg-teal-300 dark:text-slate-900 dark:bg-teal-300 dark:hover:bg-teal-200 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                       {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    Don't have an account?{' '}
                    <button onClick={onSwitchToSignup} className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300">
                        Sign up
                    </button>
                </p>
            </div>
            <div className="w-full max-w-5xl mt-8">
                <TestimonialsSlider />
            </div>
        </div>
    );
};

export default LoginPage;