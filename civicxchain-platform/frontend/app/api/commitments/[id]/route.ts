import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commitmentId = params.id;

    // First, get all commitments from the backend
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
    const commitments = data.commitments || [];

    // Find the specific commitment by ID
    const commitment = commitments.find((c: any) => c.id === parseInt(commitmentId));

    if (!commitment) {
      return NextResponse.json(
        { error: 'Commitment not found' },
        { status: 404 }
      );
    }

    // Transform to match expected frontend format
    const transformedCommitment = {
      id: commitment.id,
      description: commitment.description || commitment.title,
      official: commitment.creator,
      targetValue: commitment.target_value * 100, // Convert to integer format
      actualValue: commitment.actual_value * 100, // Convert to integer format
      deadline: Math.floor(new Date(commitment.deadline).getTime() / 1000), // Convert to Unix timestamp
      isCompleted: commitment.status === 'completed',
      rewardClaimed: Boolean(commitment.reward_claimed),
      metricType: commitment.metric_type,
      needsVerification: !commitment.judge_verified,
      firstAchievementTime: commitment.first_achieved_at ? Math.floor(new Date(commitment.first_achieved_at).getTime() / 1000) : null,
      recentAchievementTime: commitment.last_achieved_at ? Math.floor(new Date(commitment.last_achieved_at).getTime() / 1000) : null,
      achievementFrequency: null, // Not available in current backend schema
    };

    return NextResponse.json(transformedCommitment);
  } catch (error) {
    console.error('Error fetching commitment:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch commitment',
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
