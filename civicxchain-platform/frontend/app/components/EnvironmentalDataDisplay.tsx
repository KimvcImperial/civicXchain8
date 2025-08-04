'use client';

import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';

// Real Environmental Oracle ABI for reading live data
const ENVIRONMENTAL_ORACLE_ABI = [
  {
    "inputs": [],
    "name": "getLatestPM25Data",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLatestCO2Data",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLatestForestCoverData",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Real deployed oracle contract addresses from your live deployment
const ORACLE_ADDRESSES = {
  pm25: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
  co2: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
  forest: '0x0165878A594ca255338adfa4d48449f69242Eb8F'
};

export default function EnvironmentalDataDisplay() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Read REAL oracle data from deployed contracts using correct addresses
  const { data: pm25Data, refetch: refetchPM25 } = useReadContract({
    address: ORACLE_ADDRESSES.pm25 as `0x${string}`,
    abi: ENVIRONMENTAL_ORACLE_ABI,
    functionName: 'getLatestPM25Data',
  });

  const { data: co2Data, refetch: refetchCO2 } = useReadContract({
    address: ORACLE_ADDRESSES.co2 as `0x${string}`,
    abi: ENVIRONMENTAL_ORACLE_ABI,
    functionName: 'getLatestCO2Data',
  });

  const { data: forestData, refetch: refetchForest } = useReadContract({
    address: ORACLE_ADDRESSES.forest as `0x${string}`,
    abi: ENVIRONMENTAL_ORACLE_ABI,
    functionName: 'getLatestForestCoverData',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // Refetch real oracle data every 30 seconds
      refetchPM25();
      refetchCO2();
      refetchForest();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [refetchPM25, refetchCO2, refetchForest]);

  const formatValue = (value: bigint | undefined, decimals: number = 2) => {
    if (!value) return '0.00';
    return (Number(value) / 100).toFixed(decimals);
  };

  const getStatusColor = (value: number, type: 'pm25' | 'co2' | 'forest') => {
    switch (type) {
      case 'pm25':
        if (value <= 12) return 'text-green-600';
        if (value <= 35) return 'text-yellow-600';
        return 'text-red-600';
      case 'co2':
        if (value <= 400) return 'text-green-600';
        if (value <= 450) return 'text-yellow-600';
        if (value <= 500) return 'text-orange-600';
        return 'text-red-600';
      case 'forest':
        if (value >= 70) return 'text-green-600';
        if (value >= 50) return 'text-yellow-600';
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (value: number, type: 'pm25' | 'co2' | 'forest') => {
    switch (type) {
      case 'pm25':
        if (value <= 12) return '🟢';
        if (value <= 35) return '🟡';
        return '🔴';
      case 'co2':
        if (value <= 400) return '🟢';
        if (value <= 450) return '🟡';
        if (value <= 500) return '🟠';
        return '🔴';
      case 'forest':
        if (value >= 70) return '🟢';
        if (value >= 50) return '🟡';
        return '🔴';
      default:
        return '⚪';
    }
  };

  // Convert real oracle data (stored as integers with 2 decimal places)
  const pm25Value = pm25Data ? Number(pm25Data) / 100 : 0;
  const co2Value = co2Data ? Number(co2Data) / 100 : 0;
  const forestValue = forestData ? Number(forestData) / 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">🌍 Live Environmental Data</h2>
        <div className="flex items-center text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PM2.5 Data */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🏭</span>
              <h3 className="text-lg font-semibold text-gray-900">PM2.5 Levels</h3>
            </div>
            <span className="text-xl">{getStatusIcon(pm25Value, 'pm25')}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-baseline">
              <span className={`text-3xl font-bold ${getStatusColor(pm25Value, 'pm25')}`}>
                {pm25Value.toFixed(2)}
              </span>
              <span className="text-gray-500 ml-2">μg/m³</span>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>WHO Guideline: ≤ 15 μg/m³</p>
              <p className="text-xs mt-1">
                Oracle: {ORACLE_ADDRESSES.pm25.slice(0, 8)}...
              </p>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Good (0-12)</span>
                <span>Hazardous (55+)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    pm25Value <= 12 ? 'bg-green-500' : 
                    pm25Value <= 35 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((pm25Value / 55) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* CO2 Data */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🏭</span>
              <h3 className="text-lg font-semibold text-gray-900">CO2 Levels</h3>
            </div>
            <span className="text-xl">{getStatusIcon(co2Value, 'co2')}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline">
              <span className={`text-3xl font-bold ${getStatusColor(co2Value, 'co2')}`}>
                {co2Value.toFixed(2)}
              </span>
              <span className="text-gray-500 ml-2">ppm</span>
            </div>

            <div className="text-sm text-gray-600">
              <p>Atmospheric CO2 Concentration</p>
              <p className="text-xs mt-1">
                Oracle: {ORACLE_ADDRESSES.co2.slice(0, 8)}...
              </p>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Good (≤400)</span>
                <span>Moderate (401-450)</span>
                <span>High (451+)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    co2Value <= 400 ? 'bg-green-500' :
                    co2Value <= 450 ? 'bg-yellow-500' :
                    co2Value <= 500 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((co2Value / 600) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Forest Cover Data */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🌳</span>
              <h3 className="text-lg font-semibold text-gray-900">Forest Cover</h3>
            </div>
            <span className="text-xl">{getStatusIcon(forestValue, 'forest')}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-baseline">
              <span className={`text-3xl font-bold ${getStatusColor(forestValue, 'forest')}`}>
                {forestValue.toFixed(1)}
              </span>
              <span className="text-gray-500 ml-2">%</span>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Global Average: ~31%</p>
              <p className="text-xs mt-1">
                Oracle: {ORACLE_ADDRESSES.forest.slice(0, 8)}...
              </p>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Critical (0-30)</span>
                <span>Excellent (70+)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    forestValue >= 70 ? 'bg-green-500' : 
                    forestValue >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${forestValue}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Source Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">📡 Data Sources</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
          <div>
            <p><strong>PM2.5:</strong> NASA Earth Data + OpenAQ API updated every 30 seconds</p>
          </div>
          <div>
            <p><strong>CO2:</strong> NASA POWER API + NOAA data updated every 30 seconds</p>
          </div>
          <div>
            <p><strong>Forest Cover:</strong> NASA MODIS + Global Forest Watch updated every 30 seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
}
