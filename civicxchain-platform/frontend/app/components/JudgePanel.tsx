'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '../../config/contracts';
import { CIVIC_GOVERNANCE_ABI as GOVERNANCE_ABI } from '../../config/governance-abi.js';

interface Commitment {
  id: number;
  title: string;
  description: string;
  official: string;
  officialName: string;
  role: string;
  targetValue: bigint;
  deadline: bigint;
  stakeAmount: bigint;
  isActive: boolean;
  isFulfilled: boolean;
  isVerified: boolean;
  createdAt: bigint;
  verifiedAt: bigint;
  metricType: string;
  actualValue: bigint;
  baselineValue: bigint;
}

interface JudgeVote {
  commitmentId: number;
  judge: string;
  vote: 'approve' | 'reject' | 'pending';
  reason: string;
  timestamp: number;
}

export default function JudgePanel() {
  const { address, isConnected } = useAccount();
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [votes, setVotes] = useState<JudgeVote[]>([]);
  const [selectedCommitment, setSelectedCommitment] = useState<number | null>(null);
  const [voteReason, setVoteReason] = useState('');
  const [isJudge, setIsJudge] = useState(false);

  const { writeContract: manualVerify } = useWriteContract();

  // Check if current user is a judge (simplified - in production, this would be role-based)
  useEffect(() => {
    // For demo purposes, any connected wallet can be a judge
    // In production, you'd check against a judges registry
    setIsJudge(isConnected);
  }, [isConnected]);

  // Fetch commitments that need manual review
  const fetchDisputedCommitments = async () => {
    try {
      // This would fetch commitments that failed automatic verification
      // or are flagged for manual review
      const mockCommitments: Commitment[] = [
        {
          id: 1,
          title: "Reduce PM2.5 levels in downtown area",
          description: "Commitment to reduce air pollution",
          official: "0x1234...",
          officialName: "Mayor Johnson",
          role: "City Mayor",
          targetValue: BigInt(1500), // 15.00 μg/m³
          deadline: BigInt(Math.floor(Date.now() / 1000) - 3600), // 1 hour ago
          stakeAmount: BigInt(1000),
          isActive: true,
          isFulfilled: false,
          isVerified: false,
          createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400),
          verifiedAt: BigInt(0),
          metricType: "PM25",
          actualValue: BigInt(1600), // 16.00 μg/m³ (failed by 1 μg/m³)
          baselineValue: BigInt(2000)
        }
      ];
      setCommitments(mockCommitments);
    } catch (error) {
      console.error('Error fetching disputed commitments:', error);
    }
  };

  useEffect(() => {
    if (isJudge) {
      fetchDisputedCommitments();
    }
  }, [isJudge]);

  const handleVote = async (commitmentId: number, vote: 'approve' | 'reject') => {
    if (!voteReason.trim()) {
      alert('Please provide a reason for your vote');
      return;
    }

    try {
      // Record the vote
      const newVote: JudgeVote = {
        commitmentId,
        judge: address!,
        vote,
        reason: voteReason,
        timestamp: Date.now()
      };

      setVotes(prev => [...prev, newVote]);

      // In a real system, this would call a smart contract function
      // For now, we'll simulate manual verification
      if (vote === 'approve') {
        // Call manual verification function
        manualVerify({
          address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
          abi: GOVERNANCE_ABI,
          functionName: 'manualVerifyCommitment',
          args: [commitmentId, true, voteReason],
        });
      }

      setVoteReason('');
      setSelectedCommitment(null);
      
      alert(`Vote submitted: ${vote} for commitment ${commitmentId}`);
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Error submitting vote');
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-purple-500">
        <h2 className="text-xl font-bold text-purple-400 mb-4">🏛️ Judge Panel</h2>
        <p className="text-gray-400">Please connect your wallet to access the judge panel.</p>
      </div>
    );
  }

  if (!isJudge) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-purple-500">
        <h2 className="text-xl font-bold text-purple-400 mb-4">🏛️ Judge Panel</h2>
        <p className="text-gray-400">You are not authorized to access the judge panel.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-purple-500">
      <h2 className="text-xl font-bold text-purple-400 mb-6">🏛️ Manual Verification Panel</h2>
      
      {commitments.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">⚖️</div>
          <p className="text-gray-400">No commitments require manual review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {commitments.map((commitment) => (
            <div key={commitment.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{commitment.title}</h3>
                  <p className="text-gray-400">{commitment.officialName} - {commitment.role}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Commitment #{commitment.id}</div>
                  <div className="text-xs text-red-400">⏰ Deadline Passed</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-400">Target</div>
                  <div className="text-white font-mono">
                    {(Number(commitment.targetValue) / 100).toFixed(2)} {commitment.metricType === 'PM25' ? 'μg/m³' : commitment.metricType === 'FOREST' ? '%' : 'ppm'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Actual</div>
                  <div className="text-white font-mono">
                    {(Number(commitment.actualValue) / 100).toFixed(2)} {commitment.metricType === 'PM25' ? 'μg/m³' : commitment.metricType === 'FOREST' ? '%' : 'ppm'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Difference</div>
                  <div className={`font-mono ${Number(commitment.actualValue) <= Number(commitment.targetValue) ? 'text-green-400' : 'text-red-400'}`}>
                    {((Number(commitment.actualValue) - Number(commitment.targetValue)) / 100).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Oracle Decision</div>
                <div className="text-red-400">❌ Failed (missed target by {((Number(commitment.actualValue) - Number(commitment.targetValue)) / 100).toFixed(2)})</div>
                <div className="text-xs text-gray-500 mt-1">Requires manual review for edge cases or disputes</div>
              </div>

              {selectedCommitment === commitment.id ? (
                <div className="space-y-3">
                  <textarea
                    value={voteReason}
                    onChange={(e) => setVoteReason(e.target.value)}
                    placeholder="Provide detailed reasoning for your decision..."
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                    rows={3}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVote(commitment.id, 'approve')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                    >
                      ✅ Approve (Override)
                    </button>
                    <button
                      onClick={() => handleVote(commitment.id, 'reject')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    >
                      ❌ Reject (Confirm Failure)
                    </button>
                    <button
                      onClick={() => setSelectedCommitment(null)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedCommitment(commitment.id)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                >
                  🏛️ Review & Vote
                </button>
              )}

              {/* Show existing votes */}
              {votes.filter(v => v.commitmentId === commitment.id).length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="text-sm text-gray-400 mb-2">Judge Votes:</div>
                  {votes.filter(v => v.commitmentId === commitment.id).map((vote, idx) => (
                    <div key={idx} className="text-xs text-gray-300 mb-1">
                      <span className={vote.vote === 'approve' ? 'text-green-400' : 'text-red-400'}>
                        {vote.vote === 'approve' ? '✅' : '❌'} {vote.judge.slice(0, 8)}...
                      </span>
                      <span className="text-gray-500 ml-2">{vote.reason}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
