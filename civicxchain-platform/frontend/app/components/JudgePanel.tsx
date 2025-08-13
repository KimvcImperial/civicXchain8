'use client';

import React, { useState, useEffect } from 'react';
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_CONFIG } from '../../config/contracts';
import { CIVIC_GOVERNANCE_ABI } from '../../config/governance-abi';

// Simple Judge Commitment Card - Same as Live Feed but with Verify Button
function JudgeCommitmentCard({ commitmentId }: { commitmentId: bigint }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [rewardVerified, setRewardVerified] = useState(() => {
    // Check if this commitment is already verified
    const judgeVerifications = JSON.parse(localStorage.getItem('judgeVerifications') || '{}');
    return judgeVerifications[commitmentId.toString()]?.verified || false;
  });

  // Wallet connection hook (for display purposes)
  const { address } = useAccount();

  // Smart contract write hook for judge approval
  const { writeContract, data: hash, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });





  // Check oracle fulfillment status directly from blockchain
  const { data: fulfillmentData, error: fulfillmentError, isLoading: fulfillmentLoading } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
    functionName: 'checkFulfillment',
    args: [commitmentId],
  });

  // Debug wagmi hook
  React.useEffect(() => {
    console.log(`🔍 Wagmi fulfillment data for commitment ${commitmentId}:`, {
      data: fulfillmentData,
      error: fulfillmentError,
      loading: fulfillmentLoading
    });
  }, [fulfillmentData, fulfillmentError, fulfillmentLoading, commitmentId]);

  // Check if oracle shows target is achieved
  const isOracleVerified = fulfillmentData ? (fulfillmentData as any)[0] : false;

  // Get commitment data from blockchain (same as Live Feed)
  const { data: commitment } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
    functionName: 'getCommitment',
    args: [commitmentId],
  });

  // Check if commitment is already fulfilled on blockchain
  const isBlockchainFulfilled = commitment ? (commitment as any)[10] : false; // isFulfilled field

  console.log(`🔍 Judge Panel - Commitment ${commitmentId.toString()} data:`, {
    commitmentId: commitmentId.toString(),
    rewardVerified: rewardVerified,
    isOracleVerified: isOracleVerified,
    isBlockchainFulfilled: isBlockchainFulfilled,
    commitment: commitment ? {
      description: (commitment as any)[0],
      targetValue: (commitment as any)[1]?.toString(),
      stakeAmount: (commitment as any)[2]?.toString(),
      deadline: (commitment as any)[3]?.toString(),
      official: (commitment as any)[4],
      isActive: (commitment as any)[5],
      isFulfilled: (commitment as any)[10],
      rewardClaimed: (commitment as any)[11]
    } : null
  });

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      setRewardVerified(true);
      setIsVerifying(false);
      alert('✅ Judge approved! Reward verified on blockchain.\n\n📋 Next steps:\n1. Go to Rewards section\n2. Find this commitment\n3. Click "Claim Reward"\n\nNote: This commitment is now approved for reward claiming.');
    }
  }, [isConfirmed]);

  // Smart contract judge verification - Calls judgeApproveCommitment on blockchain
  const handleVerifyReward = async () => {
    setIsVerifying(true);
    console.log('🎯 Judge approving reward for commitment:', commitmentId.toString());

    try {
      console.log('✅ Judge verification: Calling smart contract judgeApproveCommitment');

      // Call the smart contract function to mark commitment as fulfilled
      await writeContract({
        address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
        abi: CIVIC_GOVERNANCE_ABI,
        functionName: 'judgeApproveCommitment',
        args: [BigInt(commitmentId)],
      });

      // Also store in localStorage for UI consistency
      const judgeVerifications = JSON.parse(localStorage.getItem('judgeVerifications') || '{}');
      judgeVerifications[commitmentId.toString()] = {
        verified: true,
        timestamp: new Date().toISOString(),
        method: 'blockchain_approval',
        judgeAddress: address || 'demo_judge'
      };
      localStorage.setItem('judgeVerifications', JSON.stringify(judgeVerifications));

      console.log('✅ Judge verification transaction submitted');

    } catch (error) {
      console.error('❌ Error in judge verification:', error);
      setIsVerifying(false);
      alert('Error submitting judge verification: ' + (error as Error).message);
    }
  };



  // Safety timeout to reset button state if processing hangs
  useEffect(() => {
    if (isVerifying) {
      const timeout = setTimeout(() => {
        console.log('⏰ Processing timeout - resetting button state');
        setIsVerifying(false);
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [isVerifying]);

  // Delete function - purely local, no blockchain interaction
  const deleteCommitment = () => {
    console.log('🗑️ Deleting commitment locally:', commitmentId.toString());

    // Mark as cancelled in localStorage
    const cancelled = JSON.parse(localStorage.getItem('cancelledCommitments') || '{}');
    cancelled[commitmentId.toString()] = {
      cancelled: true,
      timestamp: Date.now(),
      reason: 'Judge deleted'
    };
    localStorage.setItem('cancelledCommitments', JSON.stringify(cancelled));

    // Note: Oracle verification is blockchain-based, no localStorage to clean up

    // Close modal and refresh
    setShowCancelConfirm(false);
    setTimeout(() => window.location.reload(), 100);
  };

  if (!commitment) {
    return (
      <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/20 animate-pulse">
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="text-xs text-gray-500">Loading commitment #{commitmentId.toString()}...</div>
      </div>
    );
  }

  // Parse commitment data (same as Live Feed)
  const commitmentData = commitment as any;
  const title = commitmentData?.title || commitmentData?.description || 'Environmental Commitment';
  const officialName = commitmentData?.officialName || 'Unknown Official';
  const targetValue = Number(commitmentData?.targetValue || 0) / 100;
  const isAlreadyClaimed = commitmentData?.rewardClaimed || false;

  return (
    <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/20">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h5 className="text-lg font-semibold text-white">{title}</h5>
          <p className="text-purple-400 text-sm">Official: {officialName}</p>
          <p className="text-gray-400 text-xs mt-1">Commitment ID: #{commitmentId.toString()}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className="px-3 py-1 border text-sm font-medium rounded-full bg-green-500/20 border-green-500/50 text-green-400">
            ✅ Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-sm">Target Value</p>
          <p className="text-cyan-400 font-medium">{targetValue.toFixed(2)} μg/m³</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Metric Type</p>
          <p className="text-gray-300 text-sm">PM2.5</p>
        </div>
      </div>



      {/* Judge Actions - Verify Reward Button and Individual Delete Button */}
      <div className="space-y-3">
        <div className="flex gap-3 items-center justify-between">
          <div className="flex gap-3 items-center">
            <button
              onClick={handleVerifyReward}
              disabled={isVerifying || isConfirming || isBlockchainFulfilled || rewardVerified}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                isBlockchainFulfilled || rewardVerified
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : isVerifying
                  ? 'bg-yellow-600 text-white cursor-not-allowed opacity-50'
                  : 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
              }`}
            >
              {isBlockchainFulfilled || rewardVerified ? '✅ Judge Approved' :
               isConfirming ? '⏳ Confirming Transaction...' :
               isVerifying ? '🔄 Submitting...' :
               '⚖️ Judge Approve Reward'}
            </button>

            <div className="text-sm text-gray-400">
              {isBlockchainFulfilled ? (
                <span className="text-green-400">✅ Judge approved - reward claimable</span>
              ) : isAlreadyClaimed ? (
                <span className="text-blue-400">💰 Reward already claimed</span>
              ) : (
                <span>Judge can approve reward</span>
              )}
            </div>
          </div>

          {/* Individual Delete Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowCancelConfirm(true);
            }}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all"
            title="Delete this commitment"
          >
            �️ Delete
          </button>
        </div>

        {/* Delete Confirmation */}
        {showCancelConfirm && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 text-sm mb-3">
              ⚠️ Are you sure you want to delete this commitment? This will remove it from the display only (no blockchain transaction).
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={deleteCommitment}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowCancelConfirm(false);
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-medium"
              >
                No, Keep
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main Judge Panel Component
export default function JudgePanel() {

  console.log('🎯 Judge Panel: Component mounting/rendering');

  // Get SAME blockchain data as Live Feed - nextCommitmentId to know total commitments
  const { data: nextCommitmentId } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
    functionName: 'nextCommitmentId',
  });

  console.log('🔍 Judge Panel Debug (showing SAME blockchain data as Live Feed):', {
    nextCommitmentId: nextCommitmentId?.toString(),
    totalCommitments: nextCommitmentId ? Number(nextCommitmentId) - 1 : 0,
    contractAddress: CONTRACT_CONFIG.GOVERNANCE_CONTRACT
  });

  // Generate array of commitment IDs to display (same as Live Feed, but filter cancelled)
  const allCommitmentIds = nextCommitmentId ?
    Array.from({ length: Number(nextCommitmentId) - 1 }, (_, i) => BigInt(i + 1)) :
    [];

  // Filter out cancelled commitments
  const cancelledCommitments = JSON.parse(localStorage.getItem('cancelledCommitments') || '{}');
  const commitmentIds = allCommitmentIds.filter(id => !cancelledCommitments[id.toString()]?.cancelled);

  console.log('🔍 Judge Panel Filtering Debug:', {
    allCommitmentIds: allCommitmentIds.map(id => id.toString()),
    cancelledCommitments,
    filteredCommitmentIds: commitmentIds.map(id => id.toString()),
    nextCommitmentId: nextCommitmentId?.toString()
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl text-white mb-6 flex items-center">
          <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 animate-pulse"></span>
          Judge Panel - Manual Verification
        </h3>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Total Commitments: {commitmentIds.length}
          </div>
        </div>
      </div>





      <div className="space-y-4">
        {commitmentIds.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🌱</div>
            <p className="text-gray-400 mb-2">No active commitments</p>
            <p className="text-sm text-gray-500">Create your first environmental commitment to get started</p>
          </div>
        ) : (
          commitmentIds.map((commitmentId) => (
            <JudgeCommitmentCard
              key={commitmentId.toString()}
              commitmentId={commitmentId}
            />
          ))
        )}
      </div>
    </div>
  );
}
