import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commitmentId = params.id;
    const body = await request.json();

    console.log('🎯 Achievement API: Updating commitment', commitmentId, 'with achievement data:', body);

    // Proxy to the backend API
    const response = await fetch(`${BACKEND_URL}/api/commitments/${commitmentId}/achievement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const data = await response.json();

    console.log('✅ Achievement API: Successfully updated commitment', commitmentId);

    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Achievement API: Error updating achievement:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
