// ===== PART 1: IMPORTS (Getting Our Tools) =====
'use client';                    // 🎯 Tells Next.js this runs in the browser
import { useState } from 'react'; // 🧠 Tool for remembering things
import TravelForm from '@/components/TravelForm'; // 🗂️ Our beautiful form component

/*
🤔 WHY THESE IMPORTS?
- 'use client': Like putting a "browser only" sticker on our code
- useState: Think of it as the app's memory - remembers form data
- TravelForm: The sidebar component we built earlier
*/

// ===== PART 2: TYPE DEFINITION (The Rules) =====
interface TravelFormData {
    origin: string;        // 📍 Where they start (text)
    destination: string;   // 🎯 Where they want to go (text)  
    duration: number;      // 📅 How many days (number)
    budget: number;        // 💰 How much money (number)
}

/*
🤔 WHY THIS INTERFACE?
Think of it like a form template that says:
"Any travel data MUST have these 4 things, and they must be these types"
TypeScript uses this to catch mistakes before they happen!
*/

// ===== PART 3: THE MAIN COMPONENT (The Director) =====
export default function Home() {

    // === PART 3A: STATE VARIABLES (The App's Memory) ===
    const [isLoading, setIsLoading] = useState(false);
    const [tripData, setTripData] = useState<TravelFormData | null>(null);

    /*
    🧠 WHAT IS useState?
    Think of useState like having two things:
    1. A box to store something (isLoading, tripData)
    2. A way to change what's in the box (setIsLoading, setTripData)
    
    🎯 WHAT THESE STORE:
    - isLoading: true/false - "Are we currently processing the trip?"
    - tripData: Either trip information OR null (empty)
    
    📱 REAL-LIFE ANALOGY:
    Like having a notepad where you write:
    - "Currently working: Yes/No"
    - "Trip details: [either the details or 'nothing yet']"
    */

    // === PART 3B: THE EVENT HANDLER (What Happens When Form Submits) ===
    const handleTravelFormSubmit = async (data: TravelFormData) => {
        console.log('🎉 Form submitted with data:', data);

        // Step 1: Remember we're now loading
        setIsLoading(true);
        // Step 2: Save the trip data 
        setTripData(data);

        // Step 3: Simulate processing (fake API call for now)
        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
            console.log('✅ Trip planning completed!');
        } catch (error) {
            console.error('❌ Error planning trip:', error);
        } finally {
            // Step 4: We're done loading
            setIsLoading(false);
        }
    };

    /*
    🎬 WHAT HAPPENS HERE STEP-BY-STEP:
    
    1. User fills form and clicks "Plan My Adventure!"
    2. This function receives the form data
    3. We set isLoading = true (shows loading animation)
    4. We save the data to tripData (so we can display it)
    5. We fake an API call (2 second delay)
    6. We set isLoading = false (hides loading animation)
    
    🔗 CONNECTION TO FORM:
    We'll GIVE this function TO our TravelForm component
    When the form is submitted, it will CALL this function
    */

    // === PART 3C: THE RENDER (What Users See) ===
    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* LEFT SIDE: Our Travel Form */}
            <TravelForm
                onSubmit={handleTravelFormSubmit}  // 🔗 Give the form our function
                isLoading={isLoading}              // 🔗 Tell form if we're loading
            />

            {/* RIGHT SIDE: Map Area (changes based on state) */}
            <div className="flex-1 relative">
                <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">

                    {/* CONDITIONAL RENDERING: Show different things based on tripData */}
                    {!tripData ? (

                        // === SCENARIO 1: No trip data yet (initial state) ===
                        <div className="text-center p-8">
                            <div className="w-32 h-32 mx-auto mb-6 bg-blue-200 rounded-full flex items-center justify-center">
                                <span className="text-4xl">🗺️</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-700 mb-4">
                                Ready for Your Adventure?
                            </h2>
                            <p className="text-gray-600 max-w-md">
                                Fill out the form on the left to start planning your perfect trip.
                                We'll show you the route and create a personalized itinerary!
                            </p>
                        </div>

                    ) : (

                        // === SCENARIO 2: We have trip data ===
                        <div className="text-center p-8 max-w-2xl">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                Your Trip is Being Planned!
                            </h2>

                            {/* Display the trip details */}
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

                            {/* Show different content based on loading state */}
                            {isLoading ? (

                                // === SUB-SCENARIO 2A: Still processing ===
                                <div className="space-y-4">
                                    <div className="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-gray-600">
                                        Creating your personalized itinerary...
                                    </p>
                                </div>

                            ) : (

                                // === SUB-SCENARIO 2B: Processing complete ===
                                <div className="space-y-4">
                                    <div className="text-green-600 text-6xl mb-4"></div>
                                    <p className="text-xl font-semibold text-gray-700">
                                        Your itinerary is ready!
                                    </p>
                                    <p className="text-gray-600">
                                        (Map and itinerary features coming next!)
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}