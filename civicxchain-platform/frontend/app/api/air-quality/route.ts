// app/api/air-quality/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || 'London';
    
    // OpenAQ API endpoint
    const apiUrl = `https://api.openaq.org/v2/latest?location=${encodeURIComponent(location)}&parameter=pm25`;
    
    console.log('Fetching from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CivicXChain/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`OpenAQ API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch air quality data',
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