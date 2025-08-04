'use client';

import { useState, useEffect } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useBalance } from 'wagmi';
import { CONTRACT_CONFIG, CIVIC_CONTRACT_ABI } from '../../config/contracts';

// Transaction status tracking interface
interface TransactionStatus {
  hash?: string;
  status: 'idle' | 'pending' | 'confirming' | 'success' | 'error';
  error?: string;
  commitmentId?: number;
}

// Individual Reward Commitment Card (SAME approach as Live Feed CommitmentCard)
function RewardCommitmentCard({ commitmentId, currentPM25FromOracle }: {
  commitmentId: bigint,
  currentPM25FromOracle: bigint | undefined
}) {
  const [isClaiming, setIsClaiming] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>({
    status: 'idle'
  });
  const { address } = useAccount(); // Get wallet address
  const { writeContract, data: hash, error: writeError } = useWriteContract();

  // Get user's ETH balance to show balance changes
  const { data: ethBalance, refetch: refetchBalance } = useBalance({
    address: address,
  });

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Track transaction status changes
  useEffect(() => {
    if (hash) {
      setTransactionStatus({
        status: 'confirming',
        hash: hash,
        commitmentId: Number(commitmentId)
      });
    }
  }, [hash, commitmentId]);

  useEffect(() => {
    if (isConfirmed) {
      setIsClaiming(false);
      setTransactionStatus({
        status: 'success',
        hash: hash,
        commitmentId: Number(commitmentId)
      });

      // Refresh balance after successful claim
      refetchBalance();

      // Clear transaction status after 5 seconds
      setTimeout(() => {
        setTransactionStatus({ status: 'idle' });
      }, 5000);
    }
  }, [isConfirmed, hash, commitmentId, refetchBalance]);

  useEffect(() => {
    if (writeError) {
      setIsClaiming(false);
      setTransactionStatus({
        status: 'error',
        error: writeError?.message || 'Transaction failed',
        hash: hash,
        commitmentId: Number(commitmentId)
      });
    }
  }, [writeError, hash, commitmentId]);

  // Check fulfillment status directly from blockchain (oracle-based verification)
  const { data: fulfillmentData } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'checkFulfillment',
    args: [commitmentId],
  });

  // Get REAL commitment data from blockchain - USE GOVERNANCE_CONTRACT
  const { data: commitment } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`, // USE GOVERNANCE_CONTRACT
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'getCommitment',
    args: [commitmentId],
  });

  // Check fulfillment status using the contract's checkFulfillment function (MOVED UP TO AVOID HOOKS RULE VIOLATION)
  const { data: fulfillmentStatus } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'checkFulfillment',
    args: [commitmentId],
  });

  // Handle transaction confirmation (MOVED UP TO AVOID HOOKS RULE VIOLATION)
  useEffect(() => {
    if (isConfirmed) {
      alert('🎉 Reward claimed successfully! ETH has been transferred to your wallet.');
      setIsClaiming(false);
      // Refresh balance to show the ETH increase
      refetchBalance();
      // Refresh the page to show updated status
      window.location.reload();
    }
    if (writeError) {
      console.error('Transaction error details:', writeError);

      // Parse common error messages
      let errorMessage = writeError.message;
      if (errorMessage.includes('execution reverted')) {
        if (errorMessage.includes('Commitment not fulfilled')) {
          errorMessage = 'Environmental target not achieved yet';
        } else if (errorMessage.includes('Reward already claimed')) {
          errorMessage = 'Reward has already been claimed';
        } else if (errorMessage.includes('Not authorized')) {
          errorMessage = 'You are not authorized to claim this reward';
        } else if (errorMessage.includes('Deadline not reached')) {
          errorMessage = 'Cannot claim reward before deadline';
        } else if (errorMessage.includes('Judge verification required')) {
          errorMessage = 'Judge verification required first';
        }
      }

      alert('❌ Transaction failed: ' + errorMessage);
      setIsClaiming(false);
    }
  }, [isConfirmed, writeError, refetchBalance]);

  if (!commitment) {
    return (
      <div className="border border-gray-700 rounded-lg p-6 animate-pulse">
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  // Debug logging for commitment filtering
  console.log(`🔍 RewardCommitmentCard ${commitmentId.toString()} - Checking filters:`, {
    commitmentId: commitmentId.toString(),
    description: commitment.description,
    hasCommitmentData: !!commitment
  });

  // TEMPORARILY DISABLE ALL FILTERING FOR DEBUGGING
  console.log(`🔧 DEBUG: Showing commitment ${commitmentId.toString()} regardless of filters`);

  // Check if commitment is cancelled (SAME as Live Feed and Judge Panel)
  const cancelledCommitments = JSON.parse(localStorage.getItem('cancelledCommitments') || '{}');
  if (cancelledCommitments[commitmentId.toString()]?.cancelled) {
    console.log(`⚠️ Would filter cancelled commitment: ${commitmentId.toString()}, but showing anyway for debug`);
    // return null; // DISABLED FOR DEBUG
  }

  // Filter out test commitments
  const testKeywords = ['test', 'testing', 'sepolia', 'pm2.5'];
  const description = commitment.description?.toLowerCase() || '';
  const isTestCommitment = testKeywords.some(keyword => description.includes(keyword));

  if (isTestCommitment) {
    console.log(`⚠️ Would filter test commitment: ${commitment.description}, but showing anyway for debug`);
    // return null; // DISABLED FOR DEBUG
  }

  console.log(`✅ RewardCommitmentCard ${commitmentId.toString()} - Passed all filters, rendering...`);

  // Access REAL commitment properties (SAME as Live Feed)
  const commitmentData = commitment as any;
  const deadlineDate = new Date(Number(commitmentData.deadline || 0) * 1000);
  const isExpired = deadlineDate < new Date();
  const targetValue = Number(commitmentData.targetValue || 0) / 100;
  const currentValue = currentPM25FromOracle ? Number(currentPM25FromOracle) / 100 : 0;
  const isAchieved = currentValue <= targetValue; // For PM2.5, lower is better

  // Calculate actual ETH reward (150% of stake amount as per smart contract)
  console.log('💰 Reward Calculation Debug:', {
    rawStakeAmount: commitmentData.stakeAmount,
    stakeAmountType: typeof commitmentData.stakeAmount,
    allCommitmentData: commitmentData
  });

  const stakeAmount = Number(commitmentData.stakeAmount || 0) / 1e18; // Convert from wei to ETH
  // If stakeAmount is 0 or missing, use a default of 0.1 ETH for demo purposes
  const effectiveStakeAmount = stakeAmount > 0 ? stakeAmount : 0.1;
  const ethReward = effectiveStakeAmount * 1.5; // 150% return as per contract

  console.log('💰 Final Reward Values:', {
    stakeAmount,
    effectiveStakeAmount,
    ethReward
  });

  // Check if reward is claimed (from blockchain)
  const isRewardClaimed = commitmentData.rewardClaimed || false;

  // Use blockchain oracle verification (no localStorage needed)
  const isTargetAchievedByOracle = fulfillmentData ? fulfillmentData[0] : false; // fulfilled boolean from contract
  const oracleCurrentValue = fulfillmentData ? Number(fulfillmentData[1]) : currentValue;
  const oracleTargetValue = fulfillmentData ? Number(fulfillmentData[2]) : targetValue;

  // Check manual judge verification from localStorage (same as other components)
  const judgeVerifications = JSON.parse(localStorage.getItem('judgeVerifications') || '{}');
  const isManuallyVerifiedByJudge = judgeVerifications[commitmentId.toString()]?.verified || false;

  // Use BOTH Oracle verification AND manual judge verification
  const isJudgeVerified = isTargetAchievedByOracle || isManuallyVerifiedByJudge;

  const handleClaimReward = async () => {
    setIsClaiming(true);

    // Set transaction status to pending
    setTransactionStatus({
      status: 'pending',
      commitmentId: Number(commitmentId)
    });

    // Enhanced debugging
    console.log('🎯 Attempting to claim reward:', {
      commitmentId: commitmentId.toString(),
      commitmentData,
      fulfillmentStatus,
      isAchieved,
      isJudgeVerified,
      isRewardClaimed,
      canClaim,
      contractAddress: CONTRACT_CONFIG.GOVERNANCE_CONTRACT,
      userAddress: address
    });

    // Check all requirements before attempting transaction
    if (!commitmentData) {
      alert('❌ Commitment data not loaded');
      setIsClaiming(false);
      return;
    }

    if (commitmentData.rewardClaimed) {
      alert('❌ Reward already claimed for this commitment');
      setIsClaiming(false);
      return;
    }

    // SIMPLIFIED LOGIC: If judge verified, skip oracle check
    if (!isJudgeVerified) {
      alert('❌ Judge approval required. Please ask a judge to approve this commitment first.');
      setIsClaiming(false);
      return;
    }

    // Only check oracle achievement if judge hasn't approved
    if (!isManuallyVerifiedByJudge && !isAchieved) {
      alert('❌ Environmental target not achieved yet and no judge approval');
      setIsClaiming(false);
      return;
    }

    // SIMPLIFIED LOGIC: No deadline check - judge verification is enough!

    try {
      // REAL BLOCKCHAIN TRANSACTION: Try to claim the reward
      console.log('🎯 ATTEMPTING REAL REWARD CLAIM');

      writeContract({
        address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
        abi: CIVIC_CONTRACT_ABI,
        functionName: 'claimEnvironmentalReward',
        args: [commitmentId],
      });

    } catch (error) {
      console.error('Error claiming reward:', error);
      setIsClaiming(false);
      setTransactionStatus({
        status: 'error',
        error: (error as Error).message || 'Failed to initiate transaction',
        commitmentId: Number(commitmentId)
      });
    }
  };



  const getCommitmentStatus = () => {
    if (isRewardClaimed) {
      return { text: 'Reward Claimed', color: 'text-purple-400', bgColor: 'bg-purple-500/20' };
    }
    if (!isAchieved) {
      return { text: 'Target Not Met', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
    }
    if (!isJudgeVerified) {
      return { text: 'Awaiting Judge Verification', color: 'text-blue-400', bgColor: 'bg-blue-500/20' };
    }
    return { text: 'Ready to Claim', color: 'text-green-400', bgColor: 'bg-green-500/20' };
  };

  const status = getCommitmentStatus();
  // SIMPLIFIED LOGIC: Only need judge verification and target achievement, no deadline check
  const canClaim = isAchieved && isJudgeVerified && !isRewardClaimed;

  console.log('🔍 RewardCommitmentCard Debug:', {
    commitmentId: commitmentId.toString(),
    commitmentData,
    isAchieved,
    isTargetAchievedByOracle,
    isManuallyVerifiedByJudge,
    isJudgeVerified,
    isRewardClaimed,
    canClaim,
    currentValue,
    targetValue,
    stakeAmount,
    effectiveStakeAmount,
    ethReward,
    status,
    judgeVerifications: JSON.parse(localStorage.getItem('judgeVerifications') || '{}')
  });

  return (
    <div className="border border-gray-700 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-white">
            {commitmentData.description || `Commitment #${commitmentId}`}
          </h4>
          <p className="text-sm text-gray-400">
            By: {commitmentData.officialName || 'Current Official'}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${status.color} ${status.bgColor}`}>
          {status.text}
        </div>
      </div>

      {/* Transaction Status Display */}
      {transactionStatus.status !== 'idle' && (
        <div className="mb-4 p-3 rounded-lg border-2 border-dashed border-green-400 bg-green-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {transactionStatus.status === 'pending' && (
                <>
                  <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-yellow-400 font-medium">Transaction Pending...</span>
                </>
              )}
              {transactionStatus.status === 'confirming' && (
                <>
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-blue-400 font-medium">Confirming Transaction...</span>
                </>
              )}
              {transactionStatus.status === 'success' && (
                <>
                  <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-xs text-black">✓</span>
                  </div>
                  <span className="text-green-400 font-medium">Reward Claimed Successfully!</span>
                </>
              )}
              {transactionStatus.status === 'error' && (
                <>
                  <div className="w-4 h-4 bg-red-400 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">✗</span>
                  </div>
                  <span className="text-red-400 font-medium">Transaction Failed</span>
                </>
              )}
            </div>

            {/* Transaction Hash Link */}
            {transactionStatus.hash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${transactionStatus.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-300 hover:text-green-100 underline"
              >
                View on Etherscan →
              </a>
            )}
          </div>

          {/* Error Message */}
          {transactionStatus.error && (
            <div className="mt-2 text-sm text-red-300 bg-red-900/20 p-2 rounded">
              {transactionStatus.error}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
        <div>
          <span className="text-gray-400">Target:</span>
          <span className="text-white ml-2">{targetValue} μg/m³</span>
        </div>
        <div>
          <span className="text-gray-400">Current:</span>
          <span className="text-white ml-2">{currentValue.toFixed(2)} μg/m³</span>
        </div>
        <div>
          <span className="text-gray-400">Reward:</span>
          <span className="text-green-400 ml-2 font-mono">
            {ethReward > 0 ? `${ethReward.toFixed(3)} ETH` : 'TBD'}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Deadline:</span>
          <span className="text-white ml-2">{deadlineDate.toLocaleDateString()}</span>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className={`flex items-center gap-1 ${isAchieved ? 'text-green-400' : 'text-gray-500'}`}>
          {isAchieved ? '✅' : '⏳'} Target {isAchieved ? 'Achieved' : 'Pending'}
        </div>
        <div className={`flex items-center gap-1 ${isJudgeVerified ? 'text-blue-400' : 'text-gray-500'}`}>
          {isJudgeVerified ? '🔗' : '⏳'} Oracle {isJudgeVerified ? 'Verified' : 'Checking'}
        </div>
        <div className={`flex items-center gap-1 ${isRewardClaimed ? 'text-purple-400' : 'text-gray-500'}`}>
          {isRewardClaimed ? '💰' : '⏳'} Reward {isRewardClaimed ? 'Claimed' : 'Available'}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {/* ALWAYS show claim button for debugging - will be disabled if can't claim */}
        <button
          onClick={handleClaimReward}
          disabled={!canClaim || isClaiming || isConfirming}
          className={`font-semibold py-2 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            canClaim
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
              : 'bg-gray-600 text-gray-300'
          }`}
        >
          {isConfirming ? '⏳ Confirming Transaction...' :
           isClaiming ? '📝 Submitting Transaction...' :
           canClaim ? '💰 Claim ETH Reward' : '🔒 Cannot Claim Yet'}
        </button>



        {!isAchieved && (
          <div className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg text-sm">
            📈 Continue working towards target
          </div>
        )}

        {isRewardClaimed && (
          <div className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg text-sm">
            ✅ Reward successfully claimed
          </div>
        )}
      </div>
    </div>
  );
}

export default function PublicOfficialRewards() {
  const [loading, setLoading] = useState(false); // No loading needed for direct blockchain reads
  const { address } = useAccount(); // Get connected wallet address

  // Get user's ETH balance for main dashboard
  const { data: userEthBalance } = useBalance({
    address: address,
  });

  // Get commitments for the connected wallet ONLY (not all commitments)
  const { data: userCommitmentIds } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'getOfficialCommitments',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address, // Only run when wallet is connected
    },
  });

  // Get current PM2.5 data from oracle (SAME as Live Feed)
  const { data: currentPM25FromOracle } = useReadContract({
    address: CONTRACT_CONFIG.ENVIRONMENTAL_ORACLE as `0x${string}`,
    abi: [
      {
        "inputs": [],
        "name": "getLatestPM25Data",
        "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'getLatestPM25Data',
  });

  // Get total commitment count for comparison
  const { data: totalCommitmentId } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'nextCommitmentId',
  });

  console.log('🔍 PublicOfficialRewards Debug:', {
    connectedWallet: address,
    userCommitmentIds: userCommitmentIds?.toString(),
    userCommitmentCount: userCommitmentIds ? userCommitmentIds.length : 0,
    totalCommitments: totalCommitmentId ? Number(totalCommitmentId) - 1 : 0,
    currentPM25FromOracle: currentPM25FromOracle?.toString(),
    readFromContract: CONTRACT_CONFIG.GOVERNANCE_CONTRACT,
    claimFromContract: CONTRACT_CONFIG.COMMITMENT_CONTRACT
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        <span className="ml-3 text-gray-300">Loading rewards...</span>
      </div>
    );
  }

  // Calculate stats from user's commitments only
  const userCommitmentCount = userCommitmentIds ? userCommitmentIds.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">💰 Rewards Dashboard</h2>
            <p className="text-gray-400">
              Claim rewards for verified environmental achievements
            </p>
          </div>
          {address && userEthBalance && (
            <div className="text-right">
              <p className="text-sm text-gray-400">Your ETH Balance</p>
              <p className="text-xl font-mono text-green-400">
                {parseFloat(userEthBalance.formatted).toFixed(4)} ETH
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Simple Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h3 className="text-sm text-blue-300 mb-1">Your Commitments</h3>
          <p className="text-2xl text-white font-mono">{userCommitmentCount}</p>
          <p className="text-xs text-gray-400">Created by your wallet</p>
        </div>

        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <h3 className="text-sm text-purple-300 mb-1">Reward Status</h3>
          <p className="text-lg text-white font-mono">Ready to Claim</p>
          <p className="text-xs text-gray-400">Judge verified commitments</p>
        </div>
      </div>

      {/* Rewards List */}
      <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6">
        <h3 className="text-xl font-bold text-white mb-6">🏆 Your Commitments & Rewards</h3>
        
        <div className="space-y-4">
          {!address ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Please connect your wallet to view your commitments</p>
              <p className="text-sm text-gray-500 mt-2">
                Only commitments created by your wallet will be shown
              </p>
            </div>
          ) : !userCommitmentIds || userCommitmentIds.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No commitments found for your wallet</p>
              <p className="text-sm text-gray-500 mt-2">
                Connected wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Total commitments on blockchain: {totalCommitmentId ? Number(totalCommitmentId) - 1 : 0}
              </p>

              {/* TEMPORARY: Show all commitments for testing */}
              {totalCommitmentId && Number(totalCommitmentId) > 1 && (
                <div className="mt-6">
                  <p className="text-yellow-400 text-sm mb-4">
                    🔧 DEBUG MODE: Showing all commitments for testing (normally only shows your wallet's commitments)
                  </p>
                  <div className="space-y-4">
                    {Array.from({ length: Number(totalCommitmentId) - 1 }, (_, i) => (
                      <RewardCommitmentCard
                        key={i + 1}
                        commitmentId={BigInt(i + 1)}
                        currentPM25FromOracle={currentPM25FromOracle}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-4">
                Showing {userCommitmentIds.length} commitments created by your wallet
              </p>
              {userCommitmentIds
                .filter((commitmentId: bigint) => {
                  console.log(`🔍 Filtering commitment ${commitmentId.toString()}`);
                  return true; // For now, show all and let RewardCommitmentCard handle filtering
                })
                .map((commitmentId: bigint, index: number) => {
                  console.log(`🔍 Mapping commitment ${commitmentId.toString()} to RewardCommitmentCard`);
                  return (
                    <RewardCommitmentCard
                      key={commitmentId.toString()}
                      commitmentId={commitmentId}
                      currentPM25FromOracle={currentPM25FromOracle}
                    />
                  );
                })}
            </>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-gray-500/20 p-6">
        <h3 className="text-lg font-bold text-white mb-3">ℹ️ How Rewards Work</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p><strong>1. Achieve Target:</strong> Meet your environmental commitment target (e.g., reduce PM2.5 below threshold)</p>
          <p><strong>2. Oracle Verification:</strong> Chainlink oracles automatically verify your achievement using real environmental data</p>
          <p><strong>3. Claim Reward:</strong> Once Oracle confirms target achievement, claim your ETH reward using the button above</p>
          <p><strong>4. Automatic Distribution:</strong> Rewards are distributed instantly to your wallet</p>
        </div>
      </div>
    </div>
  );
}
