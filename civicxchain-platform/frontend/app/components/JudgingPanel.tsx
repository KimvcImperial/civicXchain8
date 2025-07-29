'use client';

import { useState, useEffect } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_CONFIG } from '../../config/contracts';

// Import the correct ABI
const CIVIC_CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_commitmentId", "type": "uint256"}],
    "name": "getCommitment",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "address", "name": "official", "type": "address"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "uint256", "name": "deadline", "type": "uint256"},
          {"internalType": "uint256", "name": "targetValue", "type": "uint256"},
          {"internalType": "uint256", "name": "actualValue", "type": "uint256"},
          {"internalType": "string", "name": "metricType", "type": "string"},
          {"internalType": "string", "name": "dataSource", "type": "string"},
          {"internalType": "bool", "name": "isCompleted", "type": "bool"},
          {"internalType": "bool", "name": "rewardClaimed", "type": "bool"},
          {"internalType": "uint256", "name": "createdAt", "type": "uint256"}
        ],
        "internalType": "struct CivicCommitmentContract.Commitment",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextCommitmentId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_commitmentId", "type": "uint256"},
      {"internalType": "uint256", "name": "_actualValue", "type": "uint256"}
    ],
    "name": "updateCommitmentValue",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_commitmentId", "type": "uint256"}],
    "name": "verifyAndReward",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

interface CommitmentForJudging {
  id: bigint;
  description: string;
  official: string;
  targetValue: bigint;
  actualValue: bigint;
  deadline: bigint;
  isCompleted: boolean;
  rewardClaimed: boolean;
  metricType: string;
  needsVerification: boolean;
  currentPM25: number;
}

