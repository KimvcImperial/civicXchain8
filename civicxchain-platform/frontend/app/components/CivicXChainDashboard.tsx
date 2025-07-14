'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CONTRACT_CONFIG } from '../../config/contracts';
import EnvironmentalDataDisplay from './EnvironmentalDataDisplay';
import CommitmentList from './CommitmentList';
import CreateCommitmentForm from './CreateCommitmentForm';
import TokenBalance from './TokenBalance';

// Simplified ABI for the main functions we need
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
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_commitmentId", "type": "uint256"}],
    "name": "getCommitment",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "string", "name": "title", "type": "string"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "address", "name": "officialAddress", "type": "address"},
          {"internalType": "string", "name": "officialName", "type": "string"},
          {"internalType": "string", "name": "officialRole", "type": "string"},
          {"internalType": "uint256", "name": "targetValue", "type": "uint256"},
          {"internalType": "uint256", "name": "deadline", "type": "uint256"},
          {"internalType": "string", "name": "metricType", "type": "string"},
          {"internalType": "bool", "name": "isActive", "type": "bool"},
          {"internalType": "bool", "name": "isFulfilled", "type": "bool"},
          {"internalType": "bool", "name": "rewardClaimed", "type": "bool"},
          {"internalType": "uint256", "name": "stakeAmount", "type": "uint256"},
          {"internalType": "uint256", "name": "tokenReward", "type": "uint256"}
        ],
        "internalType": "struct CivicXChainGovernance.EnvironmentalCommitment",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_commitmentId", "type": "uint256"}],
    "name": "checkFulfillment",
    "outputs": [
      {"internalType": "bool", "name": "fulfilled", "type": "bool"},
      {"internalType": "uint256", "name": "currentValue", "type": "uint256"},
      {"internalType": "uint256", "name": "targetValue", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_commitmentId", "type": "uint256"}],
    "name": "claimEnvironmentalReward",
    "outputs": [{"internalType": "uint256", "name": "tokensRewarded", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_account", "type": "address"}],
    "name": "getTokenBalance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractTokenBalance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export default function CivicXChainDashboard() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Read contract data
  const { data: userTokenBalance } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: GOVERNANCE_ABI,
    functionName: 'getTokenBalance',
    args: [address as `0x${string}`],
  });

  const { data: contractTokenBalance } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: GOVERNANCE_ABI,
    functionName: 'getContractTokenBalance',
  });

  // Get commitment data (we know there's at least commitment ID 1)
  const { data: commitment1 } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: GOVERNANCE_ABI,
    functionName: 'getCommitment',
    args: [1n],
  });

  const { data: fulfillmentStatus } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: GOVERNANCE_ABI,
    functionName: 'checkFulfillment',
    args: [1n],
  });

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'commitments', name: 'Commitments', icon: '📋' },
    { id: 'create', name: 'Create New', icon: '➕' },
    { id: 'rewards', name: 'My Rewards', icon: '🏆' },
  ];

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">My CIVIC Tokens</p>
              <p className="text-2xl font-bold text-gray-900">
                {userTokenBalance ? formatEther(userTokenBalance).slice(0, 8) : '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">🏦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contract Reserve</p>
              <p className="text-2xl font-bold text-gray-900">
                {contractTokenBalance ? `${(Number(formatEther(contractTokenBalance)) / 1000000).toFixed(1)}M` : '0M'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Commitments</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fulfillment Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {fulfillmentStatus && fulfillmentStatus[0] ? '100%' : '0%'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <EnvironmentalDataDisplay />
              
              {commitment1 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Current Test Commitment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Title</p>
                      <p className="font-medium">{commitment1[1]}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Official</p>
                      <p className="font-medium">{commitment1[4]} ({commitment1[5]})</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Target PM2.5</p>
                      <p className="font-medium">{(Number(commitment1[6]) / 100).toFixed(2)} μg/m³</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className={`font-medium ${fulfillmentStatus && fulfillmentStatus[0] ? 'text-green-600' : 'text-yellow-600'}`}>
                        {fulfillmentStatus && fulfillmentStatus[0] ? '✅ Fulfilled' : '⏳ In Progress'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'commitments' && (
            <CommitmentList 
              commitment={commitment1} 
              fulfillmentStatus={fulfillmentStatus}
              onRefresh={refreshData}
            />
          )}

          {activeTab === 'create' && (
            <CreateCommitmentForm onSuccess={refreshData} />
          )}

          {activeTab === 'rewards' && (
            <TokenBalance 
              userBalance={userTokenBalance}
              commitment={commitment1}
              fulfillmentStatus={fulfillmentStatus}
              onRefresh={refreshData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
