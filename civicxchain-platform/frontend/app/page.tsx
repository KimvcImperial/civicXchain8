'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { injected } from 'wagmi/connectors';
import CyberpunkDashboard from './components/CyberpunkDashboard';
import OracleDataDisplay from './components/OracleDataDisplay';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-cyan-400">Loading CivicXChain...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Cyberpunk Navigation */}
        <nav className="bg-black/40 backdrop-blur-xl border-b border-cyan-500/30 shadow-lg shadow-cyan-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
                    <span className="text-black font-bold text-sm">C</span>
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    CivicXChain
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* Debug Network Info */}
                <div className="text-xs text-cyan-400/70">
                  Chain ID: {chainId || 'Not connected'}
                  <br />
                  <button
                    onClick={() => console.log('Debug: Opening browser console')}
                    className="text-yellow-400 underline"
                  >
                    Check Console for Errors
                  </button>
                </div>
                <button
                  onClick={() => connect({ connector: injected() })}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10"></div>
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center">
              <h2 className="text-5xl font-bold text-white mb-4">
                The Future of
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> Civic Accountability</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Where government officials and citizens unite through blockchain-verified environmental commitments.
                Track progress, earn rewards, and build a sustainable future together.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
                <OracleDataDisplay />

                <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
                  <div className="text-3xl mb-3">💰</div>
                  <h3 className="text-purple-400 font-semibold mb-2">ETH Rewards</h3>
                  <p className="text-gray-300 text-sm">Earn ETH for achieving environmental commitments</p>
                  <div className="mt-3 text-xs text-purple-300">
                    <p>💎 ETH rewards pool available</p>
                    <p>🏆 150% ETH stake return</p>
                    <p>📈 Instant reward distribution</p>
                  </div>
                </div>

                <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-pink-500/20 p-6">
                  <div className="text-3xl mb-3">🔗</div>
                  <h3 className="text-pink-400 font-semibold mb-2">Blockchain Verified</h3>
                  <p className="text-gray-300 text-sm">Immutable commitments with smart contract enforcement</p>
                  <div className="mt-3 text-xs text-pink-300">
                    <p>⚡ Instant verification</p>
                    <p>🛡️ Tamper-proof records</p>
                    <p>🌐 Decentralized governance</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <button
                  onClick={() => connect({ connector: injected() })}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105"
                >
                  🚀 Launch Dashboard
                </button>
                <p className="mt-4 text-sm text-gray-400">
                  Connect to localhost:8545 • Chain ID: 31337 • Ready to claim rewards!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Cyberpunk Header */}
      <nav className="bg-black/40 backdrop-blur-xl border-b border-cyan-500/30 shadow-lg shadow-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">C</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  CivicXChain
                </h1>
              </div>
              <span className="ml-4 px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-400 text-xs font-medium rounded-full">
                🟢 LIVE
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-xs text-cyan-400/70">
                Chain: {chainId === 11155111 ? 'Sepolia ✅' : `${chainId} ❌`}
              </div>
              <div className="text-sm text-cyan-400">
                <span className="font-medium">Connected:</span> {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
              <button
                onClick={() => {
                  console.log('🔍 Connection Debug:', {
                    chainId,
                    isConnected,
                    address,
                    expectedChainId: 11155111,
                    isCorrectNetwork: chainId === 11155111
                  });
                }}
                className="text-xs text-yellow-400 underline"
              >
                Debug
              </button>
              <button
                onClick={() => disconnect()}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 px-3 py-1 rounded-lg text-sm transition-all duration-300"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CyberpunkDashboard />
      </main>
    </div>
  );
}
