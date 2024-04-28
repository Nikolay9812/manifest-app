import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Modal, Button } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { CiClock2 } from "react-icons/ci";
import { LuPackageCheck, LuPackageX } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { formatHours } from '../utils'

export default function DashManifests() {
    const { currentUser } = useSelector((state) => state.user)
    const [userManifests, setUserManifests] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [totalHours, setTotalHours] = useState(0);
    const [totalKilometers, setTotalKilometers] = useState(0);
    const [totalPackagesDelivered, setTotalPackagesDelivered] = useState(0);
    const [totalReturned, setTotalReturned] = useState(0);

    useEffect(() => {
        const fetchUserManifests = async () => {
            try {
                const res = await fetch(`/api/manifest/getusermanifests`)
                const data = await res.json()
                if (res.ok) {
                    setUserManifests(data.manifests)
                    calculateTotals(data.manifests)
                    if (data.manifests.length < 9) {
                        setShowMore(false)
                    }
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchUserManifests(); // Fetch manifests for the current user
    }, [])

    const calculateTotals = (manifests) => {
        let totalHours = 0;
        let totalKilometers = 0;
        let totalPackagesDelivered = 0;
        let totalReturned = 0;

        manifests.forEach((manifest) => {
            const hours = parseTimeToDecimal(manifest.workingHours);
            totalHours += hours; // Assuming workingHours is the property representing hours
            totalKilometers += manifest.totalKm; // Assuming totalKm is the property representing kilometers
            // Assuming packagesDelivered and returned are properties representing the number of packages delivered and returned respectively
            totalPackagesDelivered += manifest.packages;
            totalReturned += manifest.returnedPackages;
        });

        setTotalHours(totalHours);
        setTotalKilometers(totalKilometers);
        setTotalPackagesDelivered(totalPackagesDelivered);
        setTotalReturned(totalReturned);
    };

    const formatHoursMinutes = (totalHours) => {
        const hours = Math.floor(totalHours);
        const minutes = Math.round((totalHours - hours) * 60);
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}`;
    };

    const parseTimeToDecimal = (timeString) => {
        // Split the time string into hours and minutes
        const [hoursStr, minutesStr] = timeString.split(':');

        // Parse hours and minutes as integers
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);

        // Calculate total hours, considering minutes as fractions of an hour
        const totalHours = hours + (minutes / 60);

        return totalHours;
    };

    const handleShowMore = async () => {
        const startIndex = userManifests.length
        try {
            const res =
                await fetch(`/api/manifest/getusermanifests?userId=${currentUser._id}&startIndex=${startIndex}`)

            const data = await res.json()

            if (res.ok) {
                setUserManifests((prev) => [...prev, ...data.manifests])
                if (data.manifests.length < 9) {
                    setShowMore(false)
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 
    scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {
                userManifests.length > 0 ? (
                    <>
                        <Table hoverable className='shadow-md'>
                            <Table.Head>
                                <Table.HeadCell>Date updated</Table.HeadCell>
                                <Table.HeadCell>Manifest stantion</Table.HeadCell>
                                <Table.HeadCell>Manifest plate</Table.HeadCell>
                                <Table.HeadCell>Manifest Km</Table.HeadCell>
                                <Table.HeadCell>Manifest hours</Table.HeadCell>
                            </Table.Head>
                            {userManifests.map((manifest) => (
                                <Table.Body className='divide-y' key={manifest._id}>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                        <Table.Cell>
                                            {new Date(manifest.updatedAt).toLocaleDateString()}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link to={`/manifest/${manifest.slug}`}>
                                                <h1>{manifest.stantion}</h1>
                                                <p>{manifest.tor}</p>
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link className='font-medium text-gray-900 dark:text-white' to={`/manifest/${manifest.slug}`}>
                                                {manifest.plate}
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <p>{manifest.kmStart}</p>
                                            <p>{manifest.kmEnd}</p>
                                            <p>{manifest.totalKm}</p>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <p>{new Date(manifest.startTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>
                                            <p>{new Date(manifest.endTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>
                                            <p>{formatHours(manifest.workingHours)}</p>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                        </Table>
                        <div className="flex justify-between gap-4 p-3 text-xl">
                            <div className="flex items-center gap-2">
                                <CiClock2 />
                                {formatHoursMinutes(totalHours)}
                            </div>
                            <div className="flex items-center gap-2">
                                <TbTruckDelivery />
                                {totalKilometers + ' km'}
                            </div>
                            <div className="flex items-center gap-2 text-green-500">
                                <LuPackageCheck />
                                {totalPackagesDelivered}
                            </div>
                            <div className="flex items-center gap-2 text-red-500">
                                <LuPackageX />
                                {totalReturned}
                            </div>
                        </div>
                        {
                            showMore && (
                                <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>Show more</button>
                            )
                        }
                    </>
                ) : (
                    <p>You have no manifests yet!</p>
                )}
        </div>)

}
