'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_CONFIG, CIVIC_CONTRACT_ABI } from '../../config/contracts';

interface ClaimRewardProps {
  commitmentId: number;
  isVerified: boolean;
  isAlreadyClaimed: boolean;
  onClaimSuccess?: () => void;
}

export default function ClaimReward({
  commitmentId,
  isVerified,
  isAlreadyClaimed,
  onClaimSuccess
}: ClaimRewardProps) {
  const [claimStatus, setClaimStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Check if judge has verified this commitment
  const judgeVerifications = JSON.parse(localStorage.getItem('judgeVerifications') || '{}');
  const isJudgeVerified = judgeVerifications[commitmentId]?.verified || false;

  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleClaimReward = async () => {
    if (!isVerified || isAlreadyClaimed || !isJudgeVerified) return;

    setClaimStatus('idle');
    setErrorMessage('');

    try {
      // Use the contract's claimEnvironmentalReward function
      writeContract({
        address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
        abi: CIVIC_CONTRACT_ABI,
        functionName: 'claimEnvironmentalReward',
        args: [BigInt(commitmentId)],
      });
    } catch (error) {
      setClaimStatus('error');
      setErrorMessage('Failed to initiate claim transaction');
      console.error('Error claiming reward:', error);
    }
  };

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      setClaimStatus('success');
      onClaimSuccess?.();
    }
  }, [isConfirmed, onClaimSuccess]);

  if (isAlreadyClaimed) {
    return (
      <div className="text-green-400 text-sm font-medium px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
        ✅ Reward Already Claimed
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="text-yellow-400 text-sm font-medium px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        ⏳ Awaiting Fulfillment Verification
      </div>
    );
  }

  if (!isJudgeVerified) {
    return (
      <div className="text-orange-400 text-sm font-medium px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
        ⚖️ Awaiting Judge Verification
      </div>
    );
  }

  if (claimStatus === 'success') {
    return (
      <div className="text-green-400 text-sm font-medium px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
        🎉 Reward Claimed Successfully!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClaimReward}
        disabled={isPending || isConfirming || isAlreadyClaimed || !isVerified || !isJudgeVerified}
        className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isPending ? '🔄 Initiating...' :
         isConfirming ? '⏳ Confirming...' :
         isConfirmed ? '✅ Claimed!' :
         '🏆 Claim Reward'}
      </button>
      
      {claimStatus === 'error' && (
        <div className="text-red-400 text-xs px-2 py-1 bg-red-500/10 border border-red-500/30 rounded">
          ❌ {errorMessage}
        </div>
      )}
      
      <div className="text-xs text-gray-400">
        {isConfirmed ? 'Reward claimed successfully!' :
         'Reward available because target was achieved before deadline'}
      </div>

      {hash && (
        <div className="text-xs text-blue-400 mt-1">
          <a
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            View transaction ↗
          </a>
        </div>
      )}
    </div>
  );
}
