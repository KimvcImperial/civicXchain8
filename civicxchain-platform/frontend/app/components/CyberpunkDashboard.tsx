'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CONTRACT_CONFIG } from '../../config/contracts';

// Use the actual deployed contract ABI
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
    "name": "getCurrentCommitmentId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_official", "type": "address"}],
    "name": "getOfficialCommitments",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_commitmentId", "type": "uint256"},
      {"internalType": "uint256", "name": "_actualValue", "type": "uint256"}
    ],
    "name": "updateProgress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_commitmentId", "type": "uint256"}],
    "name": "claimReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Mock Aggregator ABI for reading oracle data
const MOCK_AGGREGATOR_ABI = [
  {
    "inputs": [],
    "name": "latestRoundData",
    "outputs": [
      {"internalType": "uint80", "name": "roundId", "type": "uint80"},
      {"internalType": "int256", "name": "answer", "type": "int256"},
      {"internalType": "uint256", "name": "startedAt", "type": "uint256"},
      {"internalType": "uint256", "name": "updatedAt", "type": "uint256"},
      {"internalType": "uint80", "name": "answeredInRound", "type": "uint80"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export default function CyberpunkDashboard() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [activeTab, setActiveTab] = useState('feed');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [newCommitment, setNewCommitment] = useState({
    title: '',
    description: '',
    officialName: '',
    officialRole: '',
    targetValue: '',
    deadline: '',
    metricType: 'pm25',
    stakeAmount: '0.1'
  });

  // Read contract data with refetch capability
  const { data: currentCommitmentId, refetch: refetchCommitmentId } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: GOVERNANCE_ABI,
    functionName: 'getCurrentCommitmentId',
  });

  const { data: userCommitments, refetch: refetchUserCommitments } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: GOVERNANCE_ABI,
    functionName: 'getOfficialCommitments',
    args: [address as `0x${string}`],
  });

  // Get the latest commitment (if any exist)
  const latestCommitmentId = currentCommitmentId && currentCommitmentId > 0n ? currentCommitmentId : null;

  const { data: latestCommitment, refetch: refetchLatestCommitment } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: GOVERNANCE_ABI,
    functionName: 'getCommitment',
    args: latestCommitmentId ? [latestCommitmentId] : undefined,
    query: {
      enabled: !!latestCommitmentId,
    },
  });

  // Read oracle data with periodic refresh and error handling
  const { data: pm25Data, error: pm25Error, refetch: refetchPM25, isLoading: pm25Loading } = useReadContract({
    address: CONTRACT_CONFIG.PM25_ORACLE as `0x${string}`,
    abi: MOCK_AGGREGATOR_ABI,
    functionName: 'latestRoundData',
  });

  const { data: co2Data, error: co2Error, refetch: refetchCO2, isLoading: co2Loading } = useReadContract({
    address: CONTRACT_CONFIG.CO2_ORACLE as `0x${string}`,
    abi: MOCK_AGGREGATOR_ABI,
    functionName: 'latestRoundData',
  });

  const { data: forestData, error: forestError, refetch: refetchForest, isLoading: forestLoading } = useReadContract({
    address: CONTRACT_CONFIG.FOREST_ORACLE as `0x${string}`,
    abi: MOCK_AGGREGATOR_ABI,
    functionName: 'latestRoundData',
  });

  // Write contract functions
  const { writeContract: createCommitment, data: createHash, error: createError } = useWriteContract();
  const { writeContract: claimReward, data: claimHash, error: claimError } = useWriteContract();
  
  const { isLoading: isCreateConfirming, isSuccess: isCreateConfirmed } = useWaitForTransactionReceipt({
    hash: createHash,
  });
  
  const { isLoading: isClaimConfirming, isSuccess: isClaimConfirmed } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // Refresh oracle data to simulate live updates
      refetchPM25();
      refetchCO2();
      refetchForest();
      // Also refresh commitment data
      refetchCommitmentId();
      refetchLatestCommitment();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetchPM25, refetchCO2, refetchForest, refetchCommitmentId, refetchLatestCommitment]);

  // Handle successful commitment creation
  useEffect(() => {
    if (isCreateConfirmed) {
      alert('🎉 Commitment created successfully! Check the Track Status tab to see your new commitment.');
      // Clear the form
      setNewCommitment({
        title: '',
        description: '',
        officialName: '',
        officialRole: '',
        targetValue: '',
        deadline: '',
        metricType: 'pm25',
        stakeAmount: '0.1'
      });
      // Refetch contract data to show the new commitment
      setTimeout(() => {
        refetchCommitmentId();
        refetchUserCommitments();
        refetchLatestCommitment();
      }, 2000); // Wait 2 seconds for blockchain to update
      // Switch to track tab to show the new commitment
      setActiveTab('track');
    }
  }, [isCreateConfirmed, refetchCommitmentId, refetchUserCommitments, refetchLatestCommitment]);

  // Handle commitment creation errors
  useEffect(() => {
    if (createError) {
      console.error('Create commitment error:', createError);
      alert('❌ Error creating commitment: ' + createError.message);
    }
  }, [createError]);

  const handleCreateCommitment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!newCommitment.title || !newCommitment.description || !newCommitment.officialName ||
        !newCommitment.officialRole || !newCommitment.targetValue || !newCommitment.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const deadlineTimestamp = Math.floor(new Date(newCommitment.deadline).getTime() / 1000);
      const targetValueScaled = Math.floor(parseFloat(newCommitment.targetValue) * 100);
      const stakeAmountWei = parseEther(newCommitment.stakeAmount);

      console.log('Creating commitment with:', {
        title: newCommitment.title,
        description: newCommitment.description,
        officialName: newCommitment.officialName,
        officialRole: newCommitment.officialRole,
        targetValue: targetValueScaled,
        deadline: deadlineTimestamp,
        metricType: newCommitment.metricType,
        stakeAmount: newCommitment.stakeAmount + ' ETH'
      });

      createCommitment({
        address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
        abi: GOVERNANCE_ABI,
        functionName: 'createCommitment',
        args: [
          newCommitment.title,
          newCommitment.description,
          newCommitment.officialName,
          newCommitment.officialRole,
          BigInt(targetValueScaled),
          BigInt(deadlineTimestamp),
          newCommitment.metricType
        ],
        value: stakeAmountWei,
      });
    } catch (err) {
      console.error('Error creating commitment:', err);
      alert('Error creating commitment: ' + (err as Error).message);
    }
  };

  const handleClaimReward = async () => {
    if (!latestCommitmentId) return;

    try {
      claimReward({
        address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
        abi: GOVERNANCE_ABI,
        functionName: 'claimReward',
        args: [latestCommitmentId],
      });
    } catch (err) {
      console.error('Error claiming reward:', err);
    }
  };

  // Process oracle data - ONLY show real data, no fallbacks
  const pm25Value = pm25Data ? Number(pm25Data[1]) / 100 : null;
  const co2Value = co2Data ? Number(co2Data[1]) / 100 : null;
  const forestValue = forestData ? Number(forestData[1]) / 100 : null;

  // Enhanced debug oracle data with errors and loading states
  console.log('🔍 Oracle Data Debug:', {
    pm25: {
      data: pm25Data,
      error: pm25Error?.message,
      loading: pm25Loading,
      value: pm25Value,
      formatted: pm25Value !== null ? `${pm25Value.toFixed(2)} μg/m³` : 'No Data'
    },
    co2: {
      data: co2Data,
      error: co2Error?.message,
      loading: co2Loading,
      value: co2Value,
      formatted: co2Value !== null ? `${co2Value.toFixed(1)} ppm` : 'No Data'
    },
    forest: {
      data: forestData,
      error: forestError?.message,
      loading: forestLoading,
      value: forestValue,
      formatted: forestValue !== null ? `${forestValue.toFixed(1)}%` : 'No Data'
    },
    contractAddresses: {
      PM25_ORACLE: CONTRACT_CONFIG.PM25_ORACLE,
      CO2_ORACLE: CONTRACT_CONFIG.CO2_ORACLE,
      FOREST_ORACLE: CONTRACT_CONFIG.FOREST_ORACLE
    },
    account: address,
    chainId: chainId
  });

  // Alert if oracle data is not loading
  useEffect(() => {
    if (!pm25Data && !co2Data && !forestData && !pm25Loading && !co2Loading && !forestLoading) {
      console.warn('⚠️ Oracle data not loading - check contract addresses and network connection');
      console.warn('Errors:', { pm25Error, co2Error, forestError });
    }
  }, [pm25Data, co2Data, forestData, pm25Loading, co2Loading, forestLoading, pm25Error, co2Error, forestError]);

  // Test oracle contracts manually on component mount
  useEffect(() => {
    const testOracleContracts = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          console.log('🧪 Testing oracle contracts manually...');
          const { createPublicClient, http } = await import('viem');

          const client = createPublicClient({
            transport: http('http://127.0.0.1:8545')
          });

          // Test PM2.5 Oracle
          try {
            const pm25Result = await client.readContract({
              address: CONTRACT_CONFIG.PM25_ORACLE as `0x${string}`,
              abi: MOCK_AGGREGATOR_ABI,
              functionName: 'latestRoundData',
            });
            console.log('✅ PM2.5 Oracle manual test:', pm25Result);
          } catch (error) {
            console.error('❌ PM2.5 Oracle manual test failed:', error);
          }

          // Test CO2 Oracle
          try {
            const co2Result = await client.readContract({
              address: CONTRACT_CONFIG.CO2_ORACLE as `0x${string}`,
              abi: MOCK_AGGREGATOR_ABI,
              functionName: 'latestRoundData',
            });
            console.log('✅ CO2 Oracle manual test:', co2Result);
          } catch (error) {
            console.error('❌ CO2 Oracle manual test failed:', error);
          }

          // Test Forest Oracle
          try {
            const forestResult = await client.readContract({
              address: CONTRACT_CONFIG.FOREST_ORACLE as `0x${string}`,
              abi: MOCK_AGGREGATOR_ABI,
              functionName: 'latestRoundData',
            });
            console.log('✅ Forest Oracle manual test:', forestResult);
          } catch (error) {
            console.error('❌ Forest Oracle manual test failed:', error);
          }

        } catch (error) {
          console.error('❌ Manual oracle test setup failed:', error);
        }
      }
    };

    testOracleContracts();
  }, []);

  // Mock token balance for now (since current contract doesn't have token functionality)
  const balance = userCommitments && userCommitments.length > 0 ? '150' : '0';

  const tabs = [
    { id: 'feed', name: 'Live Feed', icon: '📡' },
    { id: 'create', name: 'Create', icon: '➕' },
    { id: 'track', name: 'Track Status', icon: '📊' },
    { id: 'rewards', name: 'Rewards', icon: '💰' },
    { id: 'punishments', name: 'Penalties', icon: '⚠️' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <p className="text-cyan-400 text-sm font-medium">PM2.5 Levels</p>
                {pm25Value !== null ? (
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Live Oracle Data"></span>
                ) : (
                  <span className="w-2 h-2 bg-red-400 rounded-full" title="No Data"></span>
                )}
              </div>
              <p className="text-2xl font-bold text-white">
                {pm25Value !== null ? pm25Value.toFixed(2) : '--'}
              </p>
              <p className="text-cyan-300 text-xs">
                μg/m³ {pm25Value !== null ? '(Live)' : '(No Data)'}
              </p>
            </div>
            <div className="text-2xl">🏭</div>
          </div>
          {pm25Value !== null && (
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full" style={{width: `${Math.min(pm25Value * 4, 100)}%`}}></div>
            </div>
          )}
        </div>

        <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <p className="text-purple-400 text-sm font-medium">CO2 Levels</p>
                {co2Value !== null ? (
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Live Oracle Data"></span>
                ) : (
                  <span className="w-2 h-2 bg-red-400 rounded-full" title="No Data"></span>
                )}
              </div>
              <p className="text-2xl font-bold text-white">
                {co2Value !== null ? co2Value.toFixed(1) : '--'}
              </p>
              <p className="text-purple-300 text-xs">
                ppm {co2Value !== null ? '(Live)' : '(No Data)'}
              </p>
            </div>
            <div className="text-2xl">🌍</div>
          </div>
          {co2Value !== null && (
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full" style={{width: `${Math.min((co2Value - 300) / 2, 100)}%`}}></div>
            </div>
          )}
        </div>

        <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-green-500/20 p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <p className="text-green-400 text-sm font-medium">Forest Cover</p>
                {forestValue !== null ? (
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Live Oracle Data"></span>
                ) : (
                  <span className="w-2 h-2 bg-red-400 rounded-full" title="No Data"></span>
                )}
              </div>
              <p className="text-2xl font-bold text-white">
                {forestValue !== null ? forestValue.toFixed(1) : '--'}
              </p>
              <p className="text-green-300 text-xs">
                % {forestValue !== null ? '(Live)' : '(No Data)'}
              </p>
            </div>
            <div className="text-2xl">🌳</div>
          </div>
          {forestValue !== null && (
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" style={{width: `${forestValue}%`}}></div>
            </div>
          )}
        </div>

        <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-yellow-500/20 p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 text-sm font-medium">CIVIC Tokens</p>
              <p className="text-2xl font-bold text-white">{parseFloat(balance).toFixed(0)}</p>
              <p className="text-yellow-300 text-xs">Balance</p>
            </div>
            <div className="text-2xl">💰</div>
          </div>
          <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" style={{width: `${Math.min(parseFloat(balance) / 10, 100)}%`}}></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 shadow-2xl">
        <div className="border-b border-cyan-500/20">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-400/25'
                    : 'border-transparent text-gray-400 hover:text-cyan-300 hover:border-cyan-500/50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'feed' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
                  Live Environmental Feed
                </h3>
                <div className="text-sm text-gray-400">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              </div>

              {/* Real-time Oracle Data Stream */}
              <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
                <h4 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center">
                  🌐 Live Oracle Data Stream
                  <span className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-cyan-300 text-sm font-medium">🏭 PM2.5 Air Quality</span>
                      <span className="text-xs text-green-400">
                        {pm25Loading ? 'LOADING...' : pm25Value !== null ? 'LIVE' : 'NO DATA'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {pm25Loading ? '...' : pm25Value !== null ? `${pm25Value.toFixed(2)} μg/m³` : 'No Data'}
                    </div>
                    <div className="text-xs text-cyan-300">
                      {pm25Value !== null ? (pm25Value < 10 ? '✅ Good Air Quality' : pm25Value < 25 ? '⚠️ Moderate' : '❌ Unhealthy') : 'Oracle not connected'}
                    </div>
                    {pm25Value !== null && (
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1 rounded-full" style={{width: `${Math.min(pm25Value * 4, 100)}%`}}></div>
                      </div>
                    )}
                  </div>

                  <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-purple-300 text-sm font-medium">🌍 CO2 Emissions</span>
                      <span className="text-xs text-green-400">
                        {co2Loading ? 'LOADING...' : co2Value !== null ? 'LIVE' : 'NO DATA'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {co2Loading ? '...' : co2Value !== null ? `${co2Value.toFixed(1)} ppm` : 'No Data'}
                    </div>
                    <div className="text-xs text-purple-300">
                      {co2Value !== null ? (co2Value < 400 ? '✅ Below Target' : co2Value < 450 ? '⚠️ Elevated' : '❌ Critical') : 'Oracle not connected'}
                    </div>
                    {co2Value !== null && (
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                        <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-1 rounded-full" style={{width: `${Math.min((co2Value - 300) / 2, 100)}%`}}></div>
                      </div>
                    )}
                  </div>

                  <div className="bg-black/30 rounded-lg p-4 border border-green-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-green-300 text-sm font-medium">🌳 Forest Coverage</span>
                      <span className="text-xs text-green-400">
                        {forestLoading ? 'LOADING...' : forestValue !== null ? 'LIVE' : 'NO DATA'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {forestLoading ? '...' : forestValue !== null ? `${forestValue.toFixed(1)}%` : 'No Data'}
                    </div>
                    <div className="text-xs text-green-300">
                      {forestValue !== null ? (forestValue > 70 ? '✅ Excellent' : forestValue > 50 ? '⚠️ Moderate' : '❌ Critical') : 'Oracle not connected'}
                    </div>
                    {forestValue !== null && (
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                        <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-1 rounded-full" style={{width: `${forestValue}%`}}></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-400 text-center">
                  Data sourced from Chainlink Oracle Network • Updates every 30 seconds
                </div>
              </div>

              {/* Active Commitments */}
              <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6">
                <h4 className="text-lg font-semibold text-purple-400 mb-4 flex items-center">
                  📋 Active Environmental Commitments
                </h4>

                {latestCommitment ? (
                  <div className="space-y-4">
                    <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/20">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h5 className="text-lg font-semibold text-white">{latestCommitment[2] || 'Environmental Commitment'}</h5>
                          <p className="text-purple-400 text-sm">{latestCommitment[7] || 'Official'}</p>
                          <p className="text-gray-400 text-xs mt-1">Metric: {latestCommitment[6] || 'pm25'}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {latestCommitment[8] ? (
                            <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-400 text-sm font-medium rounded-full">
                              ✅ Target Achieved
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 text-sm font-medium rounded-full">
                              ⏳ In Progress
                            </span>
                          )}
                          <div className="text-xs text-gray-400">
                            ID: #{latestCommitment[0]?.toString() || '1'}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Target Value</p>
                          <p className="text-cyan-400 font-medium">
                            {latestCommitment[4] ? Number(latestCommitment[4]).toFixed(2) : '25.00'}
                            {latestCommitment[6] === 'pm25' ? ' μg/m³' : latestCommitment[6] === 'co2' ? ' ppm' : '%'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Current Value</p>
                          <p className="text-white font-medium">
                            {latestCommitment[6] === 'pm25' ? pm25Value.toFixed(2) + ' μg/m³' :
                             latestCommitment[6] === 'co2' ? co2Value.toFixed(1) + ' ppm' :
                             forestValue.toFixed(1) + '%'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Deadline</p>
                          <p className="text-white font-medium">{latestCommitment[3] ? new Date(Number(latestCommitment[3]) * 1000).toLocaleDateString() : 'Dec 31, 2024'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Reward</p>
                          <p className="text-yellow-400 font-medium">150 CIVIC</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Progress to Target</span>
                          <span>
                            {latestCommitment[8] ? '100%' : '75%'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              latestCommitment[8] ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-cyan-400 to-purple-500'
                            }`}
                            style={{
                              width: latestCommitment[8] ? '100%' : '75%'
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-4 text-sm">
                          <div>
                            <span className="text-gray-400">Created: </span>
                            <span className="text-cyan-400">{latestCommitment[10] ? new Date(Number(latestCommitment[10]) * 1000).toLocaleDateString() : 'Unknown'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Days Left: </span>
                            <span className="text-white">
                              {latestCommitment[3] ? Math.max(0, Math.ceil((Number(latestCommitment[3]) * 1000 - Date.now()) / (1000 * 60 * 60 * 24))) : 45}
                            </span>
                          </div>
                        </div>

                        {latestCommitment[8] && !latestCommitment[9] && (
                          <button
                            onClick={handleClaimReward}
                            disabled={isClaimConfirming}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25 disabled:opacity-50"
                          >
                            {isClaimConfirming ? (
                              <span className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Claiming...
                              </span>
                            ) : (
                              '🏆 Claim Reward'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🌱</div>
                    <p className="text-gray-400 mb-2">No active commitments</p>
                    <p className="text-sm text-gray-500">Create your first environmental commitment to get started</p>
                  </div>
                )}
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
                <h4 className="text-lg font-semibold text-cyan-400 mb-4">📈 Recent Activity</h4>
                <div className="space-y-3">
                  {/* Only show oracle data if we have real data */}
                  {(pm25Value !== null || co2Value !== null || forestValue !== null) && (
                    <div className="bg-black/30 rounded-lg p-3 border border-green-500/20">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-green-400 text-sm">Oracle Data Updated</span>
                        </div>
                        <span className="text-gray-400 text-xs">{lastUpdated.toLocaleTimeString()}</span>
                      </div>
                      <p className="text-gray-300 text-xs mt-1 ml-5">
                        {pm25Value !== null && `PM2.5: ${pm25Value.toFixed(2)} μg/m³`}
                        {pm25Value !== null && co2Value !== null && ' • '}
                        {co2Value !== null && `CO2: ${co2Value.toFixed(1)} ppm`}
                        {(pm25Value !== null || co2Value !== null) && forestValue !== null && ' • '}
                        {forestValue !== null && `Forest: ${forestValue.toFixed(1)}%`}
                      </p>
                    </div>
                  )}

                  {latestCommitment && (
                    <div className="bg-black/30 rounded-lg p-3 border border-purple-500/20">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span className="text-purple-400 text-sm">Commitment Active</span>
                        </div>
                        <span className="text-gray-400 text-xs">Monitoring</span>
                      </div>
                      <p className="text-gray-300 text-xs mt-1 ml-5">{latestCommitment[2] || 'Environmental Commitment'} - Progress tracking enabled</p>
                    </div>
                  )}

                  <div className="bg-black/30 rounded-lg p-3 border border-cyan-500/20">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <span className="text-cyan-400 text-sm">System Status</span>
                      </div>
                      <span className="text-green-400 text-xs">
                        {(pm25Value !== null || co2Value !== null || forestValue !== null) ? '✅ Online' : '⚠️ Connecting...'}
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs mt-1 ml-5">
                      {(pm25Value !== null || co2Value !== null || forestValue !== null)
                        ? 'All systems operational • Blockchain connected • Oracles active'
                        : 'Connecting to blockchain • Initializing oracles...'}
                    </p>
                  </div>

                  {/* Show message if no oracle data */}
                  {pm25Value === null && co2Value === null && forestValue === null && (
                    <div className="bg-black/30 rounded-lg p-3 border border-yellow-500/20">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                          <span className="text-yellow-400 text-sm">Waiting for Oracle Data</span>
                        </div>
                        <span className="text-gray-400 text-xs">Initializing...</span>
                      </div>
                      <p className="text-gray-300 text-xs mt-1 ml-5">Connecting to Chainlink oracles for real-time environmental data</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl text-white mb-6 flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
                Create Environmental Commitment
              </h3>
              
              <form onSubmit={handleCreateCommitment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-400 text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      required
                      value={newCommitment.title}
                      onChange={(e) => setNewCommitment({...newCommitment, title: e.target.value})}
                      className="w-full bg-black/50 border border-cyan-500/30 rounded-lg p-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      placeholder="Environmental commitment title"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-400 text-sm font-medium mb-2">Metric Type</label>
                    <select
                      value={newCommitment.metricType}
                      onChange={(e) => setNewCommitment({...newCommitment, metricType: e.target.value})}
                      className="w-full bg-black/50 border border-cyan-500/30 rounded-lg p-3 text-white focus:border-cyan-400"
                    >
                      <option value="pm25">🏭 PM2.5 Air Quality</option>
                      <option value="co2">🌍 CO2 Emissions</option>
                      <option value="forest_cover">🌳 Forest Cover</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-cyan-400 text-sm font-medium mb-2">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={newCommitment.description}
                    onChange={(e) => setNewCommitment({...newCommitment, description: e.target.value})}
                    className="w-full bg-black/50 border border-cyan-500/30 rounded-lg p-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                    placeholder="Describe your environmental commitment..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-400 text-sm font-medium mb-2">Official Name</label>
                    <input
                      type="text"
                      required
                      value={newCommitment.officialName}
                      onChange={(e) => setNewCommitment({...newCommitment, officialName: e.target.value})}
                      className="w-full bg-black/50 border border-cyan-500/30 rounded-lg p-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-400 text-sm font-medium mb-2">Role</label>
                    <input
                      type="text"
                      required
                      value={newCommitment.officialRole}
                      onChange={(e) => setNewCommitment({...newCommitment, officialRole: e.target.value})}
                      className="w-full bg-black/50 border border-cyan-500/30 rounded-lg p-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      placeholder="Your role/position"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-cyan-400 text-sm font-medium mb-2">Target Value</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newCommitment.targetValue}
                      onChange={(e) => setNewCommitment({...newCommitment, targetValue: e.target.value})}
                      className="w-full bg-black/50 border border-cyan-500/30 rounded-lg p-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      placeholder="Target value"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-400 text-sm font-medium mb-2">Deadline</label>
                    <input
                      type="date"
                      required
                      value={newCommitment.deadline}
                      onChange={(e) => setNewCommitment({...newCommitment, deadline: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-black/50 border border-cyan-500/30 rounded-lg p-3 text-white focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-400 text-sm font-medium mb-2">Stake (ETH)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={newCommitment.stakeAmount}
                      onChange={(e) => setNewCommitment({...newCommitment, stakeAmount: e.target.value})}
                      className="w-full bg-black/50 border border-cyan-500/30 rounded-lg p-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      placeholder="0.1"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreateConfirming}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50"
                >
                  {isCreateConfirming ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Commitment...
                    </span>
                  ) : (
                    '🚀 Create Commitment'
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'track' && (
            <div className="space-y-6">
              <h3 className="text-xl text-white mb-6 flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
                Commitment Status Tracker
              </h3>

              {/* Real-time Oracle Data Display */}
              <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
                <h4 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center">
                  🌐 Live Oracle Data Feed
                  <span className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-cyan-300 text-sm">PM2.5 Air Quality</span>
                      <span className="text-xs text-gray-400">Updated: {lastUpdated.toLocaleTimeString()}</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{pm25Value.toFixed(2)} μg/m³</div>
                    <div className="text-xs text-cyan-300 mt-1">
                      {pm25Value < 10 ? '✅ Good' : pm25Value < 25 ? '⚠️ Moderate' : '❌ Unhealthy'}
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-purple-300 text-sm">CO2 Emissions</span>
                      <span className="text-xs text-gray-400">Updated: {lastUpdated.toLocaleTimeString()}</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{co2Value.toFixed(1)} ppm</div>
                    <div className="text-xs text-purple-300 mt-1">
                      {co2Value < 400 ? '✅ Good' : co2Value < 450 ? '⚠️ Elevated' : '❌ High'}
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4 border border-green-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-green-300 text-sm">Forest Coverage</span>
                      <span className="text-xs text-gray-400">Updated: {lastUpdated.toLocaleTimeString()}</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{forestValue.toFixed(1)}%</div>
                    <div className="text-xs text-green-300 mt-1">
                      {forestValue > 70 ? '✅ Excellent' : forestValue > 50 ? '⚠️ Moderate' : '❌ Critical'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Commitment Progress Tracking */}
              <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6">
                <h4 className="text-lg font-semibold text-purple-400 mb-4">📊 Active Commitments Progress</h4>

                {latestCommitment ? (
                  <div className="space-y-4">
                    <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/20">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h5 className="text-white font-medium">{latestCommitment[2] || 'Environmental Commitment'}</h5>
                          <p className="text-gray-400 text-sm">{latestCommitment[7] || 'Official'}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Deadline</div>
                          <div className="text-white text-sm">
                            {latestCommitment[3] ? new Date(Number(latestCommitment[3]) * 1000).toLocaleDateString() : 'Dec 31, 2024'}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-gray-400">Target Value</div>
                          <div className="text-cyan-400 font-medium">
                            {latestCommitment[4] ? Number(latestCommitment[4]).toFixed(2) : '25.00'}
                            {latestCommitment[6] === 'pm25' ? ' μg/m³' : latestCommitment[6] === 'co2' ? ' ppm' : '%'}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Current Value</div>
                          <div className="text-white font-medium">
                            {latestCommitment[6] === 'pm25' ? pm25Value.toFixed(2) + ' μg/m³' :
                             latestCommitment[6] === 'co2' ? co2Value.toFixed(1) + ' ppm' :
                             forestValue.toFixed(1) + '%'}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Progress to Target</span>
                          <span className="text-cyan-400">
                            {latestCommitment[8] ? '100%' : '75%'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              latestCommitment[8] ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-cyan-400 to-purple-500'
                            }`}
                            style={{
                              width: latestCommitment[8] ? '100%' : '75%'
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="text-gray-400">Status: </span>
                          {latestCommitment[8] ? (
                            <span className="text-green-400 font-medium">✅ Target Achieved</span>
                          ) : (
                            <span className="text-yellow-400 font-medium">⏳ In Progress</span>
                          )}
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-400">Reward: </span>
                          <span className="text-yellow-400 font-medium">150 CIVIC</span>
                        </div>
                      </div>

                      {/* Debug info */}
                      <div className="mt-4 p-2 bg-gray-800/50 rounded text-xs text-gray-400">
                        <div>Commitment ID: {latestCommitment[0]?.toString()}</div>
                        <div>Created: {latestCommitment[10] ? new Date(Number(latestCommitment[10]) * 1000).toLocaleString() : 'Unknown'}</div>
                        <div>Metric Type: {latestCommitment[6]}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📊</div>
                    <p className="text-gray-400">No active commitments found</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {currentCommitmentId ? `Current commitment ID: ${currentCommitmentId.toString()}` : 'Create a commitment to start tracking progress'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <h3 className="text-xl text-white mb-6 flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
                CIVIC Rewards & Claims
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Balance */}
                <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-yellow-500/30 p-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">💰</div>
                    <div className="space-y-2">
                      <p className="text-yellow-400 text-sm">Current Balance</p>
                      <p className="text-3xl font-bold text-white">{parseFloat(balance).toFixed(2)}</p>
                      <p className="text-yellow-300 text-sm">CIVIC Tokens</p>
                    </div>

                    {parseFloat(balance) > 0 && (
                      <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <p className="text-green-400 text-xs mb-1">Estimated Value</p>
                        <p className="text-lg font-semibold text-green-300">
                          ~${(parseFloat(balance) * 0.1).toFixed(2)} USD
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Claimable Rewards */}
                <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-green-500/30 p-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🏆</div>
                    <div className="space-y-2">
                      <p className="text-green-400 text-sm">Available to Claim</p>
                      <p className="text-3xl font-bold text-white">
                        {latestCommitment && latestCommitment[8] && !latestCommitment[9] ? '150' : '0'}
                      </p>
                      <p className="text-green-300 text-sm">CIVIC Tokens</p>
                    </div>

                    {latestCommitment && latestCommitment[8] && !latestCommitment[9] && (
                      <button
                        onClick={handleClaimReward}
                        disabled={isClaimConfirming}
                        className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25 disabled:opacity-50"
                      >
                        {isClaimConfirming ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Claiming...
                          </span>
                        ) : (
                          '🎉 Claim Reward'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Reward History */}
              <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
                <h4 className="text-lg font-semibold text-cyan-400 mb-4">📈 Reward History</h4>
                <div className="space-y-3">
                  {parseFloat(balance) > 0 ? (
                    <div className="bg-black/30 rounded-lg p-4 border border-green-500/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-white font-medium">Environmental Achievement</div>
                          <div className="text-green-400 text-sm">PM2.5 Reduction Target Met</div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-bold">+{balance} CIVIC</div>
                          <div className="text-gray-400 text-xs">{new Date().toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="text-3xl mb-2">🎯</div>
                      <p className="text-gray-400">No rewards claimed yet</p>
                      <p className="text-sm text-gray-500 mt-1">Complete commitments to earn CIVIC tokens</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'punishments' && (
            <div className="space-y-6">
              <h3 className="text-xl text-white mb-6 flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-3 animate-pulse"></span>
                Penalty System & Enforcement
              </h3>

              {/* Penalty Overview */}
              <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-red-500/30 p-6">
                <h4 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
                  ⚠️ Smart Contract Enforcement
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <h5 className="text-red-400 font-medium mb-2">Automatic Penalties</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Stake forfeiture for missed deadlines</li>
                        <li>• Progressive penalties for repeated failures</li>
                        <li>• Public accountability records</li>
                        <li>• Reduced future staking power</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <h5 className="text-yellow-400 font-medium mb-2">Warning System</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• 30-day deadline reminders</li>
                        <li>• Progress milestone alerts</li>
                        <li>• Oracle data threshold warnings</li>
                        <li>• Community notification system</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-black/30 rounded-lg p-4 border border-gray-500/20">
                      <h5 className="text-gray-300 font-medium mb-3">Current Status</h5>
                      {latestCommitment ? (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Days Remaining:</span>
                            <span className="text-white text-sm">
                              {latestCommitment[3] ? Math.max(0, Math.ceil((Number(latestCommitment[3]) * 1000 - Date.now()) / (1000 * 60 * 60 * 24))) : 45} days
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Commitment ID:</span>
                            <span className="text-yellow-400 text-sm">#{latestCommitment[0]?.toString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Penalty Status:</span>
                            <span className="text-green-400 text-sm">
                              {latestCommitment[8] ? '✅ No Penalty' : '⏳ Monitoring'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">No active commitments</p>
                      )}
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                      <h5 className="text-purple-400 font-medium mb-2">Governance Features</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Community voting on penalties</li>
                        <li>• Appeal process for disputes</li>
                        <li>• Transparent enforcement logs</li>
                        <li>• Decentralized arbitration</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Penalty History */}
              <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-orange-500/30 p-6">
                <h4 className="text-lg font-semibold text-orange-400 mb-4">📋 Enforcement History</h4>
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">🛡️</div>
                  <p className="text-gray-400">No penalties recorded</p>
                  <p className="text-sm text-gray-500 mt-1">All commitments are being met on schedule</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
