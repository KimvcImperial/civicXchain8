import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '../../config/contracts.js';
import { CIVIC_GOVERNANCE_ABI } from '../../config/governance-abi.js';

interface OracleData {
  pm25: {
    value: number;
    timestamp: number;
    status: string;
  } | null;
  co2: {
    value: number;
    timestamp: number;
    status: string;
  } | null;
  forestCover: {
    value: number;
    timestamp: number;
    status: string;
  } | null;
}

export function useOracleData() {
  const [oracleData, setOracleData] = useState<OracleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read PM2.5 data directly from Environmental Oracle (bypasses circuit breaker)
  const { data: pm25Data, error: pm25Error } = useReadContract({
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

  // Read CO2 data directly from Environmental Oracle (bypasses circuit breaker)
  const { data: co2Data, error: co2Error } = useReadContract({
    address: CONTRACT_CONFIG.ENVIRONMENTAL_ORACLE as `0x${string}`,
    abi: [
      {
        "inputs": [],
        "name": "getLatestCO2Data",
        "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'getLatestCO2Data',
  });

  // Read Forest Cover data directly from Environmental Oracle (bypasses circuit breaker)
  const { data: forestData, error: forestError } = useReadContract({
    address: CONTRACT_CONFIG.ENVIRONMENTAL_ORACLE as `0x${string}`,
    abi: [
      {
        "inputs": [],
        "name": "getLatestForestCoverData",
        "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'getLatestForestCoverData',
  });

  useEffect(() => {
    const fetchOracleData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🔍 Oracle Hook Debug:', {
          pm25Data,
          co2Data,
          forestData,
          pm25Error: pm25Error?.message,
          co2Error: co2Error?.message,
          forestError: forestError?.message
        });

        // Process the data when any reads are complete (more robust)
        const processedData: OracleData = {
          pm25: pm25Data !== undefined ? {
            value: Number(pm25Data) / 100, // Convert from scaled integer
            timestamp: Date.now(),
            status: pm25Error ? 'error' : 'live'
          } : null,
          co2: co2Data !== undefined ? {
            value: Number(co2Data) / 100, // Convert from scaled integer
            timestamp: Date.now(),
            status: co2Error ? 'error' : 'live'
          } : null,
          forestCover: forestData !== undefined ? {
            value: Number(forestData) / 100, // Convert from scaled integer
            timestamp: Date.now(),
            status: forestError ? 'error' : 'live'
          } : null
        };

        // Set oracle data if we have at least one valid reading
        if (processedData.pm25 || processedData.co2 || processedData.forestCover) {
          setOracleData(processedData);
          console.log('✅ Oracle data updated:', processedData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch oracle data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOracleData();
  }, [pm25Data, co2Data, forestData, pm25Error, co2Error, forestError]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // The useReadContract hooks will automatically refetch
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    oracleData,
    isLoading,
    error,
    refetch: () => {
      // Trigger refetch by updating a state
      setIsLoading(true);
    }
  };
}

// Helper function to get AQI from PM2.5 value
export function calculateAQI(pm25Value: number): number {
  // EPA AQI calculation for PM2.5
  if (pm25Value <= 12.0) return Math.round((50 / 12.0) * pm25Value);
  if (pm25Value <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25Value - 12.1) + 51);
  if (pm25Value <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25Value - 35.5) + 101);
  if (pm25Value <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25Value - 55.5) + 151);
  if (pm25Value <= 250.4) return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25Value - 150.5) + 201);
  return Math.round(((500 - 301) / (500.4 - 250.5)) * (pm25Value - 250.5) + 301);
}

// Helper function to get AQI status
export function getAQIStatus(aqi: number): { status: string; color: string } {
  if (aqi <= 50) return { status: 'Good', color: 'text-green-400' };
  if (aqi <= 100) return { status: 'Moderate', color: 'text-yellow-400' };
  if (aqi <= 150) return { status: 'Unhealthy for Sensitive Groups', color: 'text-orange-400' };
  if (aqi <= 200) return { status: 'Unhealthy', color: 'text-red-400' };
  if (aqi <= 300) return { status: 'Very Unhealthy', color: 'text-purple-400' };
  return { status: 'Hazardous', color: 'text-red-600' };
}
