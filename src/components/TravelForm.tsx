'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PlaneIcon from './icons/PlaneIcon';
import MapPinIcon from './icons/MapPinIcon';
import CalendarIcon from './icons/CalendarIcon';
import MoneyIcon from './icons/MoneyIcon';

// Define the validation schema using Zod
const travelFormSchema = z.object({
    origin: z.string().min(2, 'Origin must be at least 2 characters'),
    destination: z.string().min(2, 'Destination must be at least 2 characters'),
    duration: z.number().min(1, 'Trip must be at least 1 day').max(30, 'Maximum 30 days'),
    budget: z.number().min(100, 'Budget must be at least $100').max(100000, 'Budget seems too high!')
});

// TypeScript type from our schema
type TravelFormData = z.infer<typeof travelFormSchema>;

// Props interface for our component
interface TravelFormProps {
    onSubmit: (data: TravelFormData) => void;
    isLoading?: boolean;
}

export default function TravelForm({ onSubmit, isLoading = false }: TravelFormProps) {
    // Set up the form with react-hook-form and zod validation
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch
    } = useForm<TravelFormData>({
        resolver: zodResolver(travelFormSchema),
        mode: 'onChange', // Validate as user types
        defaultValues: {
            duration: 7,
            budget: 2000
        }
    });

    // Watch form values for real-time updates
    const watchedValues = watch();

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
                    Tell us about your dream destination and we'll create the perfect itinerary! ✨
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
                    <input
                        {...register('origin')}
                        type="text"
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
                    <input
                        {...register('destination')}
                        type="text"
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
                        <input
                            {...register('duration', { valueAsNumber: true })}
                            type="range"
                            min="1"
                            max="30"
                            className="slider-with-fill w-full"
                        />
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
                        What's your budget?
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">$</span>
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
                    <p className="text-xs text-gray-500">
                        💡 Includes accommodation, food, activities, and transportation
                    </p>
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
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!isValid || isLoading}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${isValid && !isLoading
                            ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating Your Itinerary...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <span>🗺️</span>
                            Plan My Adventure!
                        </span>
                    )}
                </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                    Your personalized itinerary will include places to visit, stay, and eat! 🎉
                </p>
            </div>
        </div>
    );
}