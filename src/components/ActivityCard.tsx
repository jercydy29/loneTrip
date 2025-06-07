'use client';

import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import { TimelineActivity } from '@/types/travel';

interface ActivityCardProps {
    activity: TimelineActivity;
    dayIndex: number;
    onUpdate: (updates: Partial<TimelineActivity>) => void;
    onShowDetails?: (activity: TimelineActivity) => void;
}

export default function ActivityCard({ activity, dayIndex, onUpdate, onShowDetails }: ActivityCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({
        name: activity.name,
        duration: activity.duration,
        estimatedCost: activity.estimatedCost || 0,
        notes: activity.notes || ''
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'activity',
        item: { id: activity.id, fromDayIndex: dayIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const getActivityTypeColor = (type: TimelineActivity['type']) => {
        switch (type) {
            case 'attraction':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'meal':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'transport':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'accommodation':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'experience':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
        }
        return `${mins}m`;
    };

    const handleSave = () => {
        onUpdate({
            name: editValues.name,
            duration: editValues.duration,
            estimatedCost: editValues.estimatedCost,
            notes: editValues.notes
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValues({
            name: activity.name,
            duration: activity.duration,
            estimatedCost: activity.estimatedCost || 0,
            notes: activity.notes || ''
        });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="w-full p-3 bg-white border-2 border-red-300 rounded-lg shadow-md"
            >
                <div className="space-y-2">
                    <input
                        type="text"
                        value={editValues.name}
                        onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                        className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                        placeholder="Activity name"
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="number"
                            value={editValues.duration}
                            onChange={(e) => setEditValues({ ...editValues, duration: parseInt(e.target.value) || 0 })}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                            placeholder="Duration (min)"
                        />
                        <input
                            type="number"
                            value={editValues.estimatedCost}
                            onChange={(e) => setEditValues({ ...editValues, estimatedCost: parseInt(e.target.value) || 0 })}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                            placeholder="Cost (¥)"
                        />
                    </div>
                    
                    <textarea
                        value={editValues.notes}
                        onChange={(e) => setEditValues({ ...editValues, notes: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2 py-1 resize-none"
                        rows={2}
                        placeholder="Notes..."
                    />
                    
                    <div className="flex space-x-2">
                        <button
                            onClick={handleSave}
                            className="flex-1 text-xs bg-green-500 text-white rounded py-1 hover:bg-green-600 transition-colors"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex-1 text-xs bg-gray-300 text-gray-700 rounded py-1 hover:bg-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            ref={drag}
            className={`w-full max-w-full p-2 sm:p-3 bg-white border rounded-lg cursor-pointer transition-all duration-200 ${
                isDragging ? 'opacity-50 scale-95 shadow-2xl' : 'hover:shadow-lg hover:-translate-y-1'
            } ${getActivityTypeColor(activity.type)} group overflow-hidden`}
            whileHover={{ scale: 1.01 }}
            whileDrag={{ scale: 1.03, rotate: 1 }}
            onClick={() => onShowDetails?.(activity)}
            onDoubleClick={() => setIsEditing(true)}
        >
            {/* Responsive Layout - Force proper containment */}
            <div className="flex flex-col space-y-2 w-full">
                <div className="w-full min-w-0 max-w-full overflow-hidden">
                    {/* Header */}
                    <div className="flex items-start space-x-2 mb-2 w-full">
                        <span className="text-lg flex-shrink-0">{activity.icon}</span>
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <h4 className="text-sm font-semibold text-gray-800 break-words">{activity.name}</h4>
                            {activity.nameJapanese && (
                                <p className="text-xs text-gray-500 break-words">{activity.nameJapanese}</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Compact Info Row - Duration, Cost, Type in one line */}
                    <div className="flex items-center justify-between w-full mb-2">
                        <div className="flex items-center space-x-3 text-xs">
                            <div className="flex items-center space-x-1 text-gray-600">
                                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{formatDuration(activity.duration)}</span>
                            </div>
                            {activity.estimatedCost && (
                                <div className="flex items-center space-x-1 text-green-600 font-medium">
                                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    <span>¥{activity.estimatedCost.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full border font-medium ${getActivityTypeColor(activity.type)}`}>
                            {activity.type}
                        </div>
                    </div>
                    
                    {/* Location */}
                    {activity.location && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="break-words">{activity.location}</span>
                        </div>
                    )}
                    
                    {activity.notes && (
                        <p className="text-xs text-gray-600 italic break-words">{activity.notes}</p>
                    )}
                </div>
                
                {/* Actions - Bottom right */}
                <div className="flex items-center justify-end w-full">
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(true);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all"
                            title="Edit activity"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        
                        <div className="opacity-0 group-hover:opacity-100 text-gray-400 transition-opacity">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}