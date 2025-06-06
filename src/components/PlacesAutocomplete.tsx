'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface PlacesAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    className?: string;
    name: string;
}

export default function PlacesAutocomplete({ 
    value, 
    onChange, 
    placeholder, 
    className = '', 
    name 
}: PlacesAutocompleteProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const initAutocomplete = async () => {
            try {
                // Check if Google Maps is already loaded
                if (typeof window !== 'undefined' && window.google && window.google.maps) {
                    setIsLoaded(true);
                    initGoogleAutocomplete();
                    return;
                }

                const loader = new Loader({
                    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
                    version: 'weekly',
                    libraries: ['places']
                });

                await loader.load();
                setIsLoaded(true);
                initGoogleAutocomplete();
            } catch (error) {
                console.error('Error loading Google Maps API:', error);
            }
        };

        const initGoogleAutocomplete = () => {
            if (inputRef.current && !autocompleteRef.current && window.google) {
                autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
                    types: ['(cities)'],
                    fields: ['formatted_address', 'geometry', 'name']
                });

                autocompleteRef.current.addListener('place_changed', () => {
                    const place = autocompleteRef.current?.getPlace();
                    if (place?.formatted_address) {
                        onChange(place.formatted_address);
                    }
                });

                // Prevent form submission when Enter is pressed on autocomplete
                inputRef.current.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        // Let the autocomplete handle the selection
                        setTimeout(() => {
                            const place = autocompleteRef.current?.getPlace();
                            if (place?.formatted_address) {
                                onChange(place.formatted_address);
                            }
                        }, 100);
                    }
                });
            }
        };

        initAutocomplete();

        return () => {
            if (autocompleteRef.current && window.google) {
                google.maps.event.clearInstanceListeners(autocompleteRef.current);
            }
        };
    }, [onChange]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Don't handle Enter here - let the Google Places autocomplete handle it
        }
    };

    return (
        <input
            ref={inputRef}
            name={name}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={className}
            autoComplete="off"
        />
    );
}