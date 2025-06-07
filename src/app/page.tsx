'use client';
import { useState } from 'react';
import JapanTravelForm from '@/components/JapanTravelForm';
import TimelineView from '@/components/TimelineView';
import { JapanTravelFormData, JapanTimeline } from '@/types/travel';
import { parseItineraryToTimeline } from '@/lib/itineraryParser';

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [tripData, setTripData] = useState<JapanTravelFormData | null>(null);
    const [itinerary, setItinerary] = useState<string | null>(null);
    const [timeline, setTimeline] = useState<JapanTimeline | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleJapanTravelFormSubmit = async (data: JapanTravelFormData) => {
        console.log('🇯🇵 Japan journey submitted:', data);
        setIsLoading(true);
        setTripData(data);
        setError(null);

        try {
            const response = await fetch('/api/generate-japan-itinerary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                const errorMessage = result.error || 'Failed to generate Japan itinerary';
                const errorDetails = result.details || '';
                throw new Error(`${errorMessage}${errorDetails ? ` (${errorDetails})` : ''}`);
            }

            setItinerary(result.itinerary);
            
            // Parse the itinerary into timeline format
            const parsedTimeline = parseItineraryToTimeline(result.itinerary, data);
            setTimeline(parsedTimeline);
            
            console.log('✅ Japan journey planning completed!');
        } catch (error) {
            console.error('❌ Error planning Japan journey:', error);
            setError(error instanceof Error ? error.message : 'Failed to generate Japan itinerary');
        } finally {
            setIsLoading(false);
        }
    };

    if (!tripData) {
        return (
            <JapanTravelForm
                onSubmit={handleJapanTravelFormSubmit}
                isLoading={isLoading}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl font-light text-gray-800 mb-4">
                        <span className="text-red-600">日</span>本 Journey
                    </h1>
                    <p className="text-lg text-gray-600 font-light">
                        Your personalized Japan experience
                    </p>
                </div>

                {/* Trip Summary */}
                <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
                    <h2 className="text-2xl font-light text-gray-800 mb-6 text-center">
                        Your Japan Journey
                    </h2>
                    
                    <div className="space-y-6">
                        {/* Multiple Regions Display */}
                        <div>
                            <h3 className="font-medium text-gray-800 mb-3">
                                Your Journey ({tripData.totalDuration} days total):
                            </h3>
                            <div className="space-y-3">
                                {tripData.regions.map((regionWithDays) => (
                                    <div key={regionWithDays.region.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xl">{regionWithDays.region.icon}</span>
                                            <div>
                                                <span className="font-medium text-gray-800">
                                                    {regionWithDays.region.name}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-2">
                                                    ({regionWithDays.region.nameJapanese})
                                                </span>
                                            </div>
                                        </div>
                                        <span className="font-medium text-red-600">
                                            {regionWithDays.days} day{regionWithDays.days !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Travel Style & Season */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tripData.travelStyle && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Style:</span>
                                    <span className="font-medium flex items-center space-x-2">
                                        <span>{tripData.travelStyle.icon}</span>
                                        <span>{tripData.travelStyle.name}</span>
                                    </span>
                                </div>
                            )}
                            {tripData.season && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Season:</span>
                                    <span className="font-medium">{tripData.season.name} ({tripData.season.nameJapanese})</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="text-center">
                    {isLoading ? (
                        <div className="space-y-6">
                            <div className="w-16 h-16 mx-auto border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                            <div>
                                <h3 className="text-xl font-light text-gray-800 mb-2">
                                    Crafting your perfect Japan experience...
                                </h3>
                                <p className="text-gray-600">
                                    Considering local culture, seasonal highlights, and your preferences
                                </p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="space-y-6">
                            <div className="text-red-500 text-6xl">🚫</div>
                            <div className="max-w-md mx-auto">
                                <h3 className="text-xl font-light text-red-700 mb-4">
                                    AI Service Unavailable
                                </h3>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                    <p className="text-red-700 text-sm mb-2">{error}</p>
                                    <div className="text-xs text-red-600">
                                        <p className="mb-1">• The Gemini AI service may be temporarily down</p>
                                        <p className="mb-1">• Your API quota may have been exceeded</p>
                                        <p>• There may be a network connectivity issue</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => {
                                            setError(null);
                                            // Retry with same data
                                            if (tripData) {
                                                handleJapanTravelFormSubmit(tripData);
                                            }
                                        }}
                                        className="w-full px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setError(null);
                                            setTripData(null);
                                        }}
                                        className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        Start Over
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : itinerary ? (
                        <div className="space-y-6">
                            <div className="text-6xl mb-4">🌸</div>
                            <div>
                                <h3 className="text-2xl font-light text-gray-800 mb-4">
                                    Your Japan Itinerary is Ready!
                                </h3>
                                
                                {timeline ? (
                                    <div className="w-full">
                                        <TimelineView 
                                            timeline={timeline} 
                                            onTimelineUpdate={(updatedTimeline) => setTimeline(updatedTimeline)}
                                        />
                                    </div>
                                ) : null}
                                <div className="mt-6">
                                    <button 
                                        onClick={() => {
                                            setItinerary(null);
                                            setTimeline(null);
                                            setTripData(null);
                                        }}
                                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        Plan Another Journey
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-6xl">🎌</div>
                            <div>
                                <h3 className="text-xl font-light text-gray-800 mb-2">
                                    Ready to explore Japan!
                                </h3>
                                <p className="text-gray-600">
                                    Your journey details look perfect
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}