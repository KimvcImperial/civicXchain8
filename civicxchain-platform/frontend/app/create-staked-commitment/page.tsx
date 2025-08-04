'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_CONFIG } from '../../config/contracts';
import { CIVIC_GOVERNANCE_ABI } from '../../config/governance-abi';

export default function CreateStakedCommitmentPage() {
  const { address, isConnected } = useAccount();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    officialName: '',
    officialRole: '',
    targetValue: '',
    deadline: '',
    metricType: 'pm25',
    stakeAmount: '0.1' // ETH amount to stake
  });

  const { writeContract, data: hash, error, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      const deadlineTimestamp = Math.floor(new Date(formData.deadline).getTime() / 1000);
      const targetValueScaled = Math.floor(parseFloat(formData.targetValue) * 100); // Scale to match contract format
      
      console.log('Creating commitment with ETH stake:', formData.stakeAmount, 'ETH');
      
      writeContract({
        address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
        abi: CIVIC_GOVERNANCE_ABI,
        functionName: 'createCommitment',
        args: [
          formData.title,
          formData.description,
          formData.officialName,
          formData.officialRole,
          BigInt(targetValueScaled),
          BigInt(deadlineTimestamp),
          formData.metricType
        ],
        value: parseEther(formData.stakeAmount), // ETH staking amount
      });
    } catch (err) {
      console.error('Error creating commitment:', err);
      alert('Error creating commitment: ' + (err as Error).message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      officialName: '',
      officialRole: '',
      targetValue: '',
      deadline: '',
      metricType: 'pm25',
      stakeAmount: '0.1'
    });
  };

  const metricOptions = [
    { value: 'pm25', label: '🏭 PM2.5 Air Quality', unit: 'μg/m³', example: '15.0', description: 'Target: BELOW this value' },
    { value: 'forest_cover', label: '🌳 Forest Cover', unit: '%', example: '75.0', description: 'Target: ABOVE this value' },
    { value: 'aqi', label: '🌬️ Air Quality Index', unit: 'AQI', example: '50.0', description: 'Target: BELOW this value' },
  ];

  const selectedMetric = metricOptions.find(m => m.value === formData.metricType);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">🔗 Connect Wallet Required</h1>
          <p className="text-gray-300">Please connect your wallet to create a staked commitment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">💰 Create ETH-Staked Environmental Commitment</h1>
        
        {/* Important Notice */}
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-3">🎯 How ETH Staking Works:</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
            <li><strong>Stake ETH:</strong> You put up ETH as collateral when creating the commitment</li>
            <li><strong>Meet Target:</strong> Achieve your environmental goal by the deadline</li>
            <li><strong>Get 150% Back:</strong> Receive 1.5x your stake in ETH + bonus CivicX tokens</li>
            <li><strong>Miss Target:</strong> Lose your staked ETH (goes to environmental fund)</li>
          </ul>
        </div>

        {/* Contract Info */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">📋 Contract Information:</h3>
          <p className="text-sm text-gray-300">Address: {CONTRACT_CONFIG.GOVERNANCE_CONTRACT}</p>
          <p className="text-sm text-gray-300">Connected Wallet: {address}</p>
          <p className="text-sm text-gray-300">Network: Sepolia Testnet</p>
        </div>

        {isConfirmed ? (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-green-400 mb-4">🎉 Commitment Created Successfully!</h2>
            <div className="space-y-2 text-sm">
              <p>✅ <strong>ETH Staked:</strong> {formData.stakeAmount} ETH</p>
              <p>🏆 <strong>Potential ETH Reward:</strong> {(parseFloat(formData.stakeAmount) * 1.5).toFixed(4)} ETH</p>
              <p>🪙 <strong>Plus:</strong> Bonus CivicX governance tokens</p>
            </div>
            
            {hash && (
              <div className="mt-4">
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

            <div className="mt-6 space-x-4">
              <button 
                onClick={resetForm}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
              >
                Create Another Commitment
              </button>
              <a 
                href="/simple-claimer" 
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              >
                Check Claimable Rewards
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  📝 Commitment Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Reduce City PM2.5 Levels by 25%"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  📄 Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Detailed description of your environmental commitment..."
                />
              </div>

              {/* Official Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    👤 Official Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.officialName}
                    onChange={(e) => setFormData({...formData, officialName: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    🏛️ Role/Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.officialRole}
                    onChange={(e) => setFormData({...formData, officialRole: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Environmental Manager"
                  />
                </div>
              </div>

              {/* Metric Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  📊 Environmental Metric *
                </label>
                <select
                  value={formData.metricType}
                  onChange={(e) => setFormData({...formData, metricType: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {metricOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} ({option.unit})
                    </option>
                  ))}
                </select>
                {selectedMetric && (
                  <p className="text-xs text-gray-400 mt-1">
                    {selectedMetric.description} • Example: {selectedMetric.example} {selectedMetric.unit}
                  </p>
                )}
              </div>

              {/* Target Value */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🎯 Target Value * ({selectedMetric?.unit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.targetValue}
                  onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={selectedMetric?.example}
                />
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  📅 Deadline *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              {/* Stake Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  💰 ETH Stake Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={formData.stakeAmount}
                  onChange={(e) => setFormData({...formData, stakeAmount: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.1"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Higher stakes earn higher rewards. Recommended: 0.01 - 1.0 ETH
                </p>
              </div>

              {/* Reward Preview */}
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-green-400 mb-2">🏆 Estimated Rewards (if successful):</h4>
                <div className="text-sm text-green-300 space-y-1">
                  <p>💰 <strong>ETH Reward:</strong> {(parseFloat(formData.stakeAmount || '0') * 1.5).toFixed(4)} ETH (150% of stake)</p>
                  <p>🪙 <strong>CivicX Tokens:</strong> ~{(parseFloat(formData.stakeAmount || '0') * 1000 * 1.5).toFixed(0)} CIVIC</p>
                  <p className="text-xs text-gray-400">*Actual token amount depends on metric difficulty multiplier</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending || isConfirming}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isPending ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Preparing Transaction...
                  </span>
                ) : isConfirming ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Confirming on Blockchain...
                  </span>
                ) : (
                  `🚀 Stake ${formData.stakeAmount} ETH & Create Commitment`
                )}
              </button>
            </form>

            {/* Transaction Status */}
            {error && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">❌ Error: {error.message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
