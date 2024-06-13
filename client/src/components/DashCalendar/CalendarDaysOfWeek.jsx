// CalendarDaysOfWeek.js
import React from 'react';

const CalendarDaysOfWeek = () => {
    const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    return (
        <div className="grid grid-cols-7 h-10 gap-1">
            {daysOfWeek.map(day => (
                <div key={day} className="text-center uppercase font-medium text-sm sm:text-xl dark:text-slate-500">{day}</div>
            ))}
        </div>
    );
}

export default CalendarDaysOfWeek;
