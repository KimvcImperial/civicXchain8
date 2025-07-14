(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/app/components/CommitmentDashboard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
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
}*/ __turbopack_context__.s({
    "default": (()=>CommitmentDashboard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function CommitmentDashboard({ commitments, onUpdateProgress, onClaimReward, onRefreshData }) {
    _s();
    const [selectedCommitment, setSelectedCommitment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [progressUpdate, setProgressUpdate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [filterStatus, setFilterStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [filterCategory, setFilterCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    // Real-time update states
    const [isRefreshing, setIsRefreshing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastUpdated, setLastUpdated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Date());
    const [autoRefresh, setAutoRefresh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Auto-refresh data every 30 seconds
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CommitmentDashboard.useEffect": ()=>{
            if (!autoRefresh) return;
            const interval = setInterval({
                "CommitmentDashboard.useEffect.interval": ()=>{
                    fetchCommitments();
                }
            }["CommitmentDashboard.useEffect.interval"], 30000); // 30 seconds
            return ({
                "CommitmentDashboard.useEffect": ()=>clearInterval(interval)
            })["CommitmentDashboard.useEffect"];
        }
    }["CommitmentDashboard.useEffect"], [
        autoRefresh
    ]);
    // Function to fetch fresh commitment data
    const fetchCommitments = async ()=>{
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
        } finally{
            setIsRefreshing(false);
        }
    };
    // Manual refresh function
    const handleManualRefresh = ()=>{
        fetchCommitments();
    };
    // Filter commitments based on status and category
    const filteredCommitments = commitments.filter((commitment)=>{
        const statusMatch = filterStatus === 'all' || commitment.status === filterStatus;
        const categoryMatch = filterCategory === 'all' || commitment.category === filterCategory;
        return statusMatch && categoryMatch;
    });
    // Calculate dashboard statistics
    const dashboardStats = {
        total: commitments.length,
        active: commitments.filter((c)=>c.status === 'active').length,
        completed: commitments.filter((c)=>c.status === 'completed').length,
        overdue: commitments.filter((c)=>c.status === 'active' && new Date(c.deadline) < new Date()).length,
        totalStaked: commitments.reduce((sum, c)=>sum + c.stake_amount, 0),
        satelliteVerified: commitments.filter((c)=>c.satellite_verified).length
    };
    const getCategoryIcon = (category)=>{
        const icons = {
            'forest_protection': '🌳',
            'air_quality': '🏭',
            'water_management': '💧',
            'biodiversity': '🦋',
            'waste_reduction': '♻️'
        };
        return icons[category] || '🌍';
    };
    const getStatusColor = (status)=>{
        switch(status){
            case 'active':
                return 'from-green-500 to-emerald-500';
            case 'completed':
                return 'from-blue-500 to-cyan-500';
            case 'failed':
                return 'from-red-500 to-pink-500';
            default:
                return 'from-gray-500 to-slate-500';
        }
    };
    const formatDate = (dateString)=>{
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    const formatTime = (date)=>{
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };
    const calculateProgress = (current, target)=>{
        return Math.min(current / target * 100, 100);
    };
    const isOverdue = (deadline, status)=>{
        return status === 'active' && new Date(deadline) < new Date();
    };
    const handleProgressUpdate = (commitmentId)=>{
        const newProgress = parseFloat(progressUpdate);
        if (newProgress >= 0 && newProgress <= 100) {
            onUpdateProgress(commitmentId, newProgress);
            setProgressUpdate('');
            setSelectedCommitment(null);
            // Refresh data after update
            setTimeout(()=>fetchCommitments(), 1000);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col md:flex-row md:items-center md:justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-4xl font-bold text-white mb-2 flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center mr-4",
                                                children: "📊"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                lineNumber: 485,
                                                columnNumber: 17
                                            }, this),
                                            "Commitment Dashboard"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                        lineNumber: 484,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-300",
                                        children: "Monitor and manage your environmental commitments"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                        lineNumber: 490,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                lineNumber: 483,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 md:mt-0 flex flex-col items-end space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-300 text-sm",
                                                        children: "Auto-refresh"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                        lineNumber: 498,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setAutoRefresh(!autoRefresh),
                                                        className: `w-12 h-6 rounded-full transition-all duration-300 ${autoRefresh ? 'bg-green-500' : 'bg-gray-600'}`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `w-5 h-5 bg-white rounded-full transition-transform duration-300 ${autoRefresh ? 'translate-x-6' : 'translate-x-0.5'}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                            lineNumber: 505,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                        lineNumber: 499,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                lineNumber: 497,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleManualRefresh,
                                                disabled: isRefreshing,
                                                className: "bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full ${isRefreshing ? 'animate-spin' : ''}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                        lineNumber: 517,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: isRefreshing ? 'Refreshing...' : 'Refresh'
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                        lineNumber: 520,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                lineNumber: 512,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                        lineNumber: 495,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-400",
                                        children: [
                                            "Last updated: ",
                                            formatTime(lastUpdated)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                        lineNumber: 525,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                lineNumber: 494,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                        lineNumber: 482,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                    lineNumber: 481,
                    columnNumber: 9
                }, this),
                isRefreshing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 text-cyan-400",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "animate-spin h-5 w-5 border-2 border-cyan-400 border-t-transparent rounded-full"
                            }, void 0, false, {
                                fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                lineNumber: 536,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: "Updating commitment data..."
                            }, void 0, false, {
                                fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                lineNumber: 537,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex space-x-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                        lineNumber: 539,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-2 h-2 bg-cyan-400 rounded-full animate-pulse",
                                        style: {
                                            animationDelay: '0.2s'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                        lineNumber: 540,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-2 h-2 bg-cyan-400 rounded-full animate-pulse",
                                        style: {
                                            animationDelay: '0.4s'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                        lineNumber: 541,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                lineNumber: 538,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                        lineNumber: 535,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                    lineNumber: 534,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-4 relative overflow-hidden",
                            children: [
                                isRefreshing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 550,
                                    columnNumber: 30
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-cyan-400 text-sm font-medium",
                                    children: "Total Commitments"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 551,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-white",
                                    children: dashboardStats.total
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 552,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                            lineNumber: 549,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-black/30 backdrop-blur-xl rounded-xl border border-green-500/20 p-4 relative overflow-hidden",
                            children: [
                                isRefreshing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-400 animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 555,
                                    columnNumber: 30
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-green-400 text-sm font-medium",
                                    children: "Active"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 556,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-white",
                                    children: dashboardStats.active
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 557,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                            lineNumber: 554,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-black/30 backdrop-blur-xl rounded-xl border border-blue-500/20 p-4 relative overflow-hidden",
                            children: [
                                isRefreshing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 560,
                                    columnNumber: 30
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-blue-400 text-sm font-medium",
                                    children: "Completed"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 561,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-white",
                                    children: dashboardStats.completed
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 562,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                            lineNumber: 559,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-black/30 backdrop-blur-xl rounded-xl border border-red-500/20 p-4 relative overflow-hidden",
                            children: [
                                isRefreshing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-pink-400 animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 565,
                                    columnNumber: 30
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-red-400 text-sm font-medium",
                                    children: "Overdue"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 566,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-white",
                                    children: dashboardStats.overdue
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 567,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                            lineNumber: 564,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-black/30 backdrop-blur-xl rounded-xl border border-yellow-500/20 p-4 relative overflow-hidden",
                            children: [
                                isRefreshing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 570,
                                    columnNumber: 30
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-yellow-400 text-sm font-medium",
                                    children: "Total Staked"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 571,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-white",
                                    children: [
                                        dashboardStats.totalStaked.toFixed(2),
                                        " ETH"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 572,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                            lineNumber: 569,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-black/30 backdrop-blur-xl rounded-xl border border-purple-500/20 p-4 relative overflow-hidden",
                            children: [
                                isRefreshing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 575,
                                    columnNumber: 30
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-purple-400 text-sm font-medium",
                                    children: "Satellite Verified"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 576,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-white",
                                    children: dashboardStats.satelliteVerified
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 577,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                            lineNumber: 574,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                    lineNumber: 548,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-black/30 backdrop-blur-xl rounded-xl border border-gray-500/20 p-6 mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold text-white mb-4",
                            children: "Filters"
                        }, void 0, false, {
                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                            lineNumber: 583,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-gray-300 text-sm font-medium mb-2",
                                            children: "Status"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                            lineNumber: 586,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: filterStatus,
                                            onChange: (e)=>setFilterStatus(e.target.value),
                                            className: "w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "all",
                                                    children: "All Statuses"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 592,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "active",
                                                    children: "Active"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 593,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "completed",
                                                    children: "Completed"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 594,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "failed",
                                                    children: "Failed"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 595,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                            lineNumber: 587,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 585,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-gray-300 text-sm font-medium mb-2",
                                            children: "Category"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                            lineNumber: 599,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: filterCategory,
                                            onChange: (e)=>setFilterCategory(e.target.value),
                                            className: "w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "all",
                                                    children: "All Categories"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 605,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "forest_protection",
                                                    children: "🌳 Forest Protection"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 606,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "air_quality",
                                                    children: "🏭 Air Quality"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 607,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "water_management",
                                                    children: "💧 Water Management"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 608,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "biodiversity",
                                                    children: "🦋 Biodiversity"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 609,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "waste_reduction",
                                                    children: "♻️ Waste Reduction"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 610,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                            lineNumber: 600,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 598,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                            lineNumber: 584,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                    lineNumber: 582,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6",
                    children: filteredCommitments.map((commitment)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `bg-black/20 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300 shadow-xl relative overflow-hidden ${isRefreshing ? 'animate-pulse' : ''}`,
                            children: [
                                isRefreshing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 624,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white text-lg",
                                                        children: getCategoryIcon(commitment.category)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                        lineNumber: 631,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 630,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "text-white font-semibold text-sm",
                                                            children: commitment.official_name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                            lineNumber: 636,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-400 text-xs",
                                                            children: commitment.official_role
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                            lineNumber: 637,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 635,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                            lineNumber: 629,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(commitment.status)} text-white flex items-center space-x-1`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: commitment.status.toUpperCase()
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 641,
                                                    columnNumber: 19
                                                }, this),
                                                commitment.satellite_verified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs",
                                                    children: "🛰️"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 642,
                                                    columnNumber: 53
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                            lineNumber: 640,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 628,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "text-white font-semibold mb-2 line-clamp-2",
                                    children: commitment.title
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 647,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between text-sm text-gray-300 mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Progress"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 652,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono",
                                                    children: [
                                                        commitment.current_progress,
                                                        "% / ",
                                                        commitment.target_value,
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 653,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                            lineNumber: 651,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-full bg-gray-800 rounded-full h-3 overflow-hidden",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `bg-gradient-to-r ${getStatusColor(commitment.status)} h-3 rounded-full transition-all duration-1000 ${isRefreshing ? 'animate-pulse' : ''}`,
                                                style: {
                                                    width: `${calculateProgress(commitment.current_progress, commitment.target_value)}%`
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                lineNumber: 658,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                            lineNumber: 657,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 650,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2 mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between text-xs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-400",
                                                    children: "Deadline:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 670,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `${isOverdue(commitment.deadline, commitment.status) ? 'text-red-400' : 'text-gray-300'}`,
                                                    children: [
                                                        formatDate(commitment.deadline),
                                                        isOverdue(commitment.deadline, commitment.status) && ' ⚠️'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 671,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                            lineNumber: 669,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between text-xs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-400",
                                                    children: "Stake:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 677,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-300",
                                                    children: [
                                                        commitment.stake_amount,
                                                        " ETH"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 678,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                            lineNumber: 676,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between text-xs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-400",
                                                    children: "Verification:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 681,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: commitment.satellite_verified ? 'text-green-400' : 'text-yellow-400',
                                                    children: commitment.satellite_verified ? '🛰️ Satellite' : '📊 Self-reported'
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                                    lineNumber: 682,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                            lineNumber: 680,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 668,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex space-x-2",
                                    children: [
                                        commitment.status === 'active' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSelectedCommitment(commitment),
                                            className: "flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 px-3 py-2 rounded-lg text-sm transition-all duration-300",
                                            children: "Update Progress"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                            lineNumber: 691,
                                            columnNumber: 19
                                        }, this),
                                        commitment.status === 'completed' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>onClaimReward(commitment.id),
                                            className: "flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-3 py-2 rounded-lg text-sm transition-all duration-300",
                                            children: "Claim Reward"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                            lineNumber: 699,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 text-gray-400 px-3 py-2 rounded-lg text-sm transition-all duration-300",
                                            children: "Details"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                            lineNumber: 706,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                    lineNumber: 689,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, commitment.id, true, {
                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                            lineNumber: 619,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                    lineNumber: 617,
                    columnNumber: 9
                }, this),
                filteredCommitments.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-black/20 backdrop-blur-xl rounded-xl border border-gray-500/20 p-12 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-6xl mb-4",
                            children: "🔍"
                        }, void 0, false, {
                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                            lineNumber: 717,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-white text-xl mb-2",
                            children: "No commitments found"
                        }, void 0, false, {
                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                            lineNumber: 718,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400",
                            children: "Try adjusting your filters or create a new commitment."
                        }, void 0, false, {
                            fileName: "[project]/app/components/CommitmentDashboard.tsx",
                            lineNumber: 719,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                    lineNumber: 716,
                    columnNumber: 11
                }, this),
                selectedCommitment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-black/80 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6 max-w-md w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xl font-semibold text-white mb-4",
                                children: "Update Progress"
                            }, void 0, false, {
                                fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                lineNumber: 727,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-300 mb-4",
                                children: [
                                    "Updating progress for: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-cyan-400",
                                        children: selectedCommitment.title
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                        lineNumber: 729,
                                        columnNumber: 40
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                lineNumber: 728,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-gray-300 text-sm font-medium mb-2",
                                        children: [
                                            "New Progress (Current: ",
                                            selectedCommitment.current_progress,
                                            "%)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                        lineNumber: 732,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        value: progressUpdate,
                                        onChange: (e)=>setProgressUpdate(e.target.value),
                                        min: "0",
                                        max: "100",
                                        placeholder: "Enter new progress percentage",
                                        className: "w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                        lineNumber: 735,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                lineNumber: 731,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex space-x-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleProgressUpdate(selectedCommitment.id),
                                        className: "flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-lg transition-all duration-300",
                                        children: "Update"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                        lineNumber: 746,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setSelectedCommitment(null);
                                            setProgressUpdate('');
                                        },
                                        className: "flex-1 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 text-gray-400 px-4 py-2 rounded-lg transition-all duration-300",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                        lineNumber: 752,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/CommitmentDashboard.tsx",
                                lineNumber: 745,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/CommitmentDashboard.tsx",
                        lineNumber: 726,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/CommitmentDashboard.tsx",
                    lineNumber: 725,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/CommitmentDashboard.tsx",
            lineNumber: 479,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/CommitmentDashboard.tsx",
        lineNumber: 478,
        columnNumber: 5
    }, this);
}
_s(CommitmentDashboard, "UdOO4FI6L7jEUuVpgPGy9pDvyQc=");
_c = CommitmentDashboard;
var _c;
__turbopack_context__.k.register(_c, "CommitmentDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/*'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Cyberpunk Navigation *
      <nav className="bg-black/40 backdrop-blur-xl border-b border-cyan-500/30 shadow-lg shadow-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">C</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  CivicXChain
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section *
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-white mb-4">
              The Future of 
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> Civic Accountability</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Where government officials and citizens unite through blockchain-verified environmental commitments. 
              Track progress, earn rewards, and build a sustainable future together.
            </p>
          </div>
        </div>
      </div>

      {/* Main Feed *
      <div className="max-w-4xl mx-auto px-4 pb-12">
        {/* Create Commitment Section *
        <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6 mb-8 shadow-2xl">
          <h3 className="text-xl text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
            What's your environmental commitment?
          </h3>
          <div className="space-y-4">
            <textarea 
              className="w-full bg-black/50 border border-cyan-500/30 rounded-lg p-4 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              placeholder="I commit to reducing my city's carbon emissions by 25% within 12 months..."
              rows={3}
            />
            <div className="flex flex-wrap gap-3">
              <select className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400">
                <option>🌳 Forest Protection</option>
                <option>🏭 Air Quality</option>
                <option>💧 Water Management</option>
                <option>🦋 Biodiversity</option>
                <option>♻️ Waste Reduction</option>
              </select>
              <input 
                type="number" 
                placeholder="Target %" 
                className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white w-24 focus:border-cyan-400"
              />
              <input 
                type="date" 
                className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400"
              />
            </div>
            <button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25">
              🚀 Create Smart Commitment
            </button>
          </div>
        </div>

        {/* Sample Posts *
        <div className="space-y-6">
          {/* Government Official Post *
          <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">🏛️</span>
              </div>
              <div>
                <h3 className="text-white font-semibold flex items-center">
                  Mayor Sarah Johnson
                  <span className="ml-2 bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/30">
                    VERIFIED OFFICIAL
                  </span>
                </h3>
                <p className="text-gray-400 text-sm">Government Official • 2 hours ago</p>
              </div>
            </div>
            
            <p className="text-white mb-4 leading-relaxed">
              🎯 <strong>MAJOR COMMITMENT:</strong> Reducing our city's air pollution by 30% over the next 6 months! 
              New electric bus fleet rolling out next week. Real satellite data will track our progress. 
              <span className="text-cyan-400">#CleanAirInitiative #CivicXChain</span>
            </p>
            
            {/* Progress Bar *
            <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-lg p-4 mb-4 border border-green-500/20">
              <div className="flex justify-between text-sm text-green-400 mb-2">
                <span>🛰️ Satellite Verified Progress</span>
                <span className="font-mono">15% / 30%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-400 to-cyan-400 h-3 rounded-full transition-all duration-1000 shadow-lg shadow-green-400/30" 
                  style={{width: '50%'}}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">⏱️ 4 months remaining • 💰 50 ETH staked</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-6">
                <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                  <span>👍</span>
                  <span className="text-sm">89 supports</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                  <span>💬</span>
                  <span className="text-sm">23 comments</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors">
                  <span>📤</span>
                  <span className="text-sm">Share</span>
                </button>
              </div>
              <button className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg text-sm border border-green-500/30 transition-all">
                👀 Monitor Progress
              </button>
            </div>
          </div>

          {/* Citizen Post *
          <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">🌱</span>
              </div>
              <div>
                <h3 className="text-white font-semibold flex items-center">
                  Alex Chen
                  <span className="ml-2 bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full border border-purple-500/30">
                    ECO CITIZEN
                  </span>
                </h3>
                <p className="text-gray-400 text-sm">Environmental Activist • 5 hours ago</p>
              </div>
            </div>
            
            <p className="text-white mb-4 leading-relaxed">
              🌳 Just completed my personal commitment to plant 100 trees in my neighborhood! 
              Here's the proof from satellite imagery. Earned my first NFT badge! 🏆
              <span className="text-purple-400">#TreePlanting #CivicXChain #PersonalCommitment</span>
            </p>
            
            {/* Achievement Badge *
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 mb-4 border border-purple-500/20">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <h4 className="text-purple-400 font-semibold">Forest Guardian Badge</h4>
                  <p className="text-gray-400 text-sm">NFT #1337 • Blockchain Verified</p>
                  <p className="text-xs text-gray-500">Achievement unlocked for planting 100+ trees</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-6">
                <button className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors">
                  <span>👏</span>
                  <span className="text-sm">156 applause</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                  <span>💬</span>
                  <span className="text-sm">34 comments</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors">
                  <span>🔄</span>
                  <span className="text-sm">Repost</span>
                </button>
              </div>
              <button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-4 py-2 rounded-lg text-sm border border-purple-500/30 transition-all">
                🎉 Congratulate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  */ /*'use client';

import { useState, useEffect } from 'react';

// Types for the data structures
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

interface EnvironmentalData {
  location: string;
  pm25: number;
  co2: number;
  forest_cover: number;
  water_quality: number;
  timestamp: string;
  source: string;
}

interface SatelliteData {
  location: string;
  forest_cover_percentage: number;
  change_detected: boolean;
  last_updated: string;
  confidence_score: number;
}

export default function Home() {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state for creating new commitments
  const [newCommitment, setNewCommitment] = useState({
    title: '',
    description: '',
    category: 'forest_protection',
    target_value: '',
    deadline: '',
    official_name: '',
    official_role: '',
    stake_amount: ''
  });

  const API_BASE_URL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8000' 
    : 'https://your-production-api-url.com';

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch commitments
      const commitmentsResponse = await fetch(`${API_BASE_URL}/commitments`);
      if (commitmentsResponse.ok) {
        const commitmentsData = await commitmentsResponse.json();
        setCommitments(commitmentsData);
      }

      // Fetch environmental data
      const envResponse = await fetch(`${API_BASE_URL}/environmental-data`);
      if (envResponse.ok) {
        const envData = await envResponse.json();
        setEnvironmentalData(envData);
      }

      // Fetch satellite data
      const satResponse = await fetch(`${API_BASE_URL}/satellite-data`);
      if (satResponse.ok) {
        const satData = await satResponse.json();
        setSatelliteData(satData);
      }

    } catch (err) {
      setError('Failed to fetch data. Please check your connection.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommitment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE_URL}/commitments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCommitment,
          target_value: parseFloat(newCommitment.target_value),
          stake_amount: parseFloat(newCommitment.stake_amount)
        }),
      });

      if (response.ok) {
        const createdCommitment = await response.json();
        setCommitments(prev => [createdCommitment, ...prev]);
        
        // Reset form
        setNewCommitment({
          title: '',
          description: '',
          category: 'forest_protection',
          target_value: '',
          deadline: '',
          official_name: '',
          official_role: '',
          stake_amount: ''
        });
        
        alert('Commitment created successfully!');
      } else {
        throw new Error('Failed to create commitment');
      }
    } catch (err) {
      alert('Error creating commitment. Please try again.');
      console.error('Error creating commitment:', err);
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading CivicXChain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Cyberpunk Navigation *
      <nav className="bg-black/40 backdrop-blur-xl border-b border-cyan-500/30 shadow-lg shadow-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">C</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  CivicXChain
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={fetchAllData}
                className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25"
              >
                🔄 Refresh Data
              </button>
              <button className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Error Message *
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            ⚠️ {error}
          </div>
        </div>
      )}

      {/* Hero Section *
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-white mb-4">
              The Future of 
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> Civic Accountability</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Where government officials and citizens unite through blockchain-verified environmental commitments. 
              Track progress, earn rewards, and build a sustainable future together.
            </p>
            
            {/* Real-time Environmental Data Display *
            {environmentalData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
                <div className="bg-black/30 backdrop-blur-xl rounded-lg p-4 border border-cyan-500/20">
                  <div className="text-cyan-400 text-sm">PM2.5 Level</div>
                  <div className="text-2xl font-bold text-white">{environmentalData.pm25} μg/m³</div>
                </div>
                <div className="bg-black/30 backdrop-blur-xl rounded-lg p-4 border border-green-500/20">
                  <div className="text-green-400 text-sm">Forest Cover</div>
                  <div className="text-2xl font-bold text-white">{environmentalData.forest_cover}%</div>
                </div>
                <div className="bg-black/30 backdrop-blur-xl rounded-lg p-4 border border-blue-500/20">
                  <div className="text-blue-400 text-sm">Water Quality</div>
                  <div className="text-2xl font-bold text-white">{environmentalData.water_quality}/100</div>
                </div>
                <div className="bg-black/30 backdrop-blur-xl rounded-lg p-4 border border-purple-500/20">
                  <div className="text-purple-400 text-sm">CO2 Level</div>
                  <div className="text-2xl font-bold text-white">{environmentalData.co2} ppm</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Feed *
      <div className="max-w-4xl mx-auto px-4 pb-12">
        {/* Create Commitment Section *
        <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6 mb-8 shadow-2xl">
          <h3 className="text-xl text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
            Create Your Environmental Commitment
          </h3>
          
          <form onSubmit={handleCreateCommitment} className="space-y-4">
            <input
              type="text"
              placeholder="Commitment title..."
              value={newCommitment.title}
              onChange={(e) => setNewCommitment(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-black/50 border border-cyan-500/30 rounded-lg p-4 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              required
            />
            
            <textarea 
              placeholder="Detailed description of your commitment..."
              value={newCommitment.description}
              onChange={(e) => setNewCommitment(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-black/50 border border-cyan-500/30 rounded-lg p-4 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              rows={3}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select 
                value={newCommitment.category}
                onChange={(e) => setNewCommitment(prev => ({ ...prev, category: e.target.value }))}
                className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400"
              >
                <option value="forest_protection">🌳 Forest Protection</option>
                <option value="air_quality">🏭 Air Quality</option>
                <option value="water_management">💧 Water Management</option>
                <option value="biodiversity">🦋 Biodiversity</option>
                <option value="waste_reduction">♻️ Waste Reduction</option>
              </select>
              
              <input 
                type="number" 
                placeholder="Target %" 
                value={newCommitment.target_value}
                onChange={(e) => setNewCommitment(prev => ({ ...prev, target_value: e.target.value }))}
                className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400"
                required
              />
              
              <input 
                type="date" 
                value={newCommitment.deadline}
                onChange={(e) => setNewCommitment(prev => ({ ...prev, deadline: e.target.value }))}
                className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Official Name"
                value={newCommitment.official_name}
                onChange={(e) => setNewCommitment(prev => ({ ...prev, official_name: e.target.value }))}
                className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                required
              />
              
              <input
                type="text"
                placeholder="Official Role"
                value={newCommitment.official_role}
                onChange={(e) => setNewCommitment(prev => ({ ...prev, official_role: e.target.value }))}
                className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                required
              />
              
              <input
                type="number"
                step="0.01"
                placeholder="Stake Amount (ETH)"
                value={newCommitment.stake_amount}
                onChange={(e) => setNewCommitment(prev => ({ ...prev, stake_amount: e.target.value }))}
                className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                required
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              🚀 Create Smart Commitment
            </button>
          </form>
        </div>

        {/* Satellite Data Section *
        {satelliteData && (
          <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-green-500/20 p-6 mb-8 shadow-xl">
            <h3 className="text-xl text-white mb-4 flex items-center">
              <span className="text-2xl mr-3">🛰️</span>
              Live Satellite Monitoring
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-green-400 text-sm">Location</div>
                <div className="text-white font-semibold">{satelliteData.location}</div>
              </div>
              <div>
                <div className="text-green-400 text-sm">Forest Cover</div>
                <div className="text-white font-semibold">{satelliteData.forest_cover_percentage}%</div>
              </div>
              <div>
                <div className="text-green-400 text-sm">Confidence Score</div>
                <div className="text-white font-semibold">{satelliteData.confidence_score}%</div>
              </div>
            </div>
            {satelliteData.change_detected && (
              <div className="mt-4 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 px-4 py-2 rounded-lg">
                ⚠️ Environmental change detected! Last updated: {formatDate(satelliteData.last_updated)}
              </div>
            )}
          </div>
        )}

        {/* Commitments Feed *
        <div className="space-y-6">
          {commitments.length === 0 ? (
            <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-gray-500/20 p-12 text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-white text-xl mb-2">No commitments yet</h3>
              <p className="text-gray-400">Be the first to create an environmental commitment!</p>
            </div>
          ) : (
            commitments.map((commitment) => (
              <div key={commitment.id} className="bg-black/20 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300 shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">
                      {getCategoryIcon(commitment.category)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold flex items-center">
                      {commitment.official_name}
                      <span className="ml-2 bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/30">
                        {commitment.official_role}
                      </span>
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {formatDate(commitment.created_at)} • {commitment.category.replace('_', ' ').toUpperCase()}
                    </p>
                  </div>
                </div>
                
                <h4 className="text-white font-semibold text-lg mb-2">{commitment.title}</h4>
                <p className="text-white mb-4 leading-relaxed">{commitment.description}</p>
                
                {/* Progress Bar *
                <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-lg p-4 mb-4 border border-green-500/20">
                  <div className="flex justify-between text-sm text-green-400 mb-2">
                    <span>
                      {commitment.satellite_verified ? '🛰️ Satellite Verified' : '📊 Self Reported'} Progress
                    </span>
                    <span className="font-mono">
                      {commitment.current_progress}% / {commitment.target_value}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-cyan-400 h-3 rounded-full transition-all duration-1000 shadow-lg shadow-green-400/30" 
                      style={{width: `${calculateProgress(commitment.current_progress, commitment.target_value)}%`}}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    ⏱️ Deadline: {formatDate(commitment.deadline)} • 💰 {commitment.stake_amount} ETH staked
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-6">
                    <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                      <span>👍</span>
                      <span className="text-sm">Support</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                      <span>💬</span>
                      <span className="text-sm">Comment</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors">
                      <span>📤</span>
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    commitment.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    commitment.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {commitment.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}*/ /*
'use client';

import { useState, useEffect } from 'react';

// Types for the data structures
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

interface EnvironmentalData {
  location: string;
  pm25: number;
  co2: number;
  forest_cover: number;
  water_quality: number;
  timestamp: string;
  source: string;
}

interface SatelliteData {
  location: string;
  forest_cover_percentage: number;
  change_detected: boolean;
  last_updated: string;
  confidence_score: number;
}

interface CreateCommitmentRequest {
  title: string;
  description: string;
  category: string;
  target_value: number;
  deadline: string;
  official_name: string;
  official_role: string;
  stake_amount: number;
}

export default function Home() {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state for creating new commitments
  const [newCommitment, setNewCommitment] = useState({
    title: '',
    description: '',
    category: 'forest_protection',
    target_value: '',
    deadline: '',
    official_name: '',
    official_role: '',
    stake_amount: ''
  });

  // Proper API configuration
  const API_BASE_URL = process.env.NODE_ENV === 'development' 
    ? 'https://api.databutton.com/_projects/f4d95df8-c90d-4815-9705-a83827aa1133/dbtn/devx/app/routes'
    : 'https://api.databutton.com/_projects/f4d95df8-c90d-4815-9705-a83827aa1133/dbtn/prodx/app/routes';

  // Helper function for API calls with proper error handling
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: 'include', // Important for authentication
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch commitments with error handling
      try {
        const commitmentsData = await apiCall('/get_all_commitments');
        setCommitments(commitmentsData.commitments || []);
      } catch (err) {
        console.error('Error fetching commitments:', err);
        // Set mock data if API fails (for development)
        setCommitments([]);
      }

      // Fetch environmental data with error handling
      try {
        const envData = await apiCall('/get_environmental_data');
        setEnvironmentalData(envData);
      } catch (err) {
        console.error('Error fetching environmental data:', err);
        // Set mock data if API fails
        setEnvironmentalData({
          location: "Sample Location",
          pm25: 25.5,
          co2: 410,
          forest_cover: 75.2,
          water_quality: 82,
          timestamp: new Date().toISOString(),
          source: "Mock Data"
        });
      }

      // Fetch satellite data with error handling
      try {
        const satData = await apiCall('/get_satellite_data?commitmentId=general');
        setSatelliteData(satData);
      } catch (err) {
        console.error('Error fetching satellite data:', err);
        // Set mock data if API fails
        setSatelliteData({
          location: "Sample Region",
          forest_cover_percentage: 78.5,
          change_detected: false,
          last_updated: new Date().toISOString(),
          confidence_score: 94
        });
      }

    } catch (err) {
      setError('Failed to fetch data. Using demo mode.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommitment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const commitmentData: CreateCommitmentRequest = {
        title: newCommitment.title,
        description: newCommitment.description,
        category: newCommitment.category,
        target_value: parseFloat(newCommitment.target_value),
        deadline: newCommitment.deadline,
        official_name: newCommitment.official_name,
        official_role: newCommitment.official_role,
        stake_amount: parseFloat(newCommitment.stake_amount)
      };

      const createdCommitment = await apiCall('/create_commitment', {
        method: 'POST',
        body: JSON.stringify(commitmentData),
      });

      setCommitments(prev => [createdCommitment, ...prev]);
      
      // Reset form
      setNewCommitment({
        title: '',
        description: '',
        category: 'forest_protection',
        target_value: '',
        deadline: '',
        official_name: '',
        official_role: '',
        stake_amount: ''
      });
      
      alert('Commitment created successfully!');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Please try again.';
      alert(`Error creating commitment: ${errorMessage}`);
      console.error('Error creating commitment:', err);
    }
  };

  // Rest of your component methods remain the same...
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  // Your existing JSX return statement stays exactly the same...
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading CivicXChain...</p>
        </div>
      </div>
    );
  }

  return (
    // Your existing JSX remains exactly the same - just copy it from your current file
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Keep all your existing JSX exactly as it is *
      {/* Just replace the part above this comment *
    </div>
  );
}
*/ __turbopack_context__.s({
    "default": (()=>Home)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CommitmentDashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/CommitmentDashboard.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function Home() {
    _s();
    const [commitments, setCommitments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [environmentalData, setEnvironmentalData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [satelliteData, setSatelliteData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentView, setCurrentView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('feed');
    const [newCommitment, setNewCommitment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        title: '',
        description: '',
        category: 'forest_protection',
        target_value: '',
        deadline: '',
        official_name: '',
        official_role: '',
        stake_amount: ''
    });
    const API_BASE_URL = ("TURBOPACK compile-time truthy", 1) ? 'https://api.databutton.com/_projects/f4d95df8-c90d-4815-9705-a83827aa1133/dbtn/devx/app/routes' : ("TURBOPACK unreachable", undefined);
    const apiCall = async (endpoint, options = {})=>{
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }
        return response.json();
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            fetchAllData();
        }
    }["Home.useEffect"], []);
    const fetchAllData = async ()=>{
        try {
            setLoading(true);
            setError(null);
            try {
                const commitmentsData = await apiCall('/get_all_commitments');
                setCommitments(commitmentsData.commitments || []);
            } catch (err) {
                console.error('Error fetching commitments:', err);
                setCommitments([]);
            }
            try {
                const envData = await apiCall('/get_environmental_data');
                setEnvironmentalData(envData);
            } catch (err) {
                console.error('Error fetching environmental data:', err);
                setEnvironmentalData({
                    location: "Sample Location",
                    pm25: 25.5,
                    co2: 410,
                    forest_cover: 75.2,
                    water_quality: 82,
                    timestamp: new Date().toISOString(),
                    source: "Mock Data"
                });
            }
            try {
                const satData = await apiCall('/get_satellite_data?commitmentId=general');
                setSatelliteData(satData);
            } catch (err) {
                console.error('Error fetching satellite data:', err);
                setSatelliteData({
                    location: "Sample Region",
                    forest_cover_percentage: 78.5,
                    change_detected: false,
                    last_updated: new Date().toISOString(),
                    confidence_score: 94
                });
            }
        } catch (err) {
            setError('Failed to fetch data. Using demo mode.');
            console.error('Error fetching data:', err);
        } finally{
            setLoading(false);
        }
    };
    const handleCreateCommitment = async (e)=>{
        e.preventDefault();
        try {
            const commitmentData = {
                title: newCommitment.title,
                description: newCommitment.description,
                category: newCommitment.category,
                target_value: parseFloat(newCommitment.target_value),
                deadline: newCommitment.deadline,
                official_name: newCommitment.official_name,
                official_role: newCommitment.official_role,
                stake_amount: parseFloat(newCommitment.stake_amount)
            };
            const createdCommitment = await apiCall('/create_commitment', {
                method: 'POST',
                body: JSON.stringify(commitmentData)
            });
            setCommitments((prev)=>[
                    createdCommitment,
                    ...prev
                ]);
            setNewCommitment({
                title: '',
                description: '',
                category: 'forest_protection',
                target_value: '',
                deadline: '',
                official_name: '',
                official_role: '',
                stake_amount: ''
            });
            alert('Commitment created successfully!');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Please try again.';
            alert(`Error creating commitment: ${errorMessage}`);
            console.error('Error creating commitment:', err);
        }
    };
    const handleUpdateProgress = async (commitmentId, newProgress)=>{
        try {
            const response = await apiCall('/update_commitment_progress', {
                method: 'POST',
                body: JSON.stringify({
                    commitment_id: commitmentId,
                    new_progress: newProgress
                })
            });
            setCommitments((prev)=>prev.map((c)=>c.id === commitmentId ? {
                        ...c,
                        current_progress: newProgress
                    } : c));
            alert('Progress updated successfully!');
        } catch (err) {
            alert('Error updating progress. Please try again.');
            console.error('Error updating progress:', err);
        }
    };
    const handleClaimReward = async (commitmentId)=>{
        try {
            const response = await apiCall('/claim_reward', {
                method: 'POST',
                body: JSON.stringify({
                    commitment_id: commitmentId
                })
            });
            alert('Reward claimed successfully!');
        } catch (err) {
            alert('Error claiming reward. Please try again.');
            console.error('Error claiming reward:', err);
        }
    };
    const getCategoryIcon = (category)=>{
        const icons = {
            'forest_protection': '🌳',
            'air_quality': '🏭',
            'water_management': '💧',
            'biodiversity': '🦋',
            'waste_reduction': '♻️'
        };
        return icons[category] || '🌍';
    };
    const formatDate = (dateString)=>{
        return new Date(dateString).toLocaleDateString();
    };
    const calculateProgress = (current, target)=>{
        return Math.min(current / target * 100, 100);
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 1172,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-white text-xl",
                        children: "Loading CivicXChain..."
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 1173,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1171,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 1170,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center space-x-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setCurrentView('feed'),
                        className: `px-4 py-2 rounded-lg transition-all duration-300 ${currentView === 'feed' ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50' : 'text-gray-400 hover:text-cyan-400'}`,
                        children: "Feed"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 1182,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setCurrentView('dashboard'),
                        className: `px-4 py-2 rounded-lg transition-all duration-300 ${currentView === 'dashboard' ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50' : 'text-gray-400 hover:text-cyan-400'}`,
                        children: "Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 1192,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1181,
                columnNumber: 7
            }, this),
            currentView === 'dashboard' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CommitmentDashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                commitments: commitments,
                onUpdateProgress: handleUpdateProgress,
                onClaimReward: handleClaimReward
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1205,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "🌱 Feed content goes here (replace with your existing JSX)..."
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 1213,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1211,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 1180,
        columnNumber: 5
    }, this);
}
_s(Home, "SOewzFu0UYlo7YZTX6EGiu0UXVg=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=app_b419b885._.js.map