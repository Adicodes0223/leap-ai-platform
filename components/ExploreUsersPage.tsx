import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import UserCard from './UserCard';
import { View } from '../types';

interface ExploreUsersPageProps {
    onNavigate: (view: View, profileId?: string) => void;
    onStartChat: (userId: string) => void;
}

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);


const ExploreUsersPage: React.FC<ExploreUsersPageProps> = ({ onNavigate, onStartChat }) => {
    const { currentUser, users } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    const allInterests = useMemo(() => {
        const interestsSet = new Set<string>();
        users.forEach(user => {
            user.interests.split(',').forEach(interest => {
                if(interest.trim()) interestsSet.add(interest.trim())
            });
        });
        return Array.from(interestsSet).sort();
    }, [users]);

    const toggleFilter = (interest: string) => {
        setActiveFilters(prev =>
            prev.includes(interest)
            ? prev.filter(f => f !== interest)
            : [...prev, interest]
        );
    };

    const filteredUsers = useMemo(() => {
        return users
            .filter(user => user.id !== currentUser?.id) // Don't show current user
            .filter(user => {
                const query = searchQuery.toLowerCase();
                const matchesQuery = query === '' ||
                    user.fullName.toLowerCase().includes(query) ||
                    user.username.toLowerCase().includes(query) ||
                    user.bio.toLowerCase().includes(query) ||
                    user.skills.toLowerCase().includes(query) ||
                    user.interests.toLowerCase().includes(query);

                const userInterests = user.interests.split(',').map(i => i.trim());
                const matchesFilters = activeFilters.length === 0 ||
                    activeFilters.every(filter => userInterests.includes(filter));

                return matchesQuery && matchesFilters;
            });
    }, [searchQuery, activeFilters, currentUser, users]);
    
    const getFirstName = (fullName: string | undefined) => fullName?.split(' ')[0] || 'Builder';

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Explore Creators, Builders, and Thinkers</h2>
                {currentUser ? (
                     <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">{getFirstName(currentUser.fullName)}, connect with others who share your interests.</p>
                ) : (
                    <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">Find your tribe, collaborate smarter, and never build alone.</p>
                )}
            </div>

            {/* Search and Filters */}
            <div className="p-4 rounded-2xl shadow-lg backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 mb-8 space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search users by name, skill, or interest..."
                        className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {allInterests.map(interest => (
                        <button
                            key={interest}
                            onClick={() => toggleFilter(interest)}
                            className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${
                                activeFilters.includes(interest)
                                    ? 'bg-indigo-500 border-indigo-500 text-white'
                                    : 'bg-white/50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-600 hover:border-indigo-400'
                            }`}
                        >
                            {interest}
                        </button>
                    ))}
                     {activeFilters.length > 0 && (
                        <button onClick={() => setActiveFilters([])} className="text-sm text-slate-500 hover:text-red-500 underline">Clear Filters</button>
                     )}
                </div>
            </div>

            {/* Users Grid */}
            {filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map(user => (
                        <UserCard key={user.id} user={user} onStartChat={onStartChat} onNavigate={onNavigate} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                    <p className="text-xl font-semibold">No builders found matching your criteria.</p>
                    <p>Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};

export default ExploreUsersPage;