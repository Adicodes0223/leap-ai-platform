import React, { useState } from 'react';
import { Post, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { postsDB } from '../mockDB';
import PostCard from './PostCard';
import { View } from '../types';

const CreatePostForm: React.FC<{ onAddPost: (content: string) => void }> = ({ onAddPost }) => {
    const [content, setContent] = useState('');
    const { currentUser } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !currentUser) return;
        onAddPost(content);
        setContent('');
    };

    return (
        <div className="p-4 rounded-2xl shadow-lg backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 mb-8">
            <div className="flex items-start gap-4">
                <img src={currentUser?.profilePictureUrl} alt="Your avatar" className="w-12 h-12 rounded-full" />
                <form onSubmit={handleSubmit} className="w-full">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your progress, ask a question, or post an idea..."
                        className="w-full h-24 p-3 bg-white/50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                    />
                    <div className="mt-3 flex justify-end">
                        <button type="submit" disabled={!content.trim()} className="px-6 py-2 font-semibold rounded-lg text-white bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


interface HubProps {
    onNavigate: (view: View, profileId?: string) => void;
}

const Hub: React.FC<HubProps> = ({ onNavigate }) => {
    const { currentUser, users } = useAuth();
    const [posts, setPosts] = useState<Post[]>(postsDB);

    const handleAddPost = (content: string) => {
        if (!currentUser) return;
        const newPost: Post = {
            id: `post-${Date.now()}`,
            authorId: currentUser.id,
            content,
            timestamp: 'Just now',
            likes: [],
            comments: [],
        };
        setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Community Hub</h2>
                <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">Connect with fellow builders, share your journey, and get feedback.</p>
            </div>
            
            <CreatePostForm onAddPost={handleAddPost} />

            <div className="space-y-6">
                {posts.map(post => {
                    const author = users.find(u => u.id === post.authorId);
                    if (!author) return null;
                    return <PostCard key={post.id} post={post} author={author} onNavigate={onNavigate} />;
                })}
            </div>
        </div>
    );
};

export default Hub;