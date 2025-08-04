'use client';

import { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '../../config/contracts';
import { CIVIC_GOVERNANCE_ABI } from '../../config/governance-abi';
import { formatEther } from 'viem';

export default function TokenCheckerPage() {
  const { address, isConnected } = useAccount();

  // Get your CivicX token balance
  const { data: tokenBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  // Get token details
  const { data: tokenName } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
    functionName: 'name',
  });

  const { data: tokenSymbol } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
    functionName: 'symbol',
  });

  const { data: tokenDecimals } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
    functionName: 'decimals',
  });

  const addTokenToMetaMask = async () => {
    if (!window.ethereum) {
      alert('MetaMask not found!');
      return;
    }

    try {
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT,
            symbol: tokenSymbol || 'CIVIC',
            decimals: tokenDecimals || 18,
            image: 'https://via.placeholder.com/64x64.png?text=CIVIC',
          },
        },
      });

      if (wasAdded) {
        alert('✅ CivicX token added to MetaMask!');
      } else {
        alert('❌ Token not added');
      }
    } catch (error) {
      console.error('Error adding token:', error);
      alert('Error adding token to MetaMask');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">🪙 Token Balance Checker</h1>
          <p className="text-gray-300">Please connect your wallet to check your CivicX token balance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🪙 CivicX Token Balance</h1>
        
        {/* Wallet Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">👛 Wallet Information:</h3>
          <p className="text-sm text-gray-300 mb-2">Connected Address: {address}</p>
          <p className="text-sm text-gray-300">Network: Sepolia Testnet</p>
        </div>

        {/* Token Details */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">🪙 Token Details:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Contract:</strong> {CONTRACT_CONFIG.GOVERNANCE_CONTRACT}</p>
            <p><strong>Name:</strong> {tokenName || 'Loading...'}</p>
            <p><strong>Symbol:</strong> {tokenSymbol || 'Loading...'}</p>
            <p><strong>Decimals:</strong> {tokenDecimals?.toString() || 'Loading...'}</p>
          </div>
        </div>

        {/* Balance Display */}
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/50 rounded-lg p-6 mb-6 text-center">
          <h3 className="text-2xl font-bold mb-4">💰 Your CivicX Balance</h3>
          {tokenBalance !== undefined ? (
            <div>
              <p className="text-4xl font-bold text-green-400 mb-2">
                {formatEther(tokenBalance)} {tokenSymbol}
              </p>
              <p className="text-sm text-gray-300">
                Raw balance: {tokenBalance.toString()} wei
              </p>
            </div>
          ) : (
            <p className="text-xl text-gray-400">Loading balance...</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <button
            onClick={() => refetchBalance()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold mr-4"
          >
            🔄 Refresh Balance
          </button>
          
          <button
            onClick={addTokenToMetaMask}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold"
          >
            🦊 Add Token to MetaMask
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">📋 How to See Your Tokens:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
            <li>Click "Add Token to MetaMask" above</li>
            <li>Approve the token addition in MetaMask</li>
            <li>Go to MetaMask → Assets tab</li>
            <li>You should see your CivicX tokens there!</li>
          </ol>
        </div>

        {/* Reward History */}
        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">🏆 Recent Activity:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-3 bg-green-500/20 rounded">
              <span>✅ Reward Claimed from Commitment #3</span>
              <span className="text-green-400">+15.0 CIVIC</span>
            </div>
            <p className="text-gray-400 text-xs mt-2">
              * Rewards are automatically sent to your wallet when you successfully claim them
            </p>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">🔧 Not Seeing Tokens?</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
            <li>Make sure you're on Sepolia testnet in MetaMask</li>
            <li>Try adding the token manually: Contract {CONTRACT_CONFIG.GOVERNANCE_CONTRACT}</li>
            <li>Check the "Tokens" tab in MetaMask, not "ETH" balance</li>
            <li>Refresh this page and MetaMask</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Add window.ethereum type for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
