import React, { useState, useEffect } from 'react';

interface EnvironmentalDataViewerProps {
  commitmentId: string;
}

export default function EnvironmentalDataViewer({ commitmentId }: EnvironmentalDataViewerProps) {
  const [environmentalData, setEnvironmentalData] = useState<any>(null);

  useEffect(() => {
    fetchEnvironmentalData();
    const interval = setInterval(fetchEnvironmentalData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [commitmentId]);

  const fetchEnvironmentalData = async () => {
    // Mock real-time environmental data
    // In production, this would fetch from your backend API
    setEnvironmentalData({
      air_quality: {
        pm25: 15.2,
        status: "Good",
        trend: "improving"
      },
      forest_cover: {
        percentage: 78.5,
        change: -0.8,
        status: "declining"
      },
      water_quality: {
        score: 87,
        status: "Good",
        contaminants: "Low"
      },
      satellite_verification: {
        last_update: new Date().toISOString(),
        confidence: 95,
        status: "verified"
      }
    });
  };

  if (!environmentalData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-cyan-400 text-lg">Loading environmental data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Environmental Data Monitor</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Air Quality Card */}
        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-cyan-400/30 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-cyan-400/20 rounded-lg flex items-center justify-center">
              <span className="text-cyan-400 text-lg">🌬️</span>
            </div>
            <h3 className="text-lg font-semibold text-cyan-400">Air Quality</h3>
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">
              {environmentalData.air_quality.pm25} <span className="text-sm text-gray-400">μg/m³</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                environmentalData.air_quality.status === 'Good' 
                  ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-400/30'
              }`}>
                {environmentalData.air_quality.status}
              </span>
            </div>
            
            <div className="text-sm text-gray-400">
              Trend: <span className="text-green-400">{environmentalData.air_quality.trend}</span>
            </div>
          </div>
        </div>

        {/* Forest Cover Card */}
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-emerald-400/30 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-emerald-400/20 rounded-lg flex items-center justify-center">
              <span className="text-emerald-400 text-lg">🌳</span>
            </div>
            <h3 className="text-lg font-semibold text-emerald-400">Forest Cover</h3>
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">
              {environmentalData.forest_cover.percentage}<span className="text-sm text-gray-400">%</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                environmentalData.forest_cover.change < 0 
                  ? 'bg-red-500/20 text-red-400 border border-red-400/30' 
                  : 'bg-green-500/20 text-green-400 border border-green-400/30'
              }`}>
                {environmentalData.forest_cover.change > 0 ? '+' : ''}{environmentalData.forest_cover.change}%
              </span>
            </div>
            
            <div className="text-sm text-gray-400">
              Change since last year
            </div>
          </div>
        </div>

        {/* Water Quality Card */}
        <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-400/30 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-400/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400 text-lg">💧</span>
            </div>
            <h3 className="text-lg font-semibold text-blue-400">Water Quality</h3>
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">
              {environmentalData.water_quality.score}<span className="text-sm text-gray-400">/100</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-400/30">
                {environmentalData.water_quality.status}
              </span>
            </div>
            
            <div className="text-sm text-gray-400">
              Contaminants: <span className="text-green-400">{environmentalData.water_quality.contaminants}</span>
            </div>
          </div>
        </div>

        {/* Satellite Verification Card */}
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-400/30 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-purple-400/20 rounded-lg flex items-center justify-center">
              <span className="text-purple-400 text-lg">🛰️</span>
            </div>
            <h3 className="text-lg font-semibold text-purple-400">Satellite Data</h3>
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">
              {environmentalData.satellite_verification.confidence}<span className="text-sm text-gray-400">%</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-400/30">
                {environmentalData.satellite_verification.status}
              </span>
            </div>
            
            <div className="text-sm text-gray-400">
              Updated: {new Date(environmentalData.satellite_verification.last_update).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Data Stream Indicator */}
      <div className="mt-8 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">Live Data Stream</span>
        </div>
        <p className="text-gray-400 text-sm">
          Environmental data is updated every 30 seconds from satellite feeds and ground sensors.
          Last update: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}