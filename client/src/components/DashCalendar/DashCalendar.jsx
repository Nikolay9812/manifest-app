import React, { useEffect, useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarDaysOfWeek from './CalendarDaysOfWeek';
import CalendarDay from './CalendarDay';
import CalendarTotals from './CalendarTotals';
import { formatHours } from '../../utils';
import CalendarData from './CalendarData';
import { debounce } from 'lodash';
import { Spinner } from 'flowbite-react';

export default function DashCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [manifests, setManifests] = useState([]);
    const [totalHours, setTotalHours] = useState(0);
    const [totalKm, setTotalKm] = useState(0);
    const [totalDelivered, setTotalDelivered] = useState(0);
    const [totalReturned, setTotalReturned] = useState(0);
    const [totalManifests, setTotalManifests] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchManifests = async () => {
            try {
                setLoading(true);
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;
                const response = await fetch(`/api/manifest/getallmanifests?year=${year}&month=${month}`);
                const data = await response.json();
                setManifests(data.manifests);
                setTotalManifests(data.totalManifests)
                setTotalHours(data.totalHours)
                setTotalKm(data.totalKm)
                setTotalDelivered(data.totalDelivered)
                setTotalReturned(data.totalReturned)
            } catch (error) {
                console.error('Error fetching manifests:', error);
            } finally {
                setLoading(false)
            }
        };
        const fetchManifestsDebounced = debounce(fetchManifests, 300);
        fetchManifestsDebounced()
    }, [currentDate]);


    const getWorkedHoursForDate = (date) => {
        const manifestsForDate = manifests.filter(manifest => {
            const createdAtDate = new Date(manifest.createdAt);
            return createdAtDate.getFullYear() === currentDate.getFullYear() &&
                createdAtDate.getMonth() === currentDate.getMonth() &&
                createdAtDate.getDate() === date;
        });

        if (manifestsForDate.length > 0) {
            return manifestsForDate.map(manifest => (
                <CalendarData key={manifest._id} manifest={manifest} />
            ));
        } else {
            return '';
        }
    };

    const goToPreviousMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
    };

    const goToNextMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
    };

    const goToPreviousYear = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setFullYear(newDate.getFullYear() - 1);
            return newDate;
        });
    };

    const goToNextYear = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setFullYear(newDate.getFullYear() + 1);
            return newDate;
        });
    };

    const generateCalendarDays = () => {
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const days = [];

        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        for (let i = prevMonth.getDate() - firstDayOfMonth + 1; i <= prevMonth.getDate(); i++) {
            days.push({ day: i, month: 'prev' });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ day: i, month: 'current' });
        }

        const totalDaysDisplayed = firstDayOfMonth + daysInMonth;
        const totalRows = Math.ceil(totalDaysDisplayed / 7);
        const remainingDaysFromNextMonth = totalRows * 7 - totalDaysDisplayed;

        for (let i = 1; i <= remainingDaysFromNextMonth; i++) {
            days.push({ day: i, month: 'next' });
        }

        return days;
    };

    return (
        <div className='md:mx-auto p-6 w-full'>
            <CalendarHeader
                currentDate={currentDate}
                goToPreviousMonth={goToPreviousMonth}
                goToNextMonth={goToNextMonth}
                goToPreviousYear={goToPreviousYear}
                goToNextYear={goToNextYear}
            />
            <CalendarTotals
                totalHours={formatHours(totalHours)}
                totalKm={totalKm}
                totalDelivered={totalDelivered}
                totalReturned={totalReturned}
                totalManifests={totalManifests}
            />
            <CalendarDaysOfWeek />
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <Spinner size="xl" />
                </div>
            ) : (
                <div className={`grid grid-cols-7 gap-1 p-1 border-2 border-gray-500`}>
                    {generateCalendarDays().map((day, index) => (
                        <CalendarDay
                            key={index}
                            day={day.day}
                            month={day.month}
                            getWorkedHoursForDate={getWorkedHoursForDate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}