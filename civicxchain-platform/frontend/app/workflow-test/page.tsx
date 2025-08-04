'use client';

import { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '../../config/contracts';
import { CIVIC_GOVERNANCE_ABI } from '../../config/governance-abi';

export default function WorkflowTestPage() {
  const { address, isConnected } = useAccount();
  const [selectedCommitmentId, setSelectedCommitmentId] = useState<number>(1);

  // Get total commitments
  const { data: nextCommitmentId } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
    functionName: 'nextCommitmentId',
  });

  // Get user's commitments
  const { data: userCommitments } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
    functionName: 'getOfficialCommitments',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  // Get specific commitment data
  const { data: commitment } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
    functionName: 'getCommitment',
    args: [BigInt(selectedCommitmentId)],
    query: { enabled: selectedCommitmentId > 0 }
  });

  // Check judge verification status
  const [judgeVerified, setJudgeVerified] = useState(false);
  
  const checkJudgeVerification = () => {
    const verifiedCommitments = JSON.parse(localStorage.getItem('judgeVerifiedCommitments') || '[]');
    const isVerified = verifiedCommitments.includes(selectedCommitmentId.toString());
    setJudgeVerified(isVerified);
    return isVerified;
  };

  const simulateJudgeVerification = () => {
    const verifiedCommitments = JSON.parse(localStorage.getItem('judgeVerifiedCommitments') || '[]');
    if (!verifiedCommitments.includes(selectedCommitmentId.toString())) {
      verifiedCommitments.push(selectedCommitmentId.toString());
      localStorage.setItem('judgeVerifiedCommitments', JSON.stringify(verifiedCommitments));
    }
    setJudgeVerified(true);
    alert('✅ Judge verification simulated for Commitment #' + selectedCommitmentId);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">🔗 Connect Wallet Required</h1>
          <p className="text-gray-300">Please connect your wallet to test the workflow</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🧪 Workflow Test Dashboard</h1>
        
        {/* Wallet Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">👛 Wallet Information:</h3>
          <p className="text-sm text-gray-300 mb-2">Connected Address: {address}</p>
          <p className="text-sm text-gray-300">Network: Sepolia Testnet</p>
          <p className="text-sm text-gray-300">Contract: {CONTRACT_CONFIG.GOVERNANCE_CONTRACT}</p>
        </div>

        {/* Commitment Overview */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">📊 Commitment Overview:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Total Commitments:</strong> {nextCommitmentId ? Number(nextCommitmentId) - 1 : 0}</p>
            <p><strong>Your Commitments:</strong> {userCommitments ? userCommitments.length : 0}</p>
          </div>
          
          {userCommitments && userCommitments.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-300 mb-2">Your Commitment IDs:</p>
              <div className="flex flex-wrap gap-2">
                {userCommitments.map((id: any) => (
                  <span key={id.toString()} className="px-2 py-1 bg-blue-600 rounded text-xs">
                    #{id.toString()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Workflow Test */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">🔄 Test Workflow:</h3>
          
          {/* Step 1: Select Commitment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              1️⃣ Select Commitment to Test:
            </label>
            <select
              value={selectedCommitmentId}
              onChange={(e) => setSelectedCommitmentId(Number(e.target.value))}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              {Array.from({ length: Math.max(Number(nextCommitmentId) - 1, 5) }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Commitment #{i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Commitment Details */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-300 mb-3">2️⃣ Commitment Details:</h4>
            {commitment ? (
              <div className="bg-gray-700 rounded-lg p-4 space-y-2 text-sm">
                <p><strong>Title:</strong> {commitment.title || 'No title'}</p>
                <p><strong>Description:</strong> {commitment.description || 'No description'}</p>
                <p><strong>Official:</strong> {commitment.officialName || 'Unknown'}</p>
                <p><strong>Target Value:</strong> {Number(commitment.targetValue || 0)} μg/m³</p>
                <p><strong>Deadline:</strong> {new Date(Number(commitment.deadline || 0) * 1000).toLocaleDateString()}</p>
                <p><strong>Stake Amount:</strong> {commitment.stakeAmount ? Number(commitment.stakeAmount) / 1e18 : 0} ETH</p>
                <p><strong>Is Fulfilled:</strong> {commitment.isFulfilled ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Reward Claimed:</strong> {commitment.rewardClaimed ? '✅ Yes' : '❌ No'}</p>
              </div>
            ) : (
              <p className="text-gray-400">Loading commitment data...</p>
            )}
          </div>

          {/* Step 3: Judge Verification */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-300 mb-3">3️⃣ Judge Verification:</h4>
            <div className="flex items-center gap-4">
              <button
                onClick={checkJudgeVerification}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                🔍 Check Verification Status
              </button>
              <button
                onClick={simulateJudgeVerification}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                ⚖️ Simulate Judge Verification
              </button>
              <span className={`px-3 py-1 rounded-full text-sm ${
                judgeVerified ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
              }`}>
                {judgeVerified ? '✅ Verified' : '⏳ Not Verified'}
              </span>
            </div>
          </div>

          {/* Step 4: Claim Status */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-300 mb-3">4️⃣ Claim Eligibility:</h4>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Target Achieved:</span>
                  <span className={commitment?.isFulfilled ? 'text-green-400' : 'text-red-400'}>
                    {commitment?.isFulfilled ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Judge Verified:</span>
                  <span className={judgeVerified ? 'text-green-400' : 'text-red-400'}>
                    {judgeVerified ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Already Claimed:</span>
                  <span className={commitment?.rewardClaimed ? 'text-red-400' : 'text-green-400'}>
                    {commitment?.rewardClaimed ? '❌ Yes' : '✅ No'}
                  </span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Can Claim Reward:</span>
                  <span className={
                    commitment?.isFulfilled && judgeVerified && !commitment?.rewardClaimed 
                      ? 'text-green-400' : 'text-red-400'
                  }>
                    {commitment?.isFulfilled && judgeVerified && !commitment?.rewardClaimed 
                      ? '✅ YES' : '❌ NO'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">🔗 Quick Links:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/create-staked-commitment" 
              className="block px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-center font-medium"
            >
              💰 Create ETH-Staked Commitment
            </a>
            <a 
              href="/simple-claimer" 
              className="block px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center font-medium"
            >
              🏆 Claim ETH Rewards
            </a>
            <a 
              href="/" 
              className="block px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center font-medium"
            >
              🏠 Main Dashboard
            </a>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">📋 How the Workflow Works:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
            <li><strong>Live Feed:</strong> Shows your created commitments from the blockchain</li>
            <li><strong>Judge Panel:</strong> Shows same commitments with "Verify Reward" buttons</li>
            <li><strong>Judge clicks "Verify Reward":</strong> Stores verification in localStorage</li>
            <li><strong>Public Officials Reward:</strong> Shows "Claim Reward" button only after judge verification</li>
            <li><strong>Claim Reward:</strong> Calls smart contract to transfer 150% ETH + CivicX tokens</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
