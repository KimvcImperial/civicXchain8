'use client';

import React from 'react';
import { useOracleData, calculateAQI, getAQIStatus } from '../hooks/useOracleData';

interface OracleDataDisplayProps {
  className?: string;
}

export default function OracleDataDisplay({ className = '' }: OracleDataDisplayProps) {
  const { oracleData, isLoading, error, refetch } = useOracleData();

  if (isLoading) {
    return (
      <div className={`bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6 ${className}`}>
        <div className="text-3xl mb-3">🔄</div>
        <h3 className="text-cyan-400 font-semibold mb-2">Loading Oracle Data...</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded mb-2"></div>
          <div className="h-4 bg-gray-600 rounded mb-2"></div>
          <div className="h-4 bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-black/30 backdrop-blur-xl rounded-xl border border-red-500/20 p-6 ${className}`}>
        <div className="text-3xl mb-3">⚠️</div>
        <h3 className="text-red-400 font-semibold mb-2">Oracle Data Error</h3>
        <p className="text-gray-300 text-sm mb-3">{error}</p>
        <button 
          onClick={refetch}
          className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!oracleData) {
    return (
      <div className={`bg-black/30 backdrop-blur-xl rounded-xl border border-gray-500/20 p-6 ${className}`}>
        <div className="text-3xl mb-3">📊</div>
        <h3 className="text-gray-400 font-semibold mb-2">No Oracle Data</h3>
        <p className="text-gray-300 text-sm">Oracle data not available</p>
      </div>
    );
  }

  // Calculate AQI from PM2.5
  const aqi = calculateAQI(oracleData.pm25.value);
  const aqiStatus = getAQIStatus(aqi);

  return (
    <div className={`bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-3xl">🌍</div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400">LIVE</span>
        </div>
      </div>
      
      <h3 className="text-cyan-400 font-semibold mb-2">Live Chainlink Oracle Data</h3>
      <p className="text-gray-300 text-sm mb-4">Real-time environmental data from blockchain oracles</p>
      
      <div className="space-y-3">
        {/* PM2.5 Data */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏭</span>
            <span className="text-sm text-gray-300">PM2.5</span>
          </div>
          <div className="text-right">
            <div className="text-cyan-300 font-mono text-sm">
              {oracleData.pm25.value !== null ? oracleData.pm25.value.toFixed(2) : '--'} μg/m³
            </div>
            <div className="text-xs text-gray-400">
              {oracleData.pm25.status === 'live' ? '✅ Live' : '❌ Error'}
            </div>
          </div>
        </div>

        {/* AQI (calculated from PM2.5) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🌬️</span>
            <span className="text-sm text-gray-300">Air Quality Index</span>
          </div>
          <div className="text-right">
            <div className={`font-mono text-sm ${aqiStatus.color}`}>
              {aqi} AQI
            </div>
            <div className={`text-xs ${aqiStatus.color}`}>
              {aqiStatus.status}
            </div>
          </div>
        </div>

        {/* CO2 Data */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🌍</span>
            <span className="text-sm text-gray-300">CO2</span>
          </div>
          <div className="text-right">
            <div className="text-cyan-300 font-mono text-sm">
              {oracleData.co2.value !== null ? oracleData.co2.value.toFixed(1) : '--'} ppm
            </div>
            <div className="text-xs text-gray-400">
              {oracleData.co2.status === 'live' ? '✅ Live' : '❌ Error'}
            </div>
          </div>
        </div>



        {/* Forest Cover Data */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🌳</span>
            <span className="text-sm text-gray-300">Forest Cover</span>
          </div>
          <div className="text-right">
            <div className="text-green-400 font-mono text-sm">
              {oracleData.forestCover.value !== null ? oracleData.forestCover.value.toFixed(1) : '--'}%
            </div>
            <div className="text-xs text-gray-400">
              {oracleData.forestCover.status === 'live' ? '✅ Live' : '❌ Error'}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-600/30">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Data sourced from Chainlink Oracles</span>
          <button 
            onClick={refetch}
            className="hover:text-cyan-400 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
