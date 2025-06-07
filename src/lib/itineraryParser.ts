import { JapanTimeline, TimelineDay, TimelineActivity, JapanTravelFormData, TransportLocation, TransportMethod } from '@/types/travel';

export function parseItineraryToTimeline(
    itineraryText: string, 
    formData: JapanTravelFormData
): JapanTimeline {
    console.log('🔍 Parsing itinerary text (first 1000 chars):', itineraryText.substring(0, 1000));
    console.log('🎯 Expected days:', formData.totalDuration);
    console.log('🗾 Regions:', formData.regions.map(r => `${r.region.name} (${r.days} days)`));
    
    const lines = itineraryText.split('\n').filter(line => line.trim());
    console.log('📝 Total lines to process:', lines.length);
    
    // Use a Map to ensure only one day object per day number
    const daysMap = new Map<number, TimelineDay>();
    
    let currentDayNumber = 1;
    let currentRegionIndex = 0;
    let foundAnyDayHeaders = false;

    // Helper function to detect introduction/summary text and boring admin tasks
    const isIntroductionText = (text: string): boolean => {
        const lowerText = text.toLowerCase();
        const boringKeywords = [
            // Only exact boring admin tasks - be more specific
            'purchase a suica card', 'purchase suica card', 'buy a suica card', 'buy suica card',
            'purchase a pasmo card', 'purchase pasmo card', 'buy a pasmo card', 'buy pasmo card',
            'check into hotel', 'hotel check-in', 'check in to hotel',
            'collect luggage', 'pick up luggage', 'luggage collection',
            'airport transfer', 'transfer to hotel', 'travel to hotel from airport',
            'purchase sim card', 'buy sim card', 'activate sim card',
            'rent pocket wifi', 'get pocket wifi',
            'currency exchange', 'exchange money', 'withdraw cash from atm',
            'immigration and customs', 'clear customs', 'customs clearance',
            // Only clear intro text
            'this itinerary assumes', 'all costs are estimates', 'adjust activities based on',
            'jr pass will be cost-effective', 'purchase in advance'
        ];
        
        // Only filter if it's a strong match
        return boringKeywords.some(keyword => lowerText.includes(keyword));
    };

    // Helper function to extract time from text
    const extractTime = (text: string): string => {
        const timeMatch = text.match(/(\d{1,2}):(\d{2})|(\d{1,2})\s*(AM|PM|am|pm)/);
        if (timeMatch) {
            if (timeMatch[1] && timeMatch[2]) {
                return `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`;
            } else if (timeMatch[3] && timeMatch[4]) {
                let hour = parseInt(timeMatch[3]);
                const isPM = timeMatch[4].toLowerCase() === 'pm';
                if (isPM && hour !== 12) hour += 12;
                if (!isPM && hour === 12) hour = 0;
                return `${hour.toString().padStart(2, '0')}:00`;
            }
        }
        return '09:00'; // Default time
    };

    // Helper function to estimate duration based on activity type
    const estimateDuration = (text: string): number => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('meal') || lowerText.includes('dinner') || lowerText.includes('lunch') || lowerText.includes('breakfast')) {
            return 60; // 1 hour for meals
        }
        if (lowerText.includes('temple') || lowerText.includes('shrine') || lowerText.includes('museum')) {
            return 120; // 2 hours for cultural sites
        }
        if (lowerText.includes('walk') || lowerText.includes('stroll')) {
            return 90; // 1.5 hours for walking
        }
        if (lowerText.includes('experience') || lowerText.includes('ceremony')) {
            return 180; // 3 hours for experiences
        }
        return 120; // Default 2 hours
    };

    // Helper function to detect activity type
    const detectActivityType = (text: string): TimelineActivity['type'] => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('meal') || lowerText.includes('dinner') || lowerText.includes('lunch') || lowerText.includes('breakfast') || lowerText.includes('restaurant') || lowerText.includes('food')) {
            return 'meal';
        }
        if (lowerText.includes('transport') || lowerText.includes('train') || lowerText.includes('travel') || lowerText.includes('shinkansen')) {
            return 'transport';
        }
        if (lowerText.includes('hotel') || lowerText.includes('ryokan') || lowerText.includes('accommodation') || lowerText.includes('check-in')) {
            return 'accommodation';
        }
        if (lowerText.includes('ceremony') || lowerText.includes('experience') || lowerText.includes('tour')) {
            return 'experience';
        }
        return 'attraction';
    };

    // Helper function to extract location from activity text
    const extractLocation = (text: string, region: string): TransportLocation => {
        const lowerText = text.toLowerCase();
        
        // Common Tokyo areas
        const tokyoAreas = {
            'shibuya': { area: 'Shibuya', station: 'Shibuya Station', ward: 'Shibuya-ku' },
            'shinjuku': { area: 'Shinjuku', station: 'Shinjuku Station', ward: 'Shinjuku-ku' },
            'harajuku': { area: 'Harajuku', station: 'Harajuku Station', ward: 'Shibuya-ku' },
            'ginza': { area: 'Ginza', station: 'Ginza Station', ward: 'Chuo-ku' },
            'asakusa': { area: 'Asakusa', station: 'Asakusa Station', ward: 'Taito-ku' },
            'ueno': { area: 'Ueno', station: 'Ueno Station', ward: 'Taito-ku' },
            'akihabara': { area: 'Akihabara', station: 'Akihabara Station', ward: 'Chiyoda-ku' },
            'tokyo station': { area: 'Marunouchi', station: 'Tokyo Station', ward: 'Chiyoda-ku' },
            'roppongi': { area: 'Roppongi', station: 'Roppongi Station', ward: 'Minato-ku' },
            'tsukiji': { area: 'Tsukiji', station: 'Tsukiji Station', ward: 'Chuo-ku' },
        };
        
        // Common Kyoto/Osaka areas
        const kansaiAreas = {
            'gion': { area: 'Gion', station: 'Gion-Shijo Station', ward: 'Higashiyama-ku' },
            'arashiyama': { area: 'Arashiyama', station: 'Arashiyama Station', ward: 'Ukyo-ku' },
            'fushimi': { area: 'Fushimi', station: 'Fushimi-Inari Station', ward: 'Fushimi-ku' },
            'kiyomizu': { area: 'Higashiyama', station: 'Kiyomizu-Gojo Station', ward: 'Higashiyama-ku' },
            'dotonbori': { area: 'Dotonbori', station: 'Namba Station', ward: 'Chuo-ku' },
            'namba': { area: 'Namba', station: 'Namba Station', ward: 'Chuo-ku' },
            'osaka castle': { area: 'Osaka Castle', station: 'Osakajokoen Station', ward: 'Chuo-ku' },
            'umeda': { area: 'Umeda', station: 'Umeda Station', ward: 'Kita-ku' },
        };
        
        const allAreas = region.toLowerCase().includes('kanto') ? tokyoAreas : 
                        region.toLowerCase().includes('kansai') ? kansaiAreas : 
                        { ...tokyoAreas, ...kansaiAreas };
        
        // Find matching area
        for (const [key, location] of Object.entries(allAreas)) {
            if (lowerText.includes(key)) {
                return {
                    name: location.area,
                    area: location.area,
                    ward: location.ward,
                    station: location.station
                };
            }
        }
        
        // Default location
        return {
            name: region,
            area: region,
            station: region + ' Station'
        };
    };

    // Helper function to detect transport method
    const detectTransportMethod = (fromLocation: string, toLocation: string, region: string): TransportMethod => {
        const isInterRegion = fromLocation.toLowerCase().includes('tokyo') && toLocation.toLowerCase().includes('kyoto') ||
                             fromLocation.toLowerCase().includes('kyoto') && toLocation.toLowerCase().includes('tokyo');
        
        if (isInterRegion) {
            return {
                type: 'shinkansen',
                line: 'Tokaido Shinkansen',
                duration: 160, // ~2h 40min
                cost: 13000,
                instructions: `Take Tokaido Shinkansen from ${fromLocation} to ${toLocation} (2h 40min)`
            };
        }
        
        // Default local transport
        return {
            type: 'train',
            line: 'JR Yamanote Line',
            duration: 20,
            cost: 200,
            instructions: `Take train from ${fromLocation} to ${toLocation} (20 min)`
        };
    };

    // Helper function to get activity icon
    const getActivityIcon = (type: TimelineActivity['type'], text: string): string => {
        const lowerText = text.toLowerCase();
        
        switch (type) {
            case 'meal':
                if (lowerText.includes('sushi')) return '🍣';
                if (lowerText.includes('ramen')) return '🍜';
                if (lowerText.includes('tempura')) return '🍤';
                if (lowerText.includes('tea')) return '🍵';
                return '🍽️';
            case 'transport':
                if (lowerText.includes('shinkansen')) return '🚄';
                if (lowerText.includes('train')) return '🚃';
                return '🚌';
            case 'accommodation':
                if (lowerText.includes('ryokan')) return '🏯';
                return '🏨';
            case 'experience':
                if (lowerText.includes('tea ceremony')) return '🍵';
                if (lowerText.includes('meditation')) return '🧘';
                return '✨';
            case 'attraction':
                if (lowerText.includes('temple')) return '⛩️';
                if (lowerText.includes('shrine')) return '🏮';
                if (lowerText.includes('castle')) return '🏯';
                if (lowerText.includes('garden')) return '🌸';
                if (lowerText.includes('mountain') || lowerText.includes('fuji')) return '🗻';
                if (lowerText.includes('market')) return '🏪';
                if (lowerText.includes('museum')) return '🏛️';
                return '📍';
            default:
                return '📍';
        }
    };

    // Helper function to estimate cost
    const estimateCost = (text: string, type: TimelineActivity['type']): number => {
        const lowerText = text.toLowerCase();
        
        switch (type) {
            case 'meal':
                if (lowerText.includes('expensive') || lowerText.includes('fine dining')) return 8000;
                if (lowerText.includes('cheap') || lowerText.includes('street food')) return 1000;
                return 3000; // Average meal
            case 'transport':
                if (lowerText.includes('shinkansen')) return 8000;
                if (lowerText.includes('train')) return 500;
                return 300;
            case 'accommodation':
                if (lowerText.includes('luxury') || lowerText.includes('ryokan')) return 15000;
                return 8000;
            case 'experience':
                return 2000;
            case 'attraction':
                if (lowerText.includes('free')) return 0;
                return 1500;
            default:
                return 1000;
        }
    };

    // Helper function to get or create a day
    const getOrCreateDay = (dayNumber: number): TimelineDay => {
        if (daysMap.has(dayNumber)) {
            return daysMap.get(dayNumber)!;
        }
        
        // Calculate which region this day belongs to
        let totalDaysProcessed = 0;
        let targetRegionIndex = 0;
        
        for (let i = 0; i < formData.regions.length; i++) {
            if (dayNumber <= totalDaysProcessed + formData.regions[i].days) {
                targetRegionIndex = i;
                break;
            }
            totalDaysProcessed += formData.regions[i].days;
        }
        
        const region = formData.regions[targetRegionIndex]?.region || formData.regions[0].region;
        
        const newDay: TimelineDay = {
            dayNumber,
            region,
            activities: [],
            totalCost: 0
        };
        
        daysMap.set(dayNumber, newDay);
        console.log(`🗾 Created Day ${dayNumber} for region: ${region.name}`);
        return newDay;
    };

    let currentTime = 9; // Start at 9 AM

    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip empty lines, headers, and introduction text
        if (!trimmedLine || 
            trimmedLine.startsWith('#') || 
            trimmedLine.startsWith('**') || 
            trimmedLine.length < 5 ||
            trimmedLine.toLowerCase().includes('this itinerary') ||
            trimmedLine.toLowerCase().includes('adjust activities') ||
            trimmedLine.toLowerCase().includes('jr pass') ||
            trimmedLine.toLowerCase().includes('all costs are estimates') ||
            trimmedLine.toLowerCase().includes('purchase in advance')) {
            console.log('⏭️ Skipping line:', trimmedLine.substring(0, 50));
            continue;
        }

        // Detect day headers - more strict pattern matching
        const dayMatch = trimmedLine.match(/^Day\s*(\d+)(?:\s*[:\-]|$)/i);
        if (dayMatch) {
            foundAnyDayHeaders = true;
            console.log('📅 Found day header:', trimmedLine);
            
            // Use the detected day number from the text
            const detectedDayNumber = parseInt(dayMatch[1]);
            
            // Only accept day numbers within expected range
            if (detectedDayNumber >= 1 && detectedDayNumber <= formData.totalDuration) {
                currentDayNumber = detectedDayNumber;
                console.log(`✅ Valid day number: ${currentDayNumber}`);
                
                // Ensure this day exists (create if needed)
                getOrCreateDay(currentDayNumber);
                
                currentTime = 9; // Reset time for new day
            } else {
                console.log(`❌ Invalid day number: ${detectedDayNumber}, expected 1-${formData.totalDuration}`);
            }
            continue;
        }

        // Extract activities - better filtering
        if (trimmedLine.match(/^[•\-\*\d+\.\s]*[A-Za-z]/)) {
            console.log('📝 Checking potential activity line:', trimmedLine.substring(0, 80));
            
            // First check if the raw line is intro text
            if (isIntroductionText(trimmedLine)) {
                console.log('⏭️ Skipping boring/intro text (raw):', trimmedLine.substring(0, 50));
                continue;
            }
            
            // Get or create the current day
            const currentDay = getOrCreateDay(currentDayNumber);

            // Clean the activity text - more flexible cleaning
            let activityText = trimmedLine
                .replace(/^[•\-\*\d+\.\s\(\)]+/, '') // Remove bullets, numbers, spaces, parentheses
                .replace(/^\s*[-•*]\s*/, '') // Remove additional bullet patterns
                .trim();
            
            console.log('🧹 Cleaned activity text:', activityText.substring(0, 80));
            
            // Skip if this looks like introduction/summary text
            if (isIntroductionText(activityText)) {
                console.log('⏭️ Skipping boring/intro text (cleaned):', activityText.substring(0, 50));
                continue;
            }
            
            if (activityText.length > 10) { // Only process meaningful activities
                console.log(`🎯 Adding activity to Day ${currentDayNumber}:`, activityText.substring(0, 50) + '...');
                
                const activityType = detectActivityType(activityText);
                const duration = estimateDuration(activityText);
                const cost = estimateCost(activityText, activityType);
                const icon = getActivityIcon(activityType, activityText);
                
                // Extract or generate time
                let startTime = extractTime(activityText);
                if (startTime === '09:00') {
                    // Use incremental time based on activities already in this day
                    const activitiesInDay = currentDay.activities.length;
                    const timeOffset = activitiesInDay * 2; // 2 hours between activities
                    const activityTime = 9 + timeOffset;
                    startTime = `${Math.min(activityTime, 23).toString().padStart(2, '0')}:00`;
                }

                // Extract location and transport info
                const currentLocation = extractLocation(activityText, currentDay.region.name);
                
                // Determine transport to next activity (if this isn't the last activity)
                let transportMethod: TransportMethod | undefined;
                let nextLocation: TransportLocation | undefined;
                
                if (currentDay.activities.length > 0) {
                    const previousActivity = currentDay.activities[currentDay.activities.length - 1];
                    if (previousActivity.currentLocation) {
                        transportMethod = detectTransportMethod(
                            previousActivity.currentLocation.area,
                            currentLocation.area,
                            currentDay.region.name
                        );
                    }
                }

                const activity: TimelineActivity = {
                    id: `activity-${currentDayNumber}-${currentDay.activities.length}`,
                    name: activityText.replace(/\([^)]*\)/g, '').trim(), // Remove parentheses
                    description: activityText,
                    startTime,
                    duration,
                    type: activityType,
                    icon,
                    estimatedCost: cost,
                    currentLocation,
                    transportMethod,
                    location: `${currentLocation.area}, ${currentLocation.ward || currentLocation.name}`
                };

                currentDay.activities.push(activity);
                // Recalculate total cost from all activities to ensure accuracy
                currentDay.totalCost = currentDay.activities.reduce((sum, act) => sum + (act.estimatedCost || 0), 0);
                
                // Auto-advance to next day if we have too many activities for one day
                // This helps when the AI doesn't provide clear day breaks
                if (currentDay.activities.length >= 10 && currentDayNumber < formData.totalDuration) {
                    console.log(`🔄 Auto-advancing from Day ${currentDayNumber} to Day ${currentDayNumber + 1} after ${currentDay.activities.length} activities`);
                    currentDayNumber++;
                    currentTime = 9;
                }
            }
        }
    }

    // Convert map to array and ensure we have all expected days
    const expectedDays = formData.totalDuration;
    console.log(`🎯 Ensuring exactly ${expectedDays} days exist`);
    
    // Clear any invalid days and ensure only expected days exist
    const validDaysMap = new Map<number, TimelineDay>();
    
    // Create exactly the expected number of days (1 to totalDuration)
    for (let dayNum = 1; dayNum <= expectedDays; dayNum++) {
        if (daysMap.has(dayNum)) {
            // Use existing day with activities
            validDaysMap.set(dayNum, daysMap.get(dayNum)!);
            console.log(`✅ Day ${dayNum}: ${daysMap.get(dayNum)!.activities.length} activities`);
        } else {
            // Create empty day manually
            let totalDaysProcessed = 0;
            let targetRegionIndex = 0;
            
            for (let i = 0; i < formData.regions.length; i++) {
                if (dayNum <= totalDaysProcessed + formData.regions[i].days) {
                    targetRegionIndex = i;
                    break;
                }
                totalDaysProcessed += formData.regions[i].days;
            }
            
            const region = formData.regions[targetRegionIndex]?.region || formData.regions[0].region;
            
            const emptyDay: TimelineDay = {
                dayNumber: dayNum,
                region,
                activities: [],
                totalCost: 0
            };
            
            validDaysMap.set(dayNum, emptyDay);
            console.log(`➕ Created empty Day ${dayNum} for ${region.name}`);
        }
    }
    
    // Convert to sorted array - only valid days
    const days = Array.from(validDaysMap.values()).sort((a, b) => a.dayNumber - b.dayNumber);
    
    console.log(`📊 Final result: ${days.length} days (expected: ${expectedDays})`);
    if (days.length !== expectedDays) {
        console.error(`❌ Day count mismatch! Got ${days.length}, expected ${expectedDays}`);
    }
    
    days.forEach(day => {
        console.log(`Day ${day.dayNumber}: ${day.activities.length} activities in ${day.region.name}, cost: ¥${day.totalCost}`);
    });

    return {
        days,
        totalDuration: formData.totalDuration,
        regions: formData.regions,
        travelStyle: formData.travelStyle,
        season: formData.season
    };
}