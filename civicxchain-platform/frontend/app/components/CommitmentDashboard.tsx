/*'use client';

import { useState, useEffect } from 'react';

// Types (you can import these from your main file or create a shared types file)
interface Commitment {
  id: string;
  title: string;
  description: string;
  category: string;
  target_value: number;
  current_progress: number;
  deadline: string;
  status: string;
  official_name: string;
  official_role: string;
  stake_amount: number;
  created_at: string;
  satellite_verified: boolean;
}

interface CommitmentDashboardProps {
  commitments: Commitment[];
  onUpdateProgress: (commitmentId: string, newProgress: number) => void;
  onClaimReward: (commitmentId: string) => void;
}

export default function CommitmentDashboard({ 
  commitments, 
  onUpdateProgress, 
  onClaimReward 
}: CommitmentDashboardProps) {
  const [selectedCommitment, setSelectedCommitment] = useState<Commitment | null>(null);
  const [progressUpdate, setProgressUpdate] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Filter commitments based on status and category
  const filteredCommitments = commitments.filter(commitment => {
    const statusMatch = filterStatus === 'all' || commitment.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || commitment.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  // Calculate dashboard statistics
  const dashboardStats = {
    total: commitments.length,
    active: commitments.filter(c => c.status === 'active').length,
    completed: commitments.filter(c => c.status === 'completed').length,
    overdue: commitments.filter(c => 
      c.status === 'active' && new Date(c.deadline) < new Date()
    ).length,
    totalStaked: commitments.reduce((sum, c) => sum + c.stake_amount, 0),
    satelliteVerified: commitments.filter(c => c.satellite_verified).length
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'forest_protection': '🌳',
      'air_quality': '🏭',
      'water_management': '💧',
      'biodiversity': '🦋',
      'waste_reduction': '♻️'
    };
    return icons[category] || '🌍';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-green-500 to-emerald-500';
      case 'completed': return 'from-blue-500 to-cyan-500';
      case 'failed': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const isOverdue = (deadline: string, status: string) => {
    return status === 'active' && new Date(deadline) < new Date();
  };

  const handleProgressUpdate = (commitmentId: string) => {
    const newProgress = parseFloat(progressUpdate);
    if (newProgress >= 0 && newProgress <= 100) {
      onUpdateProgress(commitmentId, newProgress);
      setProgressUpdate('');
      setSelectedCommitment(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header *
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <span className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center mr-4">
              📊
            </span>
            Commitment Dashboard
          </h1>
          <p className="text-gray-300">Monitor and manage your environmental commitments</p>
        </div>

        {/* Dashboard Statistics *
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-4">
            <div className="text-cyan-400 text-sm font-medium">Total Commitments</div>
            <div className="text-2xl font-bold text-white">{dashboardStats.total}</div>
          </div>
          <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-green-500/20 p-4">
            <div className="text-green-400 text-sm font-medium">Active</div>
            <div className="text-2xl font-bold text-white">{dashboardStats.active}</div>
          </div>
          <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-blue-500/20 p-4">
            <div className="text-blue-400 text-sm font-medium">Completed</div>
            <div className="text-2xl font-bold text-white">{dashboardStats.completed}</div>
          </div>
          <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-red-500/20 p-4">
            <div className="text-red-400 text-sm font-medium">Overdue</div>
            <div className="text-2xl font-bold text-white">{dashboardStats.overdue}</div>
          </div>
          <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-yellow-500/20 p-4">
            <div className="text-yellow-400 text-sm font-medium">Total Staked</div>
            <div className="text-2xl font-bold text-white">{dashboardStats.totalStaked.toFixed(2)} ETH</div>
          </div>
          <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-purple-500/20 p-4">
            <div className="text-purple-400 text-sm font-medium">Satellite Verified</div>
            <div className="text-2xl font-bold text-white">{dashboardStats.satelliteVerified}</div>
          </div>
        </div>

        {/* Filters *
        <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-gray-500/20 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Status</label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400"
              >
                <option value="all">All Categories</option>
                <option value="forest_protection">🌳 Forest Protection</option>
                <option value="air_quality">🏭 Air Quality</option>
                <option value="water_management">💧 Water Management</option>
                <option value="biodiversity">🦋 Biodiversity</option>
                <option value="waste_reduction">♻️ Waste Reduction</option>
              </select>
            </div>
          </div>
        </div>

        {/* Commitments Grid *
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCommitments.map((commitment) => (
            <div key={commitment.id} className="bg-black/20 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300 shadow-xl">
              {/* Commitment Header *
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-lg">
                      {getCategoryIcon(commitment.category)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{commitment.official_name}</h3>
                    <p className="text-gray-400 text-xs">{commitment.official_role}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(commitment.status)} text-white`}>
                  {commitment.status.toUpperCase()}
                </div>
              </div>

              {/* Commitment Title *
              <h4 className="text-white font-semibold mb-2 line-clamp-2">{commitment.title}</h4>

              {/* Progress Section *
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Progress</span>
                  <span className="font-mono">
                    {commitment.current_progress}% / {commitment.target_value}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r ${getStatusColor(commitment.status)} h-3 rounded-full transition-all duration-1000`} 
                    style={{width: `${calculateProgress(commitment.current_progress, commitment.target_value)}%`}}
                  ></div>
                </div>
              </div>

              {/* Commitment Details *
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Deadline:</span>
                  <span className={`${isOverdue(commitment.deadline, commitment.status) ? 'text-red-400' : 'text-gray-300'}`}>
                    {formatDate(commitment.deadline)}
                    {isOverdue(commitment.deadline, commitment.status) && ' ⚠️'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Stake:</span>
                  <span className="text-gray-300">{commitment.stake_amount} ETH</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Verification:</span>
                  <span className={commitment.satellite_verified ? 'text-green-400' : 'text-yellow-400'}>
                    {commitment.satellite_verified ? '🛰️ Satellite' : '📊 Self-reported'}
                  </span>
                </div>
              </div>

              {/* Action Buttons *
              <div className="flex space-x-2">
                {commitment.status === 'active' && (
                  <button 
                    onClick={() => setSelectedCommitment(commitment)}
                    className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 px-3 py-2 rounded-lg text-sm transition-all duration-300"
                  >
                    Update Progress
                  </button>
                )}
                {commitment.status === 'completed' && (
                  <button 
                    onClick={() => onClaimReward(commitment.id)}
                    className="flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-3 py-2 rounded-lg text-sm transition-all duration-300"
                  >
                    Claim Reward
                  </button>
                )}
                <button className="bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 text-gray-400 px-3 py-2 rounded-lg text-sm transition-all duration-300">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No commitments message *
        {filteredCommitments.length === 0 && (
          <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-gray-500/20 p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-white text-xl mb-2">No commitments found</h3>
            <p className="text-gray-400">Try adjusting your filters or create a new commitment.</p>
          </div>
        )}

        {/* Progress Update Modal *
        {selectedCommitment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-black/80 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-white mb-4">Update Progress</h3>
              <p className="text-gray-300 mb-4">
                Updating progress for: <span className="text-cyan-400">{selectedCommitment.title}</span>
              </p>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  New Progress (Current: {selectedCommitment.current_progress}%)
                </label>
                <input
                  type="number"
                  value={progressUpdate}
                  onChange={(e) => setProgressUpdate(e.target.value)}
                  min="0"
                  max="100"
                  placeholder="Enter new progress percentage"
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleProgressUpdate(selectedCommitment.id)}
                  className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setSelectedCommitment(null);
                    setProgressUpdate('');
                  }}
                  className="flex-1 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 text-gray-400 px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}*/






