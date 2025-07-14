'use client';

import { useState } from 'react';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';
import { CONTRACT_CONFIG } from '../../config/contracts';

interface TokenBalanceProps {
  userBalance: bigint | undefined;
  commitment: any;
  fulfillmentStatus: any;
  onRefresh: () => void;
}

export default function TokenBalance({ userBalance, commitment, fulfillmentStatus, onRefresh }: TokenBalanceProps) {
  const { address } = useAccount();
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);

  const balance = userBalance ? formatEther(userBalance) : '0';
  const balanceNumber = parseFloat(balance);

  // Mock transaction history
  const transactions = [
    {
      id: 1,
      type: 'reward',
      amount: '+150.0',
      description: 'PM2.5 Reduction Commitment Reward',
      date: '2024-01-15',
      status: 'completed',
      hash: '0x1234...5678'
    },
    {
      id: 2,
      type: 'stake',
      amount: '-0.1 ETH',
      description: 'Environmental Commitment Stake',
      date: '2024-01-10',
      status: 'completed',
      hash: '0x9abc...def0'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🏆 My Rewards & Tokens</h2>
        <p className="text-gray-600">Track your CIVIC token earnings and environmental impact</p>
      </div>

      {/* Balance Overview */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 text-center">
        <div className="mb-4">
          <span className="text-6xl">💰</span>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Your CIVIC Token Balance</p>
          <p className="text-4xl font-bold text-gray-900">{balanceNumber.toFixed(2)}</p>
          <p className="text-sm text-gray-500">CIVIC Tokens</p>
        </div>
        
        {balanceNumber > 0 && (
          <div className="mt-6 p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Estimated Value</p>
            <p className="text-lg font-semibold text-green-600">
              ~${(balanceNumber * 0.1).toFixed(2)} USD
            </p>
            <p className="text-xs text-gray-500">*Based on current market rates</p>
          </div>
        )}
      </div>

      {/* Reward Status */}
      {commitment && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Current Commitment Rewards</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{commitment[1]}</p>
                <p className="text-sm text-gray-600">Potential Reward: {formatEther(commitment[13])} CIVIC</p>
              </div>
              <div className="text-right">
                {commitment[11] ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    ✅ Claimed
                  </span>
                ) : fulfillmentStatus?.[0] ? (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    🎁 Ready to Claim
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                    ⏳ In Progress
                  </span>
                )}
              </div>
            </div>

            {fulfillmentStatus && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-600 font-medium">Current Progress</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {fulfillmentStatus[0] ? '100%' : '75%'}
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-green-600 font-medium">Completion Status</p>
                  <p className="text-2xl font-bold text-green-800">
                    {fulfillmentStatus[0] ? '✅' : '⏳'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Token Utility */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Token Utility</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">🗳️</span>
              <h4 className="font-medium">Governance Voting</h4>
            </div>
            <p className="text-sm text-gray-600">
              Use CIVIC tokens to vote on environmental policies and platform improvements.
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">🎁</span>
              <h4 className="font-medium">Staking Rewards</h4>
            </div>
            <p className="text-sm text-gray-600">
              Stake tokens to earn additional rewards and support the network.
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">🏪</span>
              <h4 className="font-medium">Marketplace</h4>
            </div>
            <p className="text-sm text-gray-600">
              Trade tokens for environmental credits and carbon offsets.
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">🌱</span>
              <h4 className="font-medium">Green Projects</h4>
            </div>
            <p className="text-sm text-gray-600">
              Fund environmental initiatives and conservation projects.
            </p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📊 Transaction History</h3>
          <button
            onClick={() => setShowTransactionHistory(!showTransactionHistory)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showTransactionHistory ? 'Hide' : 'Show'} History
          </button>
        </div>

        {showTransactionHistory && (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    tx.type === 'reward' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{tx.description}</p>
                    <p className="text-xs text-gray-500">{tx.date} • {tx.hash}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    tx.type === 'reward' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {tx.amount}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{tx.status}</p>
                </div>
              </div>
            ))}
            
            {transactions.length === 0 && (
              <div className="text-center py-8">
                <span className="text-4xl mb-2 block">📝</span>
                <p className="text-gray-500">No transactions yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wallet Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">💼 Wallet Information</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Address:</strong> {address?.slice(0, 8)}...{address?.slice(-6)}</p>
          <p><strong>Network:</strong> Localhost (Chain ID: 31337)</p>
          <p><strong>Contract:</strong> {CONTRACT_CONFIG.GOVERNANCE_CONTRACT.slice(0, 8)}...</p>
        </div>
      </div>
    </div>
  );
}
