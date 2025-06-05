import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test if environment variables are loaded
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    const hasGoogleMapsKey = !!process.env.GOOGLE_MAPS_API_KEY;
    
    return NextResponse.json({
      success: true,
      message: 'API is working!',
      environment: {
        hasOpenAIKey,
        hasGoogleMapsKey,
        nodeEnv: process.env.NODE_ENV,
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Test API failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      success: true,
      message: 'POST request successful',
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'POST test failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}