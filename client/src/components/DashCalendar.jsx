import React, { useEffect, useState } from 'react';
import { formatHours } from '../utils';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

export default function DashCalendar() {
    // State to hold the current date
    const [currentDate, setCurrentDate] = useState(new Date());
    const [manifests, setManifests] = useState([]);
    console.log(manifests);
    const [totalHours, setTotalHours] = useState(0); // State to hold total hours for the current month

    useEffect(() => {
        fetchManifests();
    }, [currentDate]); // Fetch manifests when currentDate changes

    useEffect(() => {
        calculateTotalHours(); // Calculate total hours whenever the month changes
    }, [manifests]); // Calculate total hours whenever manifests change

    const fetchManifests = async () => {
        try {
            const response = await fetch(`/api/manifest/getallmanifests`);
            const data = await response.json();
            setManifests(data);
        } catch (error) {
            console.error('Error fetching manifests:', error);
        }
    };

    // Function to calculate total hours for the current month
    const calculateTotalHours = () => {
        const totalHoursForMonth = manifests.reduce((total, manifest) => {
            const createdAtDate = new Date(manifest.createdAt);
            if (createdAtDate.getFullYear() === currentDate.getFullYear() &&
                createdAtDate.getMonth() === currentDate.getMonth()) {
                return total + parseFloat(manifest.workingHours);
            }
            return total;
        }, 0);
        setTotalHours(totalHoursForMonth.toFixed(2)); // Set total hours for the month
    };

    // Function to get worked hours for a specific date
    const getWorkedHoursForDate = (date) => {
        // Find manifests for the current date
        const manifestsForDate = manifests.filter(manifest => {
            const createdAtDate = new Date(manifest.createdAt);
            return createdAtDate.getFullYear() === currentDate.getFullYear() &&
                createdAtDate.getMonth() === currentDate.getMonth() &&
                createdAtDate.getDate() === date;
        });

        // If manifests exist for the current date, extract and return their worked hours
        if (manifestsForDate.length > 0) {
            return manifestsForDate.map(manifest => (
                <div key={manifest._id} className="flex flex-col items-center">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">{formatHours(manifest.workingHours)}</div>
                    <div className="relative w-10 h-10">
                            <div className="group">
                                <img src={manifest.profilePicture} alt="" className='absolute w-full h-full rounded-full z-10 border-2 dark:border-slate-500 border-slate-300 transition-scale duration-300 hover:scale-150 hover:z-50' />
                                <div className="absolute bottom-12 left-0 w-full dark:border-slate-500 border-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                                    <span className="text-xs text-gray-700 dark:text-gray-300 px-1">{manifest.username}</span>
                                </div>
                            </div>
                            {manifest.secondUserId && manifest.secondProfilePicture &&
                                <div className="group">
                                    <img src={manifest.secondProfilePicture} alt="" className='absolute w-full h-full rounded-full ml-4 border-2 dark:border-slate-600 border-slate-400 transition-scale duration-300 hover:scale-150 hover:z-50' />
                                    <div className="absolute bottom-12 left-[50px] w-full bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                                        <span className="text-xs text-gray-700 dark:text-gray-300 px-1">{manifest.secondUsername}</span>
                                    </div>
                                </div>
                            }
                        </div>
                </div>
            ));
        } else {
            return ''; // Return empty string if no manifests exist for the current date
        }
    };

    // Function to handle moving to the previous month
    const goToPreviousMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
    };

    // Function to handle moving to the next month
    const goToNextMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
    };

    // Function to handle moving to the previous year
    const goToPreviousYear = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setFullYear(newDate.getFullYear() - 1);
            return newDate;
        });
    };

    // Function to handle moving to the next year
    const goToNextYear = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setFullYear(newDate.getFullYear() + 1);
            return newDate;
        });
    };

    // Get the first day of the current month
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    // Calculate the number of days from the previous month to display
    const daysFromPrevMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    // Calculate the first day of the current month in the calendar grid
    const startDay = daysFromPrevMonth === 0 ? 7 : daysFromPrevMonth;

    // Get number of days in the current month
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    // Array to hold the days of the month including days from previous and next months
    const days = [];

    // Fill in the days from the previous month
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    for (let i = prevMonth.getDate() - startDay + 1; i <= prevMonth.getDate(); i++) {
        days.push(
            <div key={`prev-${i}`} className="text-gray-500 h-[150px] border-2 dark:border-gray-800 relative">
                <div className="absolute top-0 left-0 p-3">{i}</div>
            </div>
        );
    }

    // Fill in the days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(
            <div key={`current-${i}`} className=" bg-slate-400 dark:bg-gray-700 border-2 border-gray-500 h-[150px] relative">
                <div className="absolute top-0 left-0 p-3">{i}</div>
                <div className="flex items-end justify-end h-full p-3">{getWorkedHoursForDate(i)}</div>
            </div>
        );
    }

    // Calculate the remaining days from the next month
    const totalDaysDisplayed = daysFromPrevMonth + daysInMonth;
    const totalRows = Math.ceil(totalDaysDisplayed / 7);
    const remainingDaysFromNextMonth = totalRows * 7 - totalDaysDisplayed;

    // Fill in the days from the next month
    for (let i = 1; i <= remainingDaysFromNextMonth; i++) {
        days.push(
            <div key={`next-${i}`} className="text-gray-500 h-[150px] border-2 dark:border-gray-800 relative">
                <div className="absolute top-0 left-0 p-3">{i}</div>
            </div>
        );
    }



    return (
        <div className='md:mx-auto p-6 w-full'>
            <div className="flex justify-between p-3 text-2xl">
                <MdKeyboardDoubleArrowLeft className='cursor-pointer opacity-[1] transition-opacity duration-300 hover:opacity-[.2]' onClick={goToPreviousYear} />
                <div className="flex items-center justify-center gap-3">
                    <MdKeyboardArrowLeft className='cursor-pointer opacity-[1] transition-opacity duration-300 hover:opacity-[.2]' onClick={goToPreviousMonth} />
                    <div className="">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                    <MdKeyboardArrowRight className='cursor-pointer opacity-[1] transition-opacity duration-300 hover:opacity-[.2]' onClick={goToNextMonth} />
                </div>
                <MdKeyboardDoubleArrowRight className='cursor-pointer opacity-[1] transition-opacity duration-300 hover:opacity-[.2]' onClick={goToNextYear} />
            </div>
            <div className="flex justify-center p-3 text-xl">
                Total Hours: {formatHours(totalHours)}
            </div>
            <div className="grid grid-cols-7 h-10 gap-1">
                <div className="text-center uppercase font-medium text-xl dark:text-slate-500">mon</div>
                <div className="text-center uppercase font-medium text-xl dark:text-slate-500">tue</div>
                <div className="text-center uppercase font-medium text-xl dark:text-slate-500">wed</div>
                <div className="text-center uppercase font-medium text-xl dark:text-slate-500">thu</div>
                <div className="text-center uppercase font-medium text-xl dark:text-slate-500">fri</div>
                <div className="text-center uppercase font-medium text-xl dark:text-slate-500">sat</div>
                <div className="text-center uppercase font-medium text-xl dark:text-slate-500">sun</div>
            </div>
            <div className={`grid grid-cols-7 gap-1 p-1 border-2 border-gray-500`}>
                {days.map((day, index) => (
                    <div key={index} className={`text-center ${day === '' ? 'text-gray-500' : ''} h-[150px]`}>
                        {day === '' ? '' : (
                            <>
                                {day}
                                <div>{getWorkedHoursForDate(day)}</div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
