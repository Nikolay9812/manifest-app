import { Button, Spinner } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CiClock2 } from "react-icons/ci";
import { MdOutlineFreeBreakfast, MdOutlineMapsHomeWork } from "react-icons/md";
import { LuMapPin, LuPackage, LuPackageCheck, LuPackageX, LuUser } from "react-icons/lu";
import { GiPathDistance } from "react-icons/gi";
import { formatHours } from '../utils';
export default function ManifestPage() {
  const [loading, setLodaing] = useState(true)
  const [error, setError] = useState(false)
  const [manifest, setManifest] = useState(null)
  const [recentManifests, setRecentManifests] = useState(null)

  const { manifestSlug } = useParams()

  useEffect(() => {
    const fetchManifest = async () => {
      try {
        setLodaing(true)
        const res = await fetch(`/api/manifest/getmanifests?slug=${manifestSlug}`)
        const data = await res.json()
        console.log(data);
        if (!res.ok) {
          setError(true)
          setLodaing(false)
          return
        }
        if (res.ok) {
          setManifest(data.manifests[0])
          setLodaing(false)
          setError(false)
        }
      } catch (error) {
        setError(true)
        setLodaing(false)
      }
    }
    fetchManifest()
  }, [manifestSlug])

  useEffect(() => {
    try {
      const fetchRecentManifests = async () => {
        const res = await fetch(`/api/manifest/getmanifests?limit=3`)
        const data = await res.json()
        if (res.ok) {
          setRecentManifests(data.manifests)
        }
      }
      fetchRecentManifests()
    } catch (error) {
      console.log(error.message);
    }
  }, [])

  if (loading) return (
    <div className="flex justify-center item-center min-h-screen">
      <Spinner size='xl' />
    </div>
  )
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>Delivery Associate control sheet</h1>
      <div className="flex flex-wrap gap-3 p-3">
        <div className="w-[200px] flex flex-col items-center justify-center text-2xl border-2 border-gray-300">
          <span className='w-full h-full p-2 text-sm text-center bg-gray-300  dark:text-gray-900 font-semibold'>Tor</span>
          <div className="p-3 flex gap-2 justify-center items-center text-md">
            <LuMapPin />
            {manifest.tor}
          </div>
        </div>
        <div className="w-[200px] flex flex-col items-center justify-center text-2xl border-2 border-gray-300">
          <span className='w-full h-full p-2 text-sm text-center bg-gray-300  dark:text-gray-900 font-semibold'>Stantion</span>
          <div className="p-3 flex gap-2 justify-center items-center text-md">
            <MdOutlineMapsHomeWork />
            {manifest.stantion}
          </div>
        </div>
        <div className="w-[200px] flex flex-col items-center justify-center text-2xl border-2 border-gray-300">
          <span className='w-full h-full p-2 text-sm text-center bg-gray-300  dark:text-gray-900 font-semibold'>Driver Name</span>
          <div className="p-3 flex gap-2 justify-center items-center text-md">
            <LuUser />
            {manifest.driverName}
          </div>
        </div>
        <div className="w-[200px] flex flex-col items-center justify-center text-2xl border-2 border-gray-300">
          <span className='w-full h-full p-2 text-sm text-center bg-gray-300  dark:text-gray-900 font-semibold'>Packages</span>
          <div className="p-3 flex gap-2 justify-center items-center text-md">
            <LuPackage />
            {manifest.packages}
          </div>
        </div>
        <div className="w-[200px] flex flex-col items-center justify-center text-2xl border-2 border-gray-300">
          <span className='w-full h-full p-2 text-sm text-center bg-gray-300  dark:text-gray-900 font-semibold'>Plate</span>
          <div className="p-3 flex gap-2 justify-center items-center text-md">
            {manifest.plate}
          </div>
        </div>
        <div className="w-[200px] flex flex-col items-center justify-center text-2xl border-2 border-gray-300">
          <span className='w-full h-full p-2 text-sm text-center bg-gray-300  dark:text-gray-900 font-semibold'>Date</span>
          <div className="p-3 flex gap-2 justify-center items-center text-md">
            {new Date(manifest.updatedAt).toLocaleDateString()}
          </div>
        </div>
        <div className="w-[200px] flex flex-col items-center justify-center text-2xl border-2 border-gray-300">
          <span className='w-full h-full text-sm text-center bg-gray-300 p-2  dark:text-gray-900 font-semibold'>Handover time handled</span>
          <div className="p-3 flex gap-2 justify-center items-center text-md">
            <CiClock2 />
            {new Date(manifest.startTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
          </div>
        </div>
        <div className="w-[200px] flex flex-col items-center justify-center text-2xl border-2 border-gray-300">
          <span className='w-full h-full text-sm text-center bg-gray-300 p-2  dark:text-gray-900 font-semibold'>Starting kilometers</span>
          <div className="p-3 flex gap-2 justify-center items-center text-md">
            {manifest.kmStart + ' km'}
          </div>
        </div>
        <div className="w-[200px] flex flex-col items-center justify-center text-2xl border-2 border-gray-300">
          <span className='w-full h-full text-sm text-center bg-gray-300 p-2  dark:text-gray-900 font-semibold'>Departure time stantion</span>
          <div className="p-3 flex gap-2 justify-center items-center text-md">
            <CiClock2 />
            {manifest.departure}
          </div>
        </div>
        <div className="w-[200px] flex flex-col items-center justify-center text-2xl border-2 border-gray-300">
          <span className='w-full h-full text-sm text-center bg-gray-300 p-2  dark:text-gray-900 font-semibold'>Time of first delivery</span>
          <div className="p-3 flex gap-2 justify-center items-center text-md">
            <CiClock2 />
            {manifest.firstDelivery}
          </div>
        </div>
        <div className="w-[200px] flex flex-col items-center justify-center text-2xl border-2 border-gray-300">
          <span className='w-full h-full text-sm text-center bg-gray-300 p-2  dark:text-gray-900 font-semibold'>Return time station</span>
          <div className="p-3 flex gap-2 justify-center items-center text-md">
            <CiClock2 />
            {manifest.returnTime}
          </div>
        </div>
        <div className="w-[200px] flex flex-col items-center justify-center text-2xl border-2 border-gray-300">
          <span className='w-full h-full p-2 text-sm text-center bg-gray-300  dark:text-gray-900 font-semibold'>Ending kilometers</span>
          <div className="p-3 flex gap-2 justify-center items-center text-md">
            {manifest.kmEnd + ' km'}
          </div>
        </div>
        <div className="w-[200px] flex flex-col items-center justify-center text-2xl border-2 border-gray-300">
          <span className='w-full h-full p-2 text-sm text-center bg-gray-300  dark:text-gray-900 font-semibold'>Time of last delivery</span>
          <div className="p-3 flex gap-2 justify-center items-center text-md">
            <CiClock2 />
            {manifest.lastDelivery}
          </div>
        </div>
        <div className="w-[200px] flex flex-col items-center justify-center text-2xl border-2 border-gray-300">
          <span className='w-full h-full p-2 text-sm text-center bg-gray-300  dark:text-gray-900 font-semibold'>Time of complete debrief</span>
          <div className="p-3 flex gap-2 justify-center items-center text-md">
            <CiClock2 />
            {new Date(manifest.endTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
          </div>
        </div>
        <div className="w-[200px] flex flex-col items-center justify-center text-2xl border-2 border-gray-300">
          <span className='w-full h-full p-2 text-sm text-center bg-gray-300  dark:text-gray-900 font-semibold'>Return packages</span>
          <div className="p-3 flex gap-2 justify-center items-center text-md">
            <LuPackageX />
            {manifest.returnedPackages}
          </div>
        </div>
        <div className="w-[200px] flex flex-col items-center justify-center text-2xl border-2 border-gray-300">
          <span className='w-full h-full p-2 text-sm text-center bg-gray-300  dark:text-gray-900 font-semibold'>Delivered packages</span>
          <div className="p-3 flex gap-2 justify-center items-center text-md">
            <LuPackageCheck />
            {manifest.totalPackages}
          </div>
        </div>
        <div className="w-[200px] flex flex-col items-center justify-center text-2xl border-2 border-gray-300">
          <span className='w-full h-full p-2 text-sm text-center bg-gray-300  dark:text-gray-900 font-semibold'>Total kilometers</span>
          <div className="p-3 flex gap-2 justify-center items-center text-md">
            <GiPathDistance />
            {manifest.totalKm + ' km'}
          </div>
        </div>
        <div className="w-[200px] flex flex-col items-center justify-center text-2xl border-2 border-gray-300">
          <span className='w-full h-full p-2 text-sm text-center bg-gray-300  dark:text-gray-900 font-semibold'>Working Hours</span>
          <div className="p-3 flex gap-2 justify-center items-center text-md">
            <CiClock2 />
            {formatHours(manifest.workingHours)}
          </div>
        </div>
        <div className="w-[200px] flex flex-col items-center justify-center text-2xl border-2 border-gray-300">
          <span className='w-full h-full p-2 text-sm text-center bg-gray-300  dark:text-gray-900 font-semibold'>Break</span>
          <div className="p-3 flex gap-2 justify-center items-center text-md">
            <MdOutlineFreeBreakfast />
            {manifest.workingHours <= 8.5 ? "30 min" : "45 min"}
          </div>
        </div>
      </div>

    </main>
  )
}
