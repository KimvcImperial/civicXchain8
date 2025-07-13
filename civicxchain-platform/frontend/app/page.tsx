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
  */

/*'use client';

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
}*/


/*
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
*/



/*
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
*/

/*
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
  */




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
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4">
          🌍 EcoChain Governance
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          Transparent environmental accountability through blockchain technology
        </p>
      </div>

      {/* Navigation */}
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
          {/* Environmental Data Cards */}
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

          {/* Satellite Data */}
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

          {/* Commitment Creation Form */}
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

          {/* Commitments Feed */}
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


/*
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
  */




