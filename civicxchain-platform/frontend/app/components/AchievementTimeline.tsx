'use client';

import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '../../config/contracts';
import { CIVIC_GOVERNANCE_ABI } from '../../config/governance-abi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { EnvironmentalTrendService, TrendAnalysis } from '../services/environmentalTrendService';

// Environmental Trend Chart Component
function EnvironmentalTrendChart({
  metric,
  targetValue,
  period = 'daily'
}: {
  metric: string;
  targetValue?: number;
  period?: 'hourly' | 'daily' | 'weekly' | 'monthly';
}) {
  const [trendData, setTrendData] = useState<TrendAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>(period);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        setLoading(true);
        const analysis = await EnvironmentalTrendService.getTrendAnalysis(
          metric,
          selectedPeriod,
          selectedPeriod === 'hourly' ? 24 : selectedPeriod === 'daily' ? 30 : selectedPeriod === 'weekly' ? 12 : 6,
          targetValue
        );
        setTrendData(analysis);
      } catch (error) {
        console.error('Error fetching trend data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
    const interval = setInterval(fetchTrendData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [metric, targetValue, selectedPeriod]);

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-4 w-1/3"></div>
          <div className="h-48 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!trendData) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <p className="text-gray-400">Unable to load trend data</p>
      </div>
    );
  }

  const chartData = trendData.data.map(point => ({
    timestamp: point.timestamp,
    time: new Date(point.timestamp).toLocaleDateString(),
    value: point.average,
    target: targetValue || 0,
    dataPoints: point.dataPointCount
  }));

  const getTrendIcon = () => {
    switch (trendData.currentTrend.direction) {
      case 'improving': return '📈 ';
      case 'worsening': return '📉 ';
      default: return '➡️ ';
    }
  };

  const getTrendColor = () => {
    switch (trendData.currentTrend.direction) {
      case 'improving': return 'text-green-400';
      case 'worsening': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getMetricUnit = () => {
    switch (metric) {
      case 'pm25': return 'μg/m³';
      case 'aqi': return 'AQI';
      case 'forest_cover': return '%';
      default: return '';
    }
  };

  const getMetricName = () => {
    switch (metric) {
      case 'pm25': return 'PM2.5 Levels';
      case 'aqi': return 'Air Quality Index';
      case 'forest_cover': return 'Forest Cover';
      default: return metric.toUpperCase();
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {getTrendIcon()}{getMetricName()} Trend
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <span className={`font-medium ${getTrendColor()}`}>
              {trendData.currentTrend.direction.charAt(0).toUpperCase() + trendData.currentTrend.direction.slice(1)}
            </span>
            {targetValue && (
              <span className={`px-2 py-1 rounded text-xs ${
                trendData.commitmentStatus.isMet
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {trendData.commitmentStatus.isMet ? '✅ Target Met' : '❌ Above Target'}
              </span>
            )}
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-1">
          {(['hourly', 'daily', 'weekly', 'monthly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                selectedPeriod === p
                  ? 'bg-blue-500/30 text-blue-400 border border-blue-500/50'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="time"
              stroke="#9CA3AF"
              fontSize={12}
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
              tick={{ fill: '#9CA3AF' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
              formatter={(value: any, name: string) => [
                `${Number(value).toFixed(2)} ${getMetricUnit()}`,
                name === 'value' ? getMetricName() : 'Target'
              ]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            {targetValue && (
              <Line
                type="monotone"
                dataKey="target"
                stroke="#EF4444"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-gray-400">Current Avg:</span>
          <div className="text-white font-medium">
            {trendData.commitmentStatus.averageValue.toFixed(2)} {getMetricUnit()}
          </div>
        </div>
        {targetValue && (
          <div>
            <span className="text-gray-400">Target:</span>
            <div className="text-white font-medium">
              {targetValue.toFixed(2)} {getMetricUnit()}
            </div>
          </div>
        )}
        <div>
          <span className="text-gray-400">Data Points:</span>
          <div className="text-white font-medium">
            {trendData.commitmentStatus.periodsChecked} periods
          </div>
        </div>
        <div>
          <span className="text-gray-400">Trend:</span>
          <div className={`font-medium ${getTrendColor()}`}>
            {Math.abs(trendData.currentTrend.value).toFixed(2)} {getMetricUnit()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component to display individual commitment with trend-based evaluation
function AchievementCommitmentCard({ commitmentId, currentPM25FromOracle }: {
  commitmentId: bigint,
  currentPM25FromOracle: bigint | undefined
}) {
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { data: commitment } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
    functionName: 'getCommitment',
    args: [commitmentId],
  });

  useEffect(() => {
    if (commitment) {
      const commitmentData = commitment as any;
      const targetValue = Number(commitmentData.targetValue || 0) / 100;

      // Fetch trend analysis for this commitment
      EnvironmentalTrendService.getTrendAnalysis('pm25', 'daily', 7, targetValue)
        .then(setTrendAnalysis)
        .catch(console.error);
    }
  }, [commitment]);

  // Delete function - same as Judge Panel
  const deleteCommitment = () => {
    console.log('🗑️ Deleting commitment locally:', commitmentId.toString());

    // Mark as cancelled in localStorage
    const cancelled = JSON.parse(localStorage.getItem('cancelledCommitments') || '{}');
    cancelled[commitmentId.toString()] = {
      cancelled: true,
      timestamp: Date.now(),
      reason: 'Judge deleted from Achievement Timeline'
    };
    localStorage.setItem('cancelledCommitments', JSON.stringify(cancelled));

    // Close modal and refresh
    setShowCancelConfirm(false);
    setTimeout(() => window.location.reload(), 100);
  };

  if (!commitment) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 animate-pulse">
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  // Access commitment properties
  const commitmentData = commitment as any; // Type cast to access properties
  const deadlineDate = new Date(Number(commitmentData.deadline || 0) * 1000);
  const isExpired = deadlineDate < new Date();
  const targetValue = Number(commitmentData.targetValue || 0) / 100;
  const currentValue = currentPM25FromOracle ? Number(currentPM25FromOracle) / 100 : 0;

  // Use trend-based evaluation instead of instantaneous values
  const isAchieved = trendAnalysis ? trendAnalysis.commitmentStatus.isMet : currentValue <= targetValue;
  const averageValue = trendAnalysis ? trendAnalysis.commitmentStatus.averageValue : currentValue;

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {commitmentData.description || `Commitment #${commitmentId}`}
          </h3>
          <p className="text-sm text-gray-400">
            By: {commitmentData.officialName || 'Unknown Official'}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isAchieved ? 'bg-green-500/20 text-green-400' :
          isExpired ? 'bg-red-500/20 text-red-400' :
          'bg-yellow-500/20 text-yellow-400'
        }`}>
          {isAchieved ? '✅ Achieved' : isExpired ? '❌ Expired' : '⏳ Pending'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <span className="text-gray-400">Target:</span>
          <span className="text-white ml-2">{targetValue} μg/m³</span>
        </div>
        <div>
          <span className="text-gray-400">7-Day Average:</span>
          <span className="text-white ml-2">{averageValue.toFixed(2)} μg/m³</span>
        </div>
        <div>
          <span className="text-gray-400">Current:</span>
          <span className="text-gray-300 ml-2 text-xs">{currentValue.toFixed(2)} μg/m³ (live)</span>
        </div>
        <div>
          <span className="text-gray-400">Trend:</span>
          <span className={`ml-2 ${
            trendAnalysis?.currentTrend.direction === 'improving' ? 'text-green-400' :
            trendAnalysis?.currentTrend.direction === 'worsening' ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {trendAnalysis?.currentTrend.direction === 'improving' ? '📈 Improving' :
             trendAnalysis?.currentTrend.direction === 'worsening' ? '📉 Worsening' : '➡️ Stable'}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Deadline:</span>
          <span className="text-white ml-2">{deadlineDate.toLocaleDateString()}</span>
        </div>
        <div>
          <span className="text-gray-400">Status:</span>
          <span className={`ml-2 ${isAchieved ? 'text-green-400' : 'text-yellow-400'}`}>
            {isAchieved ? 'Target Met (7-day avg)' : 'Above Target'}
          </span>
        </div>
      </div>

      {/* Mini trend indicator */}
      {trendAnalysis && (
        <div className="mb-4 p-3 bg-gray-700/30 rounded-lg">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">
              Evaluation based on 7-day average vs instantaneous reading
            </span>
            <span className={`px-2 py-1 rounded ${
              trendAnalysis.commitmentStatus.isMet
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {trendAnalysis.commitmentStatus.periodsChecked} days of data
            </span>
          </div>
        </div>
      )}

      {/* Actions - Role-based access control */}
      <div className="flex gap-2 justify-between items-center">
        {isAchieved && (
          <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded border border-blue-500/30 text-sm">
            📊 View Details
          </button>
        )}

        {/* Delete Button - Same as Judge Panel */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowCancelConfirm(true);
          }}
          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all"
          title="Delete this commitment"
        >
          🗑️ Delete
        </button>
      </div>

      {/* Delete Confirmation - Same as Judge Panel */}
      {showCancelConfirm && (
        <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-400 text-sm mb-3">
            ⚠️ Are you sure you want to delete this commitment? This will remove it from the display only (no blockchain transaction).
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={deleteCommitment}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium"
            >
              Yes, Delete
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowCancelConfirm(false);
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-medium"
            >
              No, Keep
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


interface AchievementEvent {
  commitmentId: number;
  description: string;
  targetValue: number;
  currentValue: number;
  achievedAt: Date;
  status: 'achieved' | 'pending' | 'failed';
  official: string;
  rewardClaimed: boolean;
  isCompleted: boolean;
  judgeVerified: boolean;
  isExpired: boolean;
  eligibleForReward: boolean;
  firstAchievedAt: string | null;
  lastAchievedAt: string | null;
  achievementCount: number;
  maxValueReached: number;
}

export default function AchievementTimeline() {
  const [achievements, setAchievements] = useState<AchievementEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPM25, setCurrentPM25] = useState<number>(0);
  const [selectedCommitment, setSelectedCommitment] = useState<number | null>(null);

  // Get ALL commitments from ALL users using GOVERNANCE_CONTRACT
  const { data: allCommitmentIds } = useReadContract({
    address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
    abi: CIVIC_GOVERNANCE_ABI,
    functionName: 'nextCommitmentId',
  });

  // Get current PM2.5 from oracle (EXACT same as Live Feed CommitmentCard)
  const { data: currentPM25FromOracle } = useReadContract({
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

  console.log('🔍 AchievementTimeline Debug (REAL CHAINLINK ORACLE):', {
    allCommitmentIds: allCommitmentIds?.toString(),
    currentPM25FromOracle: currentPM25FromOracle?.toString(),
    oracleAddress: CONTRACT_CONFIG.ENVIRONMENTAL_ORACLE,
    contractAddress: CONTRACT_CONFIG.GOVERNANCE_CONTRACT,
    dataSource: 'REAL Chainlink Oracle (updated with fresh data)'
  });

  // Create individual commitment components (EXACT same as Live Feed)
  const achievementEvents: AchievementEvent[] = [];
  if (allCommitmentIds && Number(allCommitmentIds) > 1) {
    for (let i = 1; i < Number(allCommitmentIds); i++) {
      // Use direct useReadContract for each commitment (EXACT same as Live Feed)
      const commitmentId = BigInt(i);

      // This will be rendered as individual components
      achievementEvents.push({
        commitmentId: i,
        description: `Commitment #${i}`,
        targetValue: 0, // Will be filled by individual components
        currentValue: currentPM25FromOracle ? Number(currentPM25FromOracle) / 100 : 0,
        achievedAt: new Date(),
        status: 'pending',
        official: 'Loading...',
        rewardClaimed: false,
        isCompleted: false,
        judgeVerified: false,
        isExpired: false,
        eligibleForReward: false,
        firstAchievedAt: null,
        lastAchievedAt: null,
        achievementCount: 0,
        maxValueReached: 0
      });
    }
  }

  // Set achievements immediately (no async loading needed)
  useEffect(() => {
    setAchievements(achievementEvents);
    setCurrentPM25(currentPM25FromOracle ? Number(currentPM25FromOracle) / 100 : 0);
    setLoading(false);
  }, [allCommitmentIds, currentPM25FromOracle]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        <span className="ml-3 text-gray-300">Loading achievements...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">🏆 Achievement Timeline</h2>
        <p className="text-gray-400">
          Track environmental commitment achievements using time-averaged Chainlink oracle data
        </p>
        <div className="mt-4 text-sm text-cyan-400">
          Live Environmental Data: {currentPM25FromOracle ? 'Connected to Oracle' : 'Loading...'}
        </div>
      </div>

      {/* Environmental Trend Charts */}
      <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6">
        <h3 className="text-xl font-bold text-white mb-6">📊 Environmental Data Trends</h3>
        <p className="text-gray-400 mb-6">
          Real-time trend analysis showing hourly/daily/weekly/monthly averages to determine if commitments are being met consistently
        </p>

        <div className="space-y-6">
          {/* PM2.5 Trend Chart */}
          <EnvironmentalTrendChart
            metric="pm25"
            targetValue={23} // Example target from the commitment shown in screenshot
            period="daily"
          />

          {/* AQI Trend Chart */}
          <EnvironmentalTrendChart
            metric="aqi"
            targetValue={50} // Good AQI threshold
            period="daily"
          />

          {/* Forest Cover Trend Chart */}
          <EnvironmentalTrendChart
            metric="forest_cover"
            targetValue={70} // Example forest cover target
            period="weekly"
          />
        </div>
      </div>

      {/* Achievement Timeline */}
      <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6">
        <h3 className="text-xl font-bold text-white mb-6">📈 Environmental Achievements</h3>

        <div className="space-y-4">
          {!allCommitmentIds || Number(allCommitmentIds) <= 1 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No commitments found on blockchain</p>
              <p className="text-sm text-gray-500 mt-2">
                Total commitments: {allCommitmentIds ? Number(allCommitmentIds) - 1 : 0}
              </p>
            </div>
          ) : (
            <>
              {(() => {
                // Filter out cancelled commitments (same as Live Feed and Judge Panel)
                const cancelledCommitments = JSON.parse(localStorage.getItem('cancelledCommitments') || '{}');
                const allCommitmentArray = Array.from({ length: Number(allCommitmentIds) - 1 }, (_, i) => i + 1);
                const activeCommitments = allCommitmentArray.filter(id => !cancelledCommitments[id.toString()]?.cancelled);

                console.log('🔍 Achievement Timeline Filtering:', {
                  totalCommitments: allCommitmentArray.length,
                  cancelledCommitments,
                  activeCommitments: activeCommitments.length
                });

                return (
                  <>
                    <p className="text-sm text-gray-400 mb-4">
                      Showing {activeCommitments.length} active commitments from blockchain (filtered like Live Feed)
                    </p>
                    {activeCommitments.map((commitmentId) => (
                      <AchievementCommitmentCard
                        key={commitmentId}
                        commitmentId={BigInt(commitmentId)}
                        currentPM25FromOracle={currentPM25FromOracle}
                      />
                    ))}
                  </>
                );
              })()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
