(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

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
*/ /*
'use client';

import { useState, useEffect } from 'react';
import CommitmentDashboard from './components/CommitmentDashboard';

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
  const [currentView, setCurrentView] = useState<'feed' | 'dashboard'>('feed');

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
    ? 'https://api.databutton.com/_projects/f4d95df8-c90d-4815-9705-a83827aa1133/dbtn/devx/app/routes'
    : 'https://api.databutton.com/_projects/f4d95df8-c90d-4815-9705-a83827aa1133/dbtn/prodx/app/routes';

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: 'include',
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

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
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

  const handleUpdateProgress = async (commitmentId: string, newProgress: number) => {
    try {
      const response = await apiCall('/update_commitment_progress', {
        method: 'POST',
        body: JSON.stringify({
          commitment_id: commitmentId,
          new_progress: newProgress
        }),
      });

      setCommitments(prev => prev.map(c =>
        c.id === commitmentId
          ? { ...c, current_progress: newProgress }
          : c
      ));

      alert('Progress updated successfully!');
    } catch (err) {
      alert('Error updating progress. Please try again.');
      console.error('Error updating progress:', err);
    }
  };

  const handleClaimReward = async (commitmentId: string) => {
    try {
      const response = await apiCall('/claim_reward', {
        method: 'POST',
        body: JSON.stringify({ commitment_id: commitmentId }),
      });

      alert('Reward claimed successfully!');
    } catch (err) {
      alert('Error claiming reward. Please try again.');
      console.error('Error claiming reward:', err);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => setCurrentView('feed')}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            currentView === 'feed'
              ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
              : 'text-gray-400 hover:text-cyan-400'
          }`}
        >
          Feed
        </button>
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            currentView === 'dashboard'
              ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
              : 'text-gray-400 hover:text-cyan-400'
          }`}
        >
          Dashboard
        </button>
      </div>

      {currentView === 'dashboard' ? (
        <CommitmentDashboard
          commitments={commitments}
          onUpdateProgress={handleUpdateProgress}
          onClaimReward={handleClaimReward}
        />
      ) : (
        <div>
          {/* Your existing feed JSX goes here — e.g., map commitments, display environmental data, etc. *
          <p>🌱 Feed content goes here (replace with your existing JSX)...</p>
        </div>
      )}
    </div>
  );
}
*/ /*
'use client';

import { useState, useEffect } from 'react';
// For standalone project, you'll need to install and configure these:
// npm install sonner
// You'll also need to create your own API client or use fetch

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

// Fixed brain client with proper return types
const brain = {
  get_all_commitments: async () => ({ 
    json: async () => ({ 
      commitments: [] as Commitment[] 
    }) 
  }),
  get_environmental_data: async () => ({ 
    json: async (): Promise<EnvironmentalData> => ({
      location: "Sample Location",
      pm25: 25.5,
      co2: 410,
      forest_cover: 75.2,
      water_quality: 82,
      timestamp: new Date().toISOString(),
      source: "Mock Data"
    }) 
  }),
  get_satellite_data: async (params: { commitmentId: string }) => ({ 
    json: async (): Promise<SatelliteData> => ({
      location: "Sample Region",
      forest_cover_percentage: 78.5,
      change_detected: false,
      last_updated: new Date().toISOString(),
      confidence_score: 94
    }) 
  }),
  create_commitment: async (data: CreateCommitmentRequest) => ({ 
    json: async (): Promise<Commitment> => ({
      id: Date.now().toString(),
      ...data,
      current_progress: 0,
      status: 'active',
      created_at: new Date().toISOString(),
      satellite_verified: false
    }) 
  }),
  update_commitment_progress: async (data: { commitment_id: string; new_progress: number }) => ({ 
    json: async () => ({ success: true, ...data }) 
  }),
  claim_reward: async (data: { commitment_id: string }) => ({ 
    json: async () => ({ success: true, message: 'Reward claimed!', ...data }) 
  }),
};

// Simple toast implementation - install 'sonner' package: npm install sonner
// import { toast } from 'sonner';
// For now, using console.log as placeholder
const toast = {
  success: (msg: string) => console.log('Success:', msg),
  error: (msg: string) => console.error('Error:', msg),
};

// Placeholder CommitmentDashboard component - you'll need to create this
const CommitmentDashboard = ({ commitments, onUpdateProgress, onClaimReward }: {
  commitments: Commitment[];
  onUpdateProgress: (id: string, progress: number) => void;
  onClaimReward: (id: string) => void;
}) => (
  <div className="text-white">
    <h2 className="text-2xl font-bold mb-4">Commitment Dashboard</h2>
    <div className="grid gap-4">
      {commitments.map(commitment => (
        <div key={commitment.id} className="bg-black/20 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6">
          <h3 className="text-lg font-semibold">{commitment.title}</h3>
          <p className="text-gray-400 mb-2">{commitment.description}</p>
          <div className="flex gap-4 items-center">
            <span>Progress: {commitment.current_progress}%</span>
            <button 
              onClick={() => onUpdateProgress(commitment.id, Math.min(commitment.current_progress + 10, 100))}
              className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-3 py-1 rounded"
            >
              Update +10%
            </button>
            {commitment.current_progress >= commitment.target_value && (
              <button 
                onClick={() => onClaimReward(commitment.id)}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-400 px-3 py-1 rounded"
              >
                Claim Reward
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function Home() {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'feed' | 'dashboard'>('feed');

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

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      try {
        const commitmentsResponse = await brain.get_all_commitments();
        const commitmentsData = await commitmentsResponse.json();
        setCommitments(commitmentsData.commitments || []);
      } catch (err) {
        console.error('Error fetching commitments:', err);
        setCommitments([]);
      }

      try {
        const envResponse = await brain.get_environmental_data();
        const envData = await envResponse.json();
        setEnvironmentalData(envData);
      } catch (err) {
        console.error('Error fetching environmental data:', err);
        // Fallback data with proper type
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
        // Fixed: pass object with commitmentId property
        const satResponse = await brain.get_satellite_data({ commitmentId: 'general' });
        const satData = await satResponse.json();
        setSatelliteData(satData);
      } catch (err) {
        console.error('Error fetching satellite data:', err);
        // Fallback data with proper type
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

      const response = await brain.create_commitment(commitmentData);
      const createdCommitment = await response.json();

      setCommitments(prev => [createdCommitment, ...prev]);

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

      toast.success('Commitment created successfully!');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Please try again.';
      toast.error(`Error creating commitment: ${errorMessage}`);
      console.error('Error creating commitment:', err);
    }
  };

  const handleUpdateProgress = async (commitmentId: string, newProgress: number) => {
    try {
      const response = await brain.update_commitment_progress({
        commitment_id: commitmentId,
        new_progress: newProgress
      });

      setCommitments(prev => prev.map(c =>
        c.id === commitmentId
          ? { ...c, current_progress: newProgress }
          : c
      ));

      toast.success('Progress updated successfully!');
    } catch (err) {
      toast.error('Error updating progress. Please try again.');
      console.error('Error updating progress:', err);
    }
  };

  const handleClaimReward = async (commitmentId: string) => {
    try {
      const response = await brain.claim_reward({ commitment_id: commitmentId });
      toast.success('Reward claimed successfully!');
    } catch (err) {
      toast.error('Error claiming reward. Please try again.');
      console.error('Error claiming reward:', err);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-6">
      {/* Header *
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4">
          🌍 EcoChain Governance
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          Transparent environmental accountability through blockchain technology
        </p>
      </div>

      {/* Navigation *
      <div className="max-w-7xl mx-auto flex items-center space-x-4 mb-8">
        <button
          onClick={() => setCurrentView('feed')}
          className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium ${
            currentView === 'feed'
              ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
              : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
          }`}
        >
          📡 Social Feed
        </button>
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium ${
            currentView === 'dashboard'
              ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
              : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
          }`}
        >
          📊 Dashboard
        </button>
      </div>

      {currentView === 'dashboard' ? (
        <CommitmentDashboard
          commitments={commitments}
          onUpdateProgress={handleUpdateProgress}
          onClaimReward={handleClaimReward}
        />
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Environmental Data Cards *
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {environmentalData && (
              <>
                <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-red-500/20 p-6">
                  <div className="text-red-400 text-sm font-medium mb-2">Air Quality (PM2.5)</div>
                  <div className="text-3xl font-bold text-white mb-1">{environmentalData.pm25} μg/m³</div>
                  <div className="text-xs text-gray-400">{environmentalData.location}</div>
                </div>
                <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-orange-500/20 p-6">
                  <div className="text-orange-400 text-sm font-medium mb-2">CO2 Levels</div>
                  <div className="text-3xl font-bold text-white mb-1">{environmentalData.co2} ppm</div>
                  <div className="text-xs text-gray-400">Atmospheric Reading</div>
                </div>
                <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-green-500/20 p-6">
                  <div className="text-green-400 text-sm font-medium mb-2">Forest Cover</div>
                  <div className="text-3xl font-bold text-white mb-1">{environmentalData.forest_cover}%</div>
                  <div className="text-xs text-gray-400">Regional Coverage</div>
                </div>
                <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6">
                  <div className="text-blue-400 text-sm font-medium mb-2">Water Quality</div>
                  <div className="text-3xl font-bold text-white mb-1">{environmentalData.water_quality}%</div>
                  <div className="text-xs text-gray-400">Quality Index</div>
                </div>
              </>
            )}
          </div>

          {/* Satellite Data *
          {satelliteData && (
            <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6 mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  🛰️
                </div>
                <div>
                  <h3 className="text-white font-semibold">Satellite Monitoring</h3>
                  <p className="text-gray-400 text-sm">Real-time environmental verification</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-gray-400 text-sm">Location</div>
                  <div className="text-white font-medium">{satelliteData.location}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Forest Coverage</div>
                  <div className="text-white font-medium">{satelliteData.forest_cover_percentage}%</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Confidence Score</div>
                  <div className="text-white font-medium">{satelliteData.confidence_score}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Commitment Creation Form *
          <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center mr-3">
                ➕
              </span>
              Create New Commitment
            </h2>
            <form onSubmit={handleCreateCommitment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newCommitment.title}
                  onChange={(e) => setNewCommitment({...newCommitment, title: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                  placeholder="Commitment title"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
                <select 
                  value={newCommitment.category}
                  onChange={(e) => setNewCommitment({...newCommitment, category: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400"
                >
                  <option value="forest_protection">🌳 Forest Protection</option>
                  <option value="air_quality">🏭 Air Quality</option>
                  <option value="water_management">💧 Water Management</option>
                  <option value="biodiversity">🦋 Biodiversity</option>
                  <option value="waste_reduction">♻️ Waste Reduction</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newCommitment.description}
                  onChange={(e) => setNewCommitment({...newCommitment, description: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                  placeholder="Describe your environmental commitment"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Target Value (%)</label>
                <input
                  type="number"
                  value={newCommitment.target_value}
                  onChange={(e) => setNewCommitment({...newCommitment, target_value: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                  placeholder="Target percentage"
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Deadline</label>
                <input
                  type="date"
                  value={newCommitment.deadline}
                  onChange={(e) => setNewCommitment({...newCommitment, deadline: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Official Name</label>
                <input
                  type="text"
                  value={newCommitment.official_name}
                  onChange={(e) => setNewCommitment({...newCommitment, official_name: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Official Role</label>
                <input
                  type="text"
                  value={newCommitment.official_role}
                  onChange={(e) => setNewCommitment({...newCommitment, official_role: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                  placeholder="Your role/position"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Stake Amount (ETH)</label>
                <input
                  type="number"
                  value={newCommitment.stake_amount}
                  onChange={(e) => setNewCommitment({...newCommitment, stake_amount: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                  placeholder="Stake amount"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Create Commitment
                </button>
              </div>
            </form>
          </div>

          {/* Commitments Feed *
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg flex items-center justify-center mr-3">
                📋
              </span>
              Recent Commitments
            </h2>
            {commitments.map((commitment) => (
              <div key={commitment.id} className="bg-black/20 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4">
                      {getCategoryIcon(commitment.category)}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{commitment.official_name}</h3>
                      <p className="text-gray-400 text-sm">{commitment.official_role}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    commitment.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    commitment.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {commitment.status.toUpperCase()}
                  </div>
                </div>
                <h4 className="text-white font-semibold text-lg mb-2">{commitment.title}</h4>
                <p className="text-gray-300 mb-4">{commitment.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-gray-400 text-sm">Progress</div>
                    <div className="text-white font-medium">{commitment.current_progress}% / {commitment.target_value}%</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Deadline</div>
                    <div className="text-white font-medium">{formatDate(commitment.deadline)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Stake</div>
                    <div className="text-white font-medium">{commitment.stake_amount} ETH</div>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-1000" 
                    style={{width: `${calculateProgress(commitment.current_progress, commitment.target_value)}%`}}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-400">
                    Created: {formatDate(commitment.created_at)} • 
                    {commitment.satellite_verified ? ' 🛰️ Satellite Verified' : ' 📊 Self-reported'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {commitments.length === 0 && (
            <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-gray-500/20 p-12 text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-white text-xl mb-2">No commitments yet</h3>
              <p className="text-gray-400">Be the first to create an environmental commitment!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
  */ /*
'use client';

import { useState, useEffect } from 'react';
// For standalone project, you'll need to install and configure these:
// npm install sonner
// You'll also need to create your own API client or use fetch

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

// Fixed brain client with proper return types
const brain = {
  get_all_commitments: async () => ({ 
    json: async () => ({ 
      commitments: [] as Commitment[] 
    }) 
  }),
  get_environmental_data: async () => ({ 
    json: async (): Promise<EnvironmentalData> => ({
      location: "Sample Location",
      pm25: 25.5,
      co2: 410,
      forest_cover: 75.2,
      water_quality: 82,
      timestamp: new Date().toISOString(),
      source: "Mock Data"
    }) 
  }),
  get_satellite_data: async (params: { commitmentId: string }) => ({ 
    json: async (): Promise<SatelliteData> => ({
      location: "Sample Region",
      forest_cover_percentage: 78.5,
      change_detected: false,
      last_updated: new Date().toISOString(),
      confidence_score: 94
    }) 
  }),
  create_commitment: async (data: CreateCommitmentRequest) => ({ 
    json: async (): Promise<Commitment> => ({
      id: Date.now().toString(),
      ...data,
      current_progress: 0,
      status: 'active',
      created_at: new Date().toISOString(),
      satellite_verified: false
    }) 
  }),
  update_commitment_progress: async (data: { commitment_id: string; new_progress: number }) => ({ 
    json: async () => ({ success: true, ...data }) 
  }),
  claim_reward: async (data: { commitment_id: string }) => ({ 
    json: async () => ({ success: true, message: 'Reward claimed!', ...data }) 
  }),
};

// Simple toast implementation - install 'sonner' package: npm install sonner
// import { toast } from 'sonner';
// For now, using console.log as placeholder
const toast = {
  success: (msg: string) => console.log('Success:', msg),
  error: (msg: string) => console.error('Error:', msg),
};

// Placeholder CommitmentDashboard component - you'll need to create this
const CommitmentDashboard = ({ commitments, onUpdateProgress, onClaimReward }: {
  commitments: Commitment[];
  onUpdateProgress: (id: string, progress: number) => void;
  onClaimReward: (id: string) => void;
}) => (
  <div className="text-white">
    <h2 className="text-2xl font-bold mb-4">Commitment Dashboard</h2>
    <div className="grid gap-4">
      {commitments.map(commitment => (
        <div key={commitment.id} className="bg-black/20 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6">
          <h3 className="text-lg font-semibold">{commitment.title}</h3>
          <p className="text-gray-400 mb-2">{commitment.description}</p>
          <div className="flex gap-4 items-center">
            <span>Progress: {commitment.current_progress}%</span>
            <button 
              onClick={() => onUpdateProgress(commitment.id, Math.min(commitment.current_progress + 10, 100))}
              className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-3 py-1 rounded"
            >
              Update +10%
            </button>
            {commitment.current_progress >= commitment.target_value && (
              <button 
                onClick={() => onClaimReward(commitment.id)}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-400 px-3 py-1 rounded"
              >
                Claim Reward
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function Home() {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'feed' | 'dashboard'>('feed');

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

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      try {
        const commitmentsResponse = await brain.get_all_commitments();
        const commitmentsData = await commitmentsResponse.json();
        setCommitments(commitmentsData.commitments || []);
      } catch (err) {
        console.error('Error fetching commitments:', err);
        setCommitments([]);
      }

      try {
        const envResponse = await brain.get_environmental_data();
        const envData = await envResponse.json();
        setEnvironmentalData(envData);
      } catch (err) {
        console.error('Error fetching environmental data:', err);
        // Fallback data with proper type
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
        // Fixed: pass object with commitmentId property
        const satResponse = await brain.get_satellite_data({ commitmentId: 'general' });
        const satData = await satResponse.json();
        setSatelliteData(satData);
      } catch (err) {
        console.error('Error fetching satellite data:', err);
        // Fallback data with proper type
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

      const response = await brain.create_commitment(commitmentData);
      const createdCommitment = await response.json();

      setCommitments(prev => [createdCommitment, ...prev]);

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

      toast.success('Commitment created successfully!');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Please try again.';
      toast.error(`Error creating commitment: ${errorMessage}`);
      console.error('Error creating commitment:', err);
    }
  };

  const handleUpdateProgress = async (commitmentId: string, newProgress: number) => {
    try {
      const response = await brain.update_commitment_progress({
        commitment_id: commitmentId,
        new_progress: newProgress
      });

      setCommitments(prev => prev.map(c =>
        c.id === commitmentId
          ? { ...c, current_progress: newProgress }
          : c
      ));

      toast.success('Progress updated successfully!');
    } catch (err) {
      toast.error('Error updating progress. Please try again.');
      console.error('Error updating progress:', err);
    }
  };

  const handleClaimReward = async (commitmentId: string) => {
    try {
      const response = await brain.claim_reward({ commitment_id: commitmentId });
      toast.success('Reward claimed successfully!');
    } catch (err) {
      toast.error('Error claiming reward. Please try again.');
      console.error('Error claiming reward:', err);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-6">
      {/* Header *
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4">
          🌍 EcoChain Governance
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          Transparent environmental accountability through blockchain technology
        </p>
      </div>

      {/* Navigation *
      <div className="max-w-7xl mx-auto flex items-center space-x-4 mb-8">
        <button
          onClick={() => setCurrentView('feed')}
          className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium ${
            currentView === 'feed'
              ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
              : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
          }`}
        >
          📡 Social Feed
        </button>
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium ${
            currentView === 'dashboard'
              ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
              : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
          }`}
        >
          📊 Dashboard
        </button>
      </div>

      {currentView === 'dashboard' ? (
        <CommitmentDashboard
          commitments={commitments}
          onUpdateProgress={handleUpdateProgress}
          onClaimReward={handleClaimReward}
        />
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Environmental Data Cards *
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {environmentalData && (
              <>
                <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-red-500/20 p-6">
                  <div className="text-red-400 text-sm font-medium mb-2">Air Quality (PM2.5)</div>
                  <div className="text-3xl font-bold text-white mb-1">{environmentalData.pm25} μg/m³</div>
                  <div className="text-xs text-gray-400">{environmentalData.location}</div>
                </div>
                <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-orange-500/20 p-6">
                  <div className="text-orange-400 text-sm font-medium mb-2">CO2 Levels</div>
                  <div className="text-3xl font-bold text-white mb-1">{environmentalData.co2} ppm</div>
                  <div className="text-xs text-gray-400">Atmospheric Reading</div>
                </div>
                <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-green-500/20 p-6">
                  <div className="text-green-400 text-sm font-medium mb-2">Forest Cover</div>
                  <div className="text-3xl font-bold text-white mb-1">{environmentalData.forest_cover}%</div>
                  <div className="text-xs text-gray-400">Regional Coverage</div>
                </div>
                <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6">
                  <div className="text-blue-400 text-sm font-medium mb-2">Water Quality</div>
                  <div className="text-3xl font-bold text-white mb-1">{environmentalData.water_quality}%</div>
                  <div className="text-xs text-gray-400">Quality Index</div>
                </div>
              </>
            )}
          </div>

          {/* Satellite Data *
          {satelliteData && (
            <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6 mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  🛰️
                </div>
                <div>
                  <h3 className="text-white font-semibold">Satellite Monitoring</h3>
                  <p className="text-gray-400 text-sm">Real-time environmental verification</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-gray-400 text-sm">Location</div>
                  <div className="text-white font-medium">{satelliteData.location}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Forest Coverage</div>
                  <div className="text-white font-medium">{satelliteData.forest_cover_percentage}%</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Confidence Score</div>
                  <div className="text-white font-medium">{satelliteData.confidence_score}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Commitment Creation Form *
          <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center mr-3">
                ➕
              </span>
              Create New Commitment
            </h2>
            <form onSubmit={handleCreateCommitment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newCommitment.title}
                  onChange={(e) => setNewCommitment({...newCommitment, title: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                  placeholder="Commitment title"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
                <select 
                  value={newCommitment.category}
                  onChange={(e) => setNewCommitment({...newCommitment, category: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400"
                >
                  <option value="forest_protection">🌳 Forest Protection</option>
                  <option value="air_quality">🏭 Air Quality</option>
                  <option value="water_management">💧 Water Management</option>
                  <option value="biodiversity">🦋 Biodiversity</option>
                  <option value="waste_reduction">♻️ Waste Reduction</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newCommitment.description}
                  onChange={(e) => setNewCommitment({...newCommitment, description: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                  placeholder="Describe your environmental commitment"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Target Value (%)</label>
                <input
                  type="number"
                  value={newCommitment.target_value}
                  onChange={(e) => setNewCommitment({...newCommitment, target_value: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                  placeholder="Target percentage"
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Deadline</label>
                <input
                  type="date"
                  value={newCommitment.deadline}
                  onChange={(e) => setNewCommitment({...newCommitment, deadline: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Official Name</label>
                <input
                  type="text"
                  value={newCommitment.official_name}
                  onChange={(e) => setNewCommitment({...newCommitment, official_name: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Official Role</label>
                <input
                  type="text"
                  value={newCommitment.official_role}
                  onChange={(e) => setNewCommitment({...newCommitment, official_role: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                  placeholder="Your role/position"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Stake Amount (ETH)</label>
                <input
                  type="number"
                  value={newCommitment.stake_amount}
                  onChange={(e) => setNewCommitment({...newCommitment, stake_amount: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                  placeholder="Stake amount"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Create Commitment
                </button>
              </div>
            </form>
          </div>

          {/* Commitments Feed *
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg flex items-center justify-center mr-3">
                📋
              </span>
              Recent Commitments
            </h2>
            {commitments.map((commitment) => (
              <div key={commitment.id} className="bg-black/20 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4">
                      {getCategoryIcon(commitment.category)}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{commitment.official_name}</h3>
                      <p className="text-gray-400 text-sm">{commitment.official_role}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    commitment.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    commitment.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {commitment.status.toUpperCase()}
                  </div>
                </div>
                <h4 className="text-white font-semibold text-lg mb-2">{commitment.title}</h4>
                <p className="text-gray-300 mb-4">{commitment.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-gray-400 text-sm">Progress</div>
                    <div className="text-white font-medium">{commitment.current_progress}% / {commitment.target_value}%</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Deadline</div>
                    <div className="text-white font-medium">{formatDate(commitment.deadline)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Stake</div>
                    <div className="text-white font-medium">{commitment.stake_amount} ETH</div>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-1000" 
                    style={{width: `${calculateProgress(commitment.current_progress, commitment.target_value)}%`}}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-400">
                    Created: {formatDate(commitment.created_at)} • 
                    {commitment.satellite_verified ? ' 🛰️ Satellite Verified' : ' 📊 Self-reported'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {commitments.length === 0 && (
            <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-gray-500/20 p-12 text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-white text-xl mb-2">No commitments yet</h3>
              <p className="text-gray-400">Be the first to create an environmental commitment!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
*/ /*
'use client';

import { useState, useEffect } from 'react';
// For standalone project, you'll need to install and configure these:
// npm install sonner
// You'll also need to create your own API client or use fetch

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
  reward_claimed?: boolean;
  reward_amount?: number;
  completion_date?: string;
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

// Fixed brain client with proper return types
const brain = {
  get_all_commitments: async () => ({ 
    ok: true,
    json: async () => ({ 
      commitments: [] as Commitment[] 
    }) 
  }),
  get_environmental_data: async () => ({ 
    ok: true,
    json: async (): Promise<EnvironmentalData> => ({
      location: "Sample Location",
      pm25: Math.random() * 50 + 10, // Random values for demo
      co2: Math.random() * 50 + 400,
      forest_cover: Math.random() * 30 + 60,
      water_quality: Math.random() * 40 + 60,
      timestamp: new Date().toISOString(),
      source: "Mock Data"
    }) 
  }),
  get_satellite_data: async (params: { commitmentId: string }) => ({ 
    ok: true,
    json: async (): Promise<SatelliteData> => ({
      location: "Sample Region",
      forest_cover_percentage: Math.random() * 20 + 70, // Random values for demo
      change_detected: Math.random() > 0.5,
      last_updated: new Date().toISOString(),
      confidence_score: Math.random() * 20 + 80
    }) 
  }),
  create_commitment: async (data: CreateCommitmentRequest) => ({ 
    ok: true,
    json: async (): Promise<Commitment> => ({
      id: Date.now().toString(),
      ...data,
      current_progress: 0,
      status: 'active',
      created_at: new Date().toISOString(),
      satellite_verified: false
    }) 
  }),
  update_commitment_progress: async (data: { commitment_id: string; new_progress: number }) => ({ 
    ok: true,
    json: async () => ({ success: true, ...data }) 
  }),
  claim_reward: async (data: { commitment_id: string }) => ({ 
    ok: true,
    json: async () => ({ 
      success: true, 
      message: 'Reward claimed successfully!', 
      reward_amount: Math.random() * 5 + 1, // Random reward between 1-6 ETH
      transaction_hash: '0x' + Math.random().toString(16).substr(2, 40),
      ...data 
    }) 
  }),
};

// Simple toast implementation - install 'sonner' package: npm install sonner
// import { toast } from 'sonner';
// For now, using console.log as placeholder
const toast = {
  success: (msg: string) => console.log('Success:', msg),
  error: (msg: string) => console.error('Error:', msg),
};

// Placeholder CommitmentDashboard component - you'll need to create this
const CommitmentDashboard = ({ commitments, onUpdateProgress, onClaimReward }: {
  commitments: Commitment[];
  onUpdateProgress: (id: string, progress: number) => void;
  onClaimReward: (id: string) => void;
}) => (
  <div className="text-white">
    <h2 className="text-2xl font-bold mb-4">Commitment Dashboard</h2>
    <div className="grid gap-4">
      {commitments.map(commitment => (
        <div key={commitment.id} className="bg-black/20 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6">
          <h3 className="text-lg font-semibold">{commitment.title}</h3>
          <p className="text-gray-400 mb-2">{commitment.description}</p>
          <div className="flex gap-4 items-center flex-wrap">
            <span>Progress: {commitment.current_progress}%</span>
            <span className={`px-2 py-1 rounded text-xs ${
              commitment.status === 'active' ? 'bg-green-500/20 text-green-400' :
              commitment.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
              commitment.status === 'rewarded' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {commitment.status.toUpperCase()}
            </span>
            {commitment.status === 'active' && (
              <button 
                onClick={() => onUpdateProgress(commitment.id, Math.min(commitment.current_progress + 10, 100))}
                className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-3 py-1 rounded"
              >
                Update +10%
              </button>
            )}
            {commitment.current_progress >= commitment.target_value && commitment.status !== 'rewarded' && (
              <button 
                onClick={() => onClaimReward(commitment.id)}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-400 px-3 py-1 rounded"
              >
                Claim Reward
              </button>
            )}
            {commitment.reward_claimed && (
              <span className="text-yellow-400 text-sm">
                💰 Reward: {commitment.reward_amount?.toFixed(2)} ETH
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function Home() {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'feed' | 'dashboard'>('feed');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

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

  useEffect(() => {
    fetchAllData();
    
    // Set up interval for real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchAllData();
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      try {
        const commitmentsResponse = await brain.get_all_commitments();
        const commitmentsData = await commitmentsResponse.json();
        setCommitments(commitmentsData.commitments || []);
      } catch (err) {
        console.error('Error fetching commitments:', err);
        setCommitments([]);
      }

      try {
        const envResponse = await brain.get_environmental_data();
        const envData = await envResponse.json();
        setEnvironmentalData(envData);
      } catch (err) {
        console.error('Error fetching environmental data:', err);
        // Fallback data with proper type
        setEnvironmentalData({
          location: "Sample Location",
          pm25: Math.random() * 50 + 10,
          co2: Math.random() * 50 + 400,
          forest_cover: Math.random() * 30 + 60,
          water_quality: Math.random() * 40 + 60,
          timestamp: new Date().toISOString(),
          source: "Mock Data"
        });
      }

      try {
        // Fixed: pass object with commitmentId property
        const satResponse = await brain.get_satellite_data({ commitmentId: 'general' });
        const satData = await satResponse.json();
        setSatelliteData(satData);
      } catch (err) {
        console.error('Error fetching satellite data:', err);
        // Fallback data with proper type
        setSatelliteData({
          location: "Sample Region",
          forest_cover_percentage: Math.random() * 20 + 70,
          change_detected: Math.random() > 0.5,
          last_updated: new Date().toISOString(),
          confidence_score: Math.random() * 20 + 80
        });
      }

      // Update timestamp to show data freshness
      setLastUpdated(new Date());

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
      // First create in database (not just state)
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

      const response = await brain.create_commitment(commitmentData);
      
      if (response.ok) {
        // After creating, refresh from database instead of just updating state
        await fetchAllData(); // This will get persisted data
        
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

        toast.success('Commitment created successfully!');
      } else {
        throw new Error('Failed to create commitment');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Please try again.';
      toast.error(`Error creating commitment: ${errorMessage}`);
      console.error('Error creating commitment:', err);
    }
  };

  const handleUpdateProgress = async (commitmentId: string, newProgress: number) => {
    try {
      const response = await brain.update_commitment_progress({
        commitment_id: commitmentId,
        new_progress: newProgress
      });

      if (response.ok) {
        // Update local state
        setCommitments(prev => prev.map(c =>
          c.id === commitmentId
            ? { 
                ...c, 
                current_progress: newProgress,
                status: newProgress >= c.target_value ? 'completed' : 'active'
              }
            : c
        ));

        toast.success('Progress updated successfully!');
        
        // Refresh data to ensure consistency
        await fetchAllData();
      } else {
        throw new Error('Failed to update progress');
      }
    } catch (err) {
      toast.error('Error updating progress. Please try again.');
      console.error('Error updating progress:', err);
    }
  };

  const handleClaimReward = async (commitmentId: string) => {
    try {
      const response = await brain.claim_reward({ commitment_id: commitmentId });
      
      if (response.ok) {
        const result = await response.json();
        
        // Update commitment status to 'rewarded'
        setCommitments(prev => 
          prev.map(c => 
            c.id === commitmentId 
              ? { 
                  ...c, 
                  status: 'rewarded',
                  reward_claimed: true,
                  reward_amount: result.reward_amount,
                  completion_date: new Date().toISOString()
                }
              : c
          )
        );
        
        // Show success message with details
        alert(`🎉 ${result.message}\nReward: ${result.reward_amount?.toFixed(2)} ETH\nTransaction: ${result.transaction_hash}`);
        
        // Refresh data to ensure consistency
        await fetchAllData();
      } else {
        throw new Error('Failed to claim reward');
      }
    } catch (err) {
      alert('Error claiming reward. Please try again.');
      console.error('Error claiming reward:', err);
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-6">
      {/* Header *
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4">
              🌍 EcoChain Governance
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Transparent environmental accountability through blockchain technology
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Last Updated</div>
            <div className="text-cyan-400 font-medium">{formatTime(lastUpdated)}</div>
            <div className="text-xs text-gray-500">{lastUpdated.toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Navigation *
      <div className="max-w-7xl mx-auto flex items-center space-x-4 mb-8">
        <button
          onClick={() => setCurrentView('feed')}
          className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium ${
            currentView === 'feed'
              ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
              : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
          }`}
        >
          📡 Social Feed
        </button>
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium ${
            currentView === 'dashboard'
              ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
              : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
          }`}
        >
          📊 Dashboard
        </button>
      </div>

      {currentView === 'dashboard' ? (
        <CommitmentDashboard
          commitments={commitments}
          onUpdateProgress={handleUpdateProgress}
          onClaimReward={handleClaimReward}
        />
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Environmental Data Cards *
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {environmentalData && (
              <>
                <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-red-500/20 p-6">
                  <div className="text-red-400 text-sm font-medium mb-2">Air Quality (PM2.5)</div>
                  <div className="text-3xl font-bold text-white mb-1">{environmentalData.pm25?.toFixed(1) || '25.0'} μg/m³</div>
                  <div className="text-xs text-gray-400">{environmentalData.location || 'Global'}</div>
                </div>
                <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-orange-500/20 p-6">
                  <div className="text-orange-400 text-sm font-medium mb-2">CO2 Levels</div>
                  <div className="text-3xl font-bold text-white mb-1">{environmentalData.co2?.toFixed(1) || '420.0'} ppm</div>
                  <div className="text-xs text-gray-400">Atmospheric Reading</div>
                </div>
                <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-green-500/20 p-6">
                  <div className="text-green-400 text-sm font-medium mb-2">Forest Cover</div>
                  <div className="text-3xl font-bold text-white mb-1">{environmentalData.forest_cover?.toFixed(1) || '75.0'}%</div>
                  <div className="text-xs text-gray-400">Regional Coverage</div>
                </div>
                <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6">
                  <div className="text-blue-400 text-sm font-medium mb-2">Water Quality</div>
                  <div className="text-3xl font-bold text-white mb-1">{environmentalData.water_quality?.toFixed(1) || '80.0'}%</div>
                  <div className="text-xs text-gray-400">Quality Index</div>
                </div>
              </>
            )}
          </div>

          {/* Satellite Data *
          {satelliteData && (
            <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6 mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  🛰️
                </div>
                <div>
                  <h3 className="text-white font-semibold">Satellite Monitoring</h3>
                  <p className="text-gray-400 text-sm">Real-time environmental verification</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-gray-400 text-sm">Location</div>
                  <div className="text-white font-medium">{satelliteData.location}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Forest Coverage</div>
                  <div className="text-white font-medium">{satelliteData.forest_cover_percentage?.toFixed(1) || '75.0'}%</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Change Detected</div>
                  <div className={`font-medium ${satelliteData.change_detected ? 'text-yellow-400' : 'text-green-400'}`}>
                    {satelliteData.change_detected ? '⚠️ Yes' : '✅ No'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Confidence Score</div>
                  <div className="text-white font-medium">{satelliteData.confidence_score?.toFixed(1) || '95.0'}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Commitment Creation Form *
          <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center mr-3">
                ➕
              </span>
              Create New Commitment
            </h2>
            <form onSubmit={handleCreateCommitment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newCommitment.title}
                  onChange={(e) => setNewCommitment({...newCommitment, title: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                  placeholder="Commitment title"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
                <select 
                  value={newCommitment.category}
                  onChange={(e) => setNewCommitment({...newCommitment, category: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400"
                >
                  <option value="forest_protection">🌳 Forest Protection</option>
                  <option value="air_quality">🏭 Air Quality</option>
                  <option value="water_management">💧 Water Management</option>
                  <option value="biodiversity">🦋 Biodiversity</option>
                  <option value="waste_reduction">♻️ Waste Reduction</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newCommitment.description}
                  onChange={(e) => setNewCommitment({...newCommitment, description: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                  placeholder="Describe your environmental commitment"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Target Value (%)</label>
                <input
                  type="number"
                  value={newCommitment.target_value}
                  onChange={(e) => setNewCommitment({...newCommitment, target_value: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                  placeholder="Target percentage"
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Deadline</label>
                <input
                  type="date"
                  value={newCommitment.deadline}
                  onChange={(e) => setNewCommitment({...newCommitment, deadline: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Official Name</label>
                <input
                  type="text"
                  value={newCommitment.official_name}
                  onChange={(e) => setNewCommitment({...newCommitment, official_name: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Official Role</label>
                <input
                  type="text"
                  value={newCommitment.official_role}
                  onChange={(e) => setNewCommitment({...newCommitment, official_role: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                  placeholder="Your role/position"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Stake Amount (ETH)</label>
                <input
                  type="number"
                  value={newCommitment.stake_amount}
                  onChange={(e) => setNewCommitment({...newCommitment, stake_amount: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400"
                  placeholder="Stake amount"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Create Commitment
                </button>
              </div>
            </form>
          </div>

          {/* Commitments Feed *
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg flex items-center justify-center mr-3">
                📋
              </span>
              Recent Commitments
            </h2>
            {commitments.map((commitment) => (
              <div key={commitment.id} className="bg-black/20 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4">
                      {getCategoryIcon(commitment.category)}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{commitment.official_name}</h3>
                      <p className="text-gray-400 text-sm">{commitment.official_role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      commitment.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      commitment.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                      commitment.status === 'rewarded' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {commitment.status.toUpperCase()}
                    </div>
                    {commitment.reward_claimed && (
                      <div className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400">
                        💰 {commitment.reward_amount?.toFixed(2)} ETH
                      </div>
                    )}
                  </div>
                </div>
                <h4 className="text-white font-semibold text-lg mb-2">{commitment.title}</h4>
                <p className="text-gray-300 mb-4">{commitment.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-gray-400 text-sm">Progress</div>
                    <div className="text-white font-medium">{commitment.current_progress}% / {commitment.target_value}%</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Deadline</div>
                    <div className="text-white font-medium">{formatDate(commitment.deadline)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Stake</div>
                    <div className="text-white font-medium">{commitment.stake_amount} ETH</div>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-1000" 
                    style={{width: `${calculateProgress(commitment.current_progress, commitment.target_value)}%`}}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-400">
                    Created: {formatDate(commitment.created_at)} • 
                    {commitment.satellite_verified ? ' 🛰️ Satellite Verified' : ' 📊 Self-reported'}
                    {commitment.completion_date && ` • Completed: ${formatDate(commitment.completion_date)}`}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {commitments.length === 0 && (
            <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-gray-500/20 p-12 text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-white text-xl mb-2">No commitments yet</h3>
              <p className="text-gray-400">Be the first to create an environmental commitment!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
  */ __turbopack_context__.s({
    "default": (()=>Home)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
// Real API client (replace with your actual API endpoints)
const apiClient = {
    baseUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    async request (endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
    },
    // Real API methods
    async getAllCommitments () {
        return this.request('/api/commitments');
    },
    async getEnvironmentalData () {
        return this.request('/api/environmental-data');
    },
    async getSatelliteData (commitmentId) {
        return this.request(`/api/satellite-data?commitmentId=${commitmentId}`);
    },
    async createCommitment (data) {
        return this.request('/api/commitments', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    async updateCommitmentProgress (commitmentId, newProgress) {
        return this.request(`/api/commitments/${commitmentId}/progress`, {
            method: 'PUT',
            body: JSON.stringify({
                new_progress: newProgress
            })
        });
    },
    async claimReward (commitmentId) {
        return this.request(`/api/commitments/${commitmentId}/claim-reward`, {
            method: 'POST'
        });
    },
    // Real environmental data sources
    async getAirQualityData (location) {
        // Use our backend API instead of external API
        try {
            const data = await this.request('/api/environmental-data');
            return {
                pm25: data.pm25 || 25,
                co2: data.co2 || 420
            };
        } catch (error) {
            console.warn('Using fallback air quality data:', error);
            return {
                pm25: 25,
                co2: 420
            };
        }
    },
    async getForestCoverData (coordinates) {
        // Use our backend API
        try {
            const response = await fetch(`${this.baseUrl}/api/forest-cover?lat=${coordinates.lat}&lon=${coordinates.lon}`);
            const data = await response.json();
            return {
                forest_cover: data.forest_cover_percentage
            };
        } catch (error) {
            console.warn('Using fallback forest cover data:', error);
            return {
                forest_cover: 75
            }; // Fallback value
        }
    },
    async getWaterQualityData (region) {
        // Use our backend API
        try {
            const response = await fetch(`${this.baseUrl}/api/water-quality?region=${region}`);
            const data = await response.json();
            return {
                water_quality: data.quality_index
            };
        } catch (error) {
            console.warn('Using fallback water quality data:', error);
            return {
                water_quality: 80
            }; // Fallback value
        }
    }
};
// Blockchain integration for rewards
const blockchainClient = {
    async connectWallet () {
        if ("object" !== 'undefined' && window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                return accounts[0];
            } catch (error) {
                console.warn('Failed to connect wallet:', error);
                return null;
            }
        } else {
            console.warn('MetaMask not detected. Please install MetaMask to connect your wallet.');
            return null;
        }
    },
    async claimReward (commitmentId, amount) {
        // Real CivicXChain Smart Contract interaction for token rewards
        if ("object" !== 'undefined' && window.ethereum) {
            try {
                // CivicXChain Smart Contract Address (deploy this contract)
                const CONTRACT_ADDRESS = '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A'; // Example
                // Encode function call for claiming environmental token reward
                const functionSignature = '0x8f4ffcb1'; // claimEnvironmentalReward function selector
                const encodedCommitmentId = commitmentId.toString().padStart(64, '0');
                const encodedData = functionSignature + encodedCommitmentId;
                const transactionHash = await window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [
                        {
                            to: CONTRACT_ADDRESS,
                            data: encodedData,
                            value: '0x0',
                            gas: '0x5208'
                        }
                    ]
                });
                console.log('🪙 Environmental Token Reward Transaction:', transactionHash);
                return transactionHash;
            } catch (error) {
                console.error('Blockchain transaction failed:', error);
                throw new Error('Failed to claim token reward on Ethereum blockchain');
            }
        }
        throw new Error('MetaMask required - Please install MetaMask to claim token rewards');
    },
    // Get user's CIVIC token balance
    async getTokenBalance (userAddress) {
        if ("object" !== 'undefined' && window.ethereum) {
            try {
                const CONTRACT_ADDRESS = '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A';
                // ERC-20 balanceOf function call
                const balanceCall = await window.ethereum.request({
                    method: 'eth_call',
                    params: [
                        {
                            to: CONTRACT_ADDRESS,
                            data: '0x70a08231' + userAddress.slice(2).padStart(64, '0')
                        },
                        'latest'
                    ]
                });
                // Parse balance (assuming 18 decimals)
                const balance = parseInt(balanceCall, 16) / Math.pow(10, 18);
                return balance;
            } catch (error) {
                console.error('Failed to get token balance:', error);
                return 0;
            }
        }
        return 0;
    },
    // Add CIVIC token to MetaMask wallet
    async addTokenToWallet () {
        if ("object" !== 'undefined' && window.ethereum) {
            try {
                const CONTRACT_ADDRESS = '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A';
                const wasAdded = await window.ethereum.request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20',
                        options: {
                            address: CONTRACT_ADDRESS,
                            symbol: 'CIVIC',
                            decimals: 18,
                            image: 'https://api.civicxchain.org/token-logo.png'
                        }
                    }
                });
                return wasAdded;
            } catch (error) {
                console.error('Failed to add token to wallet:', error);
                return false;
            }
        }
        return false;
    },
    // Check fulfillment via Chainlink Oracle
    async checkFulfillmentStatus (commitmentId) {
        if ("object" !== 'undefined' && window.ethereum) {
            try {
                const ORACLE_CONTRACT = '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e'; // Chainlink Oracle
                // Call Chainlink oracle for real environmental data verification
                const oracleCall = await window.ethereum.request({
                    method: 'eth_call',
                    params: [
                        {
                            to: ORACLE_CONTRACT,
                            data: '0x50d25bcd' + commitmentId.toString().padStart(64, '0')
                        },
                        'latest'
                    ]
                });
                // Parse oracle response (real PM2.5, forest cover, etc.)
                const fulfilled = parseInt(oracleCall.slice(2, 66), 16) > 0;
                const currentValue = parseInt(oracleCall.slice(66, 130), 16) / 100;
                const targetValue = parseInt(oracleCall.slice(130, 194), 16) / 100;
                return {
                    fulfilled,
                    currentValue,
                    targetValue,
                    oracleData: {
                        timestamp: Date.now(),
                        source: 'Chainlink Environmental Oracle',
                        verified: true
                    }
                };
            } catch (error) {
                console.error('Oracle verification failed:', error);
                throw new Error('Failed to verify fulfillment via Chainlink Oracle');
            }
        }
        throw new Error('Blockchain connection required for oracle verification');
    }
};
// Real CommitmentDashboard component
const CommitmentDashboard = ({ commitments, onUpdateProgress, onClaimReward, onCheckFulfillment })=>{
    _s();
    const [selectedCommitment, setSelectedCommitment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [progressInput, setProgressInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "text-white space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent",
                children: "📊 Commitment Dashboard"
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 3502,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6",
                children: commitments.map((commitment)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-black/20 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6 hover:border-cyan-500/40 transition-all duration-300",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-start mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-semibold text-white mb-2",
                                                children: commitment.title
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 3511,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-400 mb-2",
                                                children: commitment.description
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 3512,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-gray-500",
                                                children: [
                                                    "By ",
                                                    commitment.official_name,
                                                    " (",
                                                    commitment.official_role,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 3513,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 3510,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-right",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `px-3 py-1 rounded-full text-sm font-semibold mb-2 ${commitment.status === 'active' ? 'bg-green-500/20 text-green-400' : commitment.status === 'completed' ? 'bg-blue-500/20 text-blue-400' : commitment.status === 'rewarded' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`,
                                                children: commitment.status.toUpperCase()
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 3518,
                                                columnNumber: 17
                                            }, this),
                                            commitment.satellite_verified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-purple-400",
                                                children: "🛰️ Satellite Verified"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 3527,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 3517,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 3509,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between text-sm mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gray-400",
                                                children: "Progress"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 3535,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white",
                                                children: [
                                                    commitment.current_progress,
                                                    "% / ",
                                                    commitment.target_value,
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 3536,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 3534,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full bg-gray-800 rounded-full h-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-1000",
                                            style: {
                                                width: `${Math.min(commitment.current_progress / commitment.target_value * 100, 100)}%`
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 3539,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 3538,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 3533,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-4 items-center flex-wrap",
                                children: [
                                    commitment.status === 'active' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2 items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                min: commitment.current_progress,
                                                max: 100,
                                                value: selectedCommitment === commitment.id ? progressInput : commitment.current_progress,
                                                onChange: (e)=>{
                                                    setSelectedCommitment(commitment.id);
                                                    setProgressInput(Number(e.target.value));
                                                },
                                                className: "w-20 bg-black/50 border border-cyan-500/30 rounded px-2 py-1 text-white text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 3550,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    onUpdateProgress(commitment.id, progressInput);
                                                    setSelectedCommitment(null);
                                                },
                                                className: "bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-3 py-1 rounded text-sm transition-all duration-200",
                                                children: "Update Progress"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 3561,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 3549,
                                        columnNumber: 17
                                    }, this),
                                    commitment.status === 'active' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onCheckFulfillment(commitment.id),
                                        className: "bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 px-4 py-2 rounded font-medium transition-all duration-200 hover:scale-105",
                                        children: "🔍 Check Fulfillment via Oracle"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 3575,
                                        columnNumber: 17
                                    }, this),
                                    commitment.current_progress >= commitment.target_value && commitment.status !== 'rewarded' && !commitment.reward_claimed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onClaimReward(commitment.id),
                                        className: "bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-400 px-4 py-2 rounded font-medium transition-all duration-200 hover:scale-105",
                                        children: "🪙 Claim Token Reward"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 3587,
                                        columnNumber: 17
                                    }, this),
                                    commitment.reward_claimed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 text-yellow-400",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl",
                                                children: "💰"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 3597,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: [
                                                    "Reward: ",
                                                    commitment.reward_amount?.toFixed(4),
                                                    " ETH"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 3598,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 3596,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 3547,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-400",
                                                children: "Deadline"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 3608,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-white",
                                                children: new Date(commitment.deadline).toLocaleDateString()
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 3609,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 3607,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-400",
                                                children: "Stake"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 3612,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-white",
                                                children: [
                                                    commitment.stake_amount,
                                                    " ETH"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 3613,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 3611,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-400",
                                                children: "Category"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 3616,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-white",
                                                children: commitment.category.replace('_', ' ')
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 3617,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 3615,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-400",
                                                children: "Created"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 3620,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-white",
                                                children: new Date(commitment.created_at).toLocaleDateString()
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 3621,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 3619,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 3606,
                                columnNumber: 13
                            }, this)
                        ]
                    }, commitment.id, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 3508,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 3506,
                columnNumber: 7
            }, this),
            commitments.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-black/20 backdrop-blur-xl rounded-xl border border-gray-500/20 p-12 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-6xl mb-4",
                        children: "📊"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 3630,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-white text-xl mb-2",
                        children: "No commitments to manage"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 3631,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400",
                        children: "Create your first environmental commitment to get started!"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 3632,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 3629,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 3501,
        columnNumber: 5
    }, this);
};
_s(CommitmentDashboard, "ljNlm5nZReyh/evSluhgQBDacPE=");
_c = CommitmentDashboard;
function Home() {
    _s1();
    const [commitments, setCommitments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [environmentalData, setEnvironmentalData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [satelliteData, setSatelliteData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentView, setCurrentView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('feed');
    const [lastUpdated, setLastUpdated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Date());
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [walletAddress, setWalletAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            fetchAllData();
            connectWallet();
            // Set up interval for real-time updates every 30 seconds
            const interval = setInterval({
                "Home.useEffect.interval": ()=>{
                    fetchAllData();
                }
            }["Home.useEffect.interval"], 30000);
            return ({
                "Home.useEffect": ()=>clearInterval(interval)
            })["Home.useEffect"];
        }
    }["Home.useEffect"], []);
    const connectWallet = async ()=>{
        const address = await blockchainClient.connectWallet();
        setWalletAddress(address);
    };
    const fetchAllData = async ()=>{
        try {
            setLoading(true);
            setError(null);
            // Fetch commitments
            try {
                const commitmentsData = await apiClient.getAllCommitments();
                setCommitments(commitmentsData.commitments || []);
            } catch (err) {
                console.error('Error fetching commitments:', err);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Failed to load commitments');
            }
            // Fetch environmental data from our backend
            try {
                const envData = await apiClient.request('/api/environmental-data');
                setEnvironmentalData({
                    location: envData.location || "Global",
                    pm25: envData.pm25 || 25,
                    co2: envData.co2 || 420,
                    forest_cover: envData.forest_cover || 75,
                    water_quality: envData.water_quality || 80,
                    timestamp: envData.timestamp || new Date().toISOString(),
                    source: "Backend API"
                });
            } catch (err) {
                console.error('Error fetching environmental data:', err);
                // Set fallback data to prevent undefined errors
                setEnvironmentalData({
                    location: "Global",
                    pm25: 25,
                    co2: 420,
                    forest_cover: 75,
                    water_quality: 80,
                    timestamp: new Date().toISOString(),
                    source: "Fallback Data"
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Failed to load environmental data, using fallback values');
            }
            // Fetch real satellite data
            try {
                const satData = await apiClient.getSatelliteData('general');
                setSatelliteData(satData);
            } catch (err) {
                console.error('Error fetching satellite data:', err);
                // Set fallback satellite data
                setSatelliteData({
                    location: 'Global Environmental Monitoring',
                    forest_cover_percentage: 75.0,
                    change_detected: false,
                    confidence_score: 95.0,
                    last_updated: new Date().toISOString()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Failed to load satellite data, using fallback values');
            }
            setLastUpdated(new Date());
        } catch (err) {
            setError('Failed to fetch data. Please check your connection.');
            console.error('Error fetching data:', err);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Failed to load data');
        } finally{
            setLoading(false);
        }
    };
    const handleCreateCommitment = async (e)=>{
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Determine metric type based on category
            const getMetricType = (category)=>{
                switch(category){
                    case 'air_quality':
                        return 'μg/m³'; // PM2.5 measurement
                    case 'forest_protection':
                        return 'percentage'; // Forest cover percentage
                    case 'water_management':
                        return 'quality_index'; // Water quality index
                    case 'biodiversity':
                        return 'species_count'; // Number of species
                    case 'waste_reduction':
                        return 'tons'; // Waste reduction in tons
                    default:
                        return 'units';
                }
            };
            const commitmentData = {
                title: newCommitment.title,
                description: newCommitment.description,
                category: newCommitment.category,
                target_value: parseFloat(newCommitment.target_value),
                deadline: newCommitment.deadline,
                creator: `${newCommitment.official_name} (${newCommitment.official_role})`,
                metric_type: getMetricType(newCommitment.category) // Proper metric type based on category
            };
            const newCommitmentResponse = await apiClient.createCommitment(commitmentData);
            // Add to local state immediately for better UX
            setCommitments((prev)=>[
                    newCommitmentResponse,
                    ...prev
                ]);
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Commitment created successfully! 🎉');
            // Refresh data to ensure consistency
            await fetchAllData();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Please try again.';
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Failed to create commitment: ${errorMessage}`);
            console.error('Error creating commitment:', err);
        } finally{
            setIsSubmitting(false);
        }
    };
    const handleUpdateProgress = async (commitmentId, newProgress)=>{
        try {
            await apiClient.updateCommitmentProgress(commitmentId, newProgress);
            // Update local state
            setCommitments((prev)=>prev.map((c)=>c.id === commitmentId ? {
                        ...c,
                        current_progress: newProgress,
                        status: newProgress >= c.target_value ? 'completed' : 'active'
                    } : c));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Progress updated successfully! 📈');
            // Refresh data to ensure consistency
            await fetchAllData();
        } catch (err) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Failed to update progress. Please try again.');
            console.error('Error updating progress:', err);
        }
    };
    const handleClaimReward = async (commitmentId)=>{
        try {
            if (!walletAddress) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Please connect your wallet first');
                await connectWallet();
                return;
            }
            // Step 1: Verify fulfillment via Chainlink Oracle
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('🔍 Verifying environmental achievement via Chainlink Oracle...');
            const fulfillmentStatus = await blockchainClient.checkFulfillmentStatus(commitmentId);
            if (!fulfillmentStatus.fulfilled) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`❌ Environmental target not yet achieved!\nCurrent: ${fulfillmentStatus.currentValue}\nTarget: ${fulfillmentStatus.targetValue}\nOracle: ${fulfillmentStatus.oracleData.source}`);
                return;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('✅ Environmental achievement verified by Chainlink Oracle!');
            // Step 2: Process reward claim
            const result = await apiClient.claimReward(commitmentId);
            // Step 3: Calculate token reward
            const commitment = commitments.find((c)=>c.id === commitmentId);
            const stakeAmount = commitment?.stake_amount || 0.1; // Default 0.1 ETH
            const tokenReward = calculateTokenReward(stakeAmount, commitment?.category || 'environmental');
            // Step 4: Claim token reward on Ethereum blockchain
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('🪙 Claiming CIVIC token reward on Ethereum...');
            const transactionHash = await blockchainClient.claimReward(commitmentId, result.reward_amount);
            // Step 5: Update commitment status
            setCommitments((prev)=>prev.map((c)=>c.id === commitmentId ? {
                        ...c,
                        status: 'rewarded',
                        reward_claimed: true,
                        reward_amount: result.reward_amount,
                        completion_date: new Date().toISOString(),
                        transaction_hash: transactionHash,
                        token_reward: tokenReward,
                        oracle_verified: true,
                        oracle_data: fulfillmentStatus.oracleData
                    } : c));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`🎉 Environmental Achievement Tokens Claimed!\n💰 ETH Reward: ${result.reward_amount.toFixed(4)} ETH\n🪙 CIVIC Tokens: ${tokenReward.toFixed(0)} CIVIC\n🔗 TX: ${transactionHash.slice(0, 10)}...`);
            // Refresh data
            await fetchAllData();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Please try again.';
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Failed to claim reward: ${errorMessage}`);
            console.error('Error claiming reward:', err);
        }
    };
    // Check fulfillment status via Chainlink Oracle
    const handleCheckFulfillment = async (commitmentId)=>{
        try {
            if (!walletAddress) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Please connect your wallet first');
                return;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('🔍 Checking environmental progress via Chainlink Oracle...');
            const status = await blockchainClient.checkFulfillmentStatus(commitmentId);
            if (status.fulfilled) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`✅ Environmental target achieved!\nCurrent: ${status.currentValue}\nTarget: ${status.targetValue}\nVerified by: ${status.oracleData.source}\n🎉 Ready to claim NFT reward!`);
            } else {
                const progress = (status.currentValue / status.targetValue * 100).toFixed(1);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].warning(`⏳ Environmental progress: ${progress}%\nCurrent: ${status.currentValue}\nTarget: ${status.targetValue}\nVerified by: ${status.oracleData.source}`);
            }
            // Update commitment with oracle data
            setCommitments((prev)=>prev.map((c)=>c.id === commitmentId ? {
                        ...c,
                        actual_value: status.currentValue,
                        oracle_verified: true,
                        oracle_data: status.oracleData,
                        last_oracle_check: new Date().toISOString()
                    } : c));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Oracle verification failed';
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Failed to check fulfillment: ${errorMessage}`);
            console.error('Error checking fulfillment:', err);
        }
    };
    // Add CIVIC token to MetaMask wallet
    const addTokenToWallet = async ()=>{
        try {
            if (!walletAddress) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Please connect your wallet first');
                return;
            }
            // Add CIVIC token to MetaMask using the blockchain client
            const wasAdded = await blockchainClient.addTokenToWallet();
            if (wasAdded) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('🎉 CIVIC token added to MetaMask! Check your wallet\'s token list.');
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].warning('Token addition was cancelled');
            }
        } catch (error) {
            console.error('Error adding token to wallet:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Failed to add token to wallet. Make sure you have MetaMask installed.');
        }
    };
    // Calculate token reward based on stake and category
    const calculateTokenReward = (stakeAmount, category)=>{
        const TOKENS_PER_ETH = 1000; // 1 ETH = 1000 CIVIC tokens
        const baseTokens = stakeAmount * TOKENS_PER_ETH;
        // Difficulty multipliers for different environmental metrics
        let multiplier = 1.0; // Base multiplier
        switch(category){
            case 'air_quality':
                multiplier = 1.5; // 1.5x for air quality (harder to achieve)
                break;
            case 'forest_protection':
                multiplier = 1.3; // 1.3x for forest protection
                break;
            case 'water_management':
                multiplier = 1.1; // 1.1x for water quality
                break;
            case 'biodiversity':
                multiplier = 1.4; // 1.4x for biodiversity
                break;
            case 'waste_reduction':
                multiplier = 1.2; // 1.2x for waste reduction
                break;
            default:
                multiplier = 1.0;
        }
        return Math.floor(baseTokens * multiplier);
    };
    // Helper functions
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
    const formatTime = (date)=>{
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
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
                        lineNumber: 4014,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-white text-xl",
                        children: "Loading CivicXChain Platform..."
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 4015,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400 text-sm mt-2",
                        children: "Connecting to blockchain, smart contracts, and environmental monitoring APIs..."
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 4016,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 4013,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 4012,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-6xl mb-4",
                        children: "⚠️"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 4026,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-white text-2xl mb-4",
                        children: "Connection Error"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 4027,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400 mb-6",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 4028,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: fetchAllData,
                        className: "bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-colors",
                        children: "Retry Connection"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 4029,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 4025,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 4024,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto mb-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-start",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4",
                                    children: "🏛️ CivicXChain: Official Environmental Accountability"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 4046,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xl text-gray-300 mb-6",
                                    children: "Binding public officials to environmental commitments through blockchain smart contracts, Chainlink oracles, and satellite monitoring. Rewards for achievement, penalties for failure."
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 4049,
                                    columnNumber: 13
                                }, this),
                                walletAddress && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-cyan-400",
                                    children: [
                                        "🔗 Wallet: ",
                                        walletAddress.slice(0, 6),
                                        "...",
                                        walletAddress.slice(-4)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 4054,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 4045,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-right",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-400",
                                    children: "Last Updated"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 4060,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-cyan-400 font-medium",
                                    children: formatTime(lastUpdated)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 4061,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-gray-500",
                                    children: lastUpdated.toLocaleDateString()
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 4062,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: fetchAllData,
                                    className: "mt-2 text-xs bg-cyan-500/20 hover:bg-cyan-500/30 px-3 py-1 rounded border border-cyan-500/50 transition-colors",
                                    children: "🔄 Refresh"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 4063,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 4059,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 4044,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 4043,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto flex items-center space-x-4 mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setCurrentView('feed'),
                        className: `px-6 py-3 rounded-lg transition-all duration-300 font-medium ${currentView === 'feed' ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/20' : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'}`,
                        children: "📡 Social Feed"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 4075,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setCurrentView('dashboard'),
                        className: `px-6 py-3 rounded-lg transition-all duration-300 font-medium ${currentView === 'dashboard' ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/20' : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'}`,
                        children: "📊 Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 4085,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 4074,
                columnNumber: 7
            }, this),
            currentView === 'dashboard' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CommitmentDashboard, {
                        commitments: commitments,
                        onUpdateProgress: handleUpdateProgress,
                        onClaimReward: handleClaimReward,
                        onCheckFulfillment: handleCheckFulfillment
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 4099,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent",
                                children: "🪙 Environmental Achievement Token Rewards"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4108,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                                children: [
                                    commitments.filter((c)=>c.reward_claimed && c.token_reward).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl rounded-xl border border-yellow-500/20 p-6 hover:border-yellow-500/40 transition-all duration-300",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl",
                                                    children: "🪙"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 4116,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-semibold text-white mb-2",
                                                    children: "Demo Environmental Achievement Tokens"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 4119,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-yellow-400 font-mono text-sm mb-2",
                                                    children: "1,500 CIVIC"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 4120,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-300 text-sm mb-3",
                                                    children: "Complete a commitment to earn your first tokens!"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 4121,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2 text-xs",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-gray-400",
                                                                    children: "ETH Reward:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 4124,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-yellow-400",
                                                                    children: "0.1500 ETH"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 4125,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 4123,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-gray-400",
                                                                    children: "Token Reward:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 4128,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-yellow-400",
                                                                    children: "1,500 CIVIC"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 4129,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 4127,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-gray-400",
                                                                    children: "Status:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 4132,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-orange-400",
                                                                    children: "Demo Only"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 4133,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 4131,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-center mt-2",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs",
                                                                children: "🎯 Complete Commitment to Earn"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4136,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 4135,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 4122,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 4115,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4114,
                                        columnNumber: 17
                                    }, this),
                                    commitments.filter((c)=>c.reward_claimed && c.token_reward).map((commitment)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl rounded-xl border border-yellow-500/20 p-6 hover:border-yellow-500/40 transition-all duration-300",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl",
                                                        children: "🪙"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4150,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-lg font-semibold text-white mb-2",
                                                        children: "Environmental Achievement Tokens"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4153,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-yellow-400 font-mono text-sm mb-2",
                                                        children: [
                                                            commitment.token_reward?.toLocaleString() || '0',
                                                            " CIVIC"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4154,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-300 text-sm mb-3",
                                                        children: commitment.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4155,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2 text-xs",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-400",
                                                                        children: "ETH Reward:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/page.tsx",
                                                                        lineNumber: 4158,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-yellow-400",
                                                                        children: [
                                                                            commitment.reward_amount?.toFixed(4),
                                                                            " ETH"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/page.tsx",
                                                                        lineNumber: 4159,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4157,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-400",
                                                                        children: "Token Reward:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/page.tsx",
                                                                        lineNumber: 4162,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-yellow-400",
                                                                        children: [
                                                                            commitment.token_reward?.toLocaleString() || '0',
                                                                            " CIVIC"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/page.tsx",
                                                                        lineNumber: 4163,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4161,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-400",
                                                                        children: "Completed:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/page.tsx",
                                                                        lineNumber: 4166,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-green-400",
                                                                        children: new Date(commitment.completion_date || '').toLocaleDateString()
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/page.tsx",
                                                                        lineNumber: 4167,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4165,
                                                                columnNumber: 25
                                                            }, this),
                                                            commitment.transaction_hash && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-400",
                                                                        children: "TX:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/page.tsx",
                                                                        lineNumber: 4171,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-blue-400 font-mono",
                                                                        children: [
                                                                            commitment.transaction_hash.slice(0, 10),
                                                                            "..."
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/page.tsx",
                                                                        lineNumber: 4172,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4170,
                                                                columnNumber: 27
                                                            }, this),
                                                            commitment.oracle_verified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-center mt-2",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs",
                                                                    children: "✅ Oracle Verified"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 4177,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4176,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-3 pt-2 border-t border-gray-700",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>addTokenToWallet(),
                                                                    className: "w-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-400 px-3 py-2 rounded text-xs font-medium transition-all duration-200 hover:scale-105",
                                                                    children: "📱 Add CIVIC Token to Wallet"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 4185,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4184,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4156,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4149,
                                                columnNumber: 21
                                            }, this)
                                        }, commitment.id, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 4148,
                                            columnNumber: 19
                                        }, this)),
                                    commitments.filter((c)=>c.reward_claimed && c.token_reward).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "col-span-full text-center py-12",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-6xl mb-4",
                                                children: "🎯"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4199,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-white text-xl mb-2",
                                                children: "No Token Rewards Yet"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4200,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-400",
                                                children: "Complete environmental commitments to earn CIVIC token rewards!"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4201,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4198,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4111,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 4107,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent",
                                children: "📱 How to View Your CIVIC Tokens in Wallet"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4209,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gradient-to-br from-orange-500/10 to-yellow-500/10 backdrop-blur-xl rounded-xl border border-orange-500/20 p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl",
                                                        children: "🦊"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4217,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-lg font-semibold text-white",
                                                        children: "MetaMask"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4220,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4216,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3 text-sm text-gray-300",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start space-x-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-orange-400 font-bold",
                                                                children: "1."
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4224,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Open MetaMask extension"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4225,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4223,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start space-x-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-orange-400 font-bold",
                                                                children: "2."
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4228,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: 'Click "Assets" tab'
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4229,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4227,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start space-x-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-orange-400 font-bold",
                                                                children: "3."
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4232,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: 'Click "Import tokens"'
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4233,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4231,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start space-x-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-orange-400 font-bold",
                                                                children: "4."
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4236,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Enter CIVIC token contract address"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4237,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4235,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-4 p-3 bg-black/30 rounded border border-orange-500/30",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-orange-300 font-mono",
                                                            children: [
                                                                "Contract: 0x742d35...Da5A",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 4241,
                                                                    columnNumber: 48
                                                                }, this),
                                                                "Network: Ethereum Mainnet"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 4240,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4239,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4222,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4215,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl",
                                                        children: "🌊"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4251,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-lg font-semibold text-white",
                                                        children: "OpenSea"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4254,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4250,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3 text-sm text-gray-300",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start space-x-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-blue-400 font-bold",
                                                                children: "1."
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4258,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Go to opensea.io"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4259,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4257,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start space-x-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-blue-400 font-bold",
                                                                children: "2."
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4262,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Connect your wallet"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4263,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4261,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start space-x-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-blue-400 font-bold",
                                                                children: "3."
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4266,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: 'Click "Profile" → "Collected"'
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4267,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4265,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start space-x-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-blue-400 font-bold",
                                                                children: "4."
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4270,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "View your CIVIC token balance"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4271,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4269,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: "https://opensea.io",
                                                            target: "_blank",
                                                            rel: "noopener noreferrer",
                                                            className: "inline-block bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 px-3 py-2 rounded text-xs font-medium transition-all duration-200",
                                                            children: "🔗 Visit OpenSea"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 4274,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4273,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4256,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4249,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl",
                                                        children: "📋"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4289,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-lg font-semibold text-white",
                                                        children: "Token Info"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4292,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4288,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3 text-sm text-gray-300",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-purple-400 font-semibold",
                                                                children: "Token Name:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4296,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs mt-1",
                                                                children: "CivicXChain Environmental Token"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4297,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4295,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-purple-400 font-semibold",
                                                                children: "Symbol:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4300,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs mt-1",
                                                                children: "CIVIC"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4301,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4299,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-purple-400 font-semibold",
                                                                children: "Network:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4304,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs mt-1",
                                                                children: "Ethereum Mainnet"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4305,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4303,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-purple-400 font-semibold",
                                                                children: "Standard:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4308,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs mt-1",
                                                                children: "ERC-20 (Token)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4309,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4307,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-purple-400 font-semibold",
                                                                children: "Decimals:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4312,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs mt-1",
                                                                children: "18"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 4313,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4311,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-4 p-3 bg-black/30 rounded border border-purple-500/30",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-purple-300 font-mono break-all",
                                                            children: "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 4316,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4315,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4294,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4287,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4212,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 4208,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 4098,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto",
                children: [
                    environmentalData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-black/20 backdrop-blur-xl rounded-xl border border-red-500/20 p-6 hover:border-red-500/40 transition-all duration-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-red-400 text-sm font-medium mb-2",
                                        children: "Air Quality (PM2.5)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4331,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-3xl font-bold text-white mb-1",
                                        children: [
                                            environmentalData.pm25?.toFixed(1) || '25.0',
                                            " μg/m³"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4332,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-400",
                                        children: environmentalData.location || 'Global'
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4333,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-500 mt-1",
                                        children: [
                                            "Source: ",
                                            environmentalData.source || 'Environmental API'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4334,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4330,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-black/20 backdrop-blur-xl rounded-xl border border-orange-500/20 p-6 hover:border-orange-500/40 transition-all duration-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-orange-400 text-sm font-medium mb-2",
                                        children: "CO2 Levels"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4337,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-3xl font-bold text-white mb-1",
                                        children: [
                                            environmentalData.co2?.toFixed(1) || '420.0',
                                            " ppm"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4338,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-400",
                                        children: "Atmospheric Reading"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4339,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-500 mt-1",
                                        children: "Real-time monitoring"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4340,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4336,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-black/20 backdrop-blur-xl rounded-xl border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-green-400 text-sm font-medium mb-2",
                                        children: "Forest Cover"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4343,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-3xl font-bold text-white mb-1",
                                        children: [
                                            environmentalData.forest_cover?.toFixed(1) || '75.0',
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4344,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-400",
                                        children: "Regional Coverage"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4345,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-500 mt-1",
                                        children: "Satellite verified"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4346,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4342,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-black/20 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-blue-400 text-sm font-medium mb-2",
                                        children: "Water Quality"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4349,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-3xl font-bold text-white mb-1",
                                        children: [
                                            environmentalData.water_quality?.toFixed(1) || '80.0',
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4350,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-400",
                                        children: "Quality Index"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4351,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-500 mt-1",
                                        children: "WHO standards"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4352,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4348,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 4329,
                        columnNumber: 13
                    }, this),
                    satelliteData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-black/20 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6 mb-8 hover:border-purple-500/40 transition-all duration-300",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3",
                                        children: "🛰️"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4361,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-white font-semibold",
                                                children: "Satellite Monitoring"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4365,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-400 text-sm",
                                                children: "Real-time environmental verification"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4366,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4364,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ml-auto text-xs text-gray-400",
                                        children: [
                                            "Updated: ",
                                            new Date(satelliteData.last_updated).toLocaleString()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4368,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4360,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-4 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-400 text-sm",
                                                children: "Location"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4374,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-white font-medium",
                                                children: satelliteData.location
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4375,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4373,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-400 text-sm",
                                                children: "Forest Coverage"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4378,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-white font-medium",
                                                children: [
                                                    satelliteData.forest_cover_percentage?.toFixed(1) || '75.0',
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4379,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4377,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-400 text-sm",
                                                children: "Change Detected"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4382,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `font-medium ${satelliteData.change_detected ? 'text-yellow-400' : 'text-green-400'}`,
                                                children: satelliteData.change_detected ? '⚠️ Changes detected' : '✅ Stable'
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4383,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4381,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-400 text-sm",
                                                children: "Confidence Score"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4388,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-white font-medium",
                                                children: [
                                                    satelliteData.confidence_score?.toFixed(1) || '95.0',
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4389,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4387,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4372,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 4359,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-black/20 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6 mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-white mb-4 flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center mr-3",
                                        children: "🏛️"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4398,
                                        columnNumber: 15
                                    }, this),
                                    "Bind Public Official to Environmental Commitment"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4397,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-300 mb-6 text-sm",
                                children: "Create blockchain-verified environmental commitments for public officials. Achievements are monitored via Chainlink oracles and satellite data. Officials receive NFT rewards for fulfillment or face penalties for non-compliance."
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4403,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                onSubmit: handleCreateCommitment,
                                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-gray-300 text-sm font-medium mb-2",
                                                children: "Public Official Name *"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4410,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: newCommitment.official_name,
                                                onChange: (e)=>setNewCommitment({
                                                        ...newCommitment,
                                                        official_name: e.target.value
                                                    }),
                                                className: "w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors",
                                                placeholder: "e.g., Mayor John Smith",
                                                required: true,
                                                disabled: isSubmitting
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4411,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4409,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-gray-300 text-sm font-medium mb-2",
                                                children: "Official Role/Position *"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4422,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: newCommitment.official_role,
                                                onChange: (e)=>setNewCommitment({
                                                        ...newCommitment,
                                                        official_role: e.target.value
                                                    }),
                                                className: "w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors",
                                                disabled: isSubmitting,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "mayor",
                                                        children: "🏛️ Mayor"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4429,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "governor",
                                                        children: "🏛️ Governor"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4430,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "environment_minister",
                                                        children: "🌍 Environment Minister"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4431,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "city_council",
                                                        children: "🏢 City Council Member"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4432,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "environmental_agency",
                                                        children: "🌱 Environmental Agency Head"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4433,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4423,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4421,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-gray-300 text-sm font-medium mb-2",
                                                children: "Environmental Commitment Title *"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4437,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: newCommitment.title,
                                                onChange: (e)=>setNewCommitment({
                                                        ...newCommitment,
                                                        title: e.target.value
                                                    }),
                                                className: "w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors",
                                                placeholder: "e.g., Reduce PM2.5 levels below 20 μg/m³",
                                                required: true,
                                                disabled: isSubmitting
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4438,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4436,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-gray-300 text-sm font-medium mb-2",
                                                children: "Environmental Category *"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4449,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: newCommitment.category,
                                                onChange: (e)=>setNewCommitment({
                                                        ...newCommitment,
                                                        category: e.target.value
                                                    }),
                                                className: "w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors",
                                                disabled: isSubmitting,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "air_quality",
                                                        children: "🏭 Air Quality (PM2.5, CO2, etc.)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4456,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "forest_protection",
                                                        children: "🌳 Forest Protection & Reforestation"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4457,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "water_management",
                                                        children: "💧 Water Quality & Management"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4458,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "biodiversity",
                                                        children: "🦋 Biodiversity Conservation"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4459,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "waste_reduction",
                                                        children: "♻️ Waste Reduction & Recycling"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4460,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4450,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4448,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "md:col-span-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-gray-300 text-sm font-medium mb-2",
                                                children: "Detailed Description *"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4464,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                value: newCommitment.description,
                                                onChange: (e)=>setNewCommitment({
                                                        ...newCommitment,
                                                        description: e.target.value
                                                    }),
                                                className: "w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors",
                                                placeholder: "Describe your environmental commitment, methodology, and expected impact...",
                                                rows: 4,
                                                required: true,
                                                disabled: isSubmitting
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4465,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4463,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-gray-300 text-sm font-medium mb-2",
                                                children: "Target Environmental Value *"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4476,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                value: newCommitment.target_value,
                                                onChange: (e)=>setNewCommitment({
                                                        ...newCommitment,
                                                        target_value: e.target.value
                                                    }),
                                                className: "w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors",
                                                placeholder: "e.g., 20 (for PM2.5 < 20 μg/m³)",
                                                min: "0",
                                                step: "0.1",
                                                required: true,
                                                disabled: isSubmitting
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4477,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-400 mt-1",
                                                children: "Examples: PM2.5 < 20 μg/m³, CO2 < 400 ppm, Forest cover > 75%"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4488,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4475,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-gray-300 text-sm font-medium mb-2",
                                                children: "Completion Deadline *"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4493,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                value: newCommitment.deadline,
                                                onChange: (e)=>setNewCommitment({
                                                        ...newCommitment,
                                                        deadline: e.target.value
                                                    }),
                                                className: "w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors",
                                                min: new Date().toISOString().split('T')[0],
                                                required: true,
                                                disabled: isSubmitting
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4494,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4492,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-gray-300 text-sm font-medium mb-2",
                                                children: "Official Name *"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4505,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: newCommitment.official_name,
                                                onChange: (e)=>setNewCommitment({
                                                        ...newCommitment,
                                                        official_name: e.target.value
                                                    }),
                                                className: "w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors",
                                                placeholder: "Your full name",
                                                required: true,
                                                disabled: isSubmitting
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4506,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4504,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-gray-300 text-sm font-medium mb-2",
                                                children: "Official Role/Position *"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4517,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: newCommitment.official_role,
                                                onChange: (e)=>setNewCommitment({
                                                        ...newCommitment,
                                                        official_role: e.target.value
                                                    }),
                                                className: "w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors",
                                                placeholder: "e.g., Environmental Minister, Mayor, etc.",
                                                required: true,
                                                disabled: isSubmitting
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4518,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4516,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-gray-300 text-sm font-medium mb-2",
                                                children: "Stake Amount (ETH) *"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4529,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                value: newCommitment.stake_amount,
                                                onChange: (e)=>setNewCommitment({
                                                        ...newCommitment,
                                                        stake_amount: e.target.value
                                                    }),
                                                className: "w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors",
                                                placeholder: "Amount to stake (e.g., 1.5)",
                                                min: "0.01",
                                                step: "0.01",
                                                required: true,
                                                disabled: isSubmitting
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4530,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4528,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "md:col-span-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            disabled: isSubmitting,
                                            className: "bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed",
                                            children: isSubmitting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 4550,
                                                        columnNumber: 23
                                                    }, this),
                                                    "Creating Commitment..."
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: "🚀 Create Smart Environmental Commitment"
                                            }, void 0, false)
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 4543,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4542,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4408,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 4396,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-white flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg flex items-center justify-center mr-3",
                                        children: "📋"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4564,
                                        columnNumber: 15
                                    }, this),
                                    "Environmental Commitments Feed",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-2 text-sm bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded",
                                        children: [
                                            commitments.length,
                                            " Active"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 4568,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4563,
                                columnNumber: 13
                            }, this),
                            commitments.map((commitment)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-black/20 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300 hover:transform hover:scale-[1.02]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4",
                                                            children: getCategoryIcon(commitment.category)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 4577,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-white font-semibold",
                                                                    children: commitment.official_name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 4581,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-gray-400 text-sm",
                                                                    children: commitment.official_role
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 4582,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 4580,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 4576,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-2 items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `px-3 py-1 rounded-full text-sm font-semibold ${commitment.status === 'active' ? 'bg-green-500/20 text-green-400' : commitment.status === 'completed' ? 'bg-blue-500/20 text-blue-400' : commitment.status === 'rewarded' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`,
                                                            children: commitment.status.toUpperCase()
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 4586,
                                                            columnNumber: 21
                                                        }, this),
                                                        commitment.satellite_verified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400",
                                                            children: "🛰️ Verified"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 4595,
                                                            columnNumber: 23
                                                        }, this),
                                                        commitment.reward_claimed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400",
                                                            children: [
                                                                "💰 ",
                                                                commitment.reward_amount?.toFixed(4),
                                                                " ETH"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 4600,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 4585,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 4575,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "text-white font-semibold text-lg mb-2",
                                            children: commitment.title
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 4607,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-300 mb-4",
                                            children: commitment.description
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 4608,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-gray-400 text-sm",
                                                            children: "Progress"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 4612,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-white font-medium",
                                                            children: [
                                                                commitment.current_progress,
                                                                "% / ",
                                                                commitment.target_value,
                                                                "%"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 4613,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 4611,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-gray-400 text-sm",
                                                            children: "Deadline"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 4618,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-white font-medium",
                                                            children: formatDate(commitment.deadline)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 4619,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 4617,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-gray-400 text-sm",
                                                            children: "Stake"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 4622,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-white font-medium",
                                                            children: [
                                                                commitment.stake_amount,
                                                                " ETH"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 4623,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 4621,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 4610,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-full bg-gray-800 rounded-full h-3 mb-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-1000",
                                                style: {
                                                    width: `${calculateProgress(commitment.current_progress, commitment.target_value)}%`
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 4628,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 4627,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-center text-xs text-gray-400",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        "Created: ",
                                                        formatDate(commitment.created_at),
                                                        commitment.completion_date && ` • Completed: ${formatDate(commitment.completion_date)}`
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 4635,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-right",
                                                    children: [
                                                        "Category: ",
                                                        commitment.category.replace('_', ' ')
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 4639,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 4634,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, commitment.id, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 4574,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 4562,
                        columnNumber: 11
                    }, this),
                    commitments.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-black/20 backdrop-blur-xl rounded-xl border border-gray-500/20 p-12 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-6xl mb-4",
                                children: "🌱"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4649,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-white text-xl mb-2",
                                children: "No environmental commitments yet"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4650,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-400 mb-6",
                                children: "Be the first to create a verified environmental commitment and help build a sustainable future!"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4651,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setCurrentView('feed'),
                                className: "bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-colors",
                                children: "Create Your First Commitment"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4652,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 4648,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 4326,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 4041,
        columnNumber: 5
    }, this);
}
_s1(Home, "Hi4bQ48POiyVvgCVrNdnGIdCZNU=");
_c1 = Home;
var _c, _c1;
__turbopack_context__.k.register(_c, "CommitmentDashboard");
__turbopack_context__.k.register(_c1, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=app_page_tsx_8221feda._.js.map