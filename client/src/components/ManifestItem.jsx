import React, { useEffect, useState } from 'react';
import { LuMapPin, LuPackage, LuPackageCheck, LuPackageX, LuUser } from "react-icons/lu";
import { CiClock2 } from "react-icons/ci";
import { MdOutlineMapsHomeWork, MdOutlineFreeBreakfast } from "react-icons/md";
import { GiPathDistance } from "react-icons/gi";
import { FiTruck } from "react-icons/fi";
import { IoTimer } from "react-icons/io5";
import { formatHours, formatTimeForInput } from '../utils';

const ManifestItem = ({ manifest, userId }) => {
    const [user, setUser] = useState(null);
    const [secondDriverUser, setSecondDriverUser] = useState(null); // State for second driver
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Start loading
                setError(false); // Reset error flag

                // Fetch main driver's information
                const mainDriverRes = await fetch(`/api/user/getusers?userId=${userId}`);
                const mainDriverData = await mainDriverRes.json();

                if (mainDriverRes.ok && mainDriverData.users.length > 0) {
                    const foundUser = mainDriverData.users.find(user => user._id === userId);
                    setUser(foundUser);
                } else {
                    setError(true);
                }

                // Fetch second driver's information if it exists
                if (manifest.secondUserId) {
                    const secondDriverRes = await fetch(`/api/user/getusers?userId=${manifest.secondUserId}`);
                    const secondDriverData = await secondDriverRes.json();

                    if (secondDriverRes.ok && secondDriverData.users.length > 0) {
                        const foundSecondUser = secondDriverData.users.find(user => user._id === manifest.secondUserId);
                        setSecondDriverUser(foundSecondUser);
                    } else {
                        setSecondDriverUser(null);
                    }
                }

                setLoading(false); // End loading
            } catch (error) {
                setError(true);
                setLoading(false); // End loading even if there's an error
            }
        };

        // Fetch data
        fetchData();

        // Cleanup function
        return () => {
            setUser(null);
            setSecondDriverUser(null);
            setError(false);
        };
    }, [userId, manifest.secondUserId]);


    if (loading) {
        return <div className='text-center'>Loading user information...</div>;
    }

    if (error) {
        return <div className='text-center'>Error fetching user information. Please try again later.</div>;
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-3 grid-flow-row-dense text-slate-400 italic">
            <div className="bg-gray-700 rounded-lg shadow-xl min-h-[100px] row-span-4 flex flex-col items-center justify-center gap-6 ">
                <div className="text-3xl text-center">
                    <div className="relative w-20 h-20">
                        {user && user.profilePicture && (
                            <img
                                src={user.profilePicture}
                                alt="User Profile"
                                className="absolute w-full h-full rounded-full z-10 border-4 border-slate-600"
                            />
                        )}
                        {secondDriverUser && secondDriverUser.profilePicture && (
                            <img
                                src={secondDriverUser.profilePicture}
                                alt="Second Driver Profile"
                                className="absolute w-full h-full rounded-full ml-7 border-4 border-slate-600"
                            />
                        )}
                    </div>

                </div>
                <div className="text-3xl text-center">
                    <span className=' text-sm '>Driver name: </span><br />
                    <span className='text-white'>{manifest.driverName}</span>
                    {secondDriverUser && (
                        <div>
                            <p className='text-xs'>Second Driver: {secondDriverUser.username}</p>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className=' text-sm '>Stantion:</span>
                    <MdOutlineMapsHomeWork />
                    <div className="border border-gray-400 rounded-full p-1 pl-2 pr-2 text-white text-sm">{manifest.stantion}</div>
                </div>
                <div className="flex items-center gap-3">
                    <span className=' text-sm '>Tor:</span>
                    <LuMapPin />
                    <div className="border border-gray-400 rounded-full p-1 pl-2 pr-2 text-white text-sm">{manifest.tor}</div>
                </div>
                <div className="flex items-center gap-3">
                    <span className=' text-sm '>Plate:</span>
                    <FiTruck />
                    <div className="border border-gray-400 rounded-full p-1 pl-2 pr-2 text-white text-sm">{manifest.plate}</div>
                </div>
                <div className="flex items-center gap-3">
                    <span className=' text-sm '>Date:</span>
                    <div className="text-white">{new Date(manifest.createdAt).toDateString()}</div>
                </div>
                <div className="flex items-center gap-3">
                    <span className=' text-sm '>Firma:</span>
                    <div className="text-white">Ivanov Transport</div>
                </div>
                <span
                    className={`font-medium ${manifest.status === 'inProgress'
                        ? 'text-yellow-500'
                        : manifest.status === 'approved'
                            ? 'text-green-500'
                            : 'text-red-500'
                        } hover:underline cursor-pointer`}
                >
                    {manifest.status === 'inProgress'
                        ? 'Waiting for Approval'
                        : manifest.status === 'approved'
                            ? 'Approved'
                            : 'Disapproved'}
                </span>
            </div>
            <div className="bg-gray-700 rounded-lg shadow-xl min-h-[100px] col-span-2 text-3xl flex item-center justify-center gap-10">
                <div className="flex items-center gap-1 text-yellow-500">
                    <LuPackage />
                    {manifest.packages}
                </div>
                <div className="flex items-center gap-1 text-red-500">
                    <LuPackageX />
                    {manifest.returnedPackages}
                </div>
                <div className="flex items-center gap-1 text-green-500">
                    <LuPackageCheck />
                    {manifest.totalPackages}
                </div>
            </div>
            <div className="bg-gray-700 rounded-lg shadow-xl min-h-[100px] row-span-2 flex flex-col items-center justify-center gap-6 p-6">
                <div className="flex items-center gap-3">
                    <span className=' text-sm '>Handover time handled:</span>
                    <CiClock2 />
                    <div className="border border-gray-400 rounded-full p-1 pl-2 pr-2 text-white text-sm">
                        {formatTimeForInput(manifest.startTime)}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className=' text-sm '>Departure time stantion:</span>
                    <CiClock2 />
                    <div className="border border-gray-400 rounded-full p-1 pl-2 pr-2 text-sm text-white">{manifest.departure}</div>
                </div>
                <div className="flex items-center gap-3">
                    <span className=' text-sm '>Time of first delivery:</span>
                    <CiClock2 />
                    <div className="border border-gray-400 rounded-full p-1 pl-2 pr-2 text-sm text-white">{manifest.firstDelivery}</div>
                </div>
                <div className="flex items-center gap-3">
                    <span className=' text-sm '>Time of last delivery:</span>
                    <CiClock2 />
                    <div className="border border-gray-400 rounded-full p-1 pl-2 pr-2 text-white text-sm">{manifest.lastDelivery}</div>
                </div>
                <div className="flex items-center gap-3">
                    <span className=' text-sm '>Return time station:</span>
                    <CiClock2 />
                    <div className="border border-gray-400 rounded-full p-1 pl-2 pr-2 text-white text-sm">{manifest.returnTime}</div>
                </div>
                <div className="flex items-center gap-3">
                    <span className=' text-sm '>Time of complete debrief:</span>
                    <CiClock2 />
                    <div className="border border-gray-400 rounded-full p-1 pl-2 pr-2 text-white text-sm">
                        {formatTimeForInput(manifest.endTime)}
                    </div>
                </div>
            </div>
            <div className="bg-gray-700 rounded-lg shadow-xl min-h-[100px]  text-slate-400 flex flex-col items-center justify-center">
                <div className="flex flex-col justify-center items-center">
                    <span>Start Kilometers:</span>
                    <div className="flex gap-3 items-center">
                        <IoTimer />
                        <span className='text-white'>{manifest.kmStart}</span>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <span>End Kilometers:</span>
                    <div className="flex gap-3 items-center">
                        <IoTimer />
                        <span className='text-white'>{manifest.kmEnd}</span>
                    </div>
                </div>
            </div>
            <div className="bg-gray-700 rounded-lg shadow-xl min-h-[100px]  text-slate-400 flex flex-col items-center justify-center text-3xl">
                <MdOutlineFreeBreakfast />
                <div className="flex gap-3 items-center">
                    <span>Break:</span>
                    <span className='text-white'>{manifest.workingHours <= 8.5 ? "30 min" : "45 min"}</span>

                </div>
            </div>
            <div className="bg-gray-700 rounded-lg shadow-xl min-h-[100px] col-span-2 flex justify-around p-10">
                <div className="flex gap-3 items-center">
                    <div className="flex flex-col justify-center items-center text-white">
                        <span>Total Hours:</span>
                        <div className="flex gap-3 items-center">
                            <CiClock2 />
                            {formatHours(manifest.workingHours)}
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="flex flex-col justify-center items-center text-white">
                        <span>Total Kilometers:</span>
                        <div className="flex gap-3 items-center">
                            <GiPathDistance />
                            {manifest.totalKm}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ManifestItem;