export default function JudgingPanel() {
  const [commitments, setCommitments] = useState<CommitmentForJudging[]>([]);
  const [currentPM25, setCurrentPM25] = useState<number>(15.5);
  const [verifyingId, setVerifyingId] = useState<bigint | null>(null);

  // Contract interactions
  const { writeContract: updateValue, data: updateHash, error: updateError } = useWriteContract();
  const { writeContract: verifyCommitment, data: verifyHash, error: verifyError } = useWriteContract();
  
  const { isLoading: isUpdateLoading } = useWaitForTransactionReceipt({
    hash: updateHash,
  });
  
  const { isLoading: isVerifyLoading } = useWaitForTransactionReceipt({
    hash: verifyHash,
  });

  // Get current commitment count
  const { data: currentCommitmentId, refetch: refetchCommitmentId } = useReadContract({
    address: CONTRACT_CONFIG.COMMITMENT_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'nextCommitmentId',
  });

  // Mock real-time PM2.5 updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newPM25 = 12 + Math.random() * 8; // 12-20 μg/m³
      setCurrentPM25(Number(newPM25.toFixed(2)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Load commitments for judging
  useEffect(() => {
    if (!currentCommitmentId) return;

    const loadCommitments = async () => {
      const commitmentList: CommitmentForJudging[] = [];
      
      // Mock commitment data (in real app, this would fetch from contract)
      const mockCommitments = [
        {
          id: 1n,
          description: "easy target!!!!!!!!",
          official: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          targetValue: 2500n, // 25.00 scaled
          actualValue: 0n,
          deadline: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
          isCompleted: false,
          rewardClaimed: false,
          metricType: "pm25",
          needsVerification: true,
          currentPM25: currentPM25
        },
        {
          id: 2n,
          description: "very easy target to acheive!!!!!!!!!",
          official: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          targetValue: 3600n, // 36.00 scaled
          actualValue: 0n,
          deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
          isCompleted: false,
          rewardClaimed: false,
          metricType: "pm25",
          needsVerification: true,
          currentPM25: currentPM25
        },
        {
          id: 3n,
          description: "Test from script",
          official: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          targetValue: 2500n, // 25.00 scaled
          actualValue: 0n,
          deadline: BigInt(Math.floor(Date.now() / 1000) + 7200),
          isCompleted: false,
          rewardClaimed: false,
          metricType: "pm25",
          needsVerification: true,
          currentPM25: currentPM25
        },
        {
          id: 4n,
          description: "testing scripts !!!!!!!!",
          official: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          targetValue: 2800n, // 28.00 scaled
          actualValue: 0n,
          deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
          isCompleted: false,
          rewardClaimed: false,
          metricType: "pm25",
          needsVerification: true,
          currentPM25: currentPM25
        }
      ];

      setCommitments(mockCommitments.slice(0, Number(currentCommitmentId)));
    };

    loadCommitments();
  }, [currentCommitmentId, currentPM25]);

  const handleManualVerification = async (commitmentId: bigint) => {
    setVerifyingId(commitmentId);
    
    try {
      // First update the commitment with current PM2.5 value
      const scaledPM25 = Math.floor(currentPM25 * 100); // Scale to match contract
      
      console.log('🔍 Judge Manual Verification:', {
        commitmentId: commitmentId.toString(),
        currentPM25,
        scaledPM25,
        contractAddress: CONTRACT_CONFIG.COMMITMENT_CONTRACT
      });

      // Update commitment value
      updateValue({
        address: CONTRACT_CONFIG.COMMITMENT_CONTRACT as `0x${string}`,
        abi: CIVIC_CONTRACT_ABI,
        functionName: 'updateCommitmentValue',
        args: [commitmentId, BigInt(scaledPM25)],
      });

    } catch (error) {
      console.error('❌ Manual verification failed:', error);
      setVerifyingId(null);
    }
  };

  const handleApproveReward = async (commitmentId: bigint) => {
    try {
      console.log('🏆 Judge Approving Reward:', {
        commitmentId: commitmentId.toString(),
        contractAddress: CONTRACT_CONFIG.COMMITMENT_CONTRACT
      });

      setVerifyingId(commitmentId);

      // Verify and approve reward
      const result = await verifyCommitment({
        address: CONTRACT_CONFIG.COMMITMENT_CONTRACT as `0x${string}`,
        abi: CIVIC_CONTRACT_ABI,
        functionName: 'verifyAndReward',
        args: [commitmentId],
        value: BigInt('5000000000000000'), // 0.005 ETH reward (contract only has 0.01 ETH)
      });

      console.log('✅ Judge verification successful:', result);
      setVerifyingId(null);

      // Refresh commitments after successful verification
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('❌ Reward approval failed:', error);
      setVerifyingId(null);
    }
  };

  const isTargetMet = (targetValue: bigint, currentValue: number) => {
    const target = Number(targetValue) / 100; // Convert from scaled value
    return currentValue <= target;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
        <h2 className="text-2xl font-bold text-purple-400 mb-4">⚖️ Judging Panel</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="text-blue-400 text-sm font-medium">Current PM2.5</div>
            <div className="text-2xl font-bold text-white">{currentPM25} μg/m³</div>
            <div className="text-xs text-gray-400 mt-1">Live environmental data</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="text-yellow-400 text-sm font-medium">Pending Verification</div>
            <div className="text-2xl font-bold text-white">
              {commitments.filter(c => c.needsVerification && !c.isCompleted).length}
            </div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="text-green-400 text-sm font-medium">Eligible for Rewards</div>
            <div className="text-2xl font-bold text-white">
              {commitments.filter(c => isTargetMet(c.targetValue, currentPM25)).length}
            </div>
          </div>
        </div>
      </div>

      {/* Commitments for Judging */}
      <div className="space-y-4">
        {commitments.map((commitment) => {
          const targetMet = isTargetMet(commitment.targetValue, currentPM25);
          const targetValue = Number(commitment.targetValue) / 100;
          
          return (
            <div key={commitment.id.toString()} className={`bg-black/30 backdrop-blur-xl rounded-xl border p-6 ${
              targetMet ? 'border-green-500/30' : 'border-yellow-500/30'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Commitment #{commitment.id.toString()}: {commitment.description}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Official:</span>
                      <span className="ml-2 text-white font-mono text-xs">
                        {commitment.official.slice(0, 6)}...{commitment.official.slice(-4)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Target:</span>
                      <span className="ml-2 text-white font-medium">{targetValue} μg/m³</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Current:</span>
                      <span className="ml-2 text-white font-medium">{currentPM25} μg/m³</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Deadline:</span>
                      <span className="ml-2 text-white font-medium">
                        {new Date(Number(commitment.deadline) * 1000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  targetMet 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {targetMet ? '✅ TARGET MET' : '⏳ PENDING'}
                </div>
              </div>

              {/* Progress visualization */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Environmental Progress</span>
                  <span>{targetMet ? 'ACHIEVED' : 'IN PROGRESS'}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      targetMet 
                        ? 'bg-gradient-to-r from-green-500 to-green-400 w-full' 
                        : 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                    }`}
                    style={{ 
                      width: targetMet ? '100%' : `${Math.min((targetValue - currentPM25) / targetValue * 100, 90)}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Judge Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleManualVerification(commitment.id)}
                  disabled={verifyingId === commitment.id || isUpdateLoading}
                  className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifyingId === commitment.id || isUpdateLoading ? '🔄 Verifying...' : '🔍 Manual Verify'}
                </button>
                
                {targetMet && (
                  <button
                    onClick={() => handleApproveReward(commitment.id)}
                    disabled={isVerifyLoading}
                    className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifyLoading ? '🔄 Processing...' : '🏆 Approve Reward'}
                  </button>
                )}
                
                <button
                  className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg transition-all duration-300"
                >
                  ❌ Reject
                </button>
              </div>

              {/* Error display */}
              {(updateError || verifyError) && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">
                    ❌ Error: {updateError?.message || verifyError?.message}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {commitments.length === 0 && (
        <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-gray-500/20 p-12 text-center">
          <div className="text-4xl mb-4">⚖️</div>
          <h3 className="text-xl font-bold text-white mb-2">No Commitments to Judge</h3>
          <p className="text-gray-400">Waiting for commitments that need verification...</p>
        </div>
      )}
    </div>
  );
}
