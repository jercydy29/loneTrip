'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PlaneIcon from './icons/PlaneIcon';
import MapPinIcon from './icons/MapPinIcon';
import CalendarIcon from './icons/CalendarIcon';
import MoneyIcon from './icons/MoneyIcon';
import { TravelFormData } from '@/types/travel';
import PlacesAutocomplete from './PlacesAutocomplete';
import MoodSelector from './MoodSelector';

// Define the validation schema using Zod
const travelFormSchema = z.object({
    origin: z.string().min(2, 'Origin must be at least 2 characters'),
    destination: z.string().min(2, 'Destination must be at least 2 characters'),
    duration: z.number().min(1, 'Trip must be at least 1 day').max(30, 'Maximum 30 days'),
    budget: z.number().min(100, 'Budget must be at least $100').max(100000, 'Budget seems too high!')
});

// Props interface for our component
interface TravelFormProps {
    onSubmit: (data: TravelFormData) => void;
    onFormChange?: (origin: string, destination: string) => void;
    onInputFocus?: (inputType: 'origin' | 'destination' | null) => void;
    isLoading?: boolean;
}

export default function TravelForm({ onSubmit, onFormChange, onInputFocus, isLoading = false }: TravelFormProps) {
    // Set up the form with react-hook-form and zod validation
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        setValue
    } = useForm<TravelFormData>({
        resolver: zodResolver(travelFormSchema),
        mode: 'onChange', // Validate as user types
        defaultValues: {
            origin: '',
            destination: '',
            duration: 7,
            budget: 2000,
            mood: undefined
        }
    });

    // Watch form values for real-time updates
    const watchedValues = watch();

    // Effect to call onFormChange when origin or destination changes
    React.useEffect(() => {
        if (onFormChange && (watchedValues.origin || watchedValues.destination)) {
            onFormChange(watchedValues.origin || '', watchedValues.destination || '');
        }
    }, [watchedValues.origin, watchedValues.destination, onFormChange]);

    // Focus/blur handlers for input tracking
    const handleOriginFocus = React.useCallback(() => {
        onInputFocus?.('origin');
    }, [onInputFocus]);

    const handleDestinationFocus = React.useCallback(() => {
        onInputFocus?.('destination');
    }, [onInputFocus]);

    const handleInputBlur = React.useCallback(() => {
        // Debounced blur to handle quick focus switches
        setTimeout(() => {
            onInputFocus?.(null);
        }, 150);
    }, [onInputFocus]);

    return (
        <div className="w-96 h-screen bg-white shadow-2xl p-6 overflow-y-auto border-r border-gray-200">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <PlaneIcon className="w-12 h-12" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Plan Your Trip</h1>
                </div>
                <p className="text-gray-600 text-sm">
                    Tell us about your dream destination and we&apos;ll create the perfect itinerary! ✨
                </p>
            </div>

            {/* Form section */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Origin Input */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <MapPinIcon className="w-6 h-6" />
                        Where are you starting from?
                    </label>
                    <PlacesAutocomplete
                        name="origin"
                        value={watchedValues.origin || ''}
                        onChange={(value) => setValue('origin', value, { shouldValidate: true })}
                        onFocus={handleOriginFocus}
                        onBlur={handleInputBlur}
                        placeholder="e.g., New York, NY"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder-gray-400 ${errors.origin ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                    />
                    {errors.origin && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                            <span>⚠️</span> {errors.origin.message}
                        </p>
                    )}
                </div>

                {/* Destination Input */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <MapPinIcon className="w-6 h-6" />
                        Where do you want to go?
                    </label>
                    <PlacesAutocomplete
                        name="destination"
                        value={watchedValues.destination || ''}
                        onChange={(value) => setValue('destination', value, { shouldValidate: true })}
                        onFocus={handleDestinationFocus}
                        onBlur={handleInputBlur}
                        placeholder="e.g., Paris, France"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder-gray-400 ${errors.destination ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                    />
                    {errors.destination && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                            <span>⚠️</span> {errors.destination.message}
                        </p>
                    )}
                </div>

                {/* Duration Input */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <CalendarIcon className="w-6 h-6" />
                        How many days? ({watchedValues.duration} days)
                    </label>
                    <div className="relative">
                        <div className="slider-container">
                            <div
                                className="slider-fill"
                                style={{
                                    width: `${((watchedValues.duration || 7) - 1) / (30 - 1) * 100}%`
                                }}
                            />
                            <input
                                {...register('duration', { valueAsNumber: true })}
                                type="range"
                                min="1"
                                max="30"
                                className="slider-custom"
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>1 day</span>
                            <span>30 days</span>
                        </div>
                    </div>
                    {errors.duration && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                            <span>⚠️</span> {errors.duration.message}
                        </p>
                    )}
                </div>

                {/* Budget Input */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <MoneyIcon className="w-6 h-6" />
                        What&apos;s your budget?
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">$</span>
                        <input
                            {...register('budget', { valueAsNumber: true })}
                            type="number"
                            placeholder="e.g., 2000"
                            min="100"
                            max="100000"
                            step="100"
                            className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder-gray-400 ${errors.budget ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                        />
                    </div>
                    {errors.budget && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                            <span>⚠️</span> {errors.budget.message}
                        </p>
                    )}
                    <p className="text-xs text-gray-400">
                        Includes accommodation, food, activities, and transportation
                    </p>
                </div>

                {/* Mood Selector */}
                <div className="space-y-2">
                    <MoodSelector
                        selectedMood={watchedValues.mood}
                        onMoodChange={(mood) => setValue('mood', mood, { shouldValidate: true })}
                        className="w-full"
                    />
                </div>

                {/* Trip Summary Preview */}
                {isValid && watchedValues.origin && watchedValues.destination && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                        <h3 className="font-medium text-blue-900 flex items-center gap-2">
                            <span>📋</span> Trip Summary
                        </h3>
                        <div className="text-sm text-blue-800 space-y-1">
                            <p>
                                <strong>Route:</strong> {watchedValues.origin} → {watchedValues.destination}
                            </p>
                            <p>
                                <strong>Duration:</strong> {watchedValues.duration} days
                            </p>
                            <p>
                                <strong>Budget:</strong> ${watchedValues.budget?.toLocaleString()}
                            </p>
                            <p>
                                <strong>Daily Budget:</strong> ~$
                                {Math.round((watchedValues.budget || 0) / (watchedValues.duration || 1))}/day
                            </p>
                            {watchedValues.mood && (
                                <p>
                                    <strong>Travel Mood:</strong> {watchedValues.mood.primary} 
                                    (Intensity: {watchedValues.mood.intensity}/5)
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!isValid || isLoading}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                        !isValid || isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
                    }`}
                >
                    <span className="flex items-center justify-center gap-2">
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Creating Your Adventure...
                            </>
                        ) : (
                            <>
                                <span>✨</span>
                                Plan My Adventure!
                            </>
                        )}
                    </span>
                </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-400 text-center max-w-64 mx-auto">
                    Your personalized itinerary will include places to visit, stay, and eat!
                </p>
            </div>
        </div>
    );
}