import React, { useState } from 'react';
import { Post, User, Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { View } from '../types';


const LikeIcon = ({ liked }: { liked: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${liked ? 'text-pink-500 fill-current' : ''}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
);
const CommentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

interface PostCardProps {
    post: Post;
    author: User;
    onNavigate: (view: View, profileId?: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, author, onNavigate }) => {
    const { currentUser, users } = useAuth();
    const [likes, setLikes] = useState(post.likes);
    const [comments, setComments] = useState(post.comments);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    const isLiked = currentUser ? likes.includes(currentUser.id) : false;

    const handleLike = () => {
        if (!currentUser) return;
        setLikes(prevLikes => 
            isLiked
            ? prevLikes.filter(id => id !== currentUser.id)
            : [...prevLikes, currentUser.id]
        );
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser) return;

        const commentToAdd: Comment = {
            id: `comment-${Date.now()}`,
            authorId: currentUser.id,
            content: newComment,
            timestamp: 'Just now',
        };
        setComments(prev => [...prev, commentToAdd]);
        setNewComment('');
    };

    return (
        <div className="p-5 rounded-2xl shadow-lg backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70">
            {/* Post Header */}
            <div className="flex items-center gap-3 mb-4">
                <img 
                    src={author.profilePictureUrl} 
                    alt={author.fullName} 
                    className="w-12 h-12 rounded-full cursor-pointer"
                    onClick={() => onNavigate('profile', author.id)}
                />
                <div>
                    <p 
                        className="font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
                        onClick={() => onNavigate('profile', author.id)}
                    >
                        {author.fullName} {author.isAdmin && <span className="text-xs font-bold text-white bg-purple-600 rounded-full px-2 py-0.5 ml-1">Admin</span>}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{post.timestamp}</p>
                </div>
            </div>

            {/* Post Content */}
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap mb-4">{post.content}</p>

            {/* Post Actions */}
            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button onClick={handleLike} className="flex items-center gap-1.5 hover:text-pink-500 transition-colors">
                    <LikeIcon liked={isLiked} /> 
                    <span>{likes.length} Like{likes.length !== 1 && 's'}</span>
                </button>
                <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 hover:text-sky-500 transition-colors">
                    <CommentIcon />
                    <span>{comments.length} Comment{comments.length !== 1 && 's'}</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                    {comments.map(comment => {
                        const commentAuthor = users.find(u => u.id === comment.authorId);
                        return (
                            <div key={comment.id} className="flex items-start gap-3">
                                <img src={commentAuthor?.profilePictureUrl} alt={commentAuthor?.fullName} className="w-8 h-8 rounded-full"/>
                                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg flex-1">
                                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{commentAuthor?.fullName}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">{comment.content}</p>
                                </div>
                            </div>
                        )
                    })}
                    {/* Add new comment form */}
                    <form onSubmit={handleAddComment} className="flex items-start gap-3">
                        <img src={currentUser?.profilePictureUrl} alt="Your avatar" className="w-8 h-8 rounded-full" />
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                    </form>
                </div>
            )}
        </div>
    );
};

export default PostCard;