'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_CONFIG } from '../../config/contracts';

const GOVERNANCE_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_title", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "string", "name": "_officialName", "type": "string"},
      {"internalType": "string", "name": "_officialRole", "type": "string"},
      {"internalType": "uint256", "name": "_targetValue", "type": "uint256"},
      {"internalType": "uint256", "name": "_deadline", "type": "uint256"},
      {"internalType": "string", "name": "_metricType", "type": "string"}
    ],
    "name": "createCommitment",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

interface CreateCommitmentFormProps {
  onSuccess: () => void;
}

export default function CreateCommitmentForm({ onSuccess }: CreateCommitmentFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    officialName: '',
    officialRole: '',
    targetValue: '',
    deadline: '',
    metricType: 'pm25',
    stakeAmount: '0.1'
  });

  const { writeContract, data: hash, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const deadlineTimestamp = Math.floor(new Date(formData.deadline).getTime() / 1000);
      const targetValueScaled = Math.floor(parseFloat(formData.targetValue) * 100); // Scale to match contract format
      
      writeContract({
        address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
        abi: GOVERNANCE_ABI,
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
        value: parseEther(formData.stakeAmount),
      });
    } catch (err) {
      console.error('Error creating commitment:', err);
    }
  };

  if (isConfirmed) {
    onSuccess();
    // Reset form
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
  }

  const metricOptions = [
    { value: 'pm25', label: '🏭 PM2.5 Air Quality', unit: 'μg/m³', example: '15.0' },
    { value: 'co2', label: '🌍 CO2 Emissions', unit: 'ppm', example: '400.0' },
    { value: 'forest_cover', label: '🌳 Forest Cover', unit: '%', example: '75.0' },
  ];

  const selectedMetric = metricOptions.find(m => m.value === formData.metricType);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">➕ Create Environmental Commitment</h2>
          <p className="text-gray-600">Make a blockchain-verified commitment to environmental improvement</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📝 Commitment Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Reduce City PM2.5 Levels by 25%"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📄 Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe your environmental commitment, including specific actions and expected outcomes..."
            />
          </div>

          {/* Official Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👤 Official Name *
              </label>
              <input
                type="text"
                required
                value={formData.officialName}
                onChange={(e) => setFormData({...formData, officialName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏛️ Role/Position *
              </label>
              <input
                type="text"
                required
                value={formData.officialRole}
                onChange={(e) => setFormData({...formData, officialRole: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Mayor, Environmental Director"
              />
            </div>
          </div>

          {/* Metric Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📊 Environmental Metric *
            </label>
            <select
              value={formData.metricType}
              onChange={(e) => setFormData({...formData, metricType: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {metricOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Target Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎯 Target Value * ({selectedMetric?.unit})
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.targetValue}
              onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={`e.g., ${selectedMetric?.example}`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Current value: {formData.metricType === 'pm25' ? '12.03 μg/m³' : 
                            formData.metricType === 'co2' ? '416.64 ppm' : '65.68%'}
            </p>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ⏰ Deadline *
            </label>
            <input
              type="date"
              required
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Stake Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              💰 Stake Amount (ETH) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={formData.stakeAmount}
              onChange={(e) => setFormData({...formData, stakeAmount: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0.1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Higher stakes earn more CIVIC tokens. Recommended: 0.1 - 1.0 ETH
            </p>
          </div>

          {/* Reward Preview */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-green-800 mb-2">🏆 Estimated Rewards</h4>
            <div className="text-sm text-green-700 space-y-1">
              <p>CIVIC Tokens: ~{(parseFloat(formData.stakeAmount || '0') * 1000 * 1.5).toFixed(0)} CIVIC</p>
              <p>ETH Return: {(parseFloat(formData.stakeAmount || '0') * 1.5).toFixed(2)} ETH (150% of stake)</p>
              <p className="text-xs">*Rewards only paid upon successful completion</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isConfirming}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isConfirming ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Commitment...
              </span>
            ) : (
              '🚀 Create Commitment'
            )}
          </button>
        </form>

        {/* Transaction Status */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">❌ Error: {error.message}</p>
          </div>
        )}
        
        {hash && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-sm">
              📝 Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
              {isConfirming && <span className="ml-2">⏳ Confirming...</span>}
              {isConfirmed && <span className="ml-2">✅ Confirmed!</span>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
