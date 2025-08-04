'use client';

import React, { useState, useEffect } from 'react';
import { AchievementMonitorService, AchievementDetection } from '../services/achievementMonitorService';

interface VerificationLog {
  timestamp: string;
  commitmentId: number;
  status: 'success' | 'failed' | 'pending' | 'error';
  message: string;
  oracleData?: {
    pm25: number;
    co2: number;
    forest: number;
  };
  gasUsed?: string;
  transactionHash?: string;
}

interface SystemStats {
  isRunning: boolean;
  lastUpdate: string;
  totalVerifications: number;
  successfulVerifications: number;
  failedVerifications: number;
  uptime: string;
  nextCheck: string;
}

export default function AutoVerificationMonitor() {
  const [logs, setLogs] = useState<VerificationLog[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    isRunning: false,
    lastUpdate: 'Never',
    totalVerifications: 0,
    successfulVerifications: 0,
    failedVerifications: 0,
    uptime: '0m',
    nextCheck: 'Unknown'
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [achievements, setAchievements] = useState<AchievementDetection[]>([]);
  const [monitorService] = useState(() => AchievementMonitorService.getInstance());

  // Initialize achievement monitoring
  useEffect(() => {
    console.log('🚀 Auto Monitor: useEffect triggered - initializing monitoring');
    const initializeMonitoring = async () => {
      try {
        console.log('🔗 Auto Monitor: Fetching commitments from /api/blockchain/commitments');
        // Fetch commitments directly from blockchain (same as Judge Panel)
        const response = await fetch('/api/blockchain/commitments');
        console.log('📡 Auto Monitor: Response status:', response.status);
        if (response.ok) {
          const commitments = await response.json();
          console.log('🤖 Auto Monitor: Fetched', commitments.length, 'commitments from blockchain');

          // Start monitoring
          monitorService.startMonitoring(commitments);

          // Set up achievement callback
          monitorService.onAchievementUpdate((achievementsList) => {
            setAchievements(achievementsList);

            // Update stats based on achievements
            const monitorStats = monitorService.getStats();
            setStats(prev => ({
              ...prev,
              isRunning: true,
              totalVerifications: monitorStats.total,
              successfulVerifications: monitorStats.successful,
              failedVerifications: monitorStats.failed,
              uptime: monitorStats.uptime,
              lastUpdate: new Date().toLocaleTimeString(),
              nextCheck: 'Next check in 10s'
            }));

            // Add achievement logs
            achievementsList.forEach(achievement => {
              if (achievement.isAchieved) {
                const newLog: VerificationLog = {
                  timestamp: new Date().toLocaleTimeString(),
                  commitmentId: parseInt(achievement.commitmentId),
                  status: 'success',
                  message: `Target achieved! PM2.5 (${achievement.currentValue.toFixed(2)}) ≤ ${achievement.targetValue}`,
                  oracleData: {
                    pm25: achievement.currentValue,
                    co2: 0,
                    forest: 0
                  }
                };
                setLogs(prev => [newLog, ...prev.slice(0, 19)]); // Keep last 20 logs
              }
            });
          });
        }
      } catch (error) {
        console.error('Error initializing achievement monitoring:', error);
      }
    };

    initializeMonitoring();

    return () => {
      monitorService.stopMonitoring();
    };
  }, [monitorService]);

  // Real-time monitoring connected to verification system API
  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/status');
        if (response.ok) {
          const data = await response.json();
          setStats(prev => ({
            ...prev,
            // Keep our achievement monitoring stats but update external system info
            lastUpdate: data.lastUpdateFormatted || prev.lastUpdate,
            nextCheck: data.nextCheck || prev.nextCheck
          }));
        }
      } catch (error) {
        console.log('External verification system API not available');
      }
    };

    const fetchLogs = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/logs?limit=20');
        if (response.ok) {
          const data = await response.json();
          const formattedLogs = data.map((log: any) => ({
            timestamp: log.timestampFormatted,
            commitmentId: log.commitmentId || 0,
            status: log.status,
            message: log.message,
            oracleData: log.oracleData,
            gasUsed: log.gasUsed,
            transactionHash: log.transactionHash
          }));
          setLogs(formattedLogs);
        }
      } catch (error) {
        console.log('Could not fetch logs from verification system');
      }
    };

    // Initial fetch
    fetchSystemStatus();
    fetchLogs();

    // Set up polling
    const statusInterval = setInterval(fetchSystemStatus, 10000); // Every 10 seconds
    const logsInterval = setInterval(fetchLogs, 15000); // Every 15 seconds

    return () => {
      clearInterval(statusInterval);
      clearInterval(logsInterval);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      case 'error': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'failed': return '❌';
      case 'pending': return '⏳';
      case 'error': return '🚨';
      default: return '❓';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-cyan-500/30 overflow-hidden">
      {/* Header */}
      <div 
        className="p-4 bg-gray-800 border-b border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${stats.isRunning ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <h3 className="text-lg font-semibold text-cyan-400">
              🤖 Automatic Verification System
            </h3>
            <span className={`text-sm px-2 py-1 rounded ${stats.isRunning ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {stats.isRunning ? 'RUNNING' : 'STOPPED'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              Next check: {stats.nextCheck}
            </div>
            <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              ⬇️
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* System Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalVerifications}</div>
              <div className="text-xs text-gray-400">Total Verifications</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.successfulVerifications}</div>
              <div className="text-xs text-gray-400">Successful</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-400">{stats.failedVerifications}</div>
              <div className="text-xs text-gray-400">Failed</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-cyan-400">{stats.uptime}</div>
              <div className="text-xs text-gray-400">Uptime</div>
            </div>
          </div>

          {/* Real-time Logs */}
          <div>
            <h4 className="text-md font-semibold text-white mb-3 flex items-center">
              📋 Verification Logs
              <span className="ml-2 text-xs text-gray-400">({logs.length} entries)</span>
            </h4>
            
            <div className="bg-black rounded-lg p-4 max-h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  <div className="text-2xl mb-2">🔍</div>
                  <div>Monitoring {achievements.length} commitments for achievements...</div>
                  {achievements.length > 0 && (
                    <div className="text-xs text-gray-400 mt-2">
                      Environmental Data: {achievements[0]?.currentValue ? 'Connected' : 'Loading...'}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div key={index} className="border-l-2 border-gray-600 pl-4 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span>{getStatusIcon(log.status)}</span>
                          <span className={`font-mono text-sm ${getStatusColor(log.status)}`}>
                            {log.status.toUpperCase()}
                          </span>
                          {log.commitmentId > 0 && (
                            <span className="text-xs text-gray-400">
                              Commitment #{log.commitmentId}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{log.timestamp}</span>
                      </div>
                      
                      <div className="text-sm text-gray-300 mb-2">{log.message}</div>
                      
                      {log.oracleData && (
                        <div className="text-xs text-gray-400 grid grid-cols-3 gap-2">
                          <div>PM2.5: {log.oracleData.pm25} μg/m³</div>
                          <div>CO2: {log.oracleData.co2} ppm</div>
                          <div>Forest: {log.oracleData.forest}%</div>
                        </div>
                      )}
                      
                      {log.transactionHash && (
                        <div className="text-xs text-blue-400 mt-1">
                          Tx: {log.transactionHash} (Gas: {log.gasUsed})
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Control Panel */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Last update: {stats.lastUpdate}
            </div>
            <div className="space-x-2">
              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                📊 View Details
              </button>
              <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors">
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
