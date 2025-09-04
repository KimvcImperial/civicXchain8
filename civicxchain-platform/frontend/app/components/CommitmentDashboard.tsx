'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import brain from '../brain';
import {
  CreateCommitmentRequest,
  UpdateCommitmentProgressRequest,
  Commitment,
  ClaimRewardRequest,
  EnvironmentalData as EnvData,
  SatelliteData as SatData,
} from '../types';

// Your component code here...



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

interface EnvironmentalData {
  air_quality?: number;
  water_quality?: number;
  forest_coverage?: number;
  temperature?: number;
  humidity?: number;
  timestamp?: string;
}

interface SatelliteData {
  commitment_id: string;
  verification_status: 'verified' | 'pending' | 'failed';
  forest_coverage_change: number;
  deforestation_detected: boolean;
  last_updated: string;
}

const CommitmentDashboard: React.FC = () => {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [satelliteData, setSatelliteData] = useState<{ [key: string]: SatelliteData }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [localProgress, setLocalProgress] = useState<{ [id: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
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

  // Fetch all data on component mount
  useEffect(() => {
    Promise.all([
      fetchCommitments(),
      fetchEnvironmentalData(),
    ]);
  }, []);

  // Fetch commitments from the brain API
  const fetchCommitments = async () => {
    try {
      setLoading(true);
      const response = await brain.get_all_commitments();
      const data = await response.json();
      setCommitments(data);
      
      // Fetch satellite data for each commitment
      for (const commitment of data) {
        await fetchSatelliteData(commitment.id.toString());
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching commitments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch commitments');
    } finally {
      setLoading(false);
    }
  };

  // Fetch environmental data
  const fetchEnvironmentalData = async () => {
    try {
      const response = await brain.get_environmental_data();
      const data = await response.json();
      setEnvironmentalData(data);
    } catch (err) {
      console.error('Error fetching environmental data:', err);
    }
  };

  // Fetch satellite data for a specific commitment
  const fetchSatelliteData = async (commitmentId: string) => {
    try {
      const response = await brain.get_satellite_data({ commitmentId: parseInt(commitmentId) });
      const data = await response.json();
      setSatelliteData((prev: any) => ({ ...prev, [commitmentId]: data[0] || null })); // Just set the first item
    } catch (err) {
      console.error(`Error fetching satellite data for commitment ${commitmentId}:`, err);
    }
  };
  

  // Get validation status for a commitment
  const getValidationStatus = async (commitmentId: string) => {
    try {
      const response = await brain.get_validation_status();
      return null;
    } catch (err) {
      console.error(`Error getting validation status for commitment ${commitmentId}:`, err);
      return null;
    }
  };

  // Handle progress updates with real blockchain integration
  const handleProgressUpdate = async (commitmentId: string, newProgress: number) => {
    setLocalProgress(prev => ({ ...prev, [commitmentId]: newProgress }));
    
    try {
      const updateRequest = {
        commitmentId: parseInt(commitmentId),
        commitment_id: commitmentId,
        new_progress: newProgress,
        actual_value: newProgress,
        verification_data: {
          timestamp: new Date().toISOString(),
          source: 'manual_update',
          verified: false
        },
      };
  
      const response = await brain.update_commitment_progress(updateRequest);
      if (!response.ok) throw new Error('Failed to update progress');
      
      const result = await response.json();
      console.log('Progress updated successfully:', result);
      
      // Refresh commitments to get updated data
      await fetchCommitments();
      
    } catch (error) {
      console.error('Error updating progress:', error);
      // Revert local state on error
      setLocalProgress((prev: Record<string, number>) => {
        const newState = { ...prev };
        delete newState[commitmentId];
        return newState;
      });
    }
  };

  // Handle reward claiming
  //const handleClaimReward = async (commitmentId: string) => {
    //try {
      //const claimRequest: ClaimRewardRequest = {
        //commitmentId: parseInt(commitmentId),
        //wallet_address: "0x1234567890123456789012345678901234567890", // This should come from user's wallet
        //verification_proof: {
          //satellite_verified: satelliteData[commitmentId]?.verification_status === 'verified',
          //environmental_data_confirmed: true,
          //timestamp: new Date().toISOString()
        //}
      //};

      //const response = await brain.claim_reward(claimRequest);
      //if (!response.ok) throw new Error('Failed to claim reward');
      
      //const result = await response.json();
      //console.log('Reward claimed successfully:', result);
      
      // Show success message
      
    //} catch (error) {
      //console.error('Error claiming reward:', error);
    //}
  //};
  const handleClaimReward = async (commitmentId: string) => {
    try {
      const response = await brain.claim_reward({ commitmentId: parseInt(commitmentId) });
      if (!response.ok) throw new Error(`Failed to claim reward`);
  
      const result = await response.json();
      console.log('Reward claimed successfully:', result);
      
      // Show success message or update UI
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };
  // Create new commitment with blockchain integration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSubmitSuccess(false);

    try {
      // Validate required fields
      if (!newCommitment.title || !newCommitment.description || !newCommitment.official_name || 
          !newCommitment.official_role || !newCommitment.deadline) {
        throw new Error('Please fill in all required fields');
      }

      //const createRequest: CreateCommitmentRequest = {
        //title: newCommitment.title,
        //description: newCommitment.description,
        //category: newCommitment.category,
        //official_name: newCommitment.official_name,
        //official_role: newCommitment.official_role,
        //deadline: newCommitment.deadline,
        //target_value: newCommitment.target_value,
        //reward_amount: newCommitment.reward_amount,
        //penalty_amount: newCommitment.penalty_amount,
        //stake_required: newCommitment.reward_amount * 0.1, // 10% of reward as stake
        //verification_method: 'satellite_and_sensor',
        //smart_contract_params: {
          //oracle_update_frequency: '24h',
          //min_verification_threshold: 0.8,
          //penalty_distribution: 'community_fund'
        //}
      //};
      const createRequest = {
        description: newCommitment.description,
        deadline: newCommitment.deadline,
        target_value: newCommitment.target_value,
        metric_type: newCommitment.category, // Using category as metric_type
        data_source: 'satellite', // Default value
        stake_amount: 100, // Default stake amount
        commitment_type: 'environmental', // Default type
        official_name: "Government Official", // Add this
        official_role: "Environmental Minister" // Add this
      };

      try {
        const response = await brain.create_commitment({}, createRequest as any);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error((errorData as any).message || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Commitment created successfully:', result);
        
        // Show success message
        setSubmitSuccess(true);
        
        // Reset form
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
        
      } catch (error) {
        console.error('Error creating commitment:', error);
        // Handle error (show error message to user)
      }
      // Close form after 2 seconds
      setTimeout(() => {
        setShowCreateForm(false);
        setSubmitSuccess(false);
      }, 2000);
      
      // Refresh commitments list
      await fetchCommitments();
      
    } catch (error) {
      console.error('Error creating commitment:', error);
      setError(error instanceof Error ? error.message : 'Failed to create commitment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form field changes
  const handleInputChange = (field: keyof CommitmentForm, value: string | number) => {
    setNewCommitment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get real-time environmental score
const getEnvironmentalScore = (commitment: Commitment): number => {
  if (!environmentalData) return commitment.current_progress || 0;
  
  // Calculate score based on environmental data and commitment category
  switch (commitment.category) {
    case 'air_quality':
      return Math.min(environmentalData.air_quality || 0, 100);
    case 'water_management':
      return Math.min(environmentalData.water_quality || 0, 100);
    case 'forest_protection':
      return Math.min(environmentalData.forest_coverage || 0, 100);
    default:
      return commitment.current_progress || 0;
  }
};

  // Get satellite verification status
  const getSatelliteVerificationStatus = (commitmentId: string): string => {
    const satData = satelliteData[commitmentId];
    if (!satData) return 'pending';
    return satData.verification_status;
  };

  // Prepare chart data with real environmental metrics
  const chartData = commitments.map(commitment => {
    const envScore = getEnvironmentalScore(commitment);
    const satStatus = getSatelliteVerificationStatus(commitment.id.toString());
    
    return {
      name: commitment.title.substring(0, 20) + '...',
      Progress: localProgress[commitment.id] ?? envScore,
      Target: commitment.target_value,
      Current: commitment.current_value || envScore,
      SatelliteVerified: satStatus === 'verified' ? 100 : 0
    };
  });

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
        <div className="text-green-400 text-xl animate-pulse">
          Loading EcoChain Data from Blockchain...
          <div className="mt-2 text-sm">Fetching smart contract states...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      {/* Cyberpunk Header with Real-time Environmental Data */}
      <div className="mb-8 border-b border-green-400/30 pb-4">
        <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text mb-2">
          🌍 EcoChain Governance Dashboard
        </h1>
        <p className="text-green-300/70">Real-time Environmental Commitment Tracking via Blockchain & Satellites</p>
        
        {/* Real-time Environmental Indicators */}
        {environmentalData && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gray-900/50 border border-green-400/30 rounded-lg p-3">
              <div className="text-xs text-green-400/70">Air Quality</div>
              <div className="text-lg font-bold text-green-400">{(environmentalData.air_quality ?? 0).toFixed(1)}</div>
            </div>
            <div className="bg-gray-900/50 border border-blue-400/30 rounded-lg p-3">
              <div className="text-xs text-blue-400/70">Water Quality</div>
              <div className="text-lg font-bold text-blue-400">{(environmentalData.water_quality ?? 0).toFixed(1)}</div>
            </div>
            <div className="bg-gray-900/50 border border-purple-400/30 rounded-lg p-3">
              <div className="text-xs text-purple-400/70">Forest Coverage</div>
              <div className="text-lg font-bold text-purple-400">{(environmentalData.forest_coverage ?? 0).toFixed(1)}%</div>
            </div>
            <div className="bg-gray-900/50 border border-yellow-400/30 rounded-lg p-3">
              <div className="text-xs text-yellow-400/70">Temperature</div>
              <div className="text-lg font-bold text-yellow-400">{(environmentalData.temperature ?? 0).toFixed(1)}°C</div>
            </div>
            <div className="bg-gray-900/50 border border-cyan-400/30 rounded-lg p-3">
              <div className="text-xs text-cyan-400/70">Humidity</div>
              <div className="text-lg font-bold text-cyan-400">{(environmentalData.humidity ?? 0).toFixed(1)}%</div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-400 rounded-lg">
          <div className="text-red-400">⚠️ {error}</div>
        </div>
      )}

      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-4 p-4 bg-green-900/20 border border-green-400 rounded-lg">
          <div className="text-green-400">✅ Blockchain transaction successful!</div>
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
          {showCreateForm ? '🔙 Cancel' : '✨ Create Smart Contract'}
        </button>
        <button
          onClick={fetchCommitments}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-green-400/50 
                     text-green-400 font-bold rounded-lg transition-all duration-300"
        >
          🔄 Sync Blockchain
        </button>
        <button
          onClick={fetchEnvironmentalData}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-blue-400/50 
                     text-blue-400 font-bold rounded-lg transition-all duration-300"
        >
          🛰️ Update Satellite Data
        </button>
      </div>

      {/* Create Commitment Form */}
      {showCreateForm && (
        <div className="mb-8 p-6 bg-gray-900/50 border border-green-400/30 rounded-lg backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-green-400 mb-4">🌱 Deploy Smart Environmental Contract</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Smart Contract Title *"
              value={newCommitment.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="p-3 bg-black border border-green-400/50 rounded-lg text-green-400 placeholder-green-400/50 
                         focus:border-green-400 focus:outline-none"
              required
              disabled={isSubmitting}
            />
            <select
              value={newCommitment.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="p-3 bg-black border border-green-400/50 rounded-lg text-green-400 focus:border-green-400 focus:outline-none"
              disabled={isSubmitting}
            >
              <option value="environmental">🌿 Environmental Protection</option>
              <option value="air_quality">🌬️ Air Quality Improvement</option>
              <option value="water_management">💧 Water Resource Management</option>
              <option value="forest_protection">🌳 Forest Conservation</option>
              <option value="biodiversity">🦋 Biodiversity Protection</option>
              <option value="waste_reduction">♻️ Waste Reduction</option>
            </select>
            <input
              type="text"
              placeholder="Government Official Name *"
              value={newCommitment.official_name}
              onChange={(e) => handleInputChange('official_name', e.target.value)}
              className="p-3 bg-black border border-green-400/50 rounded-lg text-green-400 placeholder-green-400/50 
                         focus:border-green-400 focus:outline-none"
              required
              disabled={isSubmitting}
            />
            <input
              type="text"
              placeholder="Official Position/Role *"
              value={newCommitment.official_role}
              onChange={(e) => handleInputChange('official_role', e.target.value)}
              className="p-3 bg-black border border-green-400/50 rounded-lg text-green-400 placeholder-green-400/50 
                         focus:border-green-400 focus:outline-none"
              required
              disabled={isSubmitting}
            />
            <input
              type="date"
              value={newCommitment.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
              className="p-3 bg-black border border-green-400/50 rounded-lg text-green-400 
                         focus:border-green-400 focus:outline-none"
              required
              disabled={isSubmitting}
            />
            <input
              type="number"
              placeholder="Target Achievement (%)"
              value={newCommitment.target_value}
              onChange={(e) => handleInputChange('target_value', Number(e.target.value))}
              className="p-3 bg-black border border-green-400/50 rounded-lg text-green-400 placeholder-green-400/50 
                         focus:border-green-400 focus:outline-none"
              min="0"
              max="100"
              disabled={isSubmitting}
            />
            <input
              type="number"
              placeholder="Reward Amount (ETH)"
              value={newCommitment.reward_amount}
              onChange={(e) => handleInputChange('reward_amount', Number(e.target.value))}
              className="p-3 bg-black border border-green-400/50 rounded-lg text-green-400 placeholder-green-400/50 
                         focus:border-green-400 focus:outline-none"
              min="0"
              step="0.01"
              disabled={isSubmitting}
            />
            <input
              type="number"
              placeholder="Penalty Amount (ETH)"
              value={newCommitment.penalty_amount}
              onChange={(e) => handleInputChange('penalty_amount', Number(e.target.value))}
              className="p-3 bg-black border border-green-400/50 rounded-lg text-green-400 placeholder-green-400/50 
                         focus:border-green-400 focus:outline-none"
              min="0"
              step="0.01"
              disabled={isSubmitting}
            />
            <textarea
              placeholder="Smart Contract Description & Environmental Goals *"
              value={newCommitment.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="p-3 bg-black border border-green-400/50 rounded-lg text-green-400 placeholder-green-400/50 
                         focus:border-green-400 focus:outline-none md:col-span-2"
              rows={3}
              required
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="md:col-span-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 
                         hover:from-green-500 hover:to-blue-500 text-white font-bold rounded-lg 
                         transition-all duration-300 transform hover:scale-105 disabled:opacity-50 
                         disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? '🔄 Deploying to Ethereum...' : '🚀 Deploy Smart Contract'}
            </button>
          </form>
        </div>
      )}

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commitments List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-green-400 mb-4">📋 Smart Contracts & Commitments</h2>
          {commitments.length === 0 ? (
            <div className="p-8 bg-gray-900/30 border border-green-400/20 rounded-lg text-center">
              <div className="text-green-400/70 text-lg">No smart contracts deployed</div>
              <div className="text-green-400/50 text-sm mt-2">Deploy your first environmental commitment contract!</div>
            </div>
          ) : (
            commitments.map(commitment => {
              const currentProgress = localProgress[commitment.id] ?? getEnvironmentalScore(commitment);
              const satStatus = getSatelliteVerificationStatus(commitment.id.toString());
              const satData = satelliteData[commitment.id];
              
              const statusColor = commitment.status === 'completed' ? 'text-green-400' : 
                                commitment.status === 'active' ? 'text-blue-400' : 'text-yellow-400';
              
              function setProgressUpdate(value: string): void {
                throw new Error('Function not implemented.');
              }

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
                    <div className="flex flex-col items-end space-y-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor} bg-current bg-opacity-20`}>
                        {commitment.status?.toUpperCase()}
                      </div>
                      {/* Satellite Verification Badge */}
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                        satStatus === 'verified' ? 'text-green-400 bg-green-400/20' :
                        satStatus === 'pending' ? 'text-yellow-400 bg-yellow-400/20' :
                        'text-red-400 bg-red-400/20'
                      }`}>
                        🛰️ {satStatus.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400/70">Real-time Progress: {currentProgress.toFixed(1)}%</span>
                      <span className="text-green-400/70">
                        Target: {commitment.target_value}%
                      </span>
                    </div>
                    
                    {/* Enhanced Progress Bar with Satellite Data */}
                    <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                      <div className="relative h-full">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500 ease-out"
                          style={{ width: `${Math.min(100, currentProgress)}%` }}
                        >
                          <div className="h-full bg-gradient-to-r from-green-400 to-blue-400 animate-pulse opacity-75"></div>
                        </div>
                        {satStatus === 'verified' && (
                          <div className="absolute top-0 right-0 h-full w-4 bg-green-400 opacity-75 animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    
                    {/* Satellite Data Display */}
                    {satData && (
                      <div className="bg-black/50 rounded-lg p-3 text-xs">
                        <div className="grid grid-cols-2 gap-2 text-green-400/70">
                          <span>Forest Change: {satData.forest_coverage_change > 0 ? '+' : ''}{satData.forest_coverage_change.toFixed(2)}%</span>
                          <span>Deforestation: {satData.deforestation_detected ? '🚨 Detected' : '✅ None'}</span>
                          <span>Last Update: {new Date(satData.last_updated).toLocaleDateString()}</span>
                          <span>Verification: {satData.verification_status}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Interactive Progress Slider */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentProgress}
                      //onChange={(e) => handleProgressUpdate(commitment.id, Number(e.target.value))}
                      onChange={(e) => setProgressUpdate(e.target.value)}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer 
                                 slider hover:bg-gray-600 transition-colors duration-200"
                      disabled={commitment.status === 'completed'}
                    />
                    
                    <div className="flex justify-between text-xs text-green-400/50">
                      <span>👤 {commitment.official_name}</span>
                      <span>📅 {new Date(commitment.deadline).toLocaleDateString()}</span>
                      <span>🏷️ {commitment.category}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      {commitment.status === 'completed' && satStatus === 'verified' && (
                        <button
                          onClick={() => handleClaimReward(commitment.id.toString())}
                          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 
                                     hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-lg 
                                     transition-all duration-300 transform hover:scale-105"
                        >
                          💰 Claim Reward
                        </button>
                      )}
                      <button
                        onClick={() => fetchSatelliteData(commitment.id.toString())}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-blue-400/50 
                                   text-blue-400 font-bold rounded-lg transition-all duration-300"
                      >
                        🛰️ Verify via Satellite
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Enhanced Analytics Panel */}
        <div className="space-y-6">
          {/* Real-time Progress Overview Chart */}
          <div className="bg-gray-900/50 border border-green-400/30 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-green-400 mb-4">📊 Real-time Progress & Verification</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#10b981" opacity={0.2} />
                <XAxis dataKey="name" stroke="#10b981" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#10b981" fontSize={10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111827', 
                    border: '1px solid #10b981',
                    borderRadius: '8px',
                    color: '#10b981'
                  }} 
                />
                <Bar dataKey="Progress" fill="#10b981" />
                <Bar dataKey="SatelliteVerified" fill="#3b82f6" />
                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Environmental Trend Chart */}
          {environmentalData && (
            <div className="bg-gray-900/50 border border-blue-400/30 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-blue-400 mb-4">🌍 Environmental Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Air Quality Index</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-800 rounded-full h-2 mr-2">
                      <div 
                        className="h-2 bg-green-400 rounded-full" 
                        style={{width: `${environmentalData.air_quality}%`}}
                      ></div>
                    </div>
                    <span className="text-green-400 text-sm">{(environmentalData.air_quality ?? 0).toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Water Quality</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-800 rounded-full h-2 mr-2">
                      <div 
                        className="h-2 bg-blue-400 rounded-full" 
                        style={{width: `${environmentalData.water_quality}%`}}
                      ></div>
                    </div>
                    <span className="text-blue-400 text-sm">{(environmentalData.water_quality ?? 0).toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Forest Coverage</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-800 rounded-full h-2 mr-2">
                      <div 
                        className="h-2 bg-purple-400 rounded-full" 
                        style={{width: `${environmentalData.forest_coverage}%`}}
                      ></div>
                    </div>
                    <span className="text-purple-400 text-sm">{(environmentalData.forest_coverage ?? 0).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category Distribution */}
          {pieData.length > 0 && (
            <div className="bg-gray-900/50 border border-green-400/30 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-green-400 mb-4">🏷️ Contract Categories</h3>
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

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 border border-green-400/30 rounded-lg p-4 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-green-400">{commitments.length}</div>
              <div className="text-xs text-green-400/70">Smart Contracts</div>
            </div>
            <div className="bg-gray-900/50 border border-blue-400/30 rounded-lg p-4 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-400">
                {commitments.filter(c => c.status === 'active').length}
              </div>
              <div className="text-xs text-green-400/70">Active</div>
            </div>
            <div className="bg-gray-900/50 border border-purple-400/30 rounded-lg p-4 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-purple-400">
                {Object.values(satelliteData).filter(s => s.verification_status === 'verified').length}
              </div>
              <div className="text-xs text-green-400/70">Satellite Verified</div>
            </div>
            <div className="bg-gray-900/50 border border-yellow-400/30 rounded-lg p-4 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-yellow-400">
                {commitments.reduce((sum, c) => sum + (c.stake_amount || 0), 0).toFixed(2)}
              </div>
              <div className="text-xs text-green-400/70">ETH Staked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles for Enhanced UI */}
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

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(16, 185, 129, 0.5); }
          50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.8); }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default CommitmentDashboard;

