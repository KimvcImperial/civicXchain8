(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/lib/api-client.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// lib/api-client.ts
__turbopack_context__.s({
    "ApiClient": (()=>ApiClient),
    "getAirQualityData": (()=>getAirQualityData),
    "getAllCommitments": (()=>getAllCommitments),
    "getSatelliteData": (()=>getSatelliteData)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_BASE_URL || '/api';
class ApiClient {
    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        try {
            console.log('Making API request to:', url);
            const response = await fetch(url, config);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('API response:', data);
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    static async getAirQualityData(location) {
        const params = new URLSearchParams({
            location
        });
        return this.request(`/air-quality?${params}`);
    }
    static async getSatelliteData() {
        return this.request('/satellite-data');
    }
    static async getAllCommitments() {
        return this.request('/commitments');
    }
}
const getAirQualityData = ApiClient.getAirQualityData.bind(ApiClient);
const getSatelliteData = ApiClient.getSatelliteData.bind(ApiClient);
const getAllCommitments = ApiClient.getAllCommitments.bind(ApiClient);
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
                  <div className="text-3xl font-bold text-white mb-1">{environmentalData.pm25.toFixed(1)} μg/m³</div>
                  <div className="text-xs text-gray-400">{environmentalData.location}</div>
                </div>
                <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-orange-500/20 p-6">
                  <div className="text-orange-400 text-sm font-medium mb-2">CO2 Levels</div>
                  <div className="text-3xl font-bold text-white mb-1">{environmentalData.co2.toFixed(1)} ppm</div>
                  <div className="text-xs text-gray-400">Atmospheric Reading</div>
                </div>
                <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-green-500/20 p-6">
                  <div className="text-green-400 text-sm font-medium mb-2">Forest Cover</div>
                  <div className="text-3xl font-bold text-white mb-1">{environmentalData.forest_cover.toFixed(1)}%</div>
                  <div className="text-xs text-gray-400">Regional Coverage</div>
                </div>
                <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6">
                  <div className="text-blue-400 text-sm font-medium mb-2">Water Quality</div>
                  <div className="text-3xl font-bold text-white mb-1">{environmentalData.water_quality.toFixed(1)}%</div>
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
                  <div className="text-white font-medium">{satelliteData.forest_cover_percentage.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Change Detected</div>
                  <div className={`font-medium ${satelliteData.change_detected ? 'text-yellow-400' : 'text-green-400'}`}>
                    {satelliteData.change_detected ? '⚠️ Yes' : '✅ No'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Confidence Score</div>
                  <div className="text-white font-medium">{satelliteData.confidence_score.toFixed(1)}%</div>
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
  */ /*

'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

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

// Real API client (replace with your actual API endpoints)
const apiClient = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  // Real API methods
  async getAllCommitments(): Promise<{ commitments: Commitment[] }> {
    return this.request('/api/commitments');
  },

  async getEnvironmentalData(): Promise<EnvironmentalData> {
    return this.request('/api/environmental-data');
  },

  async getSatelliteData(commitmentId: string): Promise<SatelliteData> {
    return this.request(`/api/satellite-data?commitmentId=${commitmentId}`);
  },

  async createCommitment(data: CreateCommitmentRequest): Promise<Commitment> {
    return this.request('/api/commitments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCommitmentProgress(commitmentId: string, newProgress: number): Promise<{ success: boolean }> {
    return this.request(`/api/commitments/${commitmentId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ new_progress: newProgress }),
    });
  },

  async claimReward(commitmentId: string): Promise<{ 
    success: boolean; 
    message: string; 
    reward_amount: number; 
    transaction_hash: string; 
  }> {
    return this.request(`/api/commitments/${commitmentId}/claim-reward`, {
      method: 'POST',
    });
  },

  // Real environmental data sources
  async getAirQualityData(location: string): Promise<{ pm25: number; co2: number }> {
    // OpenAQ API integration
    const response = await fetch(`https://api.openaq.org/v2/latest?location=${location}&parameter=pm25`);
    if (!response.ok) throw new Error('Failed to fetch air quality data');
    const data = await response.json();
    return {
      pm25: data.results?.[0]?.measurements?.[0]?.value || 0,
      co2: Math.random() * 50 + 400, // Replace with real CO2 API
    };
  },

  async getForestCoverData(coordinates: { lat: number; lon: number }): Promise<{ forest_cover: number }> {
    // NASA Earthdata or Google Earth Engine integration
    // This would require proper API keys and authentication
    try {
      // Placeholder for real satellite data API call
      const response = await fetch(`/api/forest-cover?lat=${coordinates.lat}&lon=${coordinates.lon}`);
      const data = await response.json();
      return { forest_cover: data.forest_cover_percentage };
    } catch (error) {
      console.error('Forest cover data unavailable:', error);
      return { forest_cover: 75 }; // Fallback value
    }
  },

  async getWaterQualityData(region: string): Promise<{ water_quality: number }> {
    // WHO or local water quality API integration
    try {
      const response = await fetch(`/api/water-quality?region=${region}`);
      const data = await response.json();
      return { water_quality: data.quality_index };
    } catch (error) {
      console.error('Water quality data unavailable:', error);
      return { water_quality: 80 }; // Fallback value
    }
  }
};

// Blockchain integration for rewards
const blockchainClient = {
  async connectWallet(): Promise<string | null> {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return accounts[0];
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        return null;
      }
    }
    return null;
  },

  async claimReward(commitmentId: string, amount: number): Promise<string> {
    // Real smart contract interaction
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // This would be your actual smart contract interaction
        const transactionHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            // Your smart contract parameters
            to: '0x...', // Your contract address
            data: '0x...', // Encoded function call
            value: '0x0',
          }],
        });
        return transactionHash;
      } catch (error) {
        throw new Error('Blockchain transaction failed');
      }
    }
    throw new Error('Wallet not connected');
  }
};

// Real CommitmentDashboard component
const CommitmentDashboard = ({ 
  commitments, 
  onUpdateProgress, 
  onClaimReward 
}: {
  commitments: Commitment[];
  onUpdateProgress: (id: string, progress: number) => void;
  onClaimReward: (id: string) => void;
}) => {
  const [selectedCommitment, setSelectedCommitment] = useState<string | null>(null);
  const [progressInput, setProgressInput] = useState<number>(0);

  return (
    <div className="text-white space-y-6">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
        📊 Commitment Dashboard
      </h2>
      
      <div className="grid gap-6">
        {commitments.map(commitment => (
          <div key={commitment.id} className="bg-black/20 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{commitment.title}</h3>
                <p className="text-gray-400 mb-2">{commitment.description}</p>
                <div className="text-sm text-gray-500">
                  By {commitment.official_name} ({commitment.official_role})
                </div>
              </div>
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                  commitment.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  commitment.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                  commitment.status === 'rewarded' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {commitment.status.toUpperCase()}
                </div>
                {commitment.satellite_verified && (
                  <div className="text-xs text-purple-400">🛰️ Satellite Verified</div>
                )}
              </div>
            </div>

            {/* Progress Bar *
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Progress</span>
                <span className="text-white">{commitment.current_progress}% / {commitment.target_value}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-1000"
                  style={{width: `${Math.min((commitment.current_progress / commitment.target_value) * 100, 100)}%`}}
                ></div>
              </div>
            </div>

            {/* Action Buttons *
            <div className="flex gap-4 items-center flex-wrap">
              {commitment.status === 'active' && (
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min={commitment.current_progress}
                    max={100}
                    value={selectedCommitment === commitment.id ? progressInput : commitment.current_progress}
                    onChange={(e) => {
                      setSelectedCommitment(commitment.id);
                      setProgressInput(Number(e.target.value));
                    }}
                    className="w-20 bg-black/50 border border-cyan-500/30 rounded px-2 py-1 text-white text-sm"
                  />
                  <button 
                    onClick={() => {
                      onUpdateProgress(commitment.id, progressInput);
                      setSelectedCommitment(null);
                    }}
                    className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 px-3 py-1 rounded text-sm transition-all duration-200"
                  >
                    Update Progress
                  </button>
                </div>
              )}
              
              {commitment.current_progress >= commitment.target_value && 
               commitment.status !== 'rewarded' && 
               !commitment.reward_claimed && (
                <button 
                  onClick={() => onClaimReward(commitment.id)}
                  className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-400 px-4 py-2 rounded font-medium transition-all duration-200 hover:scale-105"
                >
                  🏆 Claim Reward
                </button>
              )}
              
              {commitment.reward_claimed && (
                <div className="flex items-center gap-2 text-yellow-400">
                  <span className="text-2xl">💰</span>
                  <span className="font-medium">
                    Reward: {commitment.reward_amount?.toFixed(4)} ETH
                  </span>
                </div>
              )}
            </div>

            {/* Details *
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
              <div>
                <div className="text-xs text-gray-400">Deadline</div>
                <div className="text-sm text-white">{new Date(commitment.deadline).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Stake</div>
                <div className="text-sm text-white">{commitment.stake_amount} ETH</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Category</div>
                <div className="text-sm text-white">{commitment.category.replace('_', ' ')}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Created</div>
                <div className="text-sm text-white">{new Date(commitment.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {commitments.length === 0 && (
        <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-gray-500/20 p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-white text-xl mb-2">No commitments to manage</h3>
          <p className="text-gray-400">Create your first environmental commitment to get started!</p>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'feed' | 'dashboard'>('feed');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

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
    connectWallet();
    
    // Set up interval for real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchAllData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const connectWallet = async () => {
    const address = await blockchainClient.connectWallet();
    setWalletAddress(address);
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch commitments
      try {
        const commitmentsData = await apiClient.getAllCommitments();
        setCommitments(commitmentsData.commitments || []);
      } catch (err) {
        console.error('Error fetching commitments:', err);
        toast.error('Failed to load commitments');
      }

      // Fetch real environmental data
      try {
        const location = "Global"; // You can make this dynamic
        const coordinates = { lat: 40.7128, lon: -74.0060 }; // NYC coordinates as example
        
        const [airQuality, forestCover, waterQuality] = await Promise.all([
          apiClient.getAirQualityData(location),
          apiClient.getForestCoverData(coordinates),
          apiClient.getWaterQualityData(location)
        ]);

        setEnvironmentalData({
          location,
          pm25: airQuality.pm25,
          co2: airQuality.co2,
          forest_cover: forestCover.forest_cover,
          water_quality: waterQuality.water_quality,
          timestamp: new Date().toISOString(),
          source: "Real-time APIs"
        });
      } catch (err) {
        console.error('Error fetching environmental data:', err);
        toast.error('Failed to load environmental data');
      }

      // Fetch real satellite data
      try {
        const satData = await apiClient.getSatelliteData('general');
        setSatelliteData(satData);
      } catch (err) {
        console.error('Error fetching satellite data:', err);
        toast.error('Failed to load satellite data');
      }

      setLastUpdated(new Date());

    } catch (err) {
      setError('Failed to fetch data. Please check your connection.');
      console.error('Error fetching data:', err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommitment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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

      const newCommitmentResponse = await apiClient.createCommitment(commitmentData);
      
      // Add to local state immediately for better UX
      setCommitments(prev => [newCommitmentResponse, ...prev]);
      
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

      toast.success('Commitment created successfully! 🎉');
      
      // Refresh data to ensure consistency
      await fetchAllData();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Please try again.';
      toast.error(`Failed to create commitment: ${errorMessage}`);
      console.error('Error creating commitment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProgress = async (commitmentId: string, newProgress: number) => {
    try {
      await apiClient.updateCommitmentProgress(commitmentId, newProgress);

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

      toast.success('Progress updated successfully! 📈');
      
      // Refresh data to ensure consistency
      await fetchAllData();

    } catch (err) {
      toast.error('Failed to update progress. Please try again.');
      console.error('Error updating progress:', err);
    }
  };

  const handleClaimReward = async (commitmentId: string) => {
    try {
      if (!walletAddress) {
        toast.error('Please connect your wallet first');
        await connectWallet();
        return;
      }

      const result = await apiClient.claimReward(commitmentId);
      
      // Process blockchain transaction
      const transactionHash = await blockchainClient.claimReward(commitmentId, result.reward_amount);
      
      // Update commitment status
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
      
      toast.success(`🎉 ${result.message}\n💰 Reward: ${result.reward_amount.toFixed(4)} ETH\n🔗 TX: ${transactionHash.slice(0, 10)}...`);
      
      // Refresh data
      await fetchAllData();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Please try again.';
      toast.error(`Failed to claim reward: ${errorMessage}`);
      console.error('Error claiming reward:', err);
    }
  };

  // Helper functions
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
          <p className="text-white text-xl">Loading EcoChain Governance...</p>
          <p className="text-gray-400 text-sm mt-2">Connecting to blockchain and environmental APIs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl mb-4">Connection Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={fetchAllData}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Retry Connection
          </button>
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
            {walletAddress && (
              <div className="text-sm text-cyan-400">
                🔗 Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Last Updated</div>
            <div className="text-cyan-400 font-medium">{formatTime(lastUpdated)}</div>
            <div className="text-xs text-gray-500">{lastUpdated.toLocaleDateString()}</div>
            <button 
              onClick={fetchAllData}
              className="mt-2 text-xs bg-cyan-500/20 hover:bg-cyan-500/30 px-3 py-1 rounded border border-cyan-500/50 transition-colors"
            >
              🔄 Refresh
            </button>
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
        <div className="max-w-7xl mx-auto">
          <CommitmentDashboard
            commitments={commitments}
            onUpdateProgress={handleUpdateProgress}
            onClaimReward={handleClaimReward}
          />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Environmental Data Cards *
          {environmentalData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-red-500/20 p-6 hover:border-red-500/40 transition-all duration-300">
                <div className="text-red-400 text-sm font-medium mb-2">Air Quality (PM2.5)</div>
                <div className="text-3xl font-bold text-white mb-1">{environmentalData.pm25.toFixed(1)} μg/m³</div>
                <div className="text-xs text-gray-400">{environmentalData.location}</div>
                <div className="text-xs text-gray-500 mt-1">Source: {environmentalData.source}</div>
              </div>
              <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-orange-500/20 p-6 hover:border-orange-500/40 transition-all duration-300">
                <div className="text-orange-400 text-sm font-medium mb-2">CO2 Levels</div>
                <div className="text-3xl font-bold text-white mb-1">{environmentalData.co2.toFixed(1)} ppm</div>
                <div className="text-xs text-gray-400">Atmospheric Reading</div>
                <div className="text-xs text-gray-500 mt-1">Real-time monitoring</div>
              </div>
              <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300">
                <div className="text-green-400 text-sm font-medium mb-2">Forest Cover</div>
                <div className="text-3xl font-bold text-white mb-1">{environmentalData.forest_cover.toFixed(1)}%</div>
                <div className="text-xs text-gray-400">Regional Coverage</div>
                <div className="text-xs text-gray-500 mt-1">Satellite verified</div>
              </div>
              <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300">
                <div className="text-blue-400 text-sm font-medium mb-2">Water Quality</div>
                <div className="text-3xl font-bold text-white mb-1">{environmentalData.water_quality.toFixed(1)}%</div>
                <div className="text-xs text-gray-400">Quality Index</div>
                <div className="text-xs text-gray-500 mt-1">WHO standards</div>
              </div>
            </div>
          )}

          {/* Satellite Data *
          {satelliteData && (
            <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6 mb-8 hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  🛰️
                </div>
                <div>
                  <h3 className="text-white font-semibold">Satellite Monitoring</h3>
                  <p className="text-gray-400 text-sm">Real-time environmental verification</p>
                </div>
                <div className="ml-auto text-xs text-gray-400">
                  Updated: {new Date(satelliteData.last_updated).toLocaleString()}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-gray-400 text-sm">Location</div>
                  <div className="text-white font-medium">{satelliteData.location}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Forest Coverage</div>
                  <div className="text-white font-medium">{satelliteData.forest_cover_percentage.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Change Detected</div>
                  <div className={`font-medium ${satelliteData.change_detected ? 'text-yellow-400' : 'text-green-400'}`}>
                    {satelliteData.change_detected ? '⚠️ Changes detected' : '✅ Stable'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Confidence Score</div>
                  <div className="text-white font-medium">{satelliteData.confidence_score.toFixed(1)}%</div>
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
              Create New Environmental Commitment
            </h2>
            <form onSubmit={handleCreateCommitment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Commitment Title *</label>
                <input
                  type="text"
                  value={newCommitment.title}
                  onChange={(e) => setNewCommitment({...newCommitment, title: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="e.g., Reduce PM2.5 levels by 30%"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Environmental Category *</label>
                <select 
                  value={newCommitment.category}
                  onChange={(e) => setNewCommitment({...newCommitment, category: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  disabled={isSubmitting}
                >
                  <option value="forest_protection">🌳 Forest Protection & Reforestation</option>
                  <option value="air_quality">🏭 Air Quality Improvement</option>
                  <option value="water_management">💧 Water Resource Management</option>
                  <option value="biodiversity">🦋 Biodiversity Conservation</option>
                  <option value="waste_reduction">♻️ Waste Reduction & Recycling</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">Detailed Description *</label>
                <textarea
                  value={newCommitment.description}
                  onChange={(e) => setNewCommitment({...newCommitment, description: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Describe your environmental commitment, methodology, and expected impact..."
                  rows={4}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Target Achievement (%) *</label>
                <input
                  type="number"
                  value={newCommitment.target_value}
                  onChange={(e) => setNewCommitment({...newCommitment, target_value: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Target percentage (e.g., 85)"
                  min="1"
                  max="100"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Completion Deadline *</label>
                <input
                  type="date"
                  value={newCommitment.deadline}
                  onChange={(e) => setNewCommitment({...newCommitment, deadline: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  min={new Date().toISOString().split('T')[0]}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Official Name *</label>
                <input
                  type="text"
                  value={newCommitment.official_name}
                  onChange={(e) => setNewCommitment({...newCommitment, official_name: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Your full name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Official Role/Position *</label>
                <input
                  type="text"
                  value={newCommitment.official_role}
                  onChange={(e) => setNewCommitment({...newCommitment, official_role: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="e.g., Environmental Minister, Mayor, etc."
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Stake Amount (ETH) *</label>
                <input
                  type="number"
                  value={newCommitment.stake_amount}
                  onChange={(e) => setNewCommitment({...newCommitment, stake_amount: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Amount to stake (e.g., 1.5)"
                  min="0.01"
                  step="0.01"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                      Creating Commitment...
                    </>
                  ) : (
                    <>🚀 Create Smart Environmental Commitment</>
                  )}
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
              Environmental Commitments Feed
              <span className="ml-2 text-sm bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">
                {commitments.length} Active
              </span>
            </h2>
            
            {commitments.map((commitment) => (
              <div key={commitment.id} className="bg-black/20 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300 hover:transform hover:scale-[1.02]">
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
                  <div className="flex gap-2 items-center">
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      commitment.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      commitment.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                      commitment.status === 'rewarded' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {commitment.status.toUpperCase()}
                    </div>
                    {commitment.satellite_verified && (
                      <div className="px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400">
                        🛰️ Verified
                      </div>
                    )}
                    {commitment.reward_claimed && (
                      <div className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400">
                        💰 {commitment.reward_amount?.toFixed(4)} ETH
                      </div>
                    )}
                  </div>
                </div>
                
                <h4 className="text-white font-semibold text-lg mb-2">{commitment.title}</h4>
                <p className="text-gray-300 mb-4">{commitment.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-gray-400 text-sm">Progress</div>
                    <div className="text-white font-medium">
                      {commitment.current_progress}% / {commitment.target_value}%
                    </div>
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
                
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <div>
                    Created: {formatDate(commitment.created_at)}
                    {commitment.completion_date && ` • Completed: ${formatDate(commitment.completion_date)}`}
                  </div>
                  <div className="text-right">
                    Category: {commitment.category.replace('_', ' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {commitments.length === 0 && (
            <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-gray-500/20 p-12 text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-white text-xl mb-2">No environmental commitments yet</h3>
              <p className="text-gray-400 mb-6">Be the first to create a verified environmental commitment and help build a sustainable future!</p>
              <button 
                onClick={() => setCurrentView('feed')}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Create Your First Commitment
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

*/ // app/page.tsx
__turbopack_context__.s({
    "default": (()=>Home)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function Home() {
    _s();
    const [airQualityState, setAirQualityState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        loading: false,
        error: null,
        data: null
    });
    const [satelliteState, setSatelliteState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        loading: false,
        error: null,
        data: null
    });
    const [commitmentsState, setCommitmentsState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        loading: false,
        error: null,
        data: null
    });
    const fetchAirQuality = async (location = 'London')=>{
        setAirQualityState({
            loading: true,
            error: null,
            data: null
        });
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAirQualityData"])(location);
            setAirQualityState({
                loading: false,
                error: null,
                data
            });
        } catch (error) {
            setAirQualityState({
                loading: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                data: null
            });
        }
    };
    const fetchSatelliteData = async ()=>{
        setSatelliteState({
            loading: true,
            error: null,
            data: null
        });
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSatelliteData"])();
            setSatelliteState({
                loading: false,
                error: null,
                data
            });
        } catch (error) {
            setSatelliteState({
                loading: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                data: null
            });
        }
    };
    const fetchCommitments = async ()=>{
        setCommitmentsState({
            loading: true,
            error: null,
            data: null
        });
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAllCommitments"])();
            setCommitmentsState({
                loading: false,
                error: null,
                data
            });
        } catch (error) {
            setCommitmentsState({
                loading: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                data: null
            });
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            // Fetch data on component mount
            fetchAirQuality('London');
            fetchSatelliteData();
            fetchCommitments();
        }
    }["Home.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-3xl font-bold mb-8",
                children: "CivicXChain Dashboard"
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 4231,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-6 rounded-lg shadow-md",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold mb-4",
                                children: "Air Quality Data"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4236,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>fetchAirQuality('London'),
                                className: "mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600",
                                children: "Refresh Air Quality"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4237,
                                columnNumber: 11
                            }, this),
                            airQualityState.loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600",
                                children: "Loading air quality data..."
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4244,
                                columnNumber: 39
                            }, this),
                            airQualityState.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-red-500",
                                children: [
                                    "Error: ",
                                    airQualityState.error
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4245,
                                columnNumber: 37
                            }, this),
                            airQualityState.data && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                className: "bg-gray-100 p-2 rounded text-sm overflow-auto max-h-40",
                                children: JSON.stringify(airQualityState.data, null, 2)
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4247,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 4235,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-6 rounded-lg shadow-md",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold mb-4",
                                children: "Satellite Data"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4255,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: fetchSatelliteData,
                                className: "mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600",
                                children: "Refresh Satellite Data"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4256,
                                columnNumber: 11
                            }, this),
                            satelliteState.loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600",
                                children: "Loading satellite data..."
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4263,
                                columnNumber: 38
                            }, this),
                            satelliteState.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-red-500",
                                children: [
                                    "Error: ",
                                    satelliteState.error
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4264,
                                columnNumber: 36
                            }, this),
                            satelliteState.data && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                className: "bg-gray-100 p-2 rounded text-sm overflow-auto max-h-40",
                                children: JSON.stringify(satelliteState.data, null, 2)
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4266,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 4254,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-6 rounded-lg shadow-md",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold mb-4",
                                children: "Commitments"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4274,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: fetchCommitments,
                                className: "mb-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600",
                                children: "Refresh Commitments"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4275,
                                columnNumber: 11
                            }, this),
                            commitmentsState.loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600",
                                children: "Loading commitments..."
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4282,
                                columnNumber: 40
                            }, this),
                            commitmentsState.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-red-500",
                                children: [
                                    "Error: ",
                                    commitmentsState.error
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4283,
                                columnNumber: 38
                            }, this),
                            commitmentsState.data && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                className: "bg-gray-100 p-2 rounded text-sm overflow-auto max-h-40",
                                children: JSON.stringify(commitmentsState.data, null, 2)
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 4285,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 4273,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 4233,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 4230,
        columnNumber: 5
    }, this);
}
_s(Home, "UuJnWopXDiGNClMkgK77ZkuWD8Y=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=_c4f021b6._.js.map