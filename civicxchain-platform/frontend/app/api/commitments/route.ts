// app/api/commitments/route.ts
import { NextRequest, NextResponse } from 'next/server';

// No mock data - Track Status will show real blockchain commitments
const mockCommitments: any[] = [];

export async function GET(request: NextRequest) {
  try {
    // If you have a database or external API for commitments, call it here
    // For now, returning mock data
    
    console.log('Fetching commitments data');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({
      success: true,
      data: mockCommitments,
      count: mockCommitments.length
    });
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