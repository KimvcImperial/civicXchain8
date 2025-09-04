declare global {
  interface Window {
    ethereum?: any;
  }

  }

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_CONFIG } from '../../config/contracts';

interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'NFT' | 'TOKEN' | 'FUNDING';
  amount?: number;
  tokenSymbol?: string;
  contractAddress?: string;
  tokenId?: string;
  isClaimable: boolean;
  isClaimed: boolean;
  claimedAt?: Date;
  transactionHash?: string;
  commitmentId: string;
}

interface CommitmentProgress {
  commitmentId: string;
  title: string;
  totalCommitments: number;
  completedCommitments: number;
  successRate: number;
  status: 'active' | 'completed' | 'failed';
  nextMilestone?: string;
  environmentalImpact: {
    co2Reduction: number;
    forestCoverage: number;
    airQualityImprovement: number;
  };
  validationData: any;
}

interface EnvironmentalData {
  airQuality: {
    pm25: number;
    location: string;
    timestamp: string;
  };
  satelliteData: {
    forestCoverage: number;
    coordinates: string;
    date: string;
  };
  weatherData: {
    temperature: number;
    humidity: number;
    location: string;
  };
}

// Smart Contract ABI (simplified)
const REWARD_CONTRACT_ABI = [
  "function claimEnvironmentalReward(uint256 _commitmentId) external returns (uint256 tokensRewarded)",
  "function getCommitment(uint256 _commitmentId) external view returns (tuple(uint256 id, string title, string description, address officialAddress, string officialName, string officialRole, uint256 targetValue, uint256 deadline, string metricType, bool isActive, bool isFulfilled, bool rewardClaimed, uint256 stakeAmount, uint256 tokenReward, bytes32 oracleJobId))",
  "function checkFulfillment(uint256 _commitmentId) external view returns (bool fulfilled, uint256 currentValue, string memory dataSource)",
  "event CommitmentFulfilled(uint256 indexed commitmentId, uint256 currentValue, uint256 tokenReward)"
];

