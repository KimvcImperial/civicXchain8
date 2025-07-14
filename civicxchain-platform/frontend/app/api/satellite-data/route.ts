// app/api/satellite-data/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Example: Using NASA Earth Imagery API (free, no API key required)
    // You can replace this with your actual satellite data API
    const apiUrl = 'https://api.nasa.gov/planetary/earth/imagery?lon=100.75&lat=1.5&date=2024-01-01&api_key=DEMO_KEY';
    
    console.log('Fetching satellite data from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CivicXChain/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Satellite API responded with status: ${response.status}`);
    }

    // For image data, you might want to return the image URL or metadata
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching satellite data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch satellite data',
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