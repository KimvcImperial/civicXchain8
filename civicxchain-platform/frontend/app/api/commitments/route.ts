// app/api/commitments/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mock data for commitments - replace with your actual data source
const mockCommitments = [
  {
    id: 1,
    title: "Reduce Carbon Emissions",
    description: "Commit to reducing carbon emissions by 50% by 2030",
    target: "50% reduction",
    deadline: "2030-12-31",
    status: "active"
  },
  {
    id: 2,
    title: "Renewable Energy",
    description: "Switch to 100% renewable energy sources",
    target: "100% renewable",
    deadline: "2025-12-31",
    status: "in_progress"
  }
];

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