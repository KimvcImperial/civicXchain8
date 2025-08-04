import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    // Proxy to the real backend API
    const response = await fetch(`${BACKEND_URL}/api/commitments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Transform the backend response to match the expected frontend format
    const commitments = data.commitments || [];
    const transformedCommitments = commitments.map((commitment: any) => ({
      id: commitment.id,
      description: commitment.description || commitment.title,
      official: commitment.creator,
      targetValue: commitment.target_value * 100, // Convert to integer format (multiply by 100)
      actualValue: commitment.actual_value * 100, // Convert to integer format
      deadline: Math.floor(new Date(commitment.deadline).getTime() / 1000), // Convert to Unix timestamp
      isCompleted: commitment.status === 'completed',
      rewardClaimed: Boolean(commitment.reward_claimed),
      metricType: commitment.metric_type,
      needsVerification: !commitment.judge_verified,
      firstAchievementTime: commitment.first_achieved_at ? Math.floor(new Date(commitment.first_achieved_at).getTime() / 1000) : null,
      recentAchievementTime: commitment.last_achieved_at ? Math.floor(new Date(commitment.last_achieved_at).getTime() / 1000) : null,
      achievementFrequency: null, // Not available in current backend schema
    }));

    return NextResponse.json(transformedCommitments);
  } catch (error) {
    console.error('Error fetching commitments:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch commitments',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mock creating a new commitment
    const newCommitment = {
      id: Date.now(), // Simple ID generation for mock
      ...body,
      isCompleted: false,
      rewardClaimed: false,
      needsVerification: true,
      firstAchievementTime: null,
      recentAchievementTime: null,
      achievementFrequency: null,
    };

    return NextResponse.json(newCommitment, { status: 201 });
  } catch (error) {
    console.error('Error creating commitment:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create commitment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
