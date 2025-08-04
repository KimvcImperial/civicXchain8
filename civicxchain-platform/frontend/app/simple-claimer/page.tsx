'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_CONFIG } from '../../config/contracts';
import { CIVIC_GOVERNANCE_ABI } from '../../config/governance-abi';

export default function SimpleClaimerPage() {
  const { address, isConnected } = useAccount();
  const [selectedCommitmentId, setSelectedCommitmentId] = useState<number>(3); // Default to claimable commitment
  const [verificationStep, setVerificationStep] = useState<'check' | 'verify' | 'claim'>('check');

  // Get total commitments
  const { data: allCommitmentIds } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
    functionName: 'nextCommitmentId',
  });

  // Get specific commitment data
  const { data: commitment, refetch: refetchCommitment } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
    functionName: 'getCommitment',
    args: [BigInt(selectedCommitmentId)],
    query: { enabled: selectedCommitmentId > 0 }
  });

  // Get fulfillment status
  const { data: fulfillmentStatus } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
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
  const claimabilityCheck = commitment && fulfillmentStatus ? (() => {
    const now = Math.floor(Date.now() / 1000);
    const deadlinePassed = now >= Number(commitment.deadline); // deadline
    const fulfilled = fulfillmentStatus[0]; // fulfilled
    const active = commitment.isActive; // isActive
    const rewardClaimed = commitment.rewardClaimed; // rewardClaimed

    return {
      isClaimable: active && !rewardClaimed && deadlinePassed && fulfilled,
      active,
      rewardClaimed,
      deadlinePassed,
      fulfilled,
      deadline: Number(commitment.deadline),
      currentValue: fulfillmentStatus[1],
      targetValue: fulfillmentStatus[2]
    };
  })() : null;

  const handleVerifyStep = () => {
    if (verificationStep === 'check') {
      setVerificationStep('verify');
    } else if (verificationStep === 'verify') {
      setVerificationStep('claim');
    }
  };

  const handleClaimReward = () => {
    if (!claimabilityCheck?.isClaimable) return;

    try {
      writeContract({
        address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
        abi: CIVIC_GOVERNANCE_ABI,
        functionName: 'claimEnvironmentalReward',
        args: [BigInt(selectedCommitmentId)],
      });
    } catch (error) {
      console.error('Error claiming reward:', error);
      alert('Error claiming reward: ' + (error as Error).message);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">🏆 Simple Reward Claimer</h1>
          <p className="text-gray-300">Please connect your wallet to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🏆 Simple Reward Claimer</h1>
        
        {/* Contract Info */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">📋 Contract Information:</h3>
          <p className="text-sm text-gray-300">Address: {CONTRACT_CONFIG.GOVERNANCE_CONTRACT}</p>
          <p className="text-sm text-gray-300">Connected Wallet: {address}</p>
          <p className="text-sm text-gray-300">Network: Sepolia Testnet</p>
        </div>

        {/* Step Progress */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">📋 Process Steps:</h3>
          <div className="flex space-x-4">
            <div className={`px-4 py-2 rounded ${verificationStep === 'check' ? 'bg-blue-600' : verificationStep !== 'check' ? 'bg-green-600' : 'bg-gray-600'}`}>
              1. Check Commitment
            </div>
            <div className={`px-4 py-2 rounded ${verificationStep === 'verify' ? 'bg-blue-600' : verificationStep === 'claim' ? 'bg-green-600' : 'bg-gray-600'}`}>
              2. Verify Eligibility
            </div>
            <div className={`px-4 py-2 rounded ${verificationStep === 'claim' ? 'bg-blue-600' : isConfirmed ? 'bg-green-600' : 'bg-gray-600'}`}>
              3. Claim Reward
            </div>
          </div>
        </div>

        {/* Commitment Selector */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Commitment ID:
          </label>
          <select 
            value={selectedCommitmentId}
            onChange={(e) => {
              setSelectedCommitmentId(Number(e.target.value));
              setVerificationStep('check');
            }}
            className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 w-full"
          >
            {allCommitmentIds && Array.from({length: Number(allCommitmentIds) - 1}, (_, i) => i + 1).map(id => (
              <option key={id} value={id}>Commitment #{id}</option>
            ))}
          </select>
        </div>

        {/* Commitment Details */}
        {commitment && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">📋 Commitment Details:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
              <p><strong>Title:</strong> {commitment.title}</p>
              <p><strong>Official:</strong> {commitment.officialName}</p>
              <p><strong>Role:</strong> {commitment.officialRole}</p>
              <p><strong>Target:</strong> {commitment.targetValue?.toString()} {commitment.metricType}</p>
              <p><strong>Deadline:</strong> {new Date(Number(commitment.deadline) * 1000).toLocaleString()}</p>
              <p><strong>Active:</strong> {commitment.isActive ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Reward Claimed:</strong> {commitment.rewardClaimed ? '✅ Yes' : '❌ No'}</p>
            </div>
          </div>
        )}

        {/* Claimability Check */}
        {claimabilityCheck && (
          <div className={`rounded-lg p-4 mb-6 ${claimabilityCheck.isClaimable ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'}`}>
            <h3 className="text-lg font-semibold mb-2">
              {claimabilityCheck.isClaimable ? '🎉 Ready to Claim!' : '❌ Not Claimable'}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className={claimabilityCheck.active ? 'text-green-400' : 'text-red-400'}>
                ✅ Active: {claimabilityCheck.active ? 'Yes' : 'No'}
              </p>
              <p className={claimabilityCheck.deadlinePassed ? 'text-green-400' : 'text-red-400'}>
                ✅ Deadline Passed: {claimabilityCheck.deadlinePassed ? 'Yes' : 'No'}
              </p>
              <p className={claimabilityCheck.fulfilled ? 'text-green-400' : 'text-red-400'}>
                ✅ Target Met: {claimabilityCheck.fulfilled ? 'Yes' : 'No'}
              </p>
              <p className={!claimabilityCheck.rewardClaimed ? 'text-green-400' : 'text-red-400'}>
                ✅ Not Claimed: {!claimabilityCheck.rewardClaimed ? 'Yes' : 'No'}
              </p>
            </div>
            {fulfillmentStatus && (
              <p className="text-sm mt-2">
                Current: {claimabilityCheck.currentValue?.toString()} | Target: {claimabilityCheck.targetValue?.toString()}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          {verificationStep === 'check' && (
            <button
              onClick={handleVerifyStep}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              🔍 Check Commitment
            </button>
          )}

          {verificationStep === 'verify' && (
            <button
              onClick={handleVerifyStep}
              disabled={!claimabilityCheck?.isClaimable}
              className={`px-8 py-3 rounded-lg font-semibold ${
                claimabilityCheck?.isClaimable
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              ✅ Verify Eligibility
            </button>
          )}

          {verificationStep === 'claim' && (
            <button
              onClick={handleClaimReward}
              disabled={!claimabilityCheck?.isClaimable || isPending || isConfirming || isConfirmed}
              className={`px-8 py-3 rounded-lg font-semibold ${
                claimabilityCheck?.isClaimable && !isPending && !isConfirming && !isConfirmed
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isPending ? '🔄 Preparing...' : 
               isConfirming ? '⏳ Confirming...' : 
               isConfirmed ? '✅ Claimed!' :
               '🏆 Claim Reward'}
            </button>
          )}
        </div>

        {/* Transaction Status */}
        {hash && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300 mb-2">Transaction Hash:</p>
            <a 
              href={`https://sepolia.etherscan.io/tx/${hash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm break-all"
            >
              {hash}
            </a>
          </div>
        )}

        {isConfirmed && (
          <div className="mt-6 bg-green-500/20 text-green-400 rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold mb-2">🎉 Success!</h3>
            <p>Reward claimed successfully!</p>
            <div className="mt-4 space-y-2 text-sm">
              <p>✅ <strong>CivicX Tokens:</strong> Check your wallet's "Tokens" tab</p>
              <p>💰 <strong>ETH Reward:</strong> Check your ETH balance (150% of stake returned)</p>
              <p className="text-xs text-gray-300">
                * If you don't see ETH rewards, the commitment may not have been created with ETH staking
              </p>
            </div>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => {
                  refetchCommitment();
                  setVerificationStep('check');
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Check Another Commitment
              </button>
              <a
                href="/token-checker"
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Check Token Balance
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
