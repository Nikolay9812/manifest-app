import React from 'react';

export default function WeekdayHeader() {
    return (
        <div className="grid grid-cols-7 h-10 gap-1">
            <div className="text-center uppercase font-medium text-xl dark:text-slate-500">mon</div>
            <div className="text-center uppercase font-medium text-xl dark:text-slate-500">tue</div>
            <div className="text-center uppercase font-medium text-xl dark:text-slate-500">wed</div>
            <div className="text-center uppercase font-medium text-xl dark:text-slate-500">thu</div>
            <div className="text-center uppercase font-medium text-xl dark:text-slate-500">fri</div>
            <div className="text-center uppercase font-medium text-xl dark:text-slate-500">sat</div>
            <div className="text-center uppercase font-medium text-xl dark:text-slate-500">sun</div>
        </div>
    )
};
