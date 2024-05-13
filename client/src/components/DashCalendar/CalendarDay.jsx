import React from 'react';
import { formatHours } from '../utils';

export default function CalendarDay({ day, isCurrentMonth, manifests }) {
    const dayNumber = day.getDate();
    
    // Filter manifests for the current day
    const manifestsForDay = manifests.filter(manifest => {
        const createdAtDate = new Date(manifest.createdAt);
        return (
            createdAtDate.getFullYear() === day.getFullYear() &&
            createdAtDate.getMonth() === day.getMonth() &&
            createdAtDate.getDate() === dayNumber
        );
    });

    return (
        <div className={`text-center ${!isCurrentMonth ? 'text-gray-500' : ''} h-[150px]`}>
            {dayNumber}
            {isCurrentMonth && (
                <div>
                    {manifestsForDay.map(manifest => (
                        <div key={manifest._id}>
                            {formatHours(manifest.workingHours)}
                            {/* Display other information from the manifest */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
