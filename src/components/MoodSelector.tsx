'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TravelMood } from '@/types/travel';

interface MoodOption {
    id: TravelMood['primary'];
    emoji: string;
    label: string;
    description: string;
    color: string;
    bgColor: string;
}

const moodOptions: MoodOption[] = [
    {
        id: 'adventure',
        emoji: '🏔️',
        label: 'Adventure',
        description: 'Thrilling experiences and outdoor activities',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 hover:bg-orange-100'
    },
    {
        id: 'relaxation',
        emoji: '🏖️',
        label: 'Relaxation',
        description: 'Peaceful moments and stress-free experiences',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
        id: 'cultural',
        emoji: '🏛️',
        label: 'Cultural',
        description: 'Museums, history, and local traditions',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 hover:bg-purple-100'
    },
    {
        id: 'romantic',
        emoji: '💕',
        label: 'Romantic',
        description: 'Intimate moments and couple activities',
        color: 'text-pink-600',
        bgColor: 'bg-pink-50 hover:bg-pink-100'
    },
    {
        id: 'foodie',
        emoji: '🍽️',
        label: 'Foodie',
        description: 'Culinary adventures and local cuisine',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 hover:bg-yellow-100'
    },
    {
        id: 'nature',
        emoji: '🌿',
        label: 'Nature',
        description: 'Parks, wildlife, and natural wonders',
        color: 'text-green-600',
        bgColor: 'bg-green-50 hover:bg-green-100'
    },
    {
        id: 'urban',
        emoji: '🏙️',
        label: 'Urban',
        description: 'City vibes, nightlife, and modern attractions',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50 hover:bg-gray-100'
    },
    {
        id: 'wellness',
        emoji: '🧘',
        label: 'Wellness',
        description: 'Spa, meditation, and mindful experiences',
        color: 'text-teal-600',
        bgColor: 'bg-teal-50 hover:bg-teal-100'
    }
];

interface MoodSelectorProps {
    selectedMood?: TravelMood;
    onMoodChange: (mood: TravelMood) => void;
    className?: string;
}

export default function MoodSelector({ selectedMood, onMoodChange, className = '' }: MoodSelectorProps) {
    const [hoveredMood, setHoveredMood] = useState<string | null>(null);
    const [showIntensity, setShowIntensity] = useState(false);

    const handleMoodSelect = (moodOption: MoodOption) => {
        const newMood: TravelMood = {
            primary: moodOption.id,
            intensity: selectedMood?.intensity || 3,
            description: moodOption.description
        };
        onMoodChange(newMood);
        setShowIntensity(true);
    };

    const handleIntensityChange = (intensity: number) => {
        if (selectedMood) {
            onMoodChange({
                ...selectedMood,
                intensity: intensity as TravelMood['intensity']
            });
        }
    };

    const selectedMoodOption = moodOptions.find(option => option.id === selectedMood?.primary);

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    What&apos;s your travel mood?
                </h3>
                <p className="text-sm text-gray-600">
                    Choose the vibe that matches your ideal trip
                </p>
            </div>

            {/* Mood Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {moodOptions.map((mood) => (
                    <motion.button
                        key={mood.id}
                        type="button"
                        onClick={() => handleMoodSelect(mood)}
                        onMouseEnter={() => setHoveredMood(mood.id)}
                        onMouseLeave={() => setHoveredMood(null)}
                        className={`
                            relative p-4 rounded-lg border-2 transition-all duration-200
                            ${selectedMood?.primary === mood.id 
                                ? `border-${mood.color.split('-')[1]}-400 ${mood.bgColor} shadow-md` 
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }
                            ${mood.bgColor}
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="text-center">
                            <div className="text-2xl mb-2">{mood.emoji}</div>
                            <div className={`font-medium text-sm ${mood.color}`}>
                                {mood.label}
                            </div>
                        </div>

                        {/* Selection Indicator */}
                        <AnimatePresence>
                            {selectedMood?.primary === mood.id && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className={`absolute -top-1 -right-1 w-6 h-6 rounded-full bg-${mood.color.split('-')[1]}-500 flex items-center justify-center`}
                                >
                                    <div className="text-white text-xs">✓</div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Hover Description */}
                        <AnimatePresence>
                            {hoveredMood === mood.id && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-10"
                                >
                                    {mood.description}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                ))}
            </div>

            {/* Intensity Slider */}
            <AnimatePresence>
                {showIntensity && selectedMoodOption && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className={`p-4 rounded-lg ${selectedMoodOption.bgColor} border border-gray-200`}>
                            <div className="text-center mb-4">
                                <h4 className={`font-medium ${selectedMoodOption.color}`}>
                                    How intense should your {selectedMoodOption.label.toLowerCase()} experience be?
                                </h4>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs text-gray-600">
                                    <span>Mild</span>
                                    <span>Extreme</span>
                                </div>

                                <div className="relative">
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={selectedMood?.intensity || 3}
                                        onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
                                        className="slider-with-fill w-full"
                                        style={{
                                            accentColor: selectedMoodOption.color.includes('orange') ? '#ea580c' :
                                                        selectedMoodOption.color.includes('blue') ? '#2563eb' :
                                                        selectedMoodOption.color.includes('purple') ? '#7c3aed' :
                                                        selectedMoodOption.color.includes('pink') ? '#db2777' :
                                                        selectedMoodOption.color.includes('yellow') ? '#ca8a04' :
                                                        selectedMoodOption.color.includes('green') ? '#059669' :
                                                        selectedMoodOption.color.includes('gray') ? '#4b5563' :
                                                        selectedMoodOption.color.includes('teal') ? '#0d9488' :
                                                        '#3b82f6'
                                        }}
                                    />
                                    <div className="flex justify-between text-xs mt-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <span 
                                                key={i} 
                                                className={`
                                                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                                                    ${selectedMood?.intensity === i 
                                                        ? `${selectedMoodOption.color} ${selectedMoodOption.bgColor}` 
                                                        : 'text-gray-400'
                                                    }
                                                `}
                                            >
                                                {i}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center text-sm text-gray-600">
                                    Intensity Level: {selectedMood?.intensity || 3}/5
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Selected Mood Summary */}
            {selectedMood && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                    <span className="text-xl">{selectedMoodOption?.emoji}</span>
                    <span className="font-medium text-gray-800">
                        {selectedMoodOption?.label} Experience
                    </span>
                    <span className="text-sm text-gray-600">
                        (Intensity: {selectedMood.intensity}/5)
                    </span>
                </motion.div>
            )}
        </div>
    );
}