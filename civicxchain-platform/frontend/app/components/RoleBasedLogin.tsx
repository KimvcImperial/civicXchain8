'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export type UserRole = 'public_official' | 'citizen' | 'judge' | null;

interface RoleBasedLoginProps {
  onRoleSelected: (role: UserRole) => void;
  currentRole: UserRole;
}

// Mock role registry - in production, this would be stored in smart contracts or a secure database
const ROLE_REGISTRY: Record<string, UserRole> = {
  // Public Officials (can create commitments)
  '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266': 'public_official', // Default Hardhat account 0
  '0x70997970c51812dc3a010c7d01b50e0d17dc79c8': 'public_official', // Default Hardhat account 1
  
  // Judges (can manually verify)
  '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc': 'judge', // Default Hardhat account 2
  '0x90f79bf6eb2c4f870365e785982e1f101e93b906': 'judge', // Default Hardhat account 3
  
  // Citizens (can view and monitor) - any other address defaults to citizen
};

export default function RoleBasedLogin({ onRoleSelected, currentRole }: RoleBasedLoginProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  // Determine user role based on wallet address
  useEffect(() => {
    if (isConnected && address) {
      const role = ROLE_REGISTRY[address.toLowerCase()] || 'citizen';
      setSelectedRole(role);
      onRoleSelected(role);
    } else {
      setSelectedRole(null);
      onRoleSelected(null);
    }
  }, [address, isConnected, onRoleSelected]);

  const handleRoleLogin = (role: UserRole) => {
    if (!isConnected) {
      // Connect wallet first
      const injectedConnector = connectors.find(c => c.name === 'MetaMask' || c.name === 'Injected');
      if (injectedConnector) {
        connect({ connector: injectedConnector });
      }
    }
  };

  const handleLogout = () => {
    disconnect();
    setSelectedRole(null);
    onRoleSelected(null);
  };

  if (isConnected && currentRole) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 border border-purple-500 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">
              {currentRole === 'public_official' && '🏛️'}
              {currentRole === 'judge' && '⚖️'}
              {currentRole === 'citizen' && '👥'}
            </div>
            <div>
              <div className="text-white font-semibold">
                {currentRole === 'public_official' && 'Public Official Portal'}
                {currentRole === 'judge' && 'Judge Panel Access'}
                {currentRole === 'citizen' && 'Citizen Monitoring Portal'}
              </div>
              <div className="text-gray-400 text-sm">
                Connected: {address?.slice(0, 8)}...{address?.slice(-6)}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🌍 CivicXChain
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Environmental Accountability Platform
          </p>
          <p className="text-gray-400">
            Binding public officials to environmental commitments through blockchain technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Public Official Login */}
          <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-blue-500/30 p-8 hover:border-blue-400/50 transition-all duration-300 group">
            <div className="text-center">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                🏛️
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Public Officials
              </h3>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                Create environmental commitments, stake tokens, and be held accountable for your promises to the public.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-400">
                  <span className="text-green-400 mr-2">✓</span>
                  Create commitments
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="text-green-400 mr-2">✓</span>
                  Stake CIVIC tokens
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="text-green-400 mr-2">✓</span>
                  Track progress
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="text-green-400 mr-2">✓</span>
                  Claim rewards
                </div>
              </div>

              <button
                onClick={() => handleRoleLogin('public_official')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
              >
                {isConnected ? 'Access Official Portal' : 'Connect as Official'}
              </button>
            </div>
          </div>

          {/* Citizen Login */}
          <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-green-500/30 p-8 hover:border-green-400/50 transition-all duration-300 group">
            <div className="text-center">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                👥
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Citizens
              </h3>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                Monitor public officials' environmental commitments and hold them accountable through transparency.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-400">
                  <span className="text-green-400 mr-2">✓</span>
                  View all commitments
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="text-green-400 mr-2">✓</span>
                  Monitor progress
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="text-green-400 mr-2">✓</span>
                  Track environmental data
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="text-green-400 mr-2">✓</span>
                  Public transparency
                </div>
              </div>

              <button
                onClick={() => handleRoleLogin('citizen')}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25"
              >
                {isConnected ? 'Access Citizen Portal' : 'Connect as Citizen'}
              </button>
            </div>
          </div>

          {/* Judge Login */}
          <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-purple-500/30 p-8 hover:border-purple-400/50 transition-all duration-300 group">
            <div className="text-center">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                ⚖️
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Judges
              </h3>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                Manually verify disputed commitments and ensure fair evaluation when automatic systems need oversight.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-400">
                  <span className="text-green-400 mr-2">✓</span>
                  Manual verification
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="text-green-400 mr-2">✓</span>
                  Dispute resolution
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="text-green-400 mr-2">✓</span>
                  Reward authorization
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="text-green-400 mr-2">✓</span>
                  System oversight
                </div>
              </div>

              <button
                onClick={() => handleRoleLogin('judge')}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                {isConnected ? 'Access Judge Panel' : 'Connect as Judge'}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            🔒 Secure blockchain-based authentication • 🌱 Environmental transparency • ⚡ Real-time verification
          </p>
        </div>
      </div>
    </div>
  );
}
