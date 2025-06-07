'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TimelineActivity, TransportLocation, TransportMethod } from '@/types/travel';

interface TransportTrackerProps {
    currentActivity: TimelineActivity | null;
    nextActivity: TimelineActivity | null;
    currentDay: number;
    currentRegion: string;
}

export default function TransportTracker({ 
    currentActivity, 
    nextActivity, 
    currentDay, 
    currentRegion 
}: TransportTrackerProps) {
    
    const getTransportIcon = (method?: TransportMethod) => {
        if (!method) return '🚶';
        
        switch (method.type) {
            case 'train': return '🚃';
            case 'subway': return '🚇';
            case 'shinkansen': return '🚄';
            case 'bus': return '🚌';
            case 'taxi': return '🚕';
            case 'ferry': return '⛴️';
            case 'walk': return '🚶';
            default: return '🚶';
        }
    };

    const formatDuration = (minutes: number) => {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
        >
            <div className="max-w-6xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Current Location */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-lg">📍</span>
                            <div>
                                <div className="text-sm font-medium">
                                    Day {currentDay} • {currentRegion}
                                </div>
                                {currentActivity?.currentLocation && (
                                    <div className="text-xs opacity-90">
                                        Currently at: {currentActivity.currentLocation.area}
                                        {currentActivity.currentLocation.station && (
                                            <span className="ml-1">
                                                ({currentActivity.currentLocation.station})
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Transport Progress */}
                    {currentActivity?.transportMethod && nextActivity && (
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-full px-3 py-1">
                                <span className="text-lg">
                                    {getTransportIcon(currentActivity.transportMethod)}
                                </span>
                                <div className="text-xs">
                                    <div className="font-medium">
                                        {currentActivity.transportMethod.line || currentActivity.transportMethod.type}
                                    </div>
                                    <div className="opacity-90">
                                        {formatDuration(currentActivity.transportMethod.duration)} • ¥{currentActivity.transportMethod.cost}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-0.5 bg-white opacity-50"></div>
                                <span className="text-xs">→</span>
                                <div className="w-8 h-0.5 bg-white opacity-50"></div>
                            </div>
                            
                            <div className="text-xs">
                                <div className="font-medium">Next: {nextActivity.name}</div>
                                {nextActivity.currentLocation && (
                                    <div className="opacity-90">
                                        {nextActivity.currentLocation.area}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className="flex items-center space-x-4 text-xs">
                        {currentActivity && (
                            <div className="text-center">
                                <div className="font-medium">{currentActivity.startTime}</div>
                                <div className="opacity-90">Current</div>
                            </div>
                        )}
                        {nextActivity && (
                            <div className="text-center">
                                <div className="font-medium">{nextActivity.startTime}</div>
                                <div className="opacity-90">Next</div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Transport Instructions */}
                {currentActivity?.transportMethod?.instructions && (
                    <div className="mt-2 text-xs bg-white bg-opacity-10 rounded px-3 py-1">
                        🚇 {currentActivity.transportMethod.instructions}
                    </div>
                )}
            </div>
        </motion.div>
    );
}