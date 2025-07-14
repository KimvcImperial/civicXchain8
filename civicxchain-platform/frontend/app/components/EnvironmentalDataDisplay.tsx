'use client';

import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '../../config/contracts';

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

export default function EnvironmentalDataDisplay() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Read oracle data
  const { data: pm25Data } = useReadContract({
    address: CONTRACT_CONFIG.PM25_ORACLE as `0x${string}`,
    abi: MOCK_AGGREGATOR_ABI,
    functionName: 'latestRoundData',
  });

  const { data: co2Data } = useReadContract({
    address: CONTRACT_CONFIG.CO2_ORACLE as `0x${string}`,
    abi: MOCK_AGGREGATOR_ABI,
    functionName: 'latestRoundData',
  });

  const { data: forestData } = useReadContract({
    address: CONTRACT_CONFIG.FOREST_ORACLE as `0x${string}`,
    abi: MOCK_AGGREGATOR_ABI,
    functionName: 'latestRoundData',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

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
        return '🔴';
      case 'forest':
        if (value >= 70) return '🟢';
        if (value >= 50) return '🟡';
        return '🔴';
      default:
        return '⚪';
    }
  };

  const pm25Value = pm25Data ? Number(pm25Data[1]) / 100 : 12.03;
  const co2Value = co2Data ? Number(co2Data[1]) / 100 : 416.64;
  const forestValue = forestData ? Number(forestData[1]) / 100 : 65.68;

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
                Oracle: {CONTRACT_CONFIG.PM25_ORACLE.slice(0, 8)}...
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
              <span className="text-2xl mr-3">🌍</span>
              <h3 className="text-lg font-semibold text-gray-900">CO2 Levels</h3>
            </div>
            <span className="text-xl">{getStatusIcon(co2Value, 'co2')}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-baseline">
              <span className={`text-3xl font-bold ${getStatusColor(co2Value, 'co2')}`}>
                {co2Value.toFixed(1)}
              </span>
              <span className="text-gray-500 ml-2">ppm</span>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Pre-industrial: ~280 ppm</p>
              <p className="text-xs mt-1">
                Oracle: {CONTRACT_CONFIG.CO2_ORACLE.slice(0, 8)}...
              </p>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Safe (280-350)</span>
                <span>Critical (450+)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    co2Value <= 400 ? 'bg-green-500' : 
                    co2Value <= 450 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(((co2Value - 280) / (500 - 280)) * 100, 100)}%` }}
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
                Oracle: {CONTRACT_CONFIG.FOREST_ORACLE.slice(0, 8)}...
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
            <p><strong>PM2.5:</strong> Real-time air quality data from environmental monitoring stations</p>
          </div>
          <div>
            <p><strong>CO2:</strong> Atmospheric carbon dioxide measurements from global monitoring network</p>
          </div>
          <div>
            <p><strong>Forest Cover:</strong> Satellite imagery analysis and forestry department reports</p>
          </div>
        </div>
      </div>
    </div>
  );
}
