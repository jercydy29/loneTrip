'use client';
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

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
    const initMap = async () => {
      try {
        // Check if Google Maps API key is available
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          setError('Google Maps API key not found');
          setIsLoading(false);
          return;
        }

        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        const google = await loader.load();
        
        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
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
          geocoderRef.current = new google.maps.Geocoder();
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading map:', err);
        setError('Failed to load map');
        setIsLoading(false);
      }
    };

    initMap();
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
          mapInstanceRef.current.setZoom(12);

          // Clear existing marker
          if (isOrigin) {
            if (originMarkerRef.current) {
              originMarkerRef.current.setMap(null);
            }
            // Create new origin marker
            originMarkerRef.current = new google.maps.Marker({
              position,
              map: mapInstanceRef.current,
              title: `Origin: ${address}`,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                `),
                scaledSize: new google.maps.Size(32, 32)
              }
            });
          } else {
            if (destinationMarkerRef.current) {
              destinationMarkerRef.current.setMap(null);
            }
            // Create new destination marker
            destinationMarkerRef.current = new google.maps.Marker({
              position,
              map: mapInstanceRef.current,
              title: `Destination: ${address}`,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                `),
                scaledSize: new google.maps.Size(32, 32)
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