const RewardDashboard: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [commitmentProgress, setCommitmentProgress] = useState<CommitmentProgress[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [claimingReward, setClaimingReward] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);


  const REWARD_CONTRACT_ADDRESS = CONTRACT_CONFIG.GOVERNANCE_CONTRACT; // Use the deployed Sepolia contract

  useEffect(() => {
    initializeWallet();
    fetchRealData();
  }, []);

  const initializeWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        // Check if we're on the correct network
        const network = await provider.getNetwork();
        if (network.chainId !== BigInt(CONTRACT_CONFIG.CHAIN_ID)) {
          console.warn(`Wrong network. Expected ${CONTRACT_CONFIG.CHAIN_ID}, got ${network.chainId}`);
        }

        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } else {
        console.error('MetaMask not installed');
      }
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
    }
  };

  const fetchRealData = async () => {
    setLoading(true);
    try {
      // Fetch commitments from your backend API
      const commitmentsResponse = await fetch('/api/commitments');
      const commitments = await commitmentsResponse.json();
      
      // Fetch environmental data
      const environmentalResponse = await fetch('/api/environmental-data');
      const envData = await environmentalResponse.json();
      
      // Fetch validation status for each commitment
      const progressData = await Promise.all(
        commitments.map(async (commitment: any) => {
          const validationResponse = await fetch(`/api/validation/${commitment.id}`);
          const validation = await validationResponse.json();
          
          return {
            commitmentId: commitment.id,
            title: commitment.title,
            totalCommitments: commitment.milestones?.length || 1,
            completedCommitments: validation.completedMilestones || 0,
            successRate: validation.successRate || 0,
            status: validation.status || 'active',
            nextMilestone: commitment.nextMilestone,
            environmentalImpact: validation.environmentalImpact || {
              co2Reduction: 0,
              forestCoverage: 0,
              airQualityImprovement: 0
            },
            validationData: validation
          };
        })
      );

      // Fetch available rewards from blockchain
      const rewardsData = await fetchBlockchainRewards(commitments);
      
      setCommitmentProgress(progressData);
      setRewards(rewardsData);
      setEnvironmentalData(envData);
      
    } catch (error) {
      console.error('Failed to fetch real data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockchainRewards = async (commitments: any[]): Promise<Reward[]> => {
    if (!provider || !walletAddress) return [];

    try {
      const contract = new ethers.Contract(
        REWARD_CONTRACT_ADDRESS,
        REWARD_CONTRACT_ABI,
        provider
      );

      const rewardsData: Reward[] = [];

      for (const commitment of commitments) {
        // Check if reward exists for this commitment
        try {
          const rewardInfo = await contract.getReward(commitment.id);
          const isClaimable = await contract.isRewardClaimable(commitment.id, walletAddress);
          
          rewardsData.push({
            id: commitment.id,
            title: `${commitment.title} Reward`,
            description: `Reward for completing ${commitment.title}`,
            type: commitment.rewardType || 'TOKEN',
            amount: parseFloat(ethers.formatEther(rewardInfo.amount)),
            tokenSymbol: 'ECO',
            contractAddress: REWARD_CONTRACT_ADDRESS,
            isClaimable: isClaimable && !rewardInfo.claimed,
            isClaimed: rewardInfo.claimed,
            commitmentId: commitment.id
          });
        } catch (error) {
          console.error(`Failed to fetch reward for commitment ${commitment.id}:`, error);
        }
      }

      return rewardsData;
    } catch (error) {
      console.error('Failed to fetch blockchain rewards:', error);
      return [];
    }
  };

  const handleClaimReward = async (rewardId: string) => {
    if (!provider || !walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    setClaimingReward(rewardId);
    
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        REWARD_CONTRACT_ADDRESS,
        REWARD_CONTRACT_ABI,
        signer
      );

      // Estimate gas first
      const gasEstimate = await contract.claimEnvironmentalReward.estimateGas(rewardId);

      // Execute transaction
      const tx = await contract.claimEnvironmentalReward(rewardId, {
        gasLimit: gasEstimate * BigInt(120) / BigInt(100), // Add 20% buffer
      });

      

      console.log('Transaction submitted:', tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // Update reward status locally
      setRewards(prev => prev.map(reward => 
        reward.id === rewardId 
          ? { 
              ...reward, 
              isClaimed: true, 
              claimedAt: new Date(), 
              isClaimable: false,
              transactionHash: tx.hash
            }
          : reward
      ));

      alert(`Reward claimed successfully! Transaction: ${tx.hash}`);
      
    } catch (error: any) {
      console.error('Failed to claim reward:', error);
      alert(`Failed to claim reward: ${error.message}`);
    } finally {
      setClaimingReward(null);
    }
  };

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        await initializeWallet();
      } else {
        alert('Please install MetaMask to use this feature');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const refreshData = async () => {
    await fetchRealData();
  };

  const getRewardIcon = (type: Reward['type']) => {
    switch (type) {
      case 'NFT': return '🎨';
      case 'TOKEN': return '🪙';
      case 'FUNDING': return '💰';
      default: return '🎁';
    }
  };

  const getStatusColor = (status: CommitmentProgress['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'active': return 'text-cyan-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-400 font-mono">Loading real-time data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header with Wallet Connection */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 font-mono">
            <span className="text-cyan-400">REWARD</span> DASHBOARD
          </h1>
          <p className="text-gray-400">Real-time environmental achievements and blockchain rewards</p>
        </div>
        
        <div className="text-right">
          {walletAddress ? (
            <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400">Connected Wallet</p>
              <p className="font-mono text-cyan-400">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-mono"
            >
              Connect Wallet
            </button>
          )}
          
          <button
            onClick={refreshData}
            className="ml-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-mono"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Environmental Data Display */}
      {environmentalData && (
        <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">🌍 Real-time Environmental Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">{environmentalData.airQuality.pm25}</p>
              <p className="text-sm text-gray-400">PM2.5 (μg/m³)</p>
              <p className="text-xs text-gray-500">{environmentalData.airQuality.location}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{environmentalData.satelliteData.forestCoverage}%</p>
              <p className="text-sm text-gray-400">Forest Coverage</p>
              <p className="text-xs text-gray-500">{environmentalData.satelliteData.coordinates}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{environmentalData.weatherData.temperature}°C</p>
              <p className="text-sm text-gray-400">Temperature</p>
              <p className="text-xs text-gray-500">{environmentalData.weatherData.location}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Commitment Progress */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">📊 Commitment Progress</h2>
          
          {commitmentProgress.map((progress) => (
            <div key={progress.commitmentId} className="mb-6 last:mb-0">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 font-medium">{progress.title}</span>
                <span className={`font-mono text-sm ${getStatusColor(progress.status)}`}>
                  {progress.status.toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-sm">
                  <span className="text-gray-400">Progress: </span>
                  <span className="text-green-400">
                    {progress.completedCommitments}/{progress.totalCommitments}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Success Rate: </span>
                  <span className="text-cyan-400">{progress.successRate}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-green-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(progress.completedCommitments / progress.totalCommitments) * 100}%` }}
                ></div>
              </div>

              {/* Environmental Impact from real validation data */}
              <div className="bg-gray-900 p-3 rounded">
                <p className="text-xs text-gray-400 mb-2">Environmental Impact (Validated)</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-green-400">{progress.environmentalImpact.co2Reduction}</span>
                    <p className="text-gray-500">CO₂ Reduced (tons)</p>
                  </div>
                  <div>
                    <span className="text-green-400">{progress.environmentalImpact.forestCoverage}%</span>
                    <p className="text-gray-500">Forest Coverage</p>
                  </div>
                  <div>
                    <span className="text-green-400">+{progress.environmentalImpact.airQualityImprovement}%</span>
                    <p className="text-gray-500">Air Quality</p>
                  </div>
                </div>
              </div>

              {progress.nextMilestone && (
                <div className="mt-3 p-3 bg-cyan-900/20 rounded border-l-4 border-cyan-400">
                  <p className="text-sm text-gray-300">
                    <strong className="text-cyan-400">Next:</strong> {progress.nextMilestone}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Blockchain Rewards */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">🏆 Blockchain Rewards</h2>
          
          <div className="space-y-4">
            {rewards.map((reward) => (
              <div 
                key={reward.id}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  reward.isClaimed 
                    ? 'bg-gray-900 border-gray-600' 
                    : reward.isClaimable 
                      ? 'bg-gradient-to-r from-green-900/30 to-cyan-900/30 border-cyan-500/50 glow-border' 
                      : 'bg-gray-900 border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-2xl">{getRewardIcon(reward.type)}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{reward.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{reward.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs">
                        <span className={`px-2 py-1 rounded font-mono ${
                          reward.type === 'NFT' ? 'bg-purple-900 text-purple-300' :
                          reward.type === 'TOKEN' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-green-900 text-green-300'
                        }`}>
                          {reward.type}
                        </span>
                        
                        {reward.amount && (
                          <span className="text-cyan-400 font-mono">
                            {reward.amount} {reward.tokenSymbol}
                          </span>
                        )}
                      </div>

                      {reward.contractAddress && (
                        <p className="text-xs text-gray-500 mt-1 font-mono">
                          Contract: {reward.contractAddress.slice(0, 8)}...
                        </p>
                      )}

                      {reward.transactionHash && (
                        <a 
                          href={`https://polygonscan.com/tx/${reward.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-cyan-400 hover:text-cyan-300 mt-1 block"
                        >
                          View Transaction ↗
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="ml-4">
                    {reward.isClaimed ? (
                      <span className="px-3 py-1 bg-green-900 text-green-300 rounded text-sm font-mono">
                        CLAIMED ✓
                      </span>
                    ) : reward.isClaimable && walletAddress ? (
                      <button
                        onClick={() => handleClaimReward(reward.id)}
                        disabled={claimingReward === reward.id}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-mono text-sm transition-all duration-200 hover:glow-cyan"
                      >
                        {claimingReward === reward.id ? (
                          <span className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            CLAIMING...
                          </span>
                        ) : (
                          'CLAIM REWARD'
                        )}
                      </button>
                    ) : !walletAddress ? (
                      <button
                        onClick={connectWallet}
                        className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm font-mono"
                      >
                        CONNECT
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-gray-700 text-gray-400 rounded text-sm font-mono">
                        LOCKED
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {rewards.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>No rewards available yet.</p>
                <p className="text-sm">Complete commitments to earn rewards!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
          <div className="text-2xl font-bold text-cyan-400">{rewards.filter(r => r.isClaimed).length}</div>
          <div className="text-sm text-gray-400">Rewards Claimed</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
          <div className="text-2xl font-bold text-green-400">{rewards.filter(r => r.isClaimable).length}</div>
          <div className="text-sm text-gray-400">Ready to Claim</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {commitmentProgress.reduce((acc, p) => acc + p.completedCommitments, 0)}
          </div>
          <div className="text-sm text-gray-400">Milestones Completed</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {Math.round(commitmentProgress.reduce((acc, p) => acc + p.environmentalImpact.co2Reduction, 0))}
          </div>
          <div className="text-sm text-gray-400">Total CO₂ Reduced</div>
        </div>
      </div>

      <style jsx>{`
        .glow-cyan {
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.4);
        }
        .glow-border {
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.2);
        }
      `}</style>
    </div>
  );
};

export default RewardDashboard;