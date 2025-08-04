'use client';

import { useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '../../config/contracts';
import { CIVIC_GOVERNANCE_ABI } from '../../config/governance-abi';

export default function DebugCommitments() {
  // Get current commitment count - USE GOVERNANCE_CONTRACT
  const { data: currentCommitmentId, error: commitmentIdError, isLoading: commitmentIdLoading } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
    functionName: 'nextCommitmentId',
  });

  // Fetch commitment 1 - USE GOVERNANCE_CONTRACT
  const { data: commitment1, error: commitment1Error, isLoading: commitment1Loading } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
    functionName: 'getCommitment',
    args: [BigInt(1)],
    query: { enabled: !!(currentCommitmentId && Number(currentCommitmentId) >= 1) }
  });

  // Fetch commitment 2 - USE GOVERNANCE_CONTRACT
  const { data: commitment2, error: commitment2Error, isLoading: commitment2Loading } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
    functionName: 'getCommitment',
    args: [BigInt(2)],
    query: { enabled: !!(currentCommitmentId && Number(currentCommitmentId) >= 2) }
  });

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">🔍 Debug: Commitment Data Fetching</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Contract Address:</h3>
          <p className="text-sm text-gray-300">{CONTRACT_CONFIG.COMMITMENT_CONTRACT}</p>
        </div>

        <div>
          <h3 className="font-semibold">Next Commitment ID:</h3>
          {commitmentIdLoading && <p className="text-yellow-400">Loading...</p>}
          {commitmentIdError && <p className="text-red-400">Error: {commitmentIdError.message}</p>}
          {currentCommitmentId && <p className="text-green-400">{currentCommitmentId.toString()}</p>}
        </div>

        <div>
          <h3 className="font-semibold">Commitment #1:</h3>
          {commitment1Loading && <p className="text-yellow-400">Loading...</p>}
          {commitment1Error && <p className="text-red-400">Error: {commitment1Error.message}</p>}
          {commitment1 && (
            <div className="text-sm space-y-1">
              <p><strong>Raw data:</strong> {JSON.stringify(commitment1)}</p>
              {Array.isArray(commitment1) && (
                <div>
                  <p><strong>Title:</strong> {commitment1[1]}</p>
                  <p><strong>Description:</strong> {commitment1[2]}</p>
                  <p><strong>Official:</strong> {commitment1[3]}</p>
                  <p><strong>Target Value:</strong> {commitment1[6]?.toString()}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold">Commitment #2:</h3>
          {commitment2Loading && <p className="text-yellow-400">Loading...</p>}
          {commitment2Error && <p className="text-red-400">Error: {commitment2Error.message}</p>}
          {commitment2 && (
            <div className="text-sm space-y-1">
              <p><strong>Raw data:</strong> {JSON.stringify(commitment2)}</p>
              {Array.isArray(commitment2) && (
                <div>
                  <p><strong>Title:</strong> {commitment2[1]}</p>
                  <p><strong>Description:</strong> {commitment2[2]}</p>
                  <p><strong>Official:</strong> {commitment2[3]}</p>
                  <p><strong>Target Value:</strong> {commitment2[6]?.toString()}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
