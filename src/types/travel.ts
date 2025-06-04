export interface TravelFormData {
    origin: string;
    destination: string;
    duration: number; // days
    budget: number;
}

export interface Location {
    lat: number;
    lng: number;
    address: string;
}

export interface DayItinerary {
    day: number;
    places: Place[];
    accommodation: Place[];
    restaurants: Place[];
}

export interface Place {
    name: string;
    description: string;
    location: Location;
    estimatedCost: number;
    rating?: number;
}