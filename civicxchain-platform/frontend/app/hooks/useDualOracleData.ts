import { useReadContract, useWriteContract } from 'wagmi';
import { useState, useEffect } from 'react';

// Oracle Manager ABI (simplified for the functions we need)
const ORACLE_MANAGER_ABI = [
  {
    "inputs": [{"internalType": "string", "name": "metric", "type": "string"}],
    "name": "getEnvironmentalData",
    "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOracleStatus",
    "outputs": [
      {"internalType": "uint8", "name": "status", "type": "uint8"},
      {"internalType": "bool", "name": "chainlinkHealthy", "type": "bool"},
      {"internalType": "bool", "name": "fallbackHealthy", "type": "bool"},
      {"internalType": "uint256", "name": "chainlinkLastUpdate", "type": "uint256"},
      {"internalType": "uint256", "name": "fallbackLastUpdate", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "metric", "type": "string"},
      {"internalType": "string", "name": "apiUrl", "type": "string"}
    ],
    "name": "requestChainlinkData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
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

// Oracle Manager contract address (deployed on Sepolia)
const ORACLE_MANAGER_ADDRESS = "0x66EcF98372f6F15aAb7aBeBF2BF4aD9686d70089";

export interface OracleStatus {
  status: 'CHAINLINK_ACTIVE' | 'FALLBACK_ACTIVE' | 'BOTH_FAILED';
  chainlinkHealthy: boolean;
  fallbackHealthy: boolean;
  chainlinkLastUpdate: number;
  fallbackLastUpdate: number;
}

export interface EnvironmentalData {
  pm25: number;
  co2: number;
  forestCover: number;
  aqi: number;
  lastUpdated: number;
  dataSource: 'chainlink' | 'fallback' | 'default';
}

/**
 * Hook for accessing dual oracle system with Chainlink primary + fallback
 * Automatically handles oracle switching and provides real-time environmental data
 */
export const useDualOracleData = () => {
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [oracleStatus, setOracleStatus] = useState<OracleStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get PM2.5 data from dual oracle system
  const { data: pm25Data, error: pm25Error, refetch: refetchPM25 } = useReadContract({
    address: ORACLE_MANAGER_ADDRESS as `0x${string}`,
    abi: ORACLE_MANAGER_ABI,
    functionName: 'getEnvironmentalData',
    args: ['pm25'],
    enabled: ORACLE_MANAGER_ADDRESS !== "0x0000000000000000000000000000000000000000",
  });

  // Get CO2 data from dual oracle system
  const { data: co2Data, error: co2Error, refetch: refetchCO2 } = useReadContract({
    address: ORACLE_MANAGER_ADDRESS as `0x${string}`,
    abi: ORACLE_MANAGER_ABI,
    functionName: 'getEnvironmentalData',
    args: ['co2'],
    enabled: ORACLE_MANAGER_ADDRESS !== "0x0000000000000000000000000000000000000000",
  });

  // Get Forest Cover data from dual oracle system
  const { data: forestData, error: forestError, refetch: refetchForest } = useReadContract({
    address: ORACLE_MANAGER_ADDRESS as `0x${string}`,
    abi: ORACLE_MANAGER_ABI,
    functionName: 'getEnvironmentalData',
    args: ['forest_cover'],
    enabled: ORACLE_MANAGER_ADDRESS !== "0x0000000000000000000000000000000000000000",
  });

  // Get oracle system status
  const { data: statusData, error: statusError, refetch: refetchStatus } = useReadContract({
    address: ORACLE_MANAGER_ADDRESS as `0x${string}`,
    abi: ORACLE_MANAGER_ABI,
    functionName: 'getOracleStatus',
    enabled: ORACLE_MANAGER_ADDRESS !== "0x0000000000000000000000000000000000000000",
  });

  // Write contract hook for requesting fresh Chainlink data
  const { writeContract, data: requestHash, error: requestError } = useWriteContract();

  // Process oracle status data
  useEffect(() => {
    if (statusData) {
      const [status, chainlinkHealthy, fallbackHealthy, chainlinkLastUpdate, fallbackLastUpdate] = statusData;
      
      const statusMap = {
        0: 'CHAINLINK_ACTIVE' as const,
        1: 'FALLBACK_ACTIVE' as const,
        2: 'BOTH_FAILED' as const,
      };

      setOracleStatus({
        status: statusMap[status as keyof typeof statusMap] || 'BOTH_FAILED',
        chainlinkHealthy,
        fallbackHealthy,
        chainlinkLastUpdate: Number(chainlinkLastUpdate),
        fallbackLastUpdate: Number(fallbackLastUpdate),
      });
    }
  }, [statusData]);

  // Process environmental data
  useEffect(() => {
    if (pm25Data && co2Data && forestData) {
      const pm25Value = Number(pm25Data) / 100; // Convert from scaled integer
      const co2Value = Number(co2Data) / 100;
      const forestValue = Number(forestData) / 100;
      
      // Calculate AQI from PM2.5
      const aqi = calculateAQI(pm25Value);
      
      // Determine data source based on oracle status
      let dataSource: 'chainlink' | 'fallback' | 'default' = 'default';
      if (oracleStatus) {
        if (oracleStatus.status === 'CHAINLINK_ACTIVE') {
          dataSource = 'chainlink';
        } else if (oracleStatus.status === 'FALLBACK_ACTIVE') {
          dataSource = 'fallback';
        }
      }

      setEnvironmentalData({
        pm25: pm25Value,
        co2: co2Value,
        forestCover: forestValue,
        aqi,
        lastUpdated: Date.now(),
        dataSource,
      });
      
      setIsLoading(false);
      setError(null);
    }
  }, [pm25Data, co2Data, forestData, oracleStatus]);

  // Handle errors
  useEffect(() => {
    const errors = [pm25Error, co2Error, forestError, statusError].filter(Boolean);
    if (errors.length > 0) {
      setError(`Oracle error: ${errors[0]?.message || 'Unknown error'}`);
      setIsLoading(false);
    }
  }, [pm25Error, co2Error, forestError, statusError]);

  // Request fresh data from Chainlink oracle
  const requestChainlinkData = async (metric: string, apiUrl: string) => {
    try {
      await writeContract({
        address: ORACLE_MANAGER_ADDRESS as `0x${string}`,
        abi: ORACLE_MANAGER_ABI,
        functionName: 'requestChainlinkData',
        args: [metric, apiUrl],
      });
    } catch (error) {
      console.error('Error requesting Chainlink data:', error);
      throw error;
    }
  };

  // Refresh all oracle data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        refetchPM25(),
        refetchCO2(),
        refetchForest(),
        refetchStatus(),
      ]);
    } catch (error) {
      setError(`Refresh failed: ${error}`);
    }
  };

  // Request fresh data from NASA/OpenAQ APIs via Chainlink
  const requestFreshAPIData = async () => {
    try {
      // Request PM2.5 from OpenAQ
      await requestChainlinkData('pm25', 'https://api.openaq.org/v2/latest?parameter=pm25&limit=1');
      
      // Request CO2 from NOAA (example URL)
      await requestChainlinkData('co2', 'https://api.co2signal.com/v1/latest');
      
      // Request forest data from NASA
      await requestChainlinkData('forest_cover', 'https://modis.gsfc.nasa.gov/data/dataprod/mod44.php');
      
      // Refresh data after requests
      setTimeout(refreshData, 30000); // Wait 30 seconds for Chainlink to fulfill
      
    } catch (error) {
      console.error('Error requesting fresh API data:', error);
      throw error;
    }
  };

  return {
    // Data
    environmentalData,
    oracleStatus,
    
    // State
    isLoading,
    error,
    
    // Actions
    refreshData,
    requestFreshAPIData,
    requestChainlinkData,
    
    // Individual refetch functions
    refetchPM25,
    refetchCO2,
    refetchForest,
    refetchStatus,
  };
};

// Helper function to calculate AQI from PM2.5
function calculateAQI(pm25: number): number {
  // Simplified AQI calculation based on PM2.5
  if (pm25 <= 12) return Math.round((50 / 12) * pm25);
  if (pm25 <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
  if (pm25 <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
  if (pm25 <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
  if (pm25 <= 250.4) return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
  return Math.round(((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5) + 301);
}

export default useDualOracleData;