/*
'use client';

import { useState, useEffect } from 'react';

// Types (you can import these from your main file or create a shared types file)
interface Commitment {
  id: string;
  title: string;
  description: string;
  category: string;
  target_value: number;
  current_progress: number;
  deadline: string;
  status: string;
  official_name: string;
  official_role: string;
  stake_amount: number;
  created_at: string;
  satellite_verified: boolean;
}

interface CommitmentDashboardProps {
  commitments: Commitment[];
  onUpdateProgress: (commitmentId: string, newProgress: number) => void;
  onClaimReward: (commitmentId: string) => void;
  onRefreshData?: () => Promise<void>; // New prop for refresh function
}

export default function CommitmentDashboard({ 
  commitments, 
  onUpdateProgress, 
  onClaimReward,
  onRefreshData
}: CommitmentDashboardProps) {
  const [selectedCommitment, setSelectedCommitment] = useState<Commitment | null>(null);
  const [progressUpdate, setProgressUpdate] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Real-time update states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchCommitments();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Function to fetch fresh commitment data
  const fetchCommitments = async () => {
    try {
      setIsRefreshing(true);
      console.log('Refreshing commitment data...');
      
      // Call the refresh function passed from parent component
      if (onRefreshData) {
        await onRefreshData();
      }
      
      // Update last refresh time
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Manual refresh function
  const handleManualRefresh = () => {
    fetchCommitments();
  };

  // Filter commitments based on status and category
  const filteredCommitments = commitments.filter(commitment => {
    const statusMatch = filterStatus === 'all' || commitment.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || commitment.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  // Calculate dashboard statistics
  const dashboardStats = {
    total: commitments.length,
    active: commitments.filter(c => c.status === 'active').length,
    completed: commitments.filter(c => c.status === 'completed').length,
    overdue: commitments.filter(c => 
      c.status === 'active' && new Date(c.deadline) < new Date()
    ).length,
    totalStaked: commitments.reduce((sum, c) => sum + c.stake_amount, 0),
    satelliteVerified: commitments.filter(c => c.satellite_verified).length
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'forest_protection': '🌳',
      'air_quality': '🏭',
      'water_management': '💧',
      'biodiversity': '🦋',
      'waste_reduction': '♻️'
    };
    return icons[category] || '🌍';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-green-500 to-emerald-500';
      case 'completed': return 'from-blue-500 to-cyan-500';
      case 'failed': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const isOverdue = (deadline: string, status: string) => {
    return status === 'active' && new Date(deadline) < new Date();
  };

  const handleProgressUpdate = (commitmentId: string) => {
    const newProgress = parseFloat(progressUpdate);
    if (newProgress >= 0 && newProgress <= 100) {
      onUpdateProgress(commitmentId, newProgress);
      setProgressUpdate('');
      setSelectedCommitment(null);
      // Refresh data after update
      setTimeout(() => fetchCommitments(), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header with Real-time Controls *
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <span className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center mr-4">
                  📊
                </span>
                Commitment Dashboard
              </h1>
              <p className="text-gray-300">Monitor and manage your environmental commitments</p>
            </div>
            
            {/* Real-time Controls *
            <div className="mt-4 md:mt-0 flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-4">
                {/* Auto-refresh toggle *
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300 text-sm">Auto-refresh</span>
                  <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      autoRefresh ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                      autoRefresh ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>
                
                {/* Manual refresh button *
                <button
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <div className={`w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}></div>
                  <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
              
              {/* Last updated indicator *
              <div className="text-xs text-gray-400">
                Last updated: {formatTime(lastUpdated)}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Update Indicator *
        {isRefreshing && (
          <div className="mb-6 bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-4">
            <div className="flex items-center gap-3 text-cyan-400">
              <div className="animate-spin h-5 w-5 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
              <span className="font-medium">Updating commitment data...</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Statistics *
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-4 relative overflow-hidden">
            {isRefreshing && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse"></div>}
            <div className="text-cyan-400 text-sm font-medium">Total Commitments</div>
            <div className="text-2xl font-bold text-white">{dashboardStats.total}</div>
          </div>
          <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-green-500/20 p-4 relative overflow-hidden">
            {isRefreshing && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-400 animate-pulse"></div>}
            <div className="text-green-400 text-sm font-medium">Active</div>
            <div className="text-2xl font-bold text-white">{dashboardStats.active}</div>
          </div>
          <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-blue-500/20 p-4 relative overflow-hidden">
            {isRefreshing && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse"></div>}
            <div className="text-blue-400 text-sm font-medium">Completed</div>
            <div className="text-2xl font-bold text-white">{dashboardStats.completed}</div>
          </div>
          <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-red-500/20 p-4 relative overflow-hidden">
            {isRefreshing && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-pink-400 animate-pulse"></div>}
            <div className="text-red-400 text-sm font-medium">Overdue</div>
            <div className="text-2xl font-bold text-white">{dashboardStats.overdue}</div>
          </div>
          <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-yellow-500/20 p-4 relative overflow-hidden">
            {isRefreshing && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse"></div>}
            <div className="text-yellow-400 text-sm font-medium">Total Staked</div>
            <div className="text-2xl font-bold text-white">{dashboardStats.totalStaked.toFixed(2)} ETH</div>
          </div>
          <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-purple-500/20 p-4 relative overflow-hidden">
            {isRefreshing && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"></div>}
            <div className="text-purple-400 text-sm font-medium">Satellite Verified</div>
            <div className="text-2xl font-bold text-white">{dashboardStats.satelliteVerified}</div>
          </div>
        </div>

        {/* Filters *
        <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-gray-500/20 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Status</label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400"
              >
                <option value="all">All Categories</option>
                <option value="forest_protection">🌳 Forest Protection</option>
                <option value="air_quality">🏭 Air Quality</option>
                <option value="water_management">💧 Water Management</option>
                <option value="biodiversity">🦋 Biodiversity</option>
                <option value="waste_reduction">♻️ Waste Reduction</option>
              </select>
            </div>
          </div>
        </div>

        {/* Commitments Grid *
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCommitments.map((commitment) => (
            <div key={commitment.id} className={`bg-black/20 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300 shadow-xl relative overflow-hidden ${
              isRefreshing ? 'animate-pulse' : ''
            }`}>
              {/* Real-time update indicator for individual cards *
              {isRefreshing && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse"></div>
              )}
              
              {/* Commitment Header *
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-lg">
                      {getCategoryIcon(commitment.category)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{commitment.official_name}</h3>
                    <p className="text-gray-400 text-xs">{commitment.official_role}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(commitment.status)} text-white flex items-center space-x-1`}>
                  <span>{commitment.status.toUpperCase()}</span>
                  {commitment.satellite_verified && <span className="text-xs">🛰️</span>}
                </div>
              </div>

              {/* Commitment Title *
              <h4 className="text-white font-semibold mb-2 line-clamp-2">{commitment.title}</h4>

              {/* Progress Section with animated bar *
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Progress</span>
                  <span className="font-mono">
                    {commitment.current_progress}% / {commitment.target_value}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r ${getStatusColor(commitment.status)} h-3 rounded-full transition-all duration-1000 ${
                      isRefreshing ? 'animate-pulse' : ''
                    }`} 
                    style={{width: `${calculateProgress(commitment.current_progress, commitment.target_value)}%`}}
                  ></div>
                </div>
              </div>

              {/* Commitment Details *
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Deadline:</span>
                  <span className={`${isOverdue(commitment.deadline, commitment.status) ? 'text-red-400' : 'text-gray-300'}`}>
                    {formatDate(commitment.deadline)}
                    {isOverdue(commitment.deadline, commitment.status) && ' ⚠️'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Stake:</span>
                  <span className="text-gray-300">{commitment.stake_amount} ETH</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Verification:</span>
                  <span className={commitment.satellite_verified ? 'text-green-400' : 'text-yellow-400'}>
                    {commitment.satellite_verified ? '🛰️ Satellite' : '📊 Self-reported'}
                  </span>
                </div>
              </div>

              {/* Action Buttons *
              <div className="flex space-x-2">
                {commitment.status === 'active' && (
                  <button 
                    onClick={() => setSelectedCommitment(commitment)}
                    className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 px-3 py-2 rounded-lg text-sm transition-all duration-300"
                  >
                    Update Progress
                  </button>
                )}
                {commitment.status === 'completed' && (
                  <button 
                    onClick={() => onClaimReward(commitment.id)}
                    className="flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-3 py-2 rounded-lg text-sm transition-all duration-300"
                  >
                    Claim Reward
                  </button>
                )}
                <button className="bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 text-gray-400 px-3 py-2 rounded-lg text-sm transition-all duration-300">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No commitments message *
        {filteredCommitments.length === 0 && (
          <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-gray-500/20 p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-white text-xl mb-2">No commitments found</h3>
            <p className="text-gray-400">Try adjusting your filters or create a new commitment.</p>
          </div>
        )}

        {/* Progress Update Modal *
        {selectedCommitment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-black/80 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-white mb-4">Update Progress</h3>
              <p className="text-gray-300 mb-4">
                Updating progress for: <span className="text-cyan-400">{selectedCommitment.title}</span>
              </p>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  New Progress (Current: {selectedCommitment.current_progress}%)
                </label>
                <input
                  type="number"
                  value={progressUpdate}
                  onChange={(e) => setProgressUpdate(e.target.value)}
                  min="0"
                  max="100"
                  placeholder="Enter new progress percentage"
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleProgressUpdate(selectedCommitment.id)}
                  className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setSelectedCommitment(null);
                    setProgressUpdate('');
                  }}
                  className="flex-1 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 text-gray-400 px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
  */


