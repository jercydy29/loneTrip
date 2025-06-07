import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');


export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Japan itinerary API called');
    const body = await request.json();
    console.log('📝 Request body:', JSON.stringify(body, null, 2));
    
    const { regions, totalDuration, travelStyle, season } = body;

    if (!regions || !Array.isArray(regions) || regions.length === 0 || !totalDuration) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: regions and totalDuration' },
        { status: 400 }
      );
    }

    console.log('✅ Request validation passed');

    // Build Japan-specific context for multiple regions
    const regionsContext = regions.map((regionWithDays: { region: { name: string; nameJapanese: string; description: string; prefecture?: string[] }; days: number }) => `
REGION: ${regionWithDays.region.name} (${regionWithDays.region.nameJapanese})
Duration: ${regionWithDays.days} day${regionWithDays.days !== 1 ? 's' : ''}
Description: ${regionWithDays.region.description}
Major Prefectures: ${regionWithDays.region.prefecture?.join(', ') || 'Not specified'}
`).join('\n');

    const styleContext = travelStyle ? `
TRAVEL STYLE: ${travelStyle.name} (${travelStyle.nameJapanese})
Style Focus: ${travelStyle.description}
` : '';

    const seasonContext = season ? `
SEASON: ${season.name} (${season.nameJapanese})
Season Description: ${season.description}
Seasonal Highlights: ${season.highlights.join(', ')}
` : '';

    const regionNames = regions.map((rwd: { region: { name: string } }) => rwd.region.name).join(' and ');
    
    const prompt = `Create a comprehensive and detailed ${totalDuration}-day Japan travel itinerary covering multiple regions: ${regionNames}.

MULTI-REGION JOURNEY:
${regionsContext}${styleContext}${seasonContext}

ITINERARY REQUIREMENTS:
- Create a cohesive journey across multiple regions with logical travel flow
- Allocate the specified number of days to each region as requested
- Include authentic Japanese experiences and cultural insights for each region
- Provide day-by-day breakdown with 6-8 detailed activities per day (morning, mid-morning, lunch, afternoon, late afternoon, dinner, evening activities)
- Include traditional and modern attractions appropriate to each region
- Suggest authentic local cuisine and dining experiences for each meal
- Include practical information like transportation between regions and within regions
- Respect Japanese customs and etiquette in recommendations
- Include both famous attractions and hidden gems
- Consider seasonal activities and weather conditions
- Plan efficient transportation routes between regions (JR Pass, Shinkansen, etc.)
${travelStyle ? `- Emphasize ${travelStyle.name} style experiences throughout all regions` : ''}

IMPORTANT - DO NOT INCLUDE THESE BORING TASKS AS ACTIVITIES:
- DO NOT include "Purchase Suica/Pasmo card" as an activity
- DO NOT include "Check into hotel" as an activity
- DO NOT include "Currency exchange" or "Withdraw cash" as activities
- DO NOT include "Collect luggage" or "Airport transfer" as activities
- DO NOT include "Buy SIM card" or "Rent pocket WiFi" as activities
- DO NOT include "Immigration/customs" as activities
- These are administrative tasks, not experiences! Focus on actual attractions, food, culture, and fun activities!

DETAILED DAILY STRUCTURE REQUIRED:
For each day, include these specific activity types:
1. Early Morning Activity (7:00-9:00) - Temple visits, morning markets, sunrise spots
2. Morning Activity (9:00-11:00) - Major attractions, museums, cultural sites
3. Late Morning/Lunch (11:00-13:00) - Local restaurant, food market, cooking experience
4. Afternoon Activity (13:00-15:00) - Parks, gardens, shopping districts, workshops
5. Late Afternoon (15:00-17:00) - Additional attractions, tea ceremonies, local experiences
6. Dinner (17:00-19:00) - Traditional restaurants, izakayas, regional specialties
7. Evening Activity (19:00-21:00) - Night markets, entertainment districts, cultural performances
8. Optional Late Evening (21:00+) - Bars, karaoke, night views, onsen relaxation

CONTENT RICHNESS:
- Include specific restaurant names and local food specialties for each meal
- Mention exact transportation methods (which train lines, bus routes, walking times)
- Add cultural context and historical background for major sites
- Include shopping opportunities and local craft experiences
- Suggest photo spots and Instagram-worthy locations
- Add practical tips like entry fees, opening hours, and reservation requirements
- Include backup indoor activities for rainy weather
- Mention seasonal highlights specific to travel dates

FORMAT REQUIREMENTS:
- Use clear "Day 1", "Day 2", "Day 3" etc. headers
- List each activity with bullet points or numbered items
- Include approximate times for each activity
- Add brief descriptions for each activity (2-3 sentences minimum)
- Include estimated costs in Japanese Yen
- Mention difficulty levels and accessibility information
- Add local etiquette tips for each type of activity

EXAMPLE FORMAT:
Day 1: Tokyo Exploration
• 7:00 AM - Early morning visit to Tsukiji Outer Market for fresh sushi breakfast (¥2000)
• 9:00 AM - Explore Senso-ji Temple in Asakusa district with traditional shopping (¥500)
• 11:30 AM - Lunch at famous tempura restaurant Daikokuya established 1887 (¥3000)
• 1:00 PM - Stroll through Ueno Park and visit Tokyo National Museum (¥1000)
• 3:00 PM - Experience traditional tea ceremony in Ginza (¥2500)
• 6:00 PM - Dinner at high-end sushi restaurant in Ginza district (¥8000)
• 8:00 PM - Evening walk through illuminated Tokyo Station area (Free)
• 9:30 PM - Drinks and karaoke in Shibuya entertainment district (¥3000)

FOCUS ON EXPERIENCES, NOT ADMIN TASKS!
Make each day feel packed with authentic Japanese experiences while maintaining a realistic and enjoyable pace. Every activity should be something travelers are excited to do - temples, food, culture, shopping, entertainment, nature, etc. NO boring administrative tasks like buying transit cards or checking into hotels!`;

    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.log('⚠️ GEMINI_API_KEY not found in environment variables');
      return NextResponse.json(
        { 
          error: 'AI service configuration error. Gemini API key is not configured.',
          details: 'Please ensure GEMINI_API_KEY is set in environment variables'
        },
        { status: 500 }
      );
    } else {
      console.log('✅ GEMINI_API_KEY found, length:', process.env.GEMINI_API_KEY.length);
    }

    // Generate content using Gemini
    console.log('🤖 Calling Gemini API...');
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log('📝 Prompt length:', prompt.length, 'characters');
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Gemini API success, generated', text.length, 'characters');
      return NextResponse.json({ itinerary: text });
      
    } catch (geminiError: unknown) {
      const errorMessage = geminiError instanceof Error ? geminiError.message : 'Unknown error';
      console.log('❌ Gemini API failed:', errorMessage);
      
      // Return error to user instead of fallback
      return NextResponse.json(
        { 
          error: 'Failed to generate Japan itinerary using AI. Please try again later.',
          details: `Gemini API Error: ${errorMessage}`
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error generating Japan itinerary:', error);
    return NextResponse.json(
      { 
        error: 'Unable to process your Japan travel request. Please check your request and try again.',
        details: error instanceof Error ? error.message : 'Unknown server error'
      },
      { status: 500 }
    );
  }
}