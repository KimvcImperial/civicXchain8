'use client';

import { useState } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_CONFIG, CIVIC_CONTRACT_ABI } from '../../config/contracts';

export default function SimpleRewardClaimer() {
  const [selectedCommitmentId, setSelectedCommitmentId] = useState<number>(3); // Default to claimable commitment

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

  // Write contract for claiming reward
  const { writeContract, data: hash, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Check if commitment is claimable
  const isClaimable = commitment && fulfillmentStatus ? (() => {
    const now = Math.floor(Date.now() / 1000);
    const deadlinePassed = now >= Number(commitment[7]); // deadline
    const fulfilled = fulfillmentStatus[0]; // fulfilled
    const active = commitment[9]; // isActive
    const rewardClaimed = commitment[11]; // rewardClaimed
    
    return active && !rewardClaimed && deadlinePassed && fulfilled;
  })() : false;

  const handleClaimReward = () => {
    if (!isClaimable) return;

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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">🏆 Simple Reward Claimer</h2>
      
      {/* Contract Info */}
      <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">📋 Contract Information:</h3>
        <p className="text-sm text-gray-300">Address: {CONTRACT_CONFIG.GOVERNANCE_CONTRACT}</p>
        <p className="text-sm text-gray-300">Network: Sepolia Testnet</p>
      </div>

      {/* Commitment Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Commitment ID:
        </label>
        <select 
          value={selectedCommitmentId}
          onChange={(e) => setSelectedCommitmentId(Number(e.target.value))}
          className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 w-full"
        >
          {allCommitmentIds && Array.from({length: Number(allCommitmentIds) - 1}, (_, i) => i + 1).map(id => (
            <option key={id} value={id}>Commitment #{id}</option>
          ))}
        </select>
      </div>

      {/* Commitment Details */}
      {commitment && (
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">📋 Commitment Details:</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p><strong>Title:</strong> {commitment[1]}</p>
            <p><strong>Description:</strong> {commitment[2]}</p>
            <p><strong>Official:</strong> {commitment[4]} ({commitment[5]})</p>
            <p><strong>Target Value:</strong> {commitment[6]?.toString()} {commitment[8]}</p>
            <p><strong>Deadline:</strong> {new Date(Number(commitment[7]) * 1000).toLocaleString()}</p>
            <p><strong>Active:</strong> {commitment[9] ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Reward Claimed:</strong> {commitment[11] ? '✅ Yes' : '❌ No'}</p>
          </div>
        </div>
      )}

      {/* Fulfillment Status */}
      {fulfillmentStatus && (
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">🎯 Fulfillment Status:</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p><strong>Environmental Target Met:</strong> {fulfillmentStatus[0] ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Current Value:</strong> {fulfillmentStatus[1]?.toString()}</p>
            <p><strong>Target Value:</strong> {fulfillmentStatus[2]?.toString()}</p>
          </div>
        </div>
      )}

      {/* Claimability Status */}
      <div className={`rounded-lg p-4 mb-6 ${isClaimable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        <h3 className="text-lg font-semibold mb-2">
          {isClaimable ? '🎉 Ready to Claim!' : '❌ Not Claimable'}
        </h3>
        {commitment && fulfillmentStatus && (
          <div className="text-sm space-y-1">
            {(() => {
              const now = Math.floor(Date.now() / 1000);
              const deadlinePassed = now >= Number(commitment[7]);
              const fulfilled = fulfillmentStatus[0];
              const active = commitment[9];
              const rewardClaimed = commitment[11];
              
              return (
                <>
                  <p>✅ Active: {active ? 'Yes' : 'No'}</p>
                  <p>✅ Deadline Passed: {deadlinePassed ? 'Yes' : 'No'}</p>
                  <p>✅ Environmental Target Met: {fulfilled ? 'Yes' : 'No'}</p>
                  <p>✅ Reward Not Claimed: {!rewardClaimed ? 'Yes' : 'No'}</p>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Claim Button */}
      <div className="text-center">
        <button
          onClick={handleClaimReward}
          disabled={!isClaimable || isPending || isConfirming}
          className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all ${
            isClaimable && !isPending && !isConfirming
              ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isPending ? '🔄 Preparing...' : 
           isConfirming ? '⏳ Confirming...' : 
           isConfirmed ? '✅ Claimed!' :
           isClaimable ? '🏆 Claim Reward' : '❌ Cannot Claim'}
        </button>
      </div>

      {/* Transaction Status */}
      {hash && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-300">
            Transaction: <a 
              href={`https://sepolia.etherscan.io/tx/${hash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {hash.slice(0, 10)}...{hash.slice(-8)}
            </a>
          </p>
        </div>
      )}

      {isConfirmed && (
        <div className="mt-4 bg-green-500/20 text-green-400 rounded-lg p-4 text-center">
          🎉 Reward claimed successfully! Check your wallet for tokens.
        </div>
      )}
    </div>
  );
}
