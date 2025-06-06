'use client';
import { useEffect, useRef, useState } from 'react';

interface MapViewProps {
    center?: google.maps.LatLngLiteral;
    zoom?: number;
    className?: string;
    origin?: string;
    destination?: string;
}

export default function MapView({
    center = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
    zoom = 10,
    className = "w-full h-full",
    origin,
    destination
}: MapViewProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);
    const originMarkerRef = useRef<google.maps.Marker | null>(null);
    const destinationMarkerRef = useRef<google.maps.Marker | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            return new Promise<void>((resolve, reject) => {
                if (window.google && window.google.maps) {
                    console.log('Google Maps already loaded');
                    resolve();
                    return;
                }

                const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
                if (!apiKey) {
                    reject(new Error('Google Maps API key not found'));
                    return;
                }

                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
                script.async = true;
                script.defer = true;
                
                script.onload = () => {
                    console.log('Google Maps script loaded successfully');
                    resolve();
                };
                
                script.onerror = () => {
                    reject(new Error('Failed to load Google Maps script'));
                };

                document.head.appendChild(script);
            });
        };

        const initMap = async () => {
            try {
                console.log('Starting map initialization...');
                
                await loadGoogleMapsScript();

                // Wait a bit for the DOM to be ready
                setTimeout(() => {
                    if (mapRef.current && window.google) {
                        console.log('Creating map instance...');
                        const map = new window.google.maps.Map(mapRef.current, {
                            center,
                            zoom,
                            mapTypeControl: true,
                            streetViewControl: true,
                            fullscreenControl: true,
                            zoomControl: true,
                            styles: [
                                {
                                    featureType: 'poi.business',
                                    stylers: [{ visibility: 'on' }]
                                }
                            ]
                        });

                        mapInstanceRef.current = map;
                        geocoderRef.current = new window.google.maps.Geocoder();
                        console.log('Map created successfully');
                        setIsLoading(false);
                    } else {
                        console.error(`Map initialization failed: mapRef=${!!mapRef.current}, google=${!!window.google}`);
                        setError(`Map initialization failed: mapRef=${!!mapRef.current}, google=${!!window.google}`);
                        setIsLoading(false);
                    }
                }, 100);
            } catch (err) {
                console.error('Detailed error loading map:', err);
                setError(`Failed to load map: ${err instanceof Error ? err.message : 'Unknown error'}`);
                setIsLoading(false);
            }
        };

        // Use a small delay to ensure the DOM is ready
        const timer = setTimeout(initMap, 100);
        return () => clearTimeout(timer);
    }, [center, zoom]);

    // Handle geocoding and map updates for origin/destination
    useEffect(() => {
        const geocodeAndUpdateMap = async (address: string, isOrigin: boolean) => {
            if (!geocoderRef.current || !mapInstanceRef.current || !address.trim()) {
                return;
            }

            try {
                const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
                    geocoderRef.current!.geocode({ address }, (results, status) => {
                        if (status === 'OK' && results) {
                            resolve(results);
                        } else {
                            reject(new Error(`Geocoding failed: ${status}`));
                        }
                    });
                });

                if (results.length > 0) {
                    const location = results[0].geometry.location;
                    const position = { lat: location.lat(), lng: location.lng() };

                    // Pan to the location
                    mapInstanceRef.current.panTo(position);
                    mapInstanceRef.current.setZoom(8);

                    // Clear existing marker
                    if (isOrigin) {
                        if (originMarkerRef.current) {
                            originMarkerRef.current.setMap(null);
                        }
                        // Create new origin marker
                        originMarkerRef.current = new window.google.maps.Marker({
                            position,
                            map: mapInstanceRef.current,
                            title: `Origin: ${address}`,
                            icon: {
                                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="green" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3" fill="white"/>
                  </svg>
                `),
                                scaledSize: new window.google.maps.Size(32, 32)
                            }
                        });
                    } else {
                        if (destinationMarkerRef.current) {
                            destinationMarkerRef.current.setMap(null);
                        }
                        // Create new destination marker
                        destinationMarkerRef.current = new window.google.maps.Marker({
                            position,
                            map: mapInstanceRef.current,
                            title: `Destination: ${address}`,
                            icon: {
                                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="red" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3" fill="white"/>
                  </svg>
                `),
                                scaledSize: new window.google.maps.Size(32, 32)
                            }
                        });
                    }
                }
            } catch (error) {
                console.error(`Error geocoding ${isOrigin ? 'origin' : 'destination'}:`, error);
            }
        };

        // Debounce the geocoding requests
        const debounceTimer = setTimeout(() => {
            if (origin) {
                geocodeAndUpdateMap(origin, true);
            }
            if (destination) {
                geocodeAndUpdateMap(destination, false);
            }
        }, 1000); // Wait 1 second after user stops typing

        return () => clearTimeout(debounceTimer);
    }, [origin, destination]);

    if (error) {
        return (
            <div className={`${className} flex items-center justify-center bg-gray-100`}>
                <div className="text-center p-8">
                    <div className="text-red-500 text-4xl mb-4">🗺️</div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Map Unavailable</h3>
                    <p className="text-gray-600 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${className} relative`}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="text-center">
                        <div className="w-8 h-8 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600">Loading map...</p>
                    </div>
                </div>
            )}
            <div ref={mapRef} className={className} />
        </div>
    );
}