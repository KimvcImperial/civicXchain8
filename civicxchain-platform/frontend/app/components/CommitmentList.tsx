'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACT_CONFIG } from '../../config/contracts';

const GOVERNANCE_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "_commitmentId", "type": "uint256"}],
    "name": "claimEnvironmentalReward",
    "outputs": [{"internalType": "uint256", "name": "tokensRewarded", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

interface CommitmentListProps {
  commitment: any;
  fulfillmentStatus: any;
  onRefresh: () => void;
}

export default function CommitmentList({ commitment, fulfillmentStatus, onRefresh }: CommitmentListProps) {
  const [isClaimingReward, setIsClaimingReward] = useState(false);

  const { writeContract, data: hash, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleClaimReward = async () => {
    if (!commitment || !fulfillmentStatus?.[0]) return;
    
    setIsClaimingReward(true);
    try {
      writeContract({
        address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
        abi: GOVERNANCE_ABI,
        functionName: 'claimEnvironmentalReward',
        args: [1n],
      });
    } catch (err) {
      console.error('Error claiming reward:', err);
    } finally {
      setIsClaimingReward(false);
    }
  };

  if (isConfirmed) {
    onRefresh();
  }

  if (!commitment) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Commitments Yet</h3>
        <p className="text-gray-500 mb-6">Create your first environmental commitment to get started!</p>
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Create Commitment
        </button>
      </div>
    );
  }

  const deadline = new Date(Number(commitment[7]) * 1000);
  const isExpired = deadline < new Date();
  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">📋 Environmental Commitments</h2>
        <div className="text-sm text-gray-500">
          Total Active: 1
        </div>
      </div>

      {/* Commitment Card */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{commitment[1]}</h3>
              <p className="text-sm text-gray-600 mt-1">ID: #{Number(commitment[0])}</p>
            </div>
            <div className="flex items-center space-x-2">
              {commitment[10] ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  ✅ Fulfilled
                </span>
              ) : fulfillmentStatus?.[0] ? (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  🎯 Ready to Claim
                </span>
              ) : (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                  ⏳ In Progress
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">📝 Description</h4>
                <p className="text-gray-600 text-sm">{commitment[2]}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">👤 Official</h4>
                <div className="text-sm">
                  <p className="font-medium">{commitment[4]}</p>
                  <p className="text-gray-600">{commitment[5]}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {commitment[3].slice(0, 8)}...{commitment[3].slice(-6)}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">💰 Financial Details</h4>
                <div className="text-sm space-y-1">
                  <p>Stake: <span className="font-medium">{formatEther(commitment[12])} ETH</span></p>
                  <p>Reward: <span className="font-medium text-green-600">{formatEther(commitment[13])} CIVIC</span></p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">🎯 Target & Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Metric Type:</span>
                    <span className="font-medium uppercase">{commitment[8]}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Target Value:</span>
                    <span className="font-medium">{(Number(commitment[6]) / 100).toFixed(2)} μg/m³</span>
                  </div>
                  {fulfillmentStatus && (
                    <div className="flex justify-between text-sm">
                      <span>Current Value:</span>
                      <span className="font-medium">{(Number(fulfillmentStatus[1]) / 100).toFixed(2)} μg/m³</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">⏰ Timeline</h4>
                <div className="text-sm space-y-1">
                  <p>Deadline: <span className="font-medium">{deadline.toLocaleDateString()}</span></p>
                  <p className={`${isExpired ? 'text-red-600' : daysLeft <= 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {isExpired ? '⚠️ Expired' : `${daysLeft} days remaining`}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">📊 Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Target Achievement:</span>
                    <span className={`font-medium ${fulfillmentStatus?.[0] ? 'text-green-600' : 'text-yellow-600'}`}>
                      {fulfillmentStatus?.[0] ? '✅ Achieved' : '⏳ Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Reward Status:</span>
                    <span className={`font-medium ${commitment[11] ? 'text-blue-600' : 'text-gray-600'}`}>
                      {commitment[11] ? '💰 Claimed' : '⏳ Available'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {fulfillmentStatus && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress to Target</span>
                <span>
                  {fulfillmentStatus[0] ? '100%' : 
                   `${Math.max(0, Math.min(100, ((Number(commitment[6]) - Number(fulfillmentStatus[1])) / Number(commitment[6])) * 100)).toFixed(1)}%`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    fulfillmentStatus[0] ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ 
                    width: fulfillmentStatus[0] ? '100%' : 
                           `${Math.max(5, Math.min(100, ((Number(commitment[6]) - Number(fulfillmentStatus[1])) / Number(commitment[6])) * 100))}%`
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-3">
            {fulfillmentStatus?.[0] && !commitment[11] && (
              <button
                onClick={handleClaimReward}
                disabled={isClaimingReward || isConfirming}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isClaimingReward || isConfirming ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Claiming...
                  </span>
                ) : (
                  '🏆 Claim Reward'
                )}
              </button>
            )}
            
            <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              📊 View Details
            </button>
            
            <button className="bg-blue-100 text-blue-700 px-6 py-2 rounded-lg hover:bg-blue-200 transition-colors">
              📈 Track Progress
            </button>
          </div>

          {/* Transaction Status */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">❌ Error: {error.message}</p>
            </div>
          )}
          
          {hash && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm">
                📝 Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
                {isConfirming && <span className="ml-2">⏳ Confirming...</span>}
                {isConfirmed && <span className="ml-2">✅ Confirmed!</span>}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
