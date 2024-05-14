import React from 'react';

const CalendarDay = ({ day, month, getWorkedHoursForDate }) => {
    return (
        <div className={`relative text-center ${month !== 'current' ? 'text-gray-500 border-2 border-gray-700' : 'bg-slate-400 dark:bg-gray-700/50 border-2 border-gray-500'} h-[150px]`}>
            {month === 'current' && (
                <div className='flex items-center justify-center h-full'>
                    <div className="text-gray-400 absolute top-0 left-0 p-1">{day}</div>
                    <div className='flex flex-col items-center justify-center'>{getWorkedHoursForDate(day)}</div>
                </div>
            )}
            {month !== 'current' && <div className="text-gray-500 absolute top-0 left-0 p-1">{day}</div>}
        </div>
    );
}

export default CalendarDay;
