import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table } from 'flowbite-react';
import { Link, useActionData, useAsyncError } from 'react-router-dom';
import { CiClock2 } from "react-icons/ci";
import { TbTruckDelivery } from "react-icons/tb";
import { LuPackageCheck, LuPackageX } from "react-icons/lu";
import { formatHours } from '../utils';

export default function DashManifests() {
    const { currentUser } = useSelector((state) => state.user);
    const [userManifests, setUserManifests] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [totals, setTotals] = useState({
        totalKm: 0,
        totalDelivered: 0,
        totalHours: 0,
        totalReturned: 0
    });

    useEffect(() => {
        const fetchUserManifests = async () => {
            try {
                const res = await fetch(`/api/manifest/getusermanifests`);
                const data = await res.json();
                if (res.ok) {
                    setUserManifests(data.manifests);
                    setTotals(data.totals);
                    if (data.manifests.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchUserManifests(); // Fetch manifests for the current user
    }, []);

    const handleShowMore = async () => {
        const startIndex = userManifests.length;
        try {
            const res =
                await fetch(`/api/manifest/getusermanifests?userId=${currentUser._id}&startIndex=${startIndex}`);

            const data = await res.json();

            if (res.ok) {
                setUserManifests((prev) => [...prev, ...data.manifests]);
                if (data.manifests.length < 9) {
                    setShowMore(false);
                }
                calculateTotals([...userManifests, ...data.manifests]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {userManifests.length > 0 ? (
                <>
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
                    <Table hoverable className='shadow-md'></Table><Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Manifest stantion</Table.HeadCell>
                            <Table.HeadCell>Manifest plate</Table.HeadCell>
                            <Table.HeadCell>Manifest Km</Table.HeadCell>
                            <Table.HeadCell>Manifest hours</Table.HeadCell>
                        </Table.Head>
                        {userManifests.map((manifest) => (
                            <Table.Body className='divide-y' key={manifest._id}>
                                <Table.Row className={`bg-white dark:border-gray-700 dark:bg-gray-800 ${manifest.status === 'inProgress' ? 'bg-yellow-100 dark:bg-yellow-900' : manifest.status === 'approved' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                                    <Table.Cell>
                                        <Link to={`/manifest/${manifest.slug}`}>
                                            {new Date(manifest.updatedAt).toLocaleDateString()}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/manifest/${manifest.slug}`}>
                                            <h1>{manifest.stantion}</h1>
                                            <p>{manifest.tor}</p>
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link  to={`/manifest/${manifest.slug}`}>
                                            {manifest.plate}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link  to={`/manifest/${manifest.slug}`}>
                                            <p>{manifest.kmStart}</p>
                                            <p>{manifest.kmEnd}</p>
                                            <p>{manifest.totalKm}</p>
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/manifest/${manifest.slug}`}>
                                            <p>{new Date(manifest.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            <p>{new Date(manifest.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            <p>{formatHours(manifest.workingHours)}</p>
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>Show more</button>
                    )}
                </>
            ) : (
                <p>You have no manifests yet!</p>
            )}
        </div>
    );
}
