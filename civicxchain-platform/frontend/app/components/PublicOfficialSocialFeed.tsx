'use client';

import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_CONFIG, CIVIC_CONTRACT_ABI } from '../../config/contracts.js';

interface ProgressUpdate {
  id: string;
  commitmentId: number;
  message: string;
  timestamp: Date;
  officialName: string;
  officialAddress: string;
  updateType: 'progress' | 'milestone' | 'completion' | 'challenge';
  attachments?: string[];
  likes: number;
  comments: number;
}

export default function PublicOfficialSocialFeed() {
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [newUpdate, setNewUpdate] = useState('');
  const [selectedCommitment, setSelectedCommitment] = useState<number | null>(null);
  const [updateType, setUpdateType] = useState<'progress' | 'milestone' | 'completion' | 'challenge'>('progress');
  const [isPosting, setIsPosting] = useState(false);

  // Get user's commitments for the dropdown - USE GOVERNANCE_CONTRACT
  const { data: allCommitmentIds } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`, // USE GOVERNANCE_CONTRACT
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'nextCommitmentId',
  });

  console.log('🔍 PublicOfficialSocialFeed Debug (REAL BLOCKCHAIN DATA):', {
    allCommitmentIds: allCommitmentIds?.toString(),
    contractAddress: CONTRACT_CONFIG.COMMITMENT_CONTRACT,
    dataSource: 'REAL Blockchain (same as Live Feed)'
  });

  // Load existing updates (mock data for now - in real app would come from backend)
  useEffect(() => {
    const mockUpdates: ProgressUpdate[] = [
      {
        id: '1',
        commitmentId: 1,
        message: '🌱 Great progress on our air quality initiative! PM2.5 levels have dropped by 15% in the downtown area. Installing 5 more air purifiers this week.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        officialName: 'Mayor Johnson',
        officialAddress: '0x1234...5678',
        updateType: 'progress',
        likes: 24,
        comments: 8
      },
      {
        id: '2',
        commitmentId: 2,
        message: '🎯 Milestone achieved! We\'ve successfully reduced PM2.5 to 18.5 μg/m³ - getting closer to our target of 15 μg/m³. Citizens can see real-time data on our dashboard.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        officialName: 'Environmental Director',
        officialAddress: '0x9876...4321',
        updateType: 'milestone',
        likes: 45,
        comments: 12
      },
      {
        id: '3',
        commitmentId: 1,
        message: '⚠️ Facing some challenges with equipment delays, but we\'re working with backup suppliers. Transparency is key - will keep you updated on our progress.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        officialName: 'Mayor Johnson',
        officialAddress: '0x1234...5678',
        updateType: 'challenge',
        likes: 18,
        comments: 15
      }
    ];
    setUpdates(mockUpdates);
  }, []);

  const handlePostUpdate = async () => {
    if (!newUpdate.trim() || !selectedCommitment) return;

    setIsPosting(true);
    try {
      // In real app, this would post to backend API
      const update: ProgressUpdate = {
        id: Date.now().toString(),
        commitmentId: selectedCommitment,
        message: newUpdate,
        timestamp: new Date(),
        officialName: 'Current Official', // Would get from wallet/auth
        officialAddress: '0x1234...5678', // Would get from wallet
        updateType,
        likes: 0,
        comments: 0
      };

      setUpdates(prev => [update, ...prev]);
      setNewUpdate('');
      setSelectedCommitment(null);
      
      // Show success message
      alert('✅ Progress update posted successfully!');
    } catch (error) {
      console.error('Error posting update:', error);
      alert('❌ Failed to post update');
    } finally {
      setIsPosting(false);
    }
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'progress': return '📈';
      case 'milestone': return '🎯';
      case 'completion': return '✅';
      case 'challenge': return '⚠️';
      default: return '📝';
    }
  };

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'progress': return 'border-blue-500/30 bg-blue-500/10';
      case 'milestone': return 'border-green-500/30 bg-green-500/10';
      case 'completion': return 'border-purple-500/30 bg-purple-500/10';
      case 'challenge': return 'border-yellow-500/30 bg-yellow-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">📱 Social Progress Feed</h2>
        <p className="text-gray-400">
          Share progress updates with citizens and build transparency around your environmental commitments
        </p>
      </div>

      {/* Post New Update */}
      <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6">
        <h3 className="text-xl font-bold text-white mb-4">✍️ Share Progress Update</h3>
        
        <div className="space-y-4">
          {/* Commitment Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Commitment
            </label>
            <select
              value={selectedCommitment || ''}
              onChange={(e) => setSelectedCommitment(Number(e.target.value) || null)}
              className="w-full bg-black/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            >
              <option value="">Choose a commitment...</option>
              {allCommitmentIds && Array.from({ length: Number(allCommitmentIds) - 1 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Commitment #{i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Update Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Update Type
            </label>
            <div className="flex gap-2">
              {(['progress', 'milestone', 'completion', 'challenge'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setUpdateType(type)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    updateType === type
                      ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600 hover:bg-gray-600/50'
                  }`}
                >
                  {getUpdateIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Progress Message
            </label>
            <textarea
              value={newUpdate}
              onChange={(e) => setNewUpdate(e.target.value)}
              placeholder="Share your progress, challenges, or achievements with citizens..."
              className="w-full bg-black/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
              rows={4}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">
              {newUpdate.length}/500 characters
            </div>
          </div>

          {/* Post Button */}
          <button
            onClick={handlePostUpdate}
            disabled={!newUpdate.trim() || !selectedCommitment || isPosting}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPosting ? '📤 Posting...' : '📤 Post Update'}
          </button>
        </div>
      </div>

      {/* Updates Feed */}
      <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6">
        <h3 className="text-xl font-bold text-white mb-6">📰 Recent Updates</h3>
        
        <div className="space-y-4">
          {updates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No updates yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Share your first progress update to engage with citizens
              </p>
            </div>
          ) : (
            updates.map((update) => (
              <div
                key={update.id}
                className={`border rounded-lg p-4 ${getUpdateColor(update.updateType)}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getUpdateIcon(update.updateType)}</div>
                    <div>
                      <div className="font-semibold text-white">{update.officialName}</div>
                      <div className="text-xs text-gray-400">
                        Commitment #{update.commitmentId} • {formatTimeAgo(update.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    update.updateType === 'progress' ? 'bg-blue-500/20 text-blue-400' :
                    update.updateType === 'milestone' ? 'bg-green-500/20 text-green-400' :
                    update.updateType === 'completion' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {update.updateType.toUpperCase()}
                  </div>
                </div>
                
                <p className="text-gray-300 mb-3">{update.message}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                    👍 {update.likes}
                  </button>
                  <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                    💬 {update.comments}
                  </button>
                  <button className="hover:text-cyan-400 transition-colors">
                    🔗 Share
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
