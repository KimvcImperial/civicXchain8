'use client';

import { useReadContract, useAccount } from 'wagmi';
import { CONTRACT_CONFIG } from '../../config/contracts';
import { CIVIC_GOVERNANCE_ABI } from '../../config/governance-abi';

export default function SimpleDebugPanel() {
  const { address, isConnected } = useAccount();

  // Test basic contract call
  const { data: nextId, error: nextIdError, isLoading: nextIdLoading } = useReadContract({
    address: CONTRACT_CONFIG.COMMITMENT_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
    functionName: 'nextCommitmentId',
  });

  // Test commitment fetch
  const { data: commitment1, error: commitment1Error, isLoading: commitment1Loading } = useReadContract({
    address: CONTRACT_CONFIG.COMMITMENT_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
    functionName: 'getCommitment',
    args: [BigInt(1)],
  });

  return (
    <div className="fixed top-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-md z-50 text-xs">
      <h3 className="font-bold mb-2">🔍 Debug Panel</h3>
      
      <div className="space-y-2">
        <div>
          <strong>Wallet:</strong> {isConnected ? `Connected (${address?.slice(0, 6)}...)` : 'Not connected'}
        </div>
        
        <div>
          <strong>Contract:</strong> {CONTRACT_CONFIG.COMMITMENT_CONTRACT}
        </div>
        
        <div>
          <strong>Next ID:</strong>
          {nextIdLoading && <span className="text-yellow-400"> Loading...</span>}
          {nextIdError && <span className="text-red-400"> Error: {nextIdError.message}</span>}
          {nextId && <span className="text-green-400"> {nextId.toString()}</span>}
        </div>
        
        <div>
          <strong>Commitment 1:</strong>
          {commitment1Loading && <span className="text-yellow-400"> Loading...</span>}
          {commitment1Error && <span className="text-red-400"> Error: {commitment1Error.message}</span>}
          {commitment1 && Array.isArray(commitment1) && (
            <div className="text-green-400">
              <div>Title: {commitment1[1]}</div>
              <div>Desc: {commitment1[2]}</div>
            </div>
          )}
          {commitment1 && !Array.isArray(commitment1) && (
            <div className="text-orange-400">Data: {String(commitment1).slice(0, 100)}...</div>
          )}
        </div>
      </div>
    </div>
  );
}
