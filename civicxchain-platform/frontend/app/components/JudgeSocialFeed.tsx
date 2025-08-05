'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface JudgePost {
  id: string;
  judgeName: string;
  judgeAddress: string;
  content: string;
  timestamp: Date;
  postType: 'announcement' | 'verification' | 'update' | 'warning';
  commitmentId?: number;
}

export default function JudgeSocialFeed() {
  const { address } = useAccount();
  const [posts, setPosts] = useState<JudgePost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState<'announcement' | 'verification' | 'update' | 'warning'>('announcement');
  const [selectedCommitment, setSelectedCommitment] = useState<number | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  // Load posts from localStorage on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('judgeSocialFeed');
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts).map((post: any) => ({
        ...post,
        timestamp: new Date(post.timestamp)
      }));
      setPosts(parsedPosts);
    }
  }, []);

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('judgeSocialFeed', JSON.stringify(posts));
    }
  }, [posts]);

  const handleSubmitPost = async () => {
    if (!newPost.trim() || !address) return;

    setIsPosting(true);
    
    const post: JudgePost = {
      id: Date.now().toString(),
      judgeName: `Judge ${address.slice(0, 6)}...${address.slice(-4)}`,
      judgeAddress: address,
      content: newPost.trim(),
      timestamp: new Date(),
      postType,
      commitmentId: selectedCommitment || undefined
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
    setSelectedCommitment(null);
    setIsPosting(false);
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'announcement': return '📢';
      case 'verification': return '✅';
      case 'update': return '📝';
      case 'warning': return '⚠️';
      default: return '📢';
    }
  };

  const getPostColor = (type: string) => {
    switch (type) {
      case 'announcement': return 'border-blue-500/30 bg-blue-500/10';
      case 'verification': return 'border-green-500/30 bg-green-500/10';
      case 'update': return 'border-cyan-500/30 bg-cyan-500/10';
      case 'warning': return 'border-red-500/30 bg-red-500/10';
      default: return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Post Creation Form */}
      <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
        <h4 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center">
          📱 Share Update
          <span className="ml-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
        </h4>
        
        <div className="space-y-4">
          {/* Post Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Post Type
            </label>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value as any)}
              className="w-full bg-black/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            >
              <option value="announcement">📢 Announcement</option>
              <option value="verification">✅ Verification Update</option>
              <option value="update">📝 General Update</option>
              <option value="warning">⚠️ Warning/Alert</option>
            </select>
          </div>

          {/* Commitment ID (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Related Commitment (Optional)
            </label>
            <input
              type="number"
              value={selectedCommitment || ''}
              onChange={(e) => setSelectedCommitment(Number(e.target.value) || null)}
              placeholder="Enter commitment ID..."
              className="w-full bg-black/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          {/* Post Content */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Message
            </label>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your thoughts, updates, or announcements with the community..."
              rows={4}
              className="w-full bg-black/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitPost}
            disabled={!newPost.trim() || isPosting}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
          >
            {isPosting ? 'Posting...' : `${getPostIcon(postType)} Post ${postType.charAt(0).toUpperCase() + postType.slice(1)}`}
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6">
        <h4 className="text-lg font-semibold text-purple-400 mb-4 flex items-center">
          📰 Social Feed
          <span className="ml-2 text-sm text-gray-400">({posts.length} posts)</span>
        </h4>
        
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No posts yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Share your first update to engage with the community
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className={`border rounded-lg p-4 ${getPostColor(post.postType)}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getPostIcon(post.postType)}</div>
                    <div>
                      <div className="font-semibold text-white">{post.judgeName}</div>
                      <div className="text-xs text-gray-400">
                        {post.commitmentId && `Commitment #${post.commitmentId} • `}
                        {formatTimeAgo(post.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {post.postType}
                  </div>
                </div>
                
                <div className="text-gray-200 leading-relaxed">
                  {post.content}
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-600/30">
                  <div className="text-xs text-gray-500">
                    Judge Address: {post.judgeAddress}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
