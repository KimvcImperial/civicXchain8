'use client';

import { useState, useEffect } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CONTRACT_CONFIG, CIVIC_CONTRACT_ABI } from '../../config/contracts';

// Using the correct ABI from contracts config

interface AchievementEvent {
  commitmentId: number;
  description: string;
  targetValue: number;
  currentValue: number;
  achievedAt: Date;
  status: 'achieved' | 'pending' | 'failed';
  official: string;
  rewardClaimed: boolean;
  isCompleted: boolean;
  judgeVerified: boolean;
  judgeReason?: string;
}

export default function AchievementTimeline() {
  const { address: connectedAddress } = useAccount();
  const [achievements, setAchievements] = useState<AchievementEvent[]>([]);
  const [currentPM25, setCurrentPM25] = useState<number>(15.5); // Mock current PM2.5
  const [selectedCommitment, setSelectedCommitment] = useState<number | null>(null);
  const [judgeReason, setJudgeReason] = useState<string>('');

  // Write contract functions
  const { writeContract: claimReward, data: claimHash, error: claimError } = useWriteContract();
  const { writeContract: judgeVerification, data: judgeHash, error: judgeError } = useWriteContract();

  const { isLoading: isClaimConfirming, isSuccess: isClaimConfirmed } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  // Handle successful reward claim
  useEffect(() => {
    if (isClaimConfirmed) {
      alert('🎉 Reward claimed successfully!');
      // Refresh achievements data
      setTimeout(() => {
        window.location.reload(); // Simple refresh for now
      }, 2000);
    }
  }, [isClaimConfirmed]);

  const { isLoading: isJudgeConfirming, isSuccess: isJudgeConfirmed } = useWaitForTransactionReceipt({
    hash: judgeHash,
  });

  // Get current commitment count
  const { data: currentCommitmentId } = useReadContract({
    address: CONTRACT_CONFIG.COMMITMENT_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'nextCommitmentId',
  });

  // Fetch individual commitments from blockchain
  const commitment1 = useReadContract({
    address: CONTRACT_CONFIG.COMMITMENT_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'getCommitment',
    args: [BigInt(1)],
    query: { enabled: currentCommitmentId && Number(currentCommitmentId) >= 1 }
  });

  const commitment2 = useReadContract({
    address: CONTRACT_CONFIG.COMMITMENT_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'getCommitment',
    args: [BigInt(2)],
    query: { enabled: currentCommitmentId && Number(currentCommitmentId) >= 2 }
  });

  const commitment3 = useReadContract({
    address: CONTRACT_CONFIG.COMMITMENT_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'getCommitment',
    args: [BigInt(3)],
    query: { enabled: currentCommitmentId && Number(currentCommitmentId) >= 3 }
  });

  const commitment4 = useReadContract({
    address: CONTRACT_CONFIG.COMMITMENT_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'getCommitment',
    args: [BigInt(4)],
    query: { enabled: currentCommitmentId && Number(currentCommitmentId) >= 4 }
  });

  // Mock real-time PM2.5 updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate PM2.5 fluctuation between 12-20 μg/m³
      const newPM25 = 12 + Math.random() * 8;
      setCurrentPM25(Number(newPM25.toFixed(2)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Generate achievement timeline from real blockchain data
  useEffect(() => {
    if (!currentCommitmentId) return;

    const realAchievements: AchievementEvent[] = [];
    const now = new Date();
    const commitmentData = [commitment1.data, commitment2.data, commitment3.data, commitment4.data];

    // Generate timeline events for each commitment
    for (let i = 1; i <= Number(currentCommitmentId); i++) {
      const baseTime = new Date(now.getTime() - (i * 10 * 60 * 1000)); // 10 minutes apart
      const blockchainData = commitmentData[i - 1];

      let targetValue = 25.0; // fallback
      let description = `Commitment ${i}`;
      let official = connectedAddress || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
      let isCompleted = false;
      let rewardClaimed = false;

      // Use real blockchain data if available
      if (blockchainData && Array.isArray(blockchainData) && blockchainData.length >= 7) {
        official = blockchainData[0] as string; // official address
        description = blockchainData[1] as string; // description
        targetValue = Number(blockchainData[3]) || 25.0; // targetValue
        isCompleted = blockchainData[5] as boolean; // isCompleted
        rewardClaimed = blockchainData[6] as boolean; // rewardClaimed
      }

      // Check if target is achieved based on current PM2.5
      const isAchieved = currentPM25 <= targetValue;

      realAchievements.push({
        commitmentId: i,
        description,
        targetValue,
        currentValue: currentPM25,
        achievedAt: new Date(baseTime.getTime() + (Math.random() * 30 * 60 * 1000)), // Random time within 30 min
        status: isAchieved ? 'achieved' : 'pending',
        official,
        rewardClaimed,
        isCompleted: isCompleted || isAchieved,
        judgeVerified: false, // TODO: Add judge verification status from blockchain
        judgeReason: undefined
      });
    }

    setAchievements(realAchievements.sort((a, b) => b.achievedAt.getTime() - a.achievedAt.getTime()));
  }, [currentCommitmentId, currentPM25, connectedAddress, commitment1.data, commitment2.data, commitment3.data, commitment4.data]);

  // Handle reward claiming
  const handleClaimReward = async (commitmentId: number) => {
    try {
      console.log(`🎯 Attempting to claim reward for commitment #${commitmentId}`);
      claimReward({
        address: CONTRACT_CONFIG.COMMITMENT_CONTRACT as `0x${string}`,
        abi: CIVIC_CONTRACT_ABI,
        functionName: 'claimEnvironmentalReward',
        args: [BigInt(commitmentId)],
      });
    } catch (err) {
      console.error('Error claiming reward:', err);

      // Show detailed error message
      let errorMessage = 'Unknown error occurred';
      if (err instanceof Error) {
        errorMessage = err.message;

        // Parse common error messages
        if (errorMessage.includes('Only commitment creator can claim')) {
          errorMessage = '❌ Only the commitment creator can claim this reward.\n\nMake sure you\'re connected with the same wallet that created the commitment.';
        } else if (errorMessage.includes('Environmental target not achieved')) {
          errorMessage = '❌ Environmental target not achieved yet.\n\nThe current environmental data doesn\'t meet the commitment target.';
        } else if (errorMessage.includes('Reward already claimed')) {
          errorMessage = '❌ Reward already claimed.\n\nThis reward has already been claimed.';
        } else if (errorMessage.includes('Deadline passed')) {
          errorMessage = '❌ Deadline has passed.\n\nYou can no longer claim this reward.';
        }
      }

      alert(`Error claiming reward:\n\n${errorMessage}`);
    }
  };

  // Handle judge verification
  const handleJudgeVerification = async (commitmentId: number, approved: boolean) => {
    if (!judgeReason.trim()) {
      alert('Please provide a reason for your decision');
      return;
    }

    try {
      judgeVerification({
        address: CONTRACT_CONFIG.COMMITMENT_CONTRACT as `0x${string}`,
        abi: CIVIC_CONTRACT_ABI,
        functionName: 'judgeVerification',
        args: [BigInt(commitmentId), approved, judgeReason],
      });

      // Reset form
      setSelectedCommitment(null);
      setJudgeReason('');
    } catch (err) {
      console.error('Error with judge verification:', err);
      alert('Error with judge verification: ' + (err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">🏆 Achievement Timeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="text-green-400 text-sm font-medium">Current PM2.5</div>
            <div className="text-2xl font-bold text-white">{currentPM25} μg/m³</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="text-blue-400 text-sm font-medium">Achievements</div>
            <div className="text-2xl font-bold text-white">
              {achievements.filter(a => a.status === 'achieved').length}/{achievements.length}
            </div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="text-purple-400 text-sm font-medium">Success Rate</div>
            <div className="text-2xl font-bold text-white">
              {achievements.length > 0 ? Math.round((achievements.filter(a => a.status === 'achieved').length / achievements.length) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6">
        <h3 className="text-xl font-bold text-white mb-6">📅 Target Achievement History</h3>
        
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <div key={achievement.commitmentId} className="relative">
              {/* Timeline line */}
              {index < achievements.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-cyan-500/50 to-transparent"></div>
              )}
              
              {/* Achievement card */}
              <div className={`flex items-start space-x-4 p-4 rounded-lg border ${
                achievement.status === 'achieved' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-yellow-500/10 border-yellow-500/30'
              }`}>
                {/* Status icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  achievement.status === 'achieved' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {achievement.status === 'achieved' ? '✅' : '⏳'}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">
                      Commitment #{achievement.commitmentId}: {achievement.description}
                    </h4>
                    <span className="text-sm text-gray-400">
                      {achievement.achievedAt.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Target:</span>
                      <span className="ml-2 text-white font-medium">{achievement.targetValue} μg/m³</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Current:</span>
                      <span className="ml-2 text-white font-medium">{achievement.currentValue} μg/m³</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className={`ml-2 font-medium ${
                        achievement.status === 'achieved' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {achievement.status === 'achieved' ? 'TARGET MET' : 'PENDING'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Official:</span>
                      <span className="ml-2 text-white font-mono text-xs">
                        {achievement.official.slice(0, 6)}...{achievement.official.slice(-4)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{achievement.currentValue <= achievement.targetValue ? '100%' : '0%'}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          achievement.currentValue <= achievement.targetValue
                            ? 'bg-gradient-to-r from-green-500 to-green-400 w-full'
                            : 'bg-gradient-to-r from-yellow-500 to-yellow-400 w-0'
                        }`}
                      ></div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  {achievement.status === 'achieved' && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {/* Claim Reward Button */}
                      {!achievement.rewardClaimed && (
                        <button
                          onClick={() => handleClaimReward(achievement.commitmentId)}
                          disabled={isClaimConfirming}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25 disabled:opacity-50 flex items-center space-x-2"
                        >
                          {isClaimConfirming ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Claiming...</span>
                            </>
                          ) : (
                            <>
                              <span>🎁</span>
                              <span>Claim Reward</span>
                            </>
                          )}
                        </button>
                      )}

                      {/* Reward Claimed Status */}
                      {achievement.rewardClaimed && (
                        <div className="bg-green-500/20 border border-green-500/30 text-green-400 font-medium py-2 px-4 rounded-lg flex items-center space-x-2">
                          <span>✅</span>
                          <span>Reward Claimed</span>
                        </div>
                      )}

                      {/* Judge Verification Button */}
                      {!achievement.judgeVerified && (
                        <button
                          onClick={() => setSelectedCommitment(achievement.commitmentId)}
                          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2"
                        >
                          <span>⚖️</span>
                          <span>Judge Verify</span>
                        </button>
                      )}

                      {/* Judge Verified Status */}
                      {achievement.judgeVerified && (
                        <div className="bg-purple-500/20 border border-purple-500/30 text-purple-400 font-medium py-2 px-4 rounded-lg flex items-center space-x-2">
                          <span>⚖️</span>
                          <span>Judge Verified</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Achievement timestamp */}
                  {achievement.status === 'achieved' && (
                    <div className="mt-3 text-xs text-gray-400 flex items-center space-x-2">
                      <span>🏆</span>
                      <span>Target achieved at: {achievement.achievedAt.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {achievements.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-4">📊</div>
            <p>No commitments found. Create some commitments to see the achievement timeline.</p>
          </div>
        )}
      </div>

      {/* Judge Verification Modal */}
      {selectedCommitment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-purple-500/30 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-2">⚖️</span>
              Judge Verification
            </h3>

            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-2">
                Commitment #{selectedCommitment}: {achievements.find(a => a.commitmentId === selectedCommitment)?.description}
              </p>
              <p className="text-gray-400 text-xs">
                Target: {achievements.find(a => a.commitmentId === selectedCommitment)?.targetValue} μg/m³ |
                Current: {achievements.find(a => a.commitmentId === selectedCommitment)?.currentValue} μg/m³
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-purple-400 text-sm font-medium mb-2">
                Verification Reason
              </label>
              <textarea
                value={judgeReason}
                onChange={(e) => setJudgeReason(e.target.value)}
                placeholder="Provide reason for approval/rejection..."
                className="w-full bg-black/50 border border-purple-500/30 rounded-lg p-3 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all resize-none"
                rows={3}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleJudgeVerification(selectedCommitment, true)}
                disabled={isJudgeConfirming || !judgeReason.trim()}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isJudgeConfirming ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>✅</span>
                    <span>Approve</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleJudgeVerification(selectedCommitment, false)}
                disabled={isJudgeConfirming || !judgeReason.trim()}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isJudgeConfirming ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>❌</span>
                    <span>Reject</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setSelectedCommitment(null);
                  setJudgeReason('');
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
