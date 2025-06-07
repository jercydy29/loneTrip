'use client';

import React from 'react';
import { useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import { TimelineDay, TimelineActivity } from '@/types/travel';
import ActivityCard from './ActivityCard';

interface DayCardProps {
    day: TimelineDay;
    dayIndex: number;
    onMoveActivity: (activityId: string, fromDayIndex: number, toDayIndex: number, newTimeSlot?: string) => void;
    onUpdateActivity: (dayIndex: number, activityId: string, updates: Partial<TimelineActivity>) => void;
    onShowActivityDetails?: (activity: TimelineActivity) => void;
}

export default function DayCard({ day, dayIndex, onMoveActivity, onUpdateActivity, onShowActivityDetails }: DayCardProps) {
    const [{ isOver }, drop] = useDrop({
        accept: 'activity',
        drop: (item: { id: string; fromDayIndex: number }) => {
            if (item.fromDayIndex !== dayIndex) {
                onMoveActivity(item.id, item.fromDayIndex, dayIndex);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    // Generate time slots for the day (6 AM to 11 PM)
    const timeSlots = [];
    for (let hour = 6; hour <= 23; hour++) {
        timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    const getActivityAtTime = (time: string) => {
        return day.activities.find(activity => activity.startTime === time);
    };


    return (
        <motion.div
            ref={drop}
            className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 ${
                isOver ? 'border-red-400 bg-red-50' : 'border-gray-200'
            }`}
            whileHover={{ scale: 1.005 }}
        >
            {/* Full Width Day Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-xl font-semibold text-red-600">{day.dayNumber}</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                Day {day.dayNumber}
                            </h3>
                            <p className="text-sm text-gray-500 flex items-center space-x-2">
                                <span className="text-lg">{day.region.icon}</span>
                                <span className="font-medium">{day.region.name}</span>
                                <span className="text-gray-400">•</span>
                                <span>{day.region.nameJapanese}</span>
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-8">
                        {/* Activity Summary */}
                        <div className="text-center">
                            <div className="text-2xl font-semibold text-gray-800">{day.activities.length}</div>
                            <div className="text-xs text-gray-500">Activities</div>
                        </div>
                        
                        {/* Cost Summary */}
                        <div className="text-center">
                            <div className="text-2xl font-semibold text-green-600">¥{Math.round(day.totalCost/1000)}K</div>
                            <div className="text-xs text-gray-500">Daily Cost</div>
                        </div>
                        
                        {/* Activity Type Indicators */}
                        <div className="flex items-center space-x-2">
                            {['attraction', 'meal', 'transport', 'accommodation', 'experience'].map((type) => {
                                const count = day.activities.filter(activity => activity.type === type).length;
                                const colors = {
                                    attraction: 'bg-blue-500',
                                    meal: 'bg-orange-500',
                                    transport: 'bg-gray-500',
                                    accommodation: 'bg-purple-500',
                                    experience: 'bg-green-500'
                                };
                                
                                return count > 0 ? (
                                    <div key={type} className="relative group">
                                        <div className={`w-3 h-3 rounded-full ${colors[type as keyof typeof colors]}`} />
                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {count} {type}
                                        </div>
                                    </div>
                                ) : null;
                            })}
                            {day.activities.length === 0 && (
                                <div className="text-sm text-gray-400">No activities scheduled</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Responsive Activity Layout */}
            <div className="p-6">
                {/* Activity List - Responsive Layout */}
                <div className="space-y-3">
                    {timeSlots.map((timeSlot) => {
                        const activity = getActivityAtTime(timeSlot);
                        const hour = parseInt(timeSlot.split(':')[0]);
                        const isPeakTime = hour >= 9 && hour <= 17;
                        
                        return (
                            <div key={timeSlot} className="group">
                                {/* Mobile/Tablet Layout - Stack vertically */}
                                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                    {/* Time Label */}
                                    <div className={`w-full md:w-16 text-sm font-mono text-left md:text-right flex-shrink-0 ${
                                        isPeakTime ? 'text-gray-700 font-medium' : 'text-gray-400'
                                    }`}>
                                        {timeSlot}
                                    </div>
                                    
                                    {/* Timeline Connector - Hidden on mobile */}
                                    <div className="hidden md:flex flex-col items-center flex-shrink-0">
                                        <div className={`w-3 h-3 rounded-full border-2 border-white ${
                                            activity 
                                                ? 'bg-red-500' 
                                                : isPeakTime 
                                                ? 'bg-gray-300' 
                                                : 'bg-gray-200'
                                        }`} />
                                        {timeSlot !== timeSlots[timeSlots.length - 1] && (
                                            <div className="w-px h-8 bg-gray-200 mt-1" />
                                        )}
                                    </div>
                                    
                                    {/* Activity Slot - Constrained width */}
                                    <div className="flex-1 min-h-[60px] flex items-center w-full max-w-full overflow-hidden">
                                        {activity ? (
                                            <div className="w-full max-w-full overflow-hidden">
                                                <ActivityCard
                                                    activity={activity}
                                                    dayIndex={dayIndex}
                                                    onUpdate={(updates) => onUpdateActivity(dayIndex, activity.id, updates)}
                                                    onShowDetails={onShowActivityDetails}
                                                />
                                            </div>
                                        ) : (
                                            <motion.div 
                                                className={`w-full h-12 rounded-lg border-2 border-dashed transition-all flex items-center justify-center ${
                                                    isOver 
                                                        ? 'border-red-300 bg-red-50' 
                                                        : isPeakTime 
                                                        ? 'border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-50' 
                                                        : 'border-gray-100 group-hover:border-gray-200'
                                                }`}
                                                whileHover={{ scale: 1.01 }}
                                            >
                                                <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-xs text-gray-400">Drop activity here</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Add Activity Section */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <button className="w-full py-3 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center space-x-2 border-2 border-dashed border-gray-300 hover:border-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="font-medium">Add New Activity</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}