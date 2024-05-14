// CalendarTotals.js
import React from 'react';
import { CiClock2 } from 'react-icons/ci';
import { LuFiles, LuPackageCheck, LuPackageX } from 'react-icons/lu';
import { TbTruckDelivery } from 'react-icons/tb';

const CalendarTotals = ({ totalHours, totalKm, totalDelivered, totalReturned, totalManifests }) => {
    return (
        <div className="flex justify-between gap-4 p-3 text-xl">
            <div className="flex items-center gap-2">
                <CiClock2 />
                {totalHours}
            </div>
            <div className="flex items-center gap-2">
                <TbTruckDelivery />
                {totalKm + ' km'}
            </div>
            <div className="flex items-center gap-2 text-green-500">
                <LuPackageCheck />
                {totalDelivered}
            </div>
            <div className="flex items-center gap-2 text-red-500">
                <LuPackageX />
                {totalReturned}
            </div>
            <div className="flex items-center gap-2 text-yellow-500">
                <LuFiles />
                {totalManifests}
            </div>
        </div>
    );
}

export default CalendarTotals;