'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

const API_BASE = 'http://localhost:8000/api';

interface Commitment {
  id: string;
  title: string;
  description: string;
  progress: number;
  target_value: number;
  current_value: number;
  category: string;
  deadline: string;
  official_name: string;
  status: string;
  created_at: string;
}

interface CommitmentForm {
  title: string;
  description: string;
  category: string;
  deadline: string;
  official_name: string;
  official_role: string;
  target_value: number;
  reward_amount: number;
  penalty_amount: number;
}

const CommitmentDashboard: React.FC = () => {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [localProgress, setLocalProgress] = useState<{ [id: string]: number }>({});
  const [newCommitment, setNewCommitment] = useState<CommitmentForm>({
    title: '',
    description: '',
    category: 'environmental',
    deadline: '',
    official_name: '',
    official_role: '',
    target_value: 0,
    reward_amount: 0,
    penalty_amount: 0
  });

  // Fetch commitments from API
  const fetchCommitments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/commitments`);
      if (!response.ok) throw new Error('Failed to fetch commitments');
      const data = await response.json();
      setCommitments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommitments();
  }, []);

  // Handle progress updates
  const handleProgressUpdate = async (commitmentId: string, newProgress: number) => {
    setLocalProgress(prev => ({ ...prev, [commitmentId]: newProgress }));

    try {
      const response = await fetch(`${API_BASE}/commitments/${commitmentId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          progress: newProgress,
          current_value: newProgress
        })
      });

      if (!response.ok) throw new Error('Failed to update progress');
      await fetchCommitments(); // Refresh data
    } catch (error) {
      console.error('Error updating progress:', error);
      // Revert local state on error
      setLocalProgress(prev => {
        const newState = { ...prev };
        delete newState[commitmentId];
        return newState;
      });
    }
  };

  // Handle form submission for new commitment
  const handleCreateCommitment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/commitments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCommitment)
      });

      if (!response.ok) throw new Error('Failed to create commitment');
      
      // Reset form and refresh data
      setNewCommitment({
        title: '',
        description: '',
        category: 'environmental',
        deadline: '',
        official_name: '',
        official_role: '',
        target_value: 0,
        reward_amount: 0,
        penalty_amount: 0
      });
      setShowCreateForm(false);
      await fetchCommitments();
    } catch (error) {
      console.error('Error creating commitment:', error);
      setError('Failed to create commitment');
    }
  };


  // Prepare chart data
  const chartData = commitments.map(commitment => ({
    name: commitment.title.substring(0, 20) + '...',
    Progress: localProgress[commitment.id] ?? commitment.progress,
    Target: commitment.target_value,
    Current: commitment.current_value
  }));

  const categoryData = commitments.reduce((acc, commitment) => {
    const category = commitment.category || 'Other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#00ff88', '#ff0080', '#0080ff', '#ffff00', '#ff8000'];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 text-xl animate-pulse">Loading EcoChain Data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      {/* Cyberpunk Header */}
      <div className="mb-8 border-b border-green-400/30 pb-4">
        <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text mb-2">
          🌍 EcoChain Governance Dashboard
        </h1>
        <p className="text-green-300/70">Real-time Environmental Commitment Tracking</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-400 rounded-lg">
          <div className="text-red-400">⚠️ {error}</div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 
                     text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 
                     shadow-lg hover:shadow-green-400/25"
        >
          {showCreateForm ? '🔙 Cancel' : '✨ Create New Commitment'}
        </button>
        <button
          onClick={fetchCommitments}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-green-400/50 
                     text-green-400 font-bold rounded-lg transition-all duration-300"
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Create Commitment Form */}
      {showCreateForm && (
        <div className="mb-8 p-6 bg-gray-900/50 border border-green-400/30 rounded-lg backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-green-400 mb-4">🌱 Create New Environmental Commitment</h2>
          <form onSubmit={handleCreateCommitment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Commitment Title"
              value={newCommitment.title}
              onChange={(e) => setNewCommitment(prev => ({ ...prev, title: e.target.value }))}
              className="p-3 bg-black border border-green-400/50 rounded-lg text-green-400 placeholder-green-400/50 
                         focus:border-green-400 focus:outline-none"
              required
            />
            <select
              value={newCommitment.category}
              onChange={(e) => setNewCommitment(prev => ({ ...prev, category: e.target.value }))}
              className="p-3 bg-black border border-green-400/50 rounded-lg text-green-400 focus:border-green-400 focus:outline-none"
            >
              <option value="environmental">🌿 Environmental</option>
              <option value="health">🏥 Public Health</option>
              <option value="energy">⚡ Clean Energy</option>
              <option value="water">💧 Water Quality</option>
              <option value="air">🌬️ Air Quality</option>
            </select>
            <input
              type="text"
              placeholder="Official Name"
              value={newCommitment.official_name}
              onChange={(e) => setNewCommitment(prev => ({ ...prev, official_name: e.target.value }))}
              className="p-3 bg-black border border-green-400/50 rounded-lg text-green-400 placeholder-green-400/50 
                         focus:border-green-400 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Official Role"
              value={newCommitment.official_role}
              onChange={(e) => setNewCommitment(prev => ({ ...prev, official_role: e.target.value }))}
              className="p-3 bg-black border border-green-400/50 rounded-lg text-green-400 placeholder-green-400/50 
                         focus:border-green-400 focus:outline-none"
              required
            />
            <input
              type="date"
              value={newCommitment.deadline}
              onChange={(e) => setNewCommitment(prev => ({ ...prev, deadline: e.target.value }))}
              className="p-3 bg-black border border-green-400/50 rounded-lg text-green-400 
                         focus:border-green-400 focus:outline-none"
              required
            />
            <input
              type="number"
              placeholder="Target Value"
              value={newCommitment.target_value}
              onChange={(e) => setNewCommitment(prev => ({ ...prev, target_value: Number(e.target.value) }))}
              className="p-3 bg-black border border-green-400/50 rounded-lg text-green-400 placeholder-green-400/50 
                         focus:border-green-400 focus:outline-none"
              required
            />
            <textarea
              placeholder="Commitment Description"
              value={newCommitment.description}
              onChange={(e) => setNewCommitment(prev => ({ ...prev, description: e.target.value }))}
              className="p-3 bg-black border border-green-400/50 rounded-lg text-green-400 placeholder-green-400/50 
                         focus:border-green-400 focus:outline-none md:col-span-2"
              rows={3}
              required
            />
            <button
              type="submit"
              className="md:col-span-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 
                         hover:from-green-500 hover:to-blue-500 text-white font-bold rounded-lg 
                         transition-all duration-300 transform hover:scale-105"
            >
              🚀 Deploy Commitment to Blockchain
            </button>
          </form>
        </div>
      )}

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commitments List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-green-400 mb-4">📋 Active Commitments</h2>
          {commitments.length === 0 ? (
            <div className="p-8 bg-gray-900/30 border border-green-400/20 rounded-lg text-center">
              <div className="text-green-400/70 text-lg">No commitments found</div>
              <div className="text-green-400/50 text-sm mt-2">Create your first environmental commitment!</div>
            </div>
          ) : (
            commitments.map(commitment => {
              const currentProgress = localProgress[commitment.id] ?? commitment.progress;
              const statusColor = commitment.status === 'completed' ? 'text-green-400' : 
                                commitment.status === 'active' ? 'text-blue-400' : 'text-yellow-400';
              
              return (
                <div 
                  key={commitment.id}
                  className="bg-gray-900/50 border border-green-400/30 rounded-lg p-6 backdrop-blur-sm 
                             hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/10"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-green-400">{commitment.title}</h3>
                      <p className="text-green-300/70 mt-1">{commitment.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor} bg-current bg-opacity-20`}>
                      {commitment.status?.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400/70">Progress: {currentProgress}%</span>
                      <span className="text-green-400/70">
                        {commitment.current_value}/{commitment.target_value}
                      </span>
                    </div>
                    
                    {/* Custom Progress Bar */}
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(100, currentProgress)}%` }}
                      >
                        <div className="h-full bg-gradient-to-r from-green-400 to-blue-400 animate-pulse opacity-75"></div>
                      </div>
                    </div>
                    
                    {/* Interactive Slider */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentProgress}
                      onChange={(e) => handleProgressUpdate(commitment.id, Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer 
                                 slider hover:bg-gray-600 transition-colors duration-200"
                    />
                    
                    <div className="flex justify-between text-xs text-green-400/50">
                      <span>👤 {commitment.official_name}</span>
                      <span>📅 {commitment.deadline}</span>
                      <span>🏷️ {commitment.category}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Analytics Panel */}
        <div className="space-y-6">
          {/* Progress Overview Chart */}
          <div className="bg-gray-900/50 border border-green-400/30 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-green-400 mb-4">📊 Progress Overview</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#10b981" opacity={0.2} />
                <XAxis dataKey="name" stroke="#10b981" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#10b981" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111827', 
                    border: '1px solid #10b981',
                    borderRadius: '8px',
                    color: '#10b981'
                  }} 
                />
                <Bar dataKey="Progress" fill="url(#progressGradient)" />
                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          {pieData.length > 0 && (
            <div className="bg-gray-900/50 border border-green-400/30 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-green-400 mb-4">🏷️ Category Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) => entry.name}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#111827', 
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                      color: '#10b981'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 border border-green-400/30 rounded-lg p-4 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-green-400">{commitments.length}</div>
              <div className="text-xs text-green-400/70">Total Commitments</div>
            </div>
            <div className="bg-gray-900/50 border border-green-400/30 rounded-lg p-4 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-400">
                {commitments.filter(c => c.status === 'active').length}
              </div>
              <div className="text-xs text-green-400/70">Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #10b981, #3b82f6);
          cursor: pointer;
          border: 2px solid #059669;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #10b981, #3b82f6);
          cursor: pointer;
          border: 2px solid #059669;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
};

export default CommitmentDashboard;




