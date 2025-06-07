import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Keep OpenAI as backup (optional)
// import OpenAI from 'openai';
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

export async function POST(request: NextRequest) {
  try {
    const { origin, destination, duration, budget, mood } = await request.json();

    if (!origin || !destination || !duration || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Build mood context for AI prompt
    const moodContext = mood ? `
    
TRAVEL MOOD CONTEXT:
- Primary mood: ${mood.primary}
- Intensity level: ${mood.intensity}/5
- Focus on ${mood.primary} activities and experiences
${mood.primary === 'adventure' ? '- Include outdoor activities, thrilling experiences, and active pursuits' : ''}
${mood.primary === 'relaxation' ? '- Include spa, peaceful activities, and stress-free experiences' : ''}
${mood.primary === 'cultural' ? '- Include museums, historical sites, and local cultural experiences' : ''}
${mood.primary === 'romantic' ? '- Include intimate experiences, couple activities, and romantic settings' : ''}
${mood.primary === 'foodie' ? '- Include local cuisine, food tours, and culinary experiences' : ''}
${mood.primary === 'nature' ? '- Include parks, natural attractions, and wildlife experiences' : ''}
${mood.primary === 'urban' ? '- Include city attractions, nightlife, and modern experiences' : ''}
${mood.primary === 'wellness' ? '- Include spa, meditation, yoga, and mindful experiences' : ''}
` : '';

    const prompt = `Create a detailed ${duration}-day travel itinerary from ${origin} to ${destination} with a budget of $${budget}.${moodContext}

Please provide:
1. Daily breakdown with 2-3 activities per day
2. Recommended accommodations within budget
3. Transportation suggestions
4. Food recommendations
5. Estimated costs for each activity
6. Practical tips for the destination

Format the response as a structured itinerary with clear daily sections.`;

    let itinerary: string;

    try {
      // Try Google Gemini first (free tier: 15 req/min, 1500/day)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const fullPrompt = `You are a professional travel planner who creates detailed, practical itineraries within specified budgets. Focus on authentic local experiences and provide realistic cost estimates.

${prompt}`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      itinerary = response.text();
      
    } catch (geminiError: unknown) {
      console.log('Gemini API failed, using mock data:', geminiError instanceof Error ? geminiError.message : 'Unknown error');
      
      itinerary = `🗺️ **${duration}-Day Travel Itinerary: ${origin} → ${destination}**
Budget: $${budget.toLocaleString()}

**Day 1: Arrival & City Exploration**
• Morning: Arrive in ${destination}
• Afternoon: Walking tour of city center ($25)
• Evening: Welcome dinner at local restaurant ($45)
• Accommodation: Mid-range hotel ($120/night)

**Day 2: Cultural Immersion**
• Morning: Visit main museum/cultural site ($20)
• Afternoon: Local market exploration (Free)
• Evening: Traditional cuisine experience ($50)

**Day 3: Adventure & Sightseeing**
• Morning: Popular attraction/landmark ($30)
• Afternoon: Local neighborhood walk ($15 for coffee)
• Evening: Entertainment/show ($40)

${duration > 3 ? `**Day 4+: Extended Adventures**
• Continue exploring based on interests
• Day trips to nearby attractions
• More cultural experiences` : ''}

**Transportation Tips:**
• Airport transfer: $25-40
• Local transport: $5-10/day
• Consider day passes for savings

**Food Budget Breakdown:**
• Breakfast: $10-15/day
• Lunch: $15-25/day  
• Dinner: $25-45/day

**Total Estimated Cost: $${Math.round(budget * 0.9)}-${budget}**

*Note: This is a sample itinerary. For personalized recommendations, please ensure your OpenAI API has sufficient credits.*`;
    }

    if (!itinerary) {
      throw new Error('No itinerary generated');
    }

    return NextResponse.json({
      success: true,
      itinerary,
      tripDetails: {
        origin,
        destination,
        duration,
        budget
      }
    });

  } catch (error) {
    console.error('Error generating itinerary:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate itinerary',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}