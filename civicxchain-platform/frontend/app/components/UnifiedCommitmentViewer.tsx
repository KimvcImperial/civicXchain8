'use client';

import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_CONFIG, CIVIC_CONTRACT_ABI } from '../../config/contracts';

// Simple component to show ALL commitments from the blockchain
function CommitmentCard({ commitmentId }: { commitmentId: bigint }) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const { data: commitment } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'getCommitment',
    args: [commitmentId],
  });

  const { data: fulfillmentStatus } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'checkFulfillment',
    args: [commitmentId],
  });

  // Delete function - purely local, no blockchain interaction
  const deleteCommitment = () => {
    console.log('🗑️ Deleting commitment locally:', commitmentId.toString());

    // Mark as cancelled in localStorage
    const cancelled = JSON.parse(localStorage.getItem('cancelledCommitments') || '{}');
    cancelled[commitmentId.toString()] = {
      cancelled: true,
      timestamp: Date.now(),
      reason: 'Live Feed deleted'
    };
    localStorage.setItem('cancelledCommitments', JSON.stringify(cancelled));

    // Close modal and refresh
    setShowCancelConfirm(false);
    setTimeout(() => window.location.reload(), 100);
  };

  // Check if commitment is cancelled
  const cancelled = JSON.parse(localStorage.getItem('cancelledCommitments') || '{}');
  if (cancelled[commitmentId.toString()]?.cancelled) {
    return null; // Don't render cancelled commitments
  }

  if (!commitment) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  // Parse commitment data
  const title = commitment[1] || 'Unnamed Commitment';
  const description = commitment[2] || 'No description';
  const officialName = commitment[3] || 'Unknown Official';
  const targetValue = Number(commitment[6]) / 100;
  const deadline = new Date(Number(commitment[7]) * 1000);

  // Parse fulfillment data
  const isFulfilled = fulfillmentStatus ? fulfillmentStatus[0] : false;
  const currentValue = fulfillmentStatus ? Number(fulfillmentStatus[1]) / 100 : 0;
  const isAchieved = currentValue <= targetValue;

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-lg font-semibold text-white">{title}</h4>
          <p className="text-gray-400 text-sm">By: {officialName}</p>
          <p className="text-gray-500 text-xs">ID: #{commitmentId.toString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            isAchieved ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
          }`}>
            {isAchieved ? '✅ Achieved' : '⏳ Pending'}
          </div>
          {/* Delete buttons */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowCancelConfirm(true);
            }}
            className="text-red-400 hover:text-red-300 text-sm font-bold"
            title="Delete commitment"
          >
            ❌
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowCancelConfirm(true);
            }}
            className="px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded text-xs font-medium border border-red-500/30"
            title="Delete commitment"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
      
      <p className="text-gray-300 text-sm mb-3">{description}</p>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-400">Target:</span>
          <span className="text-cyan-400 ml-2">{targetValue.toFixed(2)} μg/m³</span>
        </div>
        <div>
          <span className="text-gray-400">Current:</span>
          <span className="text-cyan-400 ml-2">{currentValue.toFixed(2)} μg/m³</span>
        </div>
        <div>
          <span className="text-gray-400">Deadline:</span>
          <span className="text-cyan-400 ml-2">{deadline.toLocaleDateString()}</span>
        </div>
        <div>
          <span className="text-gray-400">Status:</span>
          <span className={`ml-2 ${isFulfilled ? 'text-green-400' : 'text-orange-400'}`}>
            {isFulfilled ? 'Fulfilled' : 'Not Fulfilled'}
          </span>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showCancelConfirm && (
        <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
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
  );
}

export default function UnifiedCommitmentViewer() {
  // Get total commitments from the GOVERNANCE_CONTRACT
  const { data: allCommitmentIds } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'nextCommitmentId',
  });

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-green-500/20 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">🔍 Unified Commitment Viewer</h3>
        <div className="text-sm text-gray-400">
          Contract: {CONTRACT_CONFIG.GOVERNANCE_CONTRACT?.slice(0, 10)}...
        </div>
      </div>
      
      <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
        <p className="text-blue-400 text-sm">
          📋 This component shows ALL commitments from the blockchain using the same contract as Live Feed and Judge Panel
        </p>
        <p className="text-blue-300 text-xs mt-1">
          Total commitments: {allCommitmentIds ? Number(allCommitmentIds) - 1 : 0}
        </p>
      </div>

      <div className="space-y-4">
        {!allCommitmentIds || Number(allCommitmentIds) <= 1 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-400">No commitments found on blockchain</p>
            <p className="text-sm text-gray-500 mt-2">
              Total commitments: {allCommitmentIds ? Number(allCommitmentIds) - 1 : 0}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-4">
              Showing all {Number(allCommitmentIds) - 1} commitments from the blockchain:
            </p>
            {Array.from({ length: Number(allCommitmentIds) - 1 }, (_, i) => (
              <CommitmentCard
                key={i + 1}
                commitmentId={BigInt(i + 1)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
