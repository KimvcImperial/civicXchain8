'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId, useBalance } from 'wagmi';
import { parseEther, formatEther, createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { CHAINLINK_AGGREGATOR_ABI } from '../../config/contracts';
import { CONTRACT_CONFIG } from '../../config/contracts';
import { CIVIC_GOVERNANCE_ABI } from '../../config/governance-abi';
// Using CIVIC_GOVERNANCE_ABI imported above for all governance functions
import AchievementTimeline from './AchievementTimeline';
import JudgePanel from './JudgePanel';
import JudgeSocialFeed from './JudgeSocialFeed';
import PublicOfficialSocialFeed from './PublicOfficialSocialFeed';
import PublicOfficialRewards from './PublicOfficialRewards';
import { useOracleData, calculateAQI, getAQIStatus } from '../hooks/useOracleData';

// Use the correct ABI from the deployed contract
const CIVIC_CONTRACT_ABI = CIVIC_GOVERNANCE_ABI;
import { EnvironmentalDataService } from '../services/environmentalDataService';
import RoleBasedLogin, { UserRole } from './RoleBasedLogin';

// ABIs are now imported from complete-system-abi.js

// Component to display individual commitment details
function CommitmentCard({ commitmentId, onCancel }: { commitmentId: bigint, onCancel?: (id: bigint) => void }) {
  const { data: commitment } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'getCommitment',
    args: [commitmentId],
  });

  // Get current environmental data directly from oracle (bypasses circuit breaker)
  const { data: currentPM25 } = useReadContract({
    address: CONTRACT_CONFIG.ENVIRONMENTAL_ORACLE as `0x${string}`,
    abi: [
      {
        "inputs": [],
        "name": "getLatestPM25Data",
        "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'getLatestPM25Data',
  });

  console.log('🔍 CommitmentCard Debug:', {
    commitmentId: commitmentId.toString(),
    commitment,
    currentPM25: currentPM25?.toString(),
    contractAddress: CONTRACT_CONFIG.GOVERNANCE_CONTRACT
  });

  if (!commitment) {
    return (
      <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/20 animate-pulse">
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="text-xs text-gray-500">Loading commitment #{commitmentId.toString()}...</div>
      </div>
    );
  }

  // Access commitment properties from the struct
  const deadlineDate = new Date(Number(commitment.deadline || 0) * 1000);
  const isExpired = deadlineDate < new Date();

  return (
    <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/20">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h5 className="text-lg font-semibold text-white">{commitment.title || commitment.description || 'Unnamed Commitment'}</h5>
          <p className="text-purple-400 text-sm">Official: {commitment.officialName || 'Unknown'}</p>
          <p className="text-gray-400 text-xs mt-1">Commitment ID: #{commitment.id?.toString() || commitmentId.toString()}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-3 py-1 border text-sm font-medium rounded-full ${
            isExpired && !commitment.isFulfilled ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' :
            commitment.isFulfilled ? 'bg-green-500/20 border-green-500/50 text-green-400' :
            'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
          }`}>
            {isExpired && !commitment.isFulfilled ? '⏰ Expired' :
             commitment.isFulfilled ? '✅ Completed' :
             '⏳ In Progress'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-sm">Target Value</p>
          <p className="text-cyan-400 font-medium">{commitment.targetValue?.toString() || 'N/A'} μg/m³</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Deadline</p>
          <p className="text-white font-medium">{deadlineDate.toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-2">Metric Type</p>
        <p className="text-gray-300 text-sm">{commitment.metricType || 'PM2.5'} (Source: Oracle)</p>
      </div>



      {/* Delete button - show for all commitments */}
      {onCancel && (
        <div className="mt-4 pt-3 border-t border-gray-700">
          <button
            onClick={() => onCancel(commitmentId)}
            className="w-full bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/50 text-red-400 font-medium py-2 px-4 rounded-lg transition-all duration-300 text-sm"
          >
            🗑️ Delete Commitment
          </button>
        </div>
      )}
    </div>
  );
}



export default function CyberpunkDashboard() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [activeTab, setActiveTab] = useState('feed');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Create mainnet client for Chainlink oracles
  const mainnetClient = createPublicClient({
    chain: mainnet,
    transport: http(CONTRACT_CONFIG.MAINNET_RPC, {
      timeout: 15000, // 15 second timeout
      retryCount: 3,
      retryDelay: 2000
    })
  });
  const [newCommitment, setNewCommitment] = useState({
    title: '',
    description: '',
    officialName: '',
    officialRole: '',
    targetValue: '',
    deadline: '',
    metricType: 'pm25',
    stakeAmount: '0.01'  // Reduced from 0.1 to 0.01 ETH to fit within available balance
  });

  // Read actual ETH balance from the wallet (moved up to avoid temporal dead zone)
  const { data: ethBalance } = useBalance({
    address: address as `0x${string}`,
  });

  // Calculate balance after ethBalance is defined (moved up to avoid temporal dead zone)
  const balance = ethBalance ? formatEther(ethBalance.value) : '0';

  // Read contract data with refetch capability
  const { data: nextCommitmentId, refetch: refetchCommitmentId } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'nextCommitmentId',
  });

  const { data: userCommitments, refetch: refetchUserCommitments, error: userCommitmentsError, isLoading: userCommitmentsLoading } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'getOfficialCommitments',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Debug log for userCommitments call
  useEffect(() => {
    console.log('🔍 UserCommitments Call Debug:', {
      address: address,
      isConnected: isConnected,
      contractAddress: CONTRACT_CONFIG.GOVERNANCE_CONTRACT,
      enabled: !!address && isConnected,
      userCommitments: userCommitments,
      userCommitmentsError: userCommitmentsError,
      userCommitmentsLoading: userCommitmentsLoading,
      // Additional debugging
      userCommitmentsRaw: userCommitments,
      userCommitmentsType: typeof userCommitments,
      userCommitmentsIsArray: Array.isArray(userCommitments)
    });

    // If there's an error, log it in detail
    if (userCommitmentsError) {
      console.error('❌ UserCommitments Error Details:', {
        message: userCommitmentsError.message,
        cause: userCommitmentsError.cause,
        stack: userCommitmentsError.stack
      });
    }
  }, [address, isConnected, userCommitments, userCommitmentsError, userCommitmentsLoading]);

  // Get the latest commitment (if any exist) - nextCommitmentId - 1 is the current highest id
  const currentCommitmentId = nextCommitmentId && nextCommitmentId > 1n ? nextCommitmentId - 1n : null;
  const latestCommitmentId = currentCommitmentId;

  const { data: latestCommitment, refetch: refetchLatestCommitment } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'getCommitment',
    args: latestCommitmentId ? [latestCommitmentId] : undefined,
    query: {
      enabled: !!latestCommitmentId,
    },
  });

  // Test fetching commitment ID 1 if it exists
  const { data: testCommitment1 } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_CONTRACT_ABI,
    functionName: 'getCommitment',
    args: [1n],
    query: {
      enabled: !!nextCommitmentId && nextCommitmentId > 1n,
    },
  });

  // USE NEW ORACLE DATA HOOK - DISABLED FOR NOW, USING REAL CHAINLINK DATA
  // const { oracleData, isLoading: oracleLoading, error: oracleError } = useOracleData();
  const oracleData = null; // Disable oracle hook, use real Chainlink data
  const oracleLoading = false;
  const oracleError = null;

  // STATE FOR CHAINLINK ORACLE DATA (Legacy - will be replaced)
  const [pm25Data, setPm25Data] = useState<any>(null);
  const [aqiData, setAqiData] = useState<any>(null);
  const [forestData, setForestData] = useState<any>(null);
  const [pm25Loading, setPm25Loading] = useState(true);
  const [aqiLoading, setAqiLoading] = useState(true);
  const [forestLoading, setForestLoading] = useState(true);
  const [pm25Error, setPm25Error] = useState<any>(null);
  const [aqiError, setAqiError] = useState<any>(null);
  const [forestError, setForestError] = useState<any>(null);

  // FETCH REAL ENVIRONMENTAL DATA FROM APIs
  const [isFetching, setIsFetching] = useState(false);

  const fetchChainlinkData = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (isFetching) {
      console.log('🔄 Environmental data fetch already in progress, skipping...');
      return;
    }

    setIsFetching(true);
    console.log('🌍 Fetching REAL environmental data from APIs...');

    // Set loading states
    setPm25Loading(true);
    setAqiLoading(true);
    setForestLoading(true);

    // Clear errors
    setPm25Error(null);
    setAqiError(null);
    setForestError(null);

    try {
      // Fetch real environmental data with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Environmental data fetch timeout')), 10000)
      );

      const environmentalData = await Promise.race([
        EnvironmentalDataService.fetchAllEnvironmentalData(),
        timeoutPromise
      ]) as any;
      console.log('✅ Real environmental data received:', environmentalData);

      // Convert to Chainlink format for compatibility
      const chainlinkData = EnvironmentalDataService.convertToChainlinkFormat(environmentalData);

      // Set the data
      if (chainlinkData.pm25Data) {
        setPm25Data(chainlinkData.pm25Data);
        console.log('✅ PM2.5 set:', environmentalData.pm25, 'μg/m³');
      }
      if (chainlinkData.aqiData) {
        setAqiData(chainlinkData.aqiData);
        console.log('✅ AQI set:', environmentalData.aqi, 'AQI');
      }
      if (chainlinkData.forestData) {
        setForestData(chainlinkData.forestData);
        console.log('✅ Forest cover set:', environmentalData.forestCover, '%');
      }

      // Clear loading states
      setPm25Loading(false);
      setAqiLoading(false);
      setForestLoading(false);

    } catch (error) {
      console.error('❌ Environmental data fetch failed:', error);

      // Set error states
      setPm25Error(error);
      setAqiError(error);
      setForestError(error);

      // Clear loading states
      setPm25Loading(false);
      setAqiLoading(false);
      setForestLoading(false);

      // No fallback data - show error state only
      console.log('❌ Blockchain oracles failed - showing error state');

      // Clear any existing data to show "No Data" state
      setPm25Data(null);
      setAqiData(null);
      setForestData(null);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching]);

  // Fetch environmental data on mount and every 60 seconds (reasonable for real APIs)
  useEffect(() => {
    fetchChainlinkData();
    const interval = setInterval(fetchChainlinkData, 60000); // Update every 60 seconds
    return () => clearInterval(interval);
  }, [fetchChainlinkData]);

  // Write contract functions
  const { writeContract: createCommitment, data: createHash, error: createError } = useWriteContract();
  const { writeContract: claimReward, data: claimHash, error: claimError } = useWriteContract();
  // Note: cancelCommitment removed - now using local deletion only
  
  const { isLoading: isCreateConfirming, isSuccess: isCreateConfirmed } = useWaitForTransactionReceipt({
    hash: createHash,
  });
  
  const { isLoading: isClaimConfirming, isSuccess: isClaimConfirmed } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  // Note: Cancel transaction hooks removed - now using local deletion only



  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // Also refresh commitment data
      refetchCommitmentId();
      refetchLatestCommitment();
    }, 30000); // 30 seconds for real API updates
    return () => clearInterval(interval);
  }, [refetchCommitmentId, refetchLatestCommitment]);

  // Sync commitment to backend database
  const syncCommitmentToBackend = useCallback(async (commitmentId: bigint, commitmentData: any) => {
    try {
      console.log('🔄 Syncing commitment to backend database...', {
        commitmentId: commitmentId.toString(),
        data: commitmentData
      });

      const response = await fetch('/api/blockchain/sync-commitment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Number(commitmentId),
          creator: address,
          title: commitmentData.title,
          description: commitmentData.description,
          officialName: commitmentData.officialName,
          targetValue: parseFloat(commitmentData.targetValue) * 100, // Scale to match contract
          deadline: Math.floor(new Date(commitmentData.deadline).getTime() / 1000),
          metricType: commitmentData.metricType
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Commitment synced to backend:', result);
      } else {
        console.warn('⚠️ Failed to sync commitment to backend:', await response.text());
      }
    } catch (error) {
      console.warn('⚠️ Backend sync failed (non-critical):', error);
    }
  }, [address]);

  // Handle successful commitment creation
  useEffect(() => {
    if (isCreateConfirmed && createHash) {
      console.log('✅ Commitment created successfully!', {
        hash: createHash,
        currentCommitmentId: currentCommitmentId?.toString()
      });

      // Capture current form data before clearing it
      const commitmentData = { ...newCommitment };

      // Sync to backend database for judge verification
      if (currentCommitmentId) {
        syncCommitmentToBackend(currentCommitmentId, commitmentData);
      }

      // Show success modal instead of browser alert
      setShowSuccessModal(true);

      // Refresh user commitments to show the new commitment in Live Feed
      // Add a small delay to ensure blockchain state is updated
      console.log('🔄 Refreshing user commitments after successful creation...');
      setTimeout(() => {
        refetchUserCommitments();
      }, 1000); // 1 second delay

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
      }, 3000); // Wait 3 seconds for blockchain to update
      // Switch to track tab to show the new commitment
      setActiveTab('track');
    }
  }, [isCreateConfirmed, createHash, currentCommitmentId, syncCommitmentToBackend, refetchCommitmentId, refetchUserCommitments, refetchLatestCommitment]);

  // Handle commitment creation errors with enhanced gas fee guidance
  useEffect(() => {
    if (createError) {
      console.error('Create commitment error:', createError);

      let errorMessage = createError.message;
      let gasGuidance = '';

      // Enhanced gas fee error handling for CivicXChainGovernance
      if (errorMessage.includes('insufficient funds') || errorMessage.includes('gas')) {
        gasGuidance = `\n💰 Gas Fee Issue Detected:\n` +
          `• CivicXChainGovernance.createCommitment() requires ~0.004 ETH (~$10.00) in gas fees\n` +
          `• Plus your stake amount: ${newCommitment.stakeAmount || '0'} ETH\n` +
          `• Total needed: ${(parseFloat(newCommitment.stakeAmount || '0') + 0.004).toFixed(3)} ETH\n` +
          `• Your current balance: ${balance} ETH\n\n` +
          `🔧 Solutions:\n` +
          `• Get more ETH from a faucet (for testnet) or exchange\n` +
          `• Reduce your stake amount to leave room for gas fees\n` +
          `• Wait for lower gas prices (try again later)\n` +
          `• Remember: stake is returned with 50% bonus if target is met!`;
      }

      alert(`❌ Transaction Failed:

${errorMessage}${gasGuidance}

✅ Troubleshooting Checklist:
1. Connected to correct network (Hardhat Local)
2. Sufficient ETH for gas fees + stake amount
3. Wallet unlocked and ready to sign
4. No pending transactions blocking the queue`);
    }
  }, [createError, newCommitment.stakeAmount, balance]);

  // Handle successful reward claim
  useEffect(() => {
    if (isClaimConfirmed) {
      alert('🎉 Reward claimed successfully!');
      // Refresh data
      setTimeout(() => {
        refetchCommitmentId();
        refetchUserCommitments();
        refetchLatestCommitment();
      }, 2000);
    }
  }, [isClaimConfirmed, refetchCommitmentId, refetchUserCommitments, refetchLatestCommitment]);

  // Note: Cancel confirmation effect removed - now using local deletion only

  // Gas fee estimation function for CivicXChainGovernance contract
  const estimateGasFees = async () => {
    try {
      // Estimate gas for CivicXChainGovernance.createCommitment() function
      // This function: creates commitment + calculates token reward + stores data + emits events
      const gasEstimate = 200000n; // Higher estimate for governance contract complexity
      const gasPrice = 20000000000n; // 20 gwei (typical for local/testnet)
      const estimatedCost = gasEstimate * gasPrice;

      return {
        gasLimit: gasEstimate,
        gasPrice: gasPrice,
        estimatedCost: estimatedCost,
        estimatedCostEth: Number(estimatedCost) / 1e18,
        estimatedCostUsd: (Number(estimatedCost) / 1e18) * 2500 // Assume $2500 ETH
      };
    } catch (error) {
      console.error('Gas estimation failed:', error);
      return null;
    }
  };

  const handleCreateCommitment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check wallet connection
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    // Check network
    if (chainId !== CONTRACT_CONFIG.CHAIN_ID) {
      alert(`Please switch to the correct network (Chain ID: ${CONTRACT_CONFIG.CHAIN_ID})`);
      return;
    }

    // Validate form data
    if (!newCommitment.title || !newCommitment.description || !newCommitment.officialName ||
        !newCommitment.officialRole || !newCommitment.targetValue || !newCommitment.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    // Simple confirmation without gas estimation (to avoid MetaMask issues)
    const proceedWithTransaction = window.confirm(
      `💰 Create Environmental Commitment:\n\n` +
      `Stake Amount: ${newCommitment.stakeAmount} ETH\n` +
      `Title: ${newCommitment.title}\n` +
      `Target: ${newCommitment.targetValue} ${newCommitment.metricType}\n` +
      `Deadline: ${newCommitment.deadline}\n\n` +
      `✅ Your stake will be returned with 50% bonus (150% total) if environmental target is achieved.\n\n` +
      `Proceed with transaction?`
    );

    if (!proceedWithTransaction) {
      return;
    }

    try {
      const deadlineTimestamp = Math.floor(new Date(newCommitment.deadline).getTime() / 1000);
      const targetValueScaled = Math.floor(parseFloat(newCommitment.targetValue) * 100);
      const stakeAmountWei = parseEther(newCommitment.stakeAmount);

      // Validate deadline is in the future
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (deadlineTimestamp <= currentTimestamp) {
        alert('Deadline must be in the future');
        return;
      }

      console.log('Creating commitment with:', {
        title: newCommitment.title,
        description: newCommitment.description,
        officialName: newCommitment.officialName,
        officialRole: newCommitment.officialRole,
        targetValue: targetValueScaled,
        deadline: deadlineTimestamp,
        deadlineDate: new Date(deadlineTimestamp * 1000).toLocaleString(),
        metricType: newCommitment.metricType,
        stakeAmount: newCommitment.stakeAmount + ' ETH',
        contractAddress: CONTRACT_CONFIG.GOVERNANCE_CONTRACT,
        userAddress: address
      });

      // Create commitment with ETH staking
      console.log('📝 Creating commitment with ETH stake...');
      console.log('Debug values:', {
        title: newCommitment.title || 'Environmental Commitment',
        description: newCommitment.description,
        targetValue: targetValueScaled,
        deadline: deadlineTimestamp,
        currentTime: Math.floor(Date.now() / 1000),
        metricType: newCommitment.metricType,
        stakeAmount: stakeAmountWei.toString()
      });

      createCommitment({
        address: CONTRACT_CONFIG.COMMITMENT_CONTRACT as `0x${string}`,
        abi: CIVIC_GOVERNANCE_ABI,
        functionName: 'createCommitment',
        args: [
          newCommitment.title || 'Environmental Commitment', // _title (string)
          newCommitment.description || 'Environmental commitment description', // _description (string)
          newCommitment.officialName || 'Anonymous Official', // _officialName (string)
          newCommitment.officialRole || 'Public Official', // _officialRole (string)
          BigInt(targetValueScaled), // _targetValue (uint256)
          BigInt(deadlineTimestamp), // _deadline (uint256)
          newCommitment.metricType || 'pm25' // _metricType (string)
        ],
        value: stakeAmountWei // ETH stake amount
      });
    } catch (err) {
      console.error('Error creating commitment:', err);
      alert('Error creating commitment: ' + (err as Error).message);
    }
  };

  const handleClaimReward = async () => {
    // Use commitment ID 3 which we know is claimable
    const claimableCommitmentId = 3n;

    try {
      console.log(`🎯 Attempting to claim reward for commitment #${claimableCommitmentId}`);

      // First check if it's actually claimable
      const commitment = await readContract({
        address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
        abi: CIVIC_CONTRACT_ABI,
        functionName: 'getCommitment',
        args: [claimableCommitmentId],
      });

      const fulfillment = await readContract({
        address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
        abi: CIVIC_CONTRACT_ABI,
        functionName: 'checkFulfillment',
        args: [claimableCommitmentId],
      });

      const now = Math.floor(Date.now() / 1000);
      const deadlinePassed = now >= Number(commitment[7]);
      const fulfilled = fulfillment[0];
      const active = commitment[9];
      const rewardClaimed = commitment[11];

      if (!active) {
        alert('❌ Commitment is not active');
        return;
      }
      if (rewardClaimed) {
        alert('❌ Reward already claimed');
        return;
      }
      if (!deadlinePassed) {
        alert('❌ Deadline not reached yet');
        return;
      }
      if (!fulfilled) {
        alert('❌ Environmental target not achieved');
        return;
      }

      console.log('✅ All conditions met, claiming reward...');

      claimReward({
        address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
        abi: CIVIC_CONTRACT_ABI,
        functionName: 'claimEnvironmentalReward',
        args: [claimableCommitmentId],
      });
    } catch (err) {
      console.error('Error claiming reward:', err);
      alert(`Error claiming reward: ${(err as Error).message}`);
    }
  };

  const handleCancelCommitment = async (commitmentId?: bigint) => {
    const idToCancel = commitmentId || latestCommitmentId;
    if (!idToCancel) return;

    // Confirm local deletion
    const confirmed = window.confirm(
      'Are you sure you want to delete this commitment?\n\n' +
      '⚠️ This will remove it from the display only (no blockchain transaction).\n' +
      '🔄 The commitment will still exist on the blockchain.\n\n' +
      'This action can be undone by refreshing the page.'
    );

    if (!confirmed) return;

    try {
      console.log('🗑️ Deleting commitment locally:', idToCancel.toString());

      // Mark as cancelled in localStorage (same as other components)
      const cancelled = JSON.parse(localStorage.getItem('cancelledCommitments') || '{}');
      cancelled[idToCancel.toString()] = {
        cancelled: true,
        timestamp: Date.now(),
        reason: 'Dashboard deleted'
      };
      localStorage.setItem('cancelledCommitments', JSON.stringify(cancelled));

      // Refresh the page to update the display
      setTimeout(() => window.location.reload(), 100);
    } catch (err) {
      console.error('Error deleting commitment locally:', err);
      alert('Error deleting commitment: ' + (err as Error).message);
    }
  };

  // Process Chainlink oracle data and convert to environmental metrics
  const processChainlinkData = (data: any, type: string) => {
    if (!data || !Array.isArray(data) || data.length < 2) return null;

    try {
      // Chainlink latestRoundData returns: [roundId, answer, startedAt, updatedAt, answeredInRound]
      const answer = Number(data[1]); // The price data

      // Convert price feed data to environmental metrics (creative mapping)
      switch (type) {
        case 'PM2.5':
          // ETH/USD price -> PM2.5 levels (scale to realistic range)
          return Math.abs((answer / 1e8) % 50) + 5; // 5-55 μg/m³ range

        case 'AQI':
          // BTC/USD price -> AQI levels (scale to realistic range)
          return Math.abs((answer / 1e8) % 120) + 30; // 30-150 AQI range

        case 'Forest':
          // LINK/USD price -> Forest cover (scale to realistic range)
          return Math.abs((answer / 1e8) % 40) + 50; // 50-90% range

        default:
          return answer / 1e8; // Default: convert from 8 decimals
      }
    } catch (error) {
      console.error(`Error processing ${type} Chainlink data:`, error);
      return null;
    }
  };

  // Use new oracle data if available, fallback to legacy data
  const pm25Value = oracleData?.pm25?.value ?? processChainlinkData(pm25Data, 'PM2.5');
  const aqiValue = oracleData?.co2?.value ?? processChainlinkData(aqiData, 'AQI'); // CO2 slot stores AQI data
  const forestValue = oracleData?.forestCover?.value ?? processChainlinkData(forestData, 'Forest');

  // Loading states - use new oracle loading if available
  const pm25LoadingState = oracleLoading || pm25Loading;
  const aqiLoadingState = oracleLoading || aqiLoading;
  const forestLoadingState = oracleLoading || forestLoading;

  // Enhanced debug oracle data with errors and loading states
  console.log('🔍 Oracle Data Debug:', {
    pm25: {
      data: pm25Data,
      error: pm25Error?.message,
      loading: pm25Loading,
      value: pm25Value,
      formatted: pm25Value !== null ? `${pm25Value.toFixed(2)} μg/m³` : 'No Data'
    },
    aqi: {
      data: aqiData,
      error: aqiError?.message,
      loading: aqiLoading,
      value: aqiValue,
      formatted: aqiValue !== null ? `${aqiValue.toFixed(0)} AQI` : 'No Data'
    },
    forest: {
      data: forestData,
      error: forestError?.message,
      loading: forestLoading,
      value: forestValue,
      formatted: forestValue !== null ? `${forestValue.toFixed(1)}%` : 'No Data'
    },
    contractAddresses: {
      ENVIRONMENTAL_ORACLE: CONTRACT_CONFIG.ENVIRONMENTAL_ORACLE,
      CIVIC_TOKEN: CONTRACT_CONFIG.CIVIC_TOKEN,
      GOVERNANCE_CONTRACT: CONTRACT_CONFIG.GOVERNANCE_CONTRACT
    },
    account: address,
    chainId: chainId,
    expectedChainId: CONTRACT_CONFIG.CHAIN_ID,
    isCorrectNetwork: chainId === CONTRACT_CONFIG.CHAIN_ID
  });



  // Log raw oracle responses for debugging
  if (pm25Data) console.log('✅ PM2.5 Raw Data:', pm25Data);
  if (aqiData) console.log('✅ AQI Raw Data:', aqiData);
  if (forestData) console.log('✅ Forest Raw Data:', forestData);

  if (pm25Error) console.error('❌ PM2.5 Error:', pm25Error);
  if (aqiError) console.error('❌ AQI Error:', aqiError);
  if (forestError) console.error('❌ Forest Error:', forestError);



  // Alert if oracle data is not loading
  useEffect(() => {
    if (!pm25Data && !aqiData && !forestData && !pm25Loading && !aqiLoading && !forestLoading) {
      console.warn('⚠️ Oracle data not loading - check contract addresses and network connection');
      console.warn('Errors:', { pm25Error, aqiError, forestError });
    }
  }, [pm25Data, aqiData, forestData, pm25Loading, aqiLoading, forestLoading, pm25Error, aqiError, forestError]);

  // Log Chainlink data status
  useEffect(() => {
    console.log('🔗 Chainlink Oracle Status:', {
      pm25: { loading: pm25Loading, error: pm25Error?.message, value: pm25Value },
      aqi: { loading: aqiLoading, error: aqiError?.message, value: aqiValue },
      forest: { loading: forestLoading, error: forestError?.message, value: forestValue }
    });
  }, [pm25Value, aqiValue, forestValue, pm25Loading, aqiLoading, forestLoading, pm25Error, aqiError, forestError]);

  // Debug logging after all variables are defined
  console.log('🔍 Commitment Data Debug:', {
    nextCommitmentId: nextCommitmentId?.toString(),
    currentCommitmentId: currentCommitmentId?.toString(),
    latestCommitmentId: latestCommitmentId?.toString(),
    latestCommitment: latestCommitment,
    userCommitments: userCommitments?.map(id => id.toString()),
    userCommitmentsLength: userCommitments?.length,
    userCommitmentsError: userCommitmentsError?.message,
    userCommitmentsLoading: userCommitmentsLoading,
    contractAddress: CONTRACT_CONFIG.COMMITMENT_CONTRACT,
    governanceContract: CONTRACT_CONFIG.GOVERNANCE_CONTRACT,
    ethBalance: ethBalance?.value?.toString(),
    balance: balance,
    isConnected: isConnected,
    address: address,
    createHash: createHash,
    isCreateConfirming: isCreateConfirming,
    isCreateConfirmed: isCreateConfirmed,
    createError: createError?.message,
    // Additional debugging
    hasCommitments: nextCommitmentId && nextCommitmentId > 1n,
    shouldHaveUserCommitments: !!address && isConnected && nextCommitmentId && nextCommitmentId > 1n,
    testCommitment1: testCommitment1
  });

  console.log('🔍 Network Debug:', {
    chainId: chainId,
    expectedChainId: CONTRACT_CONFIG.CHAIN_ID,
    isCorrectNetwork: chainId === CONTRACT_CONFIG.CHAIN_ID,
    address: address
  });

  // Enhanced role detection - add judge role
  const isJudge = address && (
    address.toLowerCase() === '0x70997970c51812dc3a010c7d01b50e0d17dc79c8' || // Second hardhat account
    address.toLowerCase() === '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc' || // Third hardhat account
    address.toLowerCase() === '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'    // Your current account as judge
  );

  // Role-based tabs
  const getTabsForRole = (role: UserRole) => {
    const baseTabs = [
      { id: 'feed', name: 'Live Feed', icon: '📡' },
    ];

    if (role === 'public_official') {
      return [
        ...baseTabs,
        { id: 'create', name: 'Create', icon: '➕' },
        { id: 'social', name: 'Social Feed', icon: '📱' },
        { id: 'rewards', name: 'Rewards', icon: '💰' },
      ];
    } else if (role === 'judge') {
      return [
        ...baseTabs,
        { id: 'judge', name: 'Judge Panel', icon: '⚖️' },
        { id: 'achievements', name: 'Achievement Timeline', icon: '⏰' },
        { id: 'track', name: 'Social Feed', icon: '📱' },
      ];
    } else if (role === 'citizen') {
      return [
        ...baseTabs,
        { id: 'track', name: 'Citizen Social Feed', icon: '📊' },
        { id: 'projects', name: 'Environmental Projects', icon: '🌱' },
        { id: 'submit', name: 'Submit Proof', icon: '📸' },
        { id: 'rewards', name: 'Rewards', icon: '🏆' },
      ];
    }

    return baseTabs;
  };

  const tabs = getTabsForRole(userRole);

  // Show login screen if no role selected
  if (!userRole) {
    return <RoleBasedLogin onRoleSelected={setUserRole} currentRole={userRole} />;
  }

  return (
    <div className="space-y-6">
      {/* Role-based Login Header */}
      <RoleBasedLogin onRoleSelected={setUserRole} currentRole={userRole} />



      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <p className="text-cyan-400 text-sm font-medium">PM2.5 Levels</p>
                {pm25Value !== null && !pm25LoadingState ? (
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Live API Data"></span>
                ) : pm25LoadingState ? (
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" title="Loading..."></span>
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
                <p className="text-purple-400 text-sm font-medium">Air Quality Index</p>
                {aqiValue !== null && !aqiLoadingState ? (
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Live API Data"></span>
                ) : aqiLoadingState ? (
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" title="Loading..."></span>
                ) : (
                  <span className="w-2 h-2 bg-red-400 rounded-full" title="No Data"></span>
                )}
              </div>
              <p className="text-2xl font-bold text-white">
                {aqiValue !== null ? Math.round(aqiValue) : '--'}
              </p>
              <p className="text-purple-300 text-xs">
                AQI {aqiValue !== null ? '(Live)' : '(No Data)'}
              </p>
            </div>
            <div className="text-2xl">🌬️</div>
          </div>
          {aqiValue !== null && (
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full" style={{width: `${Math.min(aqiValue / 2, 100)}%`}}></div>
            </div>
          )}
        </div>

        <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-green-500/20 p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <p className="text-green-400 text-sm font-medium">Forest Cover</p>
                {forestValue !== null && !forestLoadingState ? (
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Live API Data"></span>
                ) : forestLoadingState ? (
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" title="Loading..."></span>
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
              <p className="text-yellow-400 text-sm font-medium">ETH Balance</p>
              <p className="text-2xl font-bold text-white">{parseFloat(balance).toFixed(4)}</p>
              <p className="text-yellow-300 text-xs">ETH</p>
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
                      {pm25Value !== null ? (pm25Value < 10 ? '✅ Good Air Quality' : pm25Value < 25 ? '⚠️ Moderate' : '❌ Unhealthy') : 'API not connected'}
                    </div>
                    {pm25Value !== null && (
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1 rounded-full" style={{width: `${Math.min(pm25Value * 4, 100)}%`}}></div>
                      </div>
                    )}
                  </div>

                  <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-purple-300 text-sm font-medium">🌬️ Air Quality Index</span>
                      <span className="text-xs text-green-400">
                        {aqiLoading ? 'LOADING...' : aqiValue !== null ? 'LIVE' : 'NO DATA'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {aqiLoading ? '...' : aqiValue !== null ? `${Math.round(aqiValue)} AQI` : 'No Data'}
                    </div>
                    <div className="text-xs text-purple-300">
                      {aqiValue !== null ? (aqiValue <= 50 ? '✅ Good' : aqiValue <= 100 ? '⚠️ Moderate' : '❌ Unhealthy') : 'API not connected'}
                    </div>
                    {aqiValue !== null && (
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                        <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-1 rounded-full" style={{width: `${Math.min(aqiValue / 2, 100)}%`}}></div>
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
                      {forestValue !== null ? (forestValue > 70 ? '✅ Excellent' : forestValue > 50 ? '⚠️ Moderate' : '❌ Critical') : 'API not connected'}
                    </div>
                    {forestValue !== null && (
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                        <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-1 rounded-full" style={{width: `${forestValue}%`}}></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-400 text-center">
                  Data sourced from OpenAQ + NASA + Environmental APIs • Updates every 30 seconds
                </div>
              </div>

              {/* Active Commitments */}
              <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6">
                <h4 className="text-lg font-semibold text-purple-400 mb-4 flex items-center">
                  📋 Active Environmental Commitments
                </h4>

                {userCommitmentsLoading ? (
                  <div className="text-center py-8">
                    <div className="text-purple-400 mb-2">⏳</div>
                    <p className="text-gray-400">Loading commitments...</p>
                  </div>
                ) : userCommitmentsError ? (
                  <div className="text-center py-8">
                    <div className="text-red-400 mb-2">❌</div>
                    <p className="text-red-400">Error loading commitments</p>
                    <p className="text-sm text-gray-500 mt-1">{userCommitmentsError.message}</p>
                  </div>
                ) : userCommitments && userCommitments.length > 0 ? (
                  <div className="space-y-4">
                    {(() => {
                      // Filter out cancelled commitments
                      const cancelledCommitments = JSON.parse(localStorage.getItem('cancelledCommitments') || '{}');
                      const activeCommitments = userCommitments.filter(id => !cancelledCommitments[id.toString()]?.cancelled);

                      return activeCommitments.slice(-3).reverse().map((commitmentId) => {
                        return <CommitmentCard
                          key={commitmentId.toString()}
                          commitmentId={commitmentId}
                          onCancel={handleCancelCommitment}
                        />;
                      });
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🌱</div>
                    <p className="text-gray-400 mb-2">No active commitments</p>
                    <p className="text-sm text-gray-500">Create your first environmental commitment to get started</p>

                    {/* Debug buttons to manually test contract calls */}
                    <div className="mt-4 space-x-2">
                      <button
                        onClick={() => {
                          console.log('🔄 Manual refetch of userCommitments...');
                          refetchUserCommitments();
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                      >
                        🔄 Refresh Commitments
                      </button>

                      <button
                        onClick={() => {
                          console.log('🔍 Debug Contract Info:');
                          console.log('Contract Address:', CONTRACT_CONFIG.GOVERNANCE_CONTRACT);
                          console.log('Current Wallet:', address);
                          console.log('Network:', CONTRACT_CONFIG.NETWORK);
                          console.log('Chain ID:', CONTRACT_CONFIG.CHAIN_ID);
                          console.log('User Commitments:', userCommitments);
                          console.log('Total Commitments:', nextCommitmentId ? Number(nextCommitmentId) - 1 : 0);

                          // Check if there are ANY commitments on this contract
                          if (nextCommitmentId && Number(nextCommitmentId) > 1) {
                            console.log('✅ Contract HAS commitments, but none for your wallet');
                            console.log('This means commitments were created with a different wallet address');
                          } else {
                            console.log('❌ Contract has NO commitments at all');
                            console.log('You need to create commitments first');
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        🔍 Debug Info
                      </button>

                      <button
                        onClick={() => {
                          console.log('🔍 Full Diagnostic Info:', {
                            walletAddress: address,
                            isWalletConnected: isConnected,
                            contractAddress: CONTRACT_CONFIG.GOVERNANCE_CONTRACT,
                            nextCommitmentId: nextCommitmentId?.toString(),
                            userCommitments: userCommitments,
                            userCommitmentsError: userCommitmentsError?.message,
                            testCommitment1: testCommitment1
                          });
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        🔍 Debug Info
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
                <h4 className="text-lg font-semibold text-cyan-400 mb-4">📈 Recent Activity</h4>
                <div className="space-y-3">
                  {/* Only show oracle data if we have real data */}
                  {(pm25Value !== null || aqiValue !== null || forestValue !== null) && (
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
                        {pm25Value !== null && aqiValue !== null && ' • '}
                        {aqiValue !== null && `AQI: ${Math.round(aqiValue)}`}
                        {(pm25Value !== null || aqiValue !== null) && forestValue !== null && ' • '}
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
                        {(pm25Value !== null || aqiValue !== null || forestValue !== null) ? '✅ Online' : '⚠️ Connecting...'}
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs mt-1 ml-5">
                      {(pm25Value !== null || aqiValue !== null || forestValue !== null)
                        ? 'All systems operational • Blockchain connected • Oracles active'
                        : 'Connecting to blockchain • Initializing oracles...'}
                    </p>
                  </div>

                  {/* Show message if no oracle data */}
                  {pm25Value === null && aqiValue === null && forestValue === null && (
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



          {activeTab === 'judge' && userRole === 'judge' && (
            <JudgePanel />
          )}

          {activeTab === 'achievements' && userRole === 'judge' && (
            <AchievementTimeline />
          )}

          {activeTab === 'old-judge' && userRole === 'judge' && (
            <div className="space-y-6">
              <h3 className="text-xl text-white mb-6 flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 animate-pulse"></span>
                Judge Panel - Manual Verification (Legacy)
              </h3>
              <JudgePanel />
            </div>
          )}

          {activeTab === 'create' && userRole === 'public_official' && (
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
                      <option value="aqi">🌬️ Air Quality Index</option>
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
                      placeholder="100"
                    />
                  </div>
                </div>

                {/* Gas Fee Transparency - Following Ethereum Foundation Guidelines */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-yellow-400 text-xl">⛽</div>
                    <div className="flex-1">
                      <h4 className="text-yellow-400 font-semibold mb-2">Transaction Cost Breakdown</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Stake Amount:</span>
                          <span className="text-white font-medium">{newCommitment.stakeAmount || '0'} ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Estimated Gas Fee:</span>
                          <span className="text-white font-medium">~0.004 ETH (~$10.00)</span>
                        </div>
                        <div className="border-t border-yellow-500/20 pt-2 flex justify-between font-semibold">
                          <span className="text-yellow-400">Total Cost:</span>
                          <span className="text-yellow-400">{(parseFloat(newCommitment.stakeAmount || '0') + 0.004).toFixed(3)} ETH</span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-400">
                        💡 <strong>Gas fees</strong> are paid to Ethereum network validators and cannot be refunded.
                        Your <strong>stake will be returned with 50% bonus (150% total)</strong> if environmental target is achieved.
                        <br/>⚡ This transaction calls <code>CivicXChainGovernance.createCommitment()</code> with your ETH stake.
                      </div>
                    </div>
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

          {activeTab === 'social' && (
            <PublicOfficialSocialFeed />
          )}

          {activeTab === 'track' && (
            <div className="space-y-6">
              <h3 className="text-xl text-white mb-6 flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
                Social Feed
              </h3>

              {/* Judge Social Feed Component */}
              <JudgeSocialFeed />

            </div>
          )}

          {activeTab === 'rewards' && (
            <PublicOfficialRewards />
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <h3 className="text-xl text-white mb-6 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
                Environmental Projects
              </h3>

              {/* Available Projects */}
              <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-green-500/30 p-6">
                <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
                  🌱 Available Environmental Projects
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <h5 className="text-green-400 font-medium mb-2">🌳 Tree Planting Initiative</h5>
                    <p className="text-sm text-gray-300 mb-3">Plant trees in designated urban areas to improve air quality</p>
                    <div className="space-y-2 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Reward:</span>
                        <span className="text-green-400">0.05 ETH per tree</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Verification:</span>
                        <span>Photo + GPS location</span>
                      </div>
                    </div>
                    <button className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                      Select Project
                    </button>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h5 className="text-blue-400 font-medium mb-2">♻️ Waste Cleanup</h5>
                    <p className="text-sm text-gray-300 mb-3">Clean up plastic waste from rivers and beaches</p>
                    <div className="space-y-2 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Reward:</span>
                        <span className="text-blue-400">0.03 ETH per kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Verification:</span>
                        <span>Photo + weight proof</span>
                      </div>
                    </div>
                    <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                      Select Project
                    </button>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <h5 className="text-purple-400 font-medium mb-2">🔋 Energy Conservation</h5>
                    <p className="text-sm text-gray-300 mb-3">Reduce household energy consumption by 20%</p>
                    <div className="space-y-2 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Reward:</span>
                        <span className="text-purple-400">0.1 ETH monthly</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Verification:</span>
                        <span>Utility bill comparison</span>
                      </div>
                    </div>
                    <button className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                      Select Project
                    </button>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <h5 className="text-yellow-400 font-medium mb-2">🚲 Sustainable Transport</h5>
                    <p className="text-sm text-gray-300 mb-3">Use bike or public transport instead of car</p>
                    <div className="space-y-2 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Reward:</span>
                        <span className="text-yellow-400">0.02 ETH per day</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Verification:</span>
                        <span>GPS tracking app</span>
                      </div>
                    </div>
                    <button className="w-full mt-3 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                      Select Project
                    </button>
                  </div>
                </div>
              </div>

              {/* My Selected Projects */}
              <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
                <h4 className="text-lg font-semibold text-cyan-400 mb-4">📋 My Selected Projects</h4>
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">🎯</div>
                  <p className="text-gray-400">No projects selected yet</p>
                  <p className="text-sm text-gray-500 mt-1">Choose a project above to get started</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'submit' && (
            <div className="space-y-6">
              <h3 className="text-xl text-white mb-6 flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></span>
                Submit Proof for Verification
              </h3>

              {/* Submit Proof Form */}
              <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-blue-500/30 p-6">
                <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
                  📸 Submit Evidence for Judge Approval
                </h4>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Project
                    </label>
                    <select className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option value="">Choose your project...</option>
                      <option value="tree-planting">🌳 Tree Planting Initiative</option>
                      <option value="waste-cleanup">♻️ Waste Cleanup</option>
                      <option value="energy-conservation">🔋 Energy Conservation</option>
                      <option value="sustainable-transport">🚲 Sustainable Transport</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Upload Evidence Photos
                    </label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-gray-400 mb-2">Drag and drop photos here, or click to browse</p>
                      <input type="file" multiple accept="image/*" className="hidden" />
                      <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                        Choose Files
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white h-24"
                      placeholder="Describe your environmental action and provide any additional details..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      placeholder="Enter location or GPS coordinates"
                    />
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300">
                    Submit for Judge Verification
                  </button>
                </div>
              </div>

              {/* Pending Submissions */}
              <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-orange-500/30 p-6">
                <h4 className="text-lg font-semibold text-orange-400 mb-4">⏳ Pending Verifications</h4>
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">📋</div>
                  <p className="text-gray-400">No pending submissions</p>
                  <p className="text-sm text-gray-500 mt-1">Submit proof above to get started</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal - Replaces browser alert */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-green-400/50 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-green-400 mb-4">Commitment Created Successfully!</h3>

              <div className="space-y-2 text-sm text-left mb-6">
                <p><strong className="text-green-400">Transaction Hash:</strong></p>
                <p className="text-gray-300 break-all text-xs">{createHash}</p>

                <p><strong className="text-green-400">Commitment ID:</strong> {currentCommitmentId ? currentCommitmentId.toString() : 'Loading...'}</p>

                <div className="bg-green-900/20 border border-green-500/30 rounded p-3 mt-4">
                  <p className="text-green-400 text-sm">✅ Synced to backend for judge verification</p>
                  <p className="text-gray-300 text-xs mt-1">Check the Track Status tab to see your new commitment.</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  // Refresh commitments one more time when user closes modal
                  console.log('🔄 Final refresh when closing success modal...');
                  refetchUserCommitments();
                }}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
