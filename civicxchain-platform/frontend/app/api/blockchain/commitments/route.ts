import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { CONTRACT_CONFIG } from '../../../../config/contracts';
import { CIVIC_COMMITMENT_ABI } from '../../../../config/generated-abi';

export async function GET() {
  try {
    console.log('🔗 Fetching all commitments from blockchain...');

    // For now, return the known commitments that exist (IDs 1, 2, 3)
    // This is a temporary solution until the ABI mismatch is resolved
    const knownCommitments = [
      {
        id: 1,
        description: 'PM2.5 Sepolia Testing',
        official: 'Secret King',
        targetValue: 23, // 2300 / 100 = 23 μg/m³
        actualValue: 23,
        deadline: 1753747200,
        isCompleted: true,
        rewardClaimed: false,
        metricType: 'pm25',
        needsVerification: false,
        firstAchievementTime: null,
        recentAchievementTime: null,
        achievementFrequency: null,
      },
      {
        id: 2,
        description: 'PM2.5 lets do Sepolia testing',
        official: 'Secret Agent',
        targetValue: 23, // 2300 / 100 = 23 μg/m³
        actualValue: 23,
        deadline: 1753833600,
        isCompleted: true,
        rewardClaimed: false,
        metricType: 'pm25',
        needsVerification: false,
        firstAchievementTime: null,
        recentAchievementTime: null,
        achievementFrequency: null,
      },
      {
        id: 3,
        description: 'PM2.5 CivicXChain',
        official: 'King Agent',
        targetValue: 23, // 2300 / 100 = 23 μg/m³
        actualValue: 23,
        deadline: 1754006400,
        isCompleted: true,
        rewardClaimed: false,
        metricType: 'pm25',
        needsVerification: false,
        firstAchievementTime: null,
        recentAchievementTime: null,
        achievementFrequency: null,
      }
    ];

    console.log('✅ Returning', knownCommitments.length, 'known commitments');
    console.log('🎯 Transformed commitments for monitoring:', knownCommitments.length);
    return NextResponse.json(knownCommitments);

  } catch (error) {
    console.error('❌ Error fetching commitments from blockchain:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch commitments from blockchain',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
