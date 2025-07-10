import React, { useState, useEffect } from 'react';

interface RewardDashboardProps {
  officialId: string;
}

export default function RewardDashboard({ officialId }: RewardDashboardProps) {
  const [rewards, setRewards] = useState<any>(null);

  useEffect(() => {
    // Fetch rewards data from your backend API
    fetchRewardsData();
  }, [officialId]);

  const fetchRewardsData = async () => {
    // In production, this would call your backend API
    // For now, use mock data
    setRewards({
      nft_badges: [
        { 
          type: "Forest Guardian", 
          earned_date: "2024-01-15", 
          rarity: "Rare",
          description: "Protected 1000+ acres of forest",
          image: "🌲"
        },
        { 
          type: "Air Quality Champion", 
          earned_date: "2024-02-20", 
          rarity: "Epic",
          description: "Reduced PM2.5 levels by 25%",
          image: "🌬️"
        },
        { 
          type: "Water Protector", 
          earned_date: "2024-03-10", 
          rarity: "Legendary",
          description: "Achieved 95% water quality score",
          image: "💧"
        }
      ],
      reputation_tokens: 2500,
      current_rank: "Environmental Guardian",
      total_commitments: 12,
      completed_commitments: 9,
      success_rate: 75,
      next_milestone: {
        title: "Climate Hero",
        tokens_needed: 500,
        progress: 80
      }
    });
  };

  if (!rewards) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-cyan-400 text-lg">Loading rewards...</div>
      </div>
    );
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'text-gray-400 border-gray-400/30 bg-gray-500/20';
      case 'rare': return 'text-blue-400 border-blue-400/30 bg-blue-500/20';
      case 'epic': return 'text-purple-400 border-purple-400/30 bg-purple-500/20';
      case 'legendary': return 'text-yellow-400 border-yellow-400/30 bg-yellow-500/20';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Reward Dashboard</h2>
        <p className="text-gray-400">Track your environmental achievements and earn rewards</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-400/30 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-cyan-400 mb-2">{rewards.reputation_tokens}</div>
          <div className="text-sm text-gray-400">Reputation Tokens</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-emerald-400/30 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-emerald-400 mb-2">{rewards.nft_badges.length}</div>
          <div className="text-sm text-gray-400">NFT Badges</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-400/30 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">{rewards.success_rate}%</div>
          <div className="text-sm text-gray-400">Success Rate</div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-400/30 rounded-lg p-6 text-center">
          <div className="text-xl font-bold text-yellow-400 mb-2">{rewards.current_rank}</div>
          <div className="text-sm text-gray-400">Current Rank</div>
        </div>
      </div>

      {/* NFT Badges Collection */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          NFT Badge Collection
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rewards.nft_badges.map((badge: any, index: number) => (
            <div key={index} className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 hover:border-cyan-400/50 transition-all duration-300">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{badge.image}</div>
                <h4 className="text-lg font-semibold text-white">{badge.type}</h4>
              </div>
              
              <div className="space-y-2">
                <div className={`text-center px-2 py-1 rounded text-xs font-medium border ${getRarityColor(badge.rarity)}`}>
                  {badge.rarity}
                </div>
                
                <p className="text-sm text-gray-400 text-center">{badge.description}</p>
                
                <div className="text-xs text-gray-500 text-center">
                  Earned: {new Date(badge.earned_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress to Next Milestone */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          Next Milestone: {rewards.next_milestone.title}
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="text-cyan-400">{rewards.next_milestone.progress}%</span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${rewards.next_milestone.progress}%` }}
            ></div>
          </div>
          
          <div className="text-sm text-gray-400">
            Need {rewards.next_milestone.tokens_needed} more tokens to unlock <span className="text-yellow-400">{rewards.next_milestone.title}</span>
          </div>
        </div>
      </div>

      {/* Achievement Summary */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Achievement Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Completed Commitments</span>
              <span className="text-green-400">{rewards.completed_commitments}/{rewards.total_commitments}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-400 h-2 rounded-full"
                style={{ width: `${(rewards.completed_commitments / rewards.total_commitments) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Success Rate</span>
              <span className="text-cyan-400">{rewards.success_rate}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-cyan-400 h-2 rounded-full"
                style={{ width: `${rewards.success_rate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-400/30 rounded-lg p-8">
        <h3 className="text-xl font-bold text-white mb-2">Ready for Your Next Challenge?</h3>
        <p className="text-gray-400 mb-4">Create new environmental commitments and earn more rewards</p>
        <button className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all duration-300">
          Create New Commitment
        </button>
      </div>
    </div>
  );
}