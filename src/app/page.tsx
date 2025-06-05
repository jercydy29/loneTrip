'use client';
import { useState } from 'react';
import TravelForm from '@/components/TravelForm';
import MapView from '@/components/MapView';
import { TravelFormData } from '@/types/travel';
export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [tripData, setTripData] = useState<TravelFormData | null>(null);
    const [itinerary, setItinerary] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleTravelFormSubmit = async (data: TravelFormData) => {
        console.log('🎉 Form submitted with data:', data);
        setIsLoading(true);
        setTripData(data);
        setError(null);

        try {
            const response = await fetch('/api/generate-itinerary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to generate itinerary');
            }

            setItinerary(result.itinerary);
            console.log('✅ Trip planning completed!');
        } catch (error) {
            console.error('❌ Error planning trip:', error);
            setError(error instanceof Error ? error.message : 'Failed to generate itinerary');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <TravelForm
                onSubmit={handleTravelFormSubmit}
                isLoading={isLoading}
            />

            <div className="flex-1 relative">
                {!tripData ? (
                    <div className="h-full">
                        <MapView />
                    </div>
                ) : (
                    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                        <div className="text-center p-8 max-w-2xl">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                Your Trip is Being Planned!
                            </h2>

                            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                                    Trip Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <span className="font-medium text-gray-600">From:</span>
                                        <p className="text-lg">{tripData.origin}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">To:</span>
                                        <p className="text-lg">{tripData.destination}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Duration:</span>
                                        <p className="text-lg">{tripData.duration} days</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Budget:</span>
                                        <p className="text-lg">${tripData.budget.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-gray-600">
                                        Creating your personalized itinerary...
                                    </p>
                                </div>
                            ) : error ? (
                                <div className="space-y-4">
                                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                                    <p className="text-xl font-semibold text-red-700">
                                        Oops! Something went wrong
                                    </p>
                                    <p className="text-red-600 text-sm">
                                        {error}
                                    </p>
                                    <button 
                                        onClick={() => setError(null)}
                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : itinerary ? (
                                <div className="space-y-4 max-w-4xl">
                                    <div className="text-green-600 text-5xl mb-4">✅</div>
                                    <p className="text-xl font-semibold text-gray-700">
                                        Your itinerary is ready!
                                    </p>
                                    <div className="bg-white rounded-lg shadow-lg p-6 text-left max-h-96 overflow-y-auto">
                                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                                            {itinerary}
                                        </pre>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-blue-600 text-5xl mb-4">🎉</div>
                                    <p className="text-xl font-semibold text-gray-700">
                                        Ready to generate your itinerary!
                                    </p>
                                    <p className="text-gray-600">
                                        Click &quot;Plan My Adventure!&quot; to get started.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}