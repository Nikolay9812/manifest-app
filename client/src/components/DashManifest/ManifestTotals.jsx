import React from 'react'
import { formatHours } from '../../utils'
import { CiClock2 } from 'react-icons/ci'
import { TbTruckDelivery } from 'react-icons/tb'
import { LuPackageCheck, LuPackageX } from 'react-icons/lu'

export default function ManifestTotals({totals}) {
    return (
        <div className="flex justify-between gap-4 p-3 text-xl">
            <div className="flex items-center gap-2">
                <CiClock2 />
                {formatHours(totals.totalHours)}
            </div>
            <div className="flex items-center gap-2">
                <TbTruckDelivery />
                {totals.totalKm + ' km'}
            </div>
            <div className="flex items-center gap-2 text-green-500">
                <LuPackageCheck />
                {totals.totalDelivered}
            </div>
            <div className="flex items-center gap-2 text-red-500">
                <LuPackageX />
                {totals.totalReturned}
            </div>
        </div>
    )
}
