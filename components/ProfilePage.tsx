

import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { View, StartupProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { postsDB } from '../mockDB';

const StartupSettings: React.FC = () => {
    const { currentUser, updateCurrentUser } = useAuth();
    const [formData, setFormData] = useState<StartupProfile | undefined>(
        currentUser?.startup ? {
            ...currentUser.startup,
            metrics: currentUser.startup.metrics || {
                weeklyActiveUsers: 0,
                monthlyActiveUsers: 0,
                totalUsers: 0,
                monthlyRevenue: 0,
                engagementRate: 0,
                userAcquisition: 0,
                churnRate: 0,
            }
        } : undefined
    );
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setFormData(
            currentUser?.startup ? {
                ...currentUser.startup,
                metrics: currentUser.startup.metrics || {
                    weeklyActiveUsers: 0,
                    monthlyActiveUsers: 0,
                    totalUsers: 0,
                    monthlyRevenue: 0,
                    engagementRate: 0,
                    userAcquisition: 0,
                    churnRate: 0,
                }
            } : undefined
        );
    }, [currentUser?.startup]);

    if (!formData) {
        return <div className="p-6 rounded-2xl shadow-lg backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 text-center"><p>No startup profile found. Something went wrong.</p></div>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value, type } = e.target;
        
        if (id === 'hasTechTeam') {
            setFormData(prev => prev ? ({ ...prev, hasTechTeam: value === 'true' }) : undefined);
        } else {
            setFormData(prev => prev ? ({ ...prev, [id]: value }) : undefined);
        }
    };

    const handleMetricsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => {
            if (!prev) return undefined;
            return {
                ...prev,
                metrics: {
                    ...(prev.metrics!),
                    [id]: Number(value) || 0,
                },
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        if (formData) {
            updateCurrentUser({ startup: formData });
        }
        setTimeout(() => setIsSaving(false), 1000); // Simulate save
    };
    
    const domains: StartupProfile['domain'][] = ['EdTech', 'FinTech', 'D2C', 'AgriTech', 'B2B SaaS', 'Web3', 'HealthTech', 'Other'];
    const productTypes: StartupProfile['productType'][] = ['Software', 'Marketplace', 'B-school', 'AI tool', 'NGO', 'Service-based', 'Other'];
    const stages: StartupProfile['stage'][] = ['Idea', 'Prototype', 'MVP', 'Early Traction', 'Scaling', 'Pre-Series A'];

    return (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl shadow-lg backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 space-y-4">
            <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700 pb-2">Startup Settings</h3>
            <div className="grid md:grid-cols-2 gap-4">
                <div><label htmlFor="name" className="label">Startup Name</label><input id="name" type="text" value={formData.name} onChange={handleChange} className="input-field" /></div>
                <div><label htmlFor="oneLiner" className="label">One-Liner</label><input id="oneLiner" type="text" value={formData.oneLiner} onChange={handleChange} className="input-field" /></div>
                <div><label htmlFor="domain" className="label">Domain</label><select id="domain" value={formData.domain} onChange={handleChange} className="input-field">{domains.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                <div><label htmlFor="productType" className="label">Product Type</label><select id="productType" value={formData.productType} onChange={handleChange} className="input-field">{productTypes.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                <div><label htmlFor="targetAudience" className="label">Target Audience</label><input id="targetAudience" type="text" value={formData.targetAudience} onChange={handleChange} className="input-field" /></div>
                <div><label htmlFor="stage" className="label">Stage</label><select id="stage" value={formData.stage} onChange={handleChange} className="input-field">{stages.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label htmlFor="teamMembers" className="label">Team Members</label><input id="teamMembers" type="text" value={formData.teamMembers} onChange={handleChange} className="input-field" /></div>
                <div><label htmlFor="hasTechTeam" className="label">Has Tech Team?</label><select id="hasTechTeam" value={String(formData.hasTechTeam)} onChange={handleChange} className="input-field"><option value="true">Yes</option><option value="false">No</option></select></div>
                <div className="md:col-span-2"><label htmlFor="customerAcquisitionChannels" className="label">Customer Acquisition Channels (Optional)</label><input id="customerAcquisitionChannels" placeholder="e.g., SEO, Instagram Ads" type="text" value={formData.customerAcquisitionChannels || ''} onChange={handleChange} className="input-field" /></div>
                <div className="md:col-span-2"><label htmlFor="website" className="label">Website (Optional)</label><input id="website" type="text" value={formData.website || ''} onChange={handleChange} className="input-field" /></div>
            </div>
             
             {/* Metrics Section */}
            <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700 pb-2 mt-6">Key Metrics</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 -mt-2 mb-4">This data powers your AI Growth Dashboard.</p>
            <div className="grid md:grid-cols-2 gap-4">
                <div><label htmlFor="weeklyActiveUsers" className="label">Weekly Active Users</label><input id="weeklyActiveUsers" type="number" placeholder="e.g., 100" value={formData.metrics?.weeklyActiveUsers || ''} onChange={handleMetricsChange} className="input-field" /></div>
                <div><label htmlFor="monthlyActiveUsers" className="label">Monthly Active Users</label><input id="monthlyActiveUsers" type="number" placeholder="e.g., 400" value={formData.metrics?.monthlyActiveUsers || ''} onChange={handleMetricsChange} className="input-field" /></div>
                <div><label htmlFor="totalUsers" className="label">Total Users</label><input id="totalUsers" type="number" placeholder="e.g., 1000" value={formData.metrics?.totalUsers || ''} onChange={handleMetricsChange} className="input-field" /></div>
                <div><label htmlFor="monthlyRevenue" className="label">Monthly Revenue (INR)</label><input id="monthlyRevenue" type="number" placeholder="e.g., 5000" value={formData.metrics?.monthlyRevenue || ''} onChange={handleMetricsChange} className="input-field" /></div>
                <div><label htmlFor="userAcquisition" className="label">New Users / Week</label><input id="userAcquisition" type="number" placeholder="e.g., 25" value={formData.metrics?.userAcquisition || ''} onChange={handleMetricsChange} className="input-field" /></div>
                <div><label htmlFor="engagementRate" className="label">Engagement Rate (%)</label><input id="engagementRate" type="number" placeholder="e.g., 15" value={formData.metrics?.engagementRate || ''} onChange={handleMetricsChange} className="input-field" /></div>
                <div><label htmlFor="churnRate" className="label">Churn Rate (%)</label><input id="churnRate" type="number" placeholder="e.g., 5" value={formData.metrics?.churnRate || ''} onChange={handleMetricsChange} className="input-field" /></div>
            </div>

            <div className="flex justify-end pt-4">
                <button type="submit" disabled={isSaving} className="px-5 py-2 font-semibold rounded-lg text-sm bg-purple-600 text-white hover:bg-purple-700 disabled:bg-slate-400 transition-colors">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
            <style>{`.label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; } .input-field { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.375rem; background-color: rgba(255,255,255,0.7); } .dark .input-field { border-color: #475569; background-color: rgba(30,41,59,0.8); }`}</style>
        </form>
    );
};


interface ProfilePageProps {
    userId: string;
    onNavigate: (view: View, profileId?: string) => void;
    onStartChat: (userId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userId, onNavigate, onStartChat }) => {
    const { currentUser, users } = useAuth();
    const user = users.find(u => u.id === userId);
    const userPosts = postsDB.filter(p => p.authorId === userId);

    const [isFollowing, setIsFollowing] = useState(currentUser?.following.includes(userId) || false);
    const [followerCount, setFollowerCount] = useState(user?.followers.length || 0);

    if (!user) {
        return <div className="text-center py-10">User not found.</div>;
    }

    const handleFollow = () => {
        if (isFollowing) {
            setFollowerCount(prev => prev - 1);
        } else {
            setFollowerCount(prev => prev + 1);
        }
        setIsFollowing(!isFollowing);
    };

    const isOwnProfile = currentUser?.id === user.id;

    return (
        <div className="space-y-8">
            {/* Profile Header */}
            <div className="p-6 rounded-2xl shadow-xl backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <img src={user.profilePictureUrl} alt={user.fullName} className="w-32 h-32 rounded-full border-4 border-white/50 dark:border-slate-700 shadow-lg"/>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{user.fullName}</h2>
                        <p className="text-md text-slate-500 dark:text-slate-400">@{user.username}</p>
                        <p className="mt-2 text-slate-600 dark:text-slate-300">{user.bio}</p>
                        
                        <div className="flex justify-center sm:justify-start gap-6 mt-4 text-sm text-slate-500 dark:text-slate-400">
                            <div><strong className="text-slate-700 dark:text-slate-200">{followerCount}</strong> Followers</div>
                            <div><strong className="text-slate-700 dark:text-slate-200">{user.following.length}</strong> Following</div>
                        </div>
                    </div>
                    {!isOwnProfile && (
                         <div className="flex gap-3">
                            <button onClick={handleFollow} className={`px-5 py-2 font-semibold rounded-lg text-sm transition-colors ${isFollowing ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
                                {isFollowing ? 'Following' : 'Follow'}
                            </button>
                            <button onClick={() => onStartChat(user.id)} className="px-5 py-2 font-semibold rounded-lg text-sm bg-sky-500 text-white hover:bg-sky-600 transition-colors">Message</button>
                        </div>
                    )}
                </div>
            </div>

            {isOwnProfile && currentUser.startup && <StartupSettings />}

             <div className="p-6 rounded-2xl shadow-lg backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 space-y-4">
                 <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700 pb-2">Details</h3>
                 <p><strong>Education:</strong> {user.degree} at {user.institution} ({user.graduationYear})</p>
                 <p><strong>Top Skills:</strong> {user.skills}</p>
                 <p><strong>Interests:</strong> {user.interests}</p>
             </div>

            {/* User's Posts */}
            <div>
                 <h3 className="font-bold text-2xl text-slate-800 dark:text-slate-200 mb-4">{user.fullName.split(' ')[0]}'s Posts</h3>
                 <div className="space-y-6">
                    {userPosts.length > 0 ? (
                        userPosts.map(post => <PostCard key={post.id} post={post} author={user} onNavigate={onNavigate} />)
                    ) : (
                        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                            <p>{user.fullName} hasn't posted anything yet.</p>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default ProfilePage;