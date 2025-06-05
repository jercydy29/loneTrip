'use client';
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapViewProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  className?: string;
}

export default function MapView({ 
  center = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  zoom = 10,
  className = "w-full h-full"
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
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
          libraries: ['places']
        });

        const google = await loader.load();
        
        if (mapRef.current) {
          new google.maps.Map(mapRef.current, {
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