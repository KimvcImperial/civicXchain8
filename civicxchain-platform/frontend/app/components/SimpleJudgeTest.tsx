'use client';

import { useState } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_CONFIG, CIVIC_CONTRACT_ABI } from '../../config/contracts';

export default function SimpleJudgeTest() {
  const [selectedCommitmentId, setSelectedCommitmentId] = useState<number>(1);
  const [isVerifying, setIsVerifying] = useState(false);

  // Get total commitments
  const { data: allCommitmentIds } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'nextCommitmentId',
  });

  // Get specific commitment data
  const { data: commitment } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'getCommitment',
    args: [BigInt(selectedCommitmentId)],
    query: { enabled: selectedCommitmentId > 0 }
  });

  // Get fulfillment status
  const { data: fulfillmentStatus } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'checkFulfillment',
    args: [BigInt(selectedCommitmentId)],
    query: { enabled: selectedCommitmentId > 0 }
  });

  // Contract write for claiming rewards
  const { writeContract, data: hash, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleJudgeVerify = () => {
    setIsVerifying(true);
    
    // Store verification in localStorage (simple demo approach)
    const verifications = JSON.parse(localStorage.getItem('judgeVerifications') || '{}');
    verifications[selectedCommitmentId] = {
      verified: true,
      timestamp: Date.now(),
      judge: 'Demo Judge'
    };
    localStorage.setItem('judgeVerifications', JSON.stringify(verifications));
    
    alert(`✅ Commitment ${selectedCommitmentId} verified by judge!`);
    setIsVerifying(false);
  };

  const handleClaimReward = () => {
    try {
      writeContract({
        address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
        abi: CIVIC_CONTRACT_ABI,
        functionName: 'claimEnvironmentalReward',
        args: [BigInt(selectedCommitmentId)],
      });
    } catch (error) {
      console.error('Error claiming reward:', error);
      alert('Error claiming reward: ' + (error as Error).message);
    }
  };

  // Check if commitment is judge-verified
  const verifications = JSON.parse(localStorage.getItem('judgeVerifications') || '{}');
  const isJudgeVerified = verifications[selectedCommitmentId]?.verified || false;

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white">🧪 Simple Judge Test</h2>
      
      {/* Commitment Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Commitment ID:
        </label>
        <select 
          value={selectedCommitmentId}
          onChange={(e) => setSelectedCommitmentId(Number(e.target.value))}
          className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
        >
          {allCommitmentIds && Array.from({length: Number(allCommitmentIds) - 1}, (_, i) => i + 1).map(id => (
            <option key={id} value={id}>Commitment #{id}</option>
          ))}
        </select>
      </div>

      {/* Commitment Info */}
      {commitment && (
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Commitment Details:</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p><strong>Title:</strong> {commitment[1]}</p>
            <p><strong>Description:</strong> {commitment[2]}</p>
            <p><strong>Official:</strong> {commitment[3]}</p>
            <p><strong>Target Value:</strong> {commitment[6]?.toString()}</p>
            <p><strong>Deadline:</strong> {new Date(Number(commitment[7]) * 1000).toLocaleDateString()}</p>
          </div>
        </div>
      )}

      {/* Fulfillment Status */}
      {fulfillmentStatus && (
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Fulfillment Status:</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p><strong>Fulfilled:</strong> {fulfillmentStatus[0] ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Current Value:</strong> {fulfillmentStatus[1]?.toString()}</p>
            <p><strong>Target Value:</strong> {fulfillmentStatus[2]?.toString()}</p>
          </div>
        </div>
      )}

      {/* Judge Actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Judge Actions:</h3>
        
        {/* Judge Verification */}
        <button
          onClick={handleJudgeVerify}
          disabled={isVerifying || isJudgeVerified}
          className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded border border-green-500/30 disabled:opacity-50"
        >
          {isJudgeVerified ? '✅ Already Verified' : 
           isVerifying ? '⏳ Verifying...' : 
           '⚖️ Judge Verify'}
        </button>

        {/* Claim Reward */}
        <button
          onClick={handleClaimReward}
          disabled={!isJudgeVerified || !fulfillmentStatus?.[0] || isConfirming}
          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded border border-blue-500/30 disabled:opacity-50 ml-2"
        >
          {isConfirming ? '⏳ Claiming...' : 
           isConfirmed ? '✅ Claimed!' : 
           '🏆 Claim Reward'}
        </button>
      </div>

      {/* Status Messages */}
      {!fulfillmentStatus?.[0] && (
        <p className="text-yellow-400 text-sm">⚠️ Commitment not yet fulfilled - cannot claim reward</p>
      )}
      
      {!isJudgeVerified && fulfillmentStatus?.[0] && (
        <p className="text-orange-400 text-sm">⚠️ Needs judge verification before claiming reward</p>
      )}

      {isJudgeVerified && fulfillmentStatus?.[0] && (
        <p className="text-green-400 text-sm">✅ Ready to claim reward!</p>
      )}

      {/* Transaction Hash */}
      {hash && (
        <div className="text-xs text-blue-400">
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

      {/* Error Display */}
      {error && (
        <div className="text-red-400 text-sm">
          ❌ Error: {error.message}
        </div>
      )}
    </div>
  );
}
