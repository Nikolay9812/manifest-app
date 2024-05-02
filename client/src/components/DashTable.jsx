import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { formatHours, formatTimeForInput } from '../utils';
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FaRegFilePdf } from "react-icons/fa6";
import { FaRegFileAlt } from "react-icons/fa";
import { CiClock2 } from "react-icons/ci";
import { LuMapPin, LuPackage, LuPackageCheck, LuPackageX, LuTruck, LuUser } from "react-icons/lu";

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DashTable = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [userManifests, setUserManifests] = useState([]);
    const [openDropdowns, setOpenDropdowns] = useState({});

    useEffect(() => {
        const fetchManifests = async () => {
            try {
                const res = await fetch(`/api/manifest/getallmanifests`);
                const data = await res.json();
                if (res.ok) {
                    const processedData = processManifestData(data);
                    setUserManifests(processedData);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        if (currentUser.isAdmin) {
            fetchManifests();
        }
    }, [currentUser._id]);

    // Function to organize data into nested objects by driver, year, and month
    const processManifestData = (data) => {
        const organizedData = {};

        data.forEach((item) => {
            const createdAt = new Date(item.createdAt);
            const year = createdAt.getFullYear();
            const month = createdAt.toLocaleString('en-US', { month: 'long' });
            const driver = item.driverName;

            if (!organizedData[driver]) {
                organizedData[driver] = {};
            }
            if (!organizedData[driver][year]) {
                organizedData[driver][year] = {};
            }
            if (!organizedData[driver][year][month]) {
                organizedData[driver][year][month] = {
                    manifests: [],
                    totalKm: 0,
                    totalWorkingHours: 0,
                    totalPackages: 0,
                    totalReturnedPackages: 0
                };
            }

            const workingHours = item.workingHours;
            organizedData[driver][year][month].manifests.push({
                ...item,
                createdAt: createdAt.toLocaleDateString(),
                startTime: formatTimeForInput(item.startTime),
                endTime: formatTimeForInput(item.endTime),
                workingHours: workingHours,
            });
            organizedData[driver][year][month].totalKm += parseFloat(item.totalKm);
            organizedData[driver][year][month].totalWorkingHours += workingHours;
            organizedData[driver][year][month].totalPackages += item.totalPackages;
            organizedData[driver][year][month].totalReturnedPackages += item.returnedPackages;
        });

        return organizedData;
    };

    const toggleDropdown = (driver, year, month) => {
        setOpenDropdowns({
            ...openDropdowns,
            [`${driver}-${year}-${month}`]: !openDropdowns[`${driver}-${year}-${month}`],
        });
    };

    const generatePDF = async () => {
        const input = document.getElementById('manifest-table');
    
        // Calculate the width of the table
        const { clientWidth } = input;
    
        // Create a canvas with dimensions matching the table width but a fixed height
        const canvas = await html2canvas(input, { width: clientWidth, height: clientWidth * 1.3 }); // Adjust the aspect ratio as needed
    
        // Set the width and height of the PDF page based on the table width
        const pdfWidth = 210; // A4 paper width in mm
        const pdfHeight = pdfWidth * 1.3; // Adjust the aspect ratio as needed
    
        // Convert the canvas to image data
        const imgData = canvas.toDataURL('image/png');
    
        // Create a new PDF document with adjusted dimensions
        const pdf = new jsPDF({
            unit: 'mm',
            format: [pdfWidth, pdfHeight], // Set the dimensions
        });
    
        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
        // Save the PDF
        pdf.save('manifests.pdf');
    };
    

    return (
        <div className='p-3 relative overflow-x-auto shadow-md sm:rounded-lg'>
            {userManifests && Object.keys(userManifests).map((driver) => (
                <div key={driver} >
                    <div className='flex items-center gap-2' onClick={() => toggleDropdown(driver, 'all', 'all')}>
                        {driver} {openDropdowns[`${driver}-all-all`] ? <IoIosArrowDown /> : <IoIosArrowForward />}
                    </div>
                    {openDropdowns[`${driver}-all-all`] && (
                        <>
                            {Object.keys(userManifests[driver]).map((year) => (
                                <div className='pl-3 ' key={year}>
                                    <div className='flex items-center gap-2' onClick={() => toggleDropdown(driver, year, 'all')}>
                                        {year} {openDropdowns[`${driver}-${year}-all`] ? <IoIosArrowDown /> : <IoIosArrowForward />}
                                    </div>
                                    {openDropdowns[`${driver}-${year}-all`] && (
                                        <>
                                            {Object.keys(userManifests[driver][year]).map((month) => (
                                                <div className='pl-3' key={month}>
                                                    <div className='flex items-center gap-2' onClick={() => toggleDropdown(driver, year, month)}>
                                                        {month} {openDropdowns[`${driver}-${year}-${month}`] ? <div className='w-full flex justify-between mb-3'><IoIosArrowDown /> <FaRegFilePdf className='text-xl cursor-pointer' onClick={generatePDF} /></div> : <IoIosArrowForward />}
                                                    </div>
                                                    {openDropdowns[`${driver}-${year}-${month}`] && (
                                                        <table id="manifest-table" className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                                                            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                                                                <tr>
                                                                    <th scope="col" className="px-6 py-3">Created At</th>
                                                                    <th scope="col" className="px-6 py-3">Station</th>
                                                                    <th scope="col" className="px-6 py-3">Tor</th>
                                                                    <th scope="col" className="px-6 py-3">Plate</th>
                                                                    <th scope="col" className="px-6 py-3">Total Km</th>
                                                                    <th scope="col" className="px-6 py-3">Working Hours</th>
                                                                    <th scope="col" className="px-6 py-3">Returned Packages</th>
                                                                    <th scope="col" className="px-6 py-3">Total Packages</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {userManifests[driver][year][month].manifests.map((manifest, index) => (
                                                                    <tr key={index} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
                                                                        <td className="px-6 py-4"><div className='inline-flex items-center gap-3'>{manifest.createdAt}</div></td>
                                                                        <td className="px-6 py-4"><div className='inline-flex items-center gap-3'>{manifest.stantion}</div></td>
                                                                        <td className="px-6 py-4"><div className='inline-flex items-center gap-3'>{manifest.tor}</div></td>
                                                                        <td className="px-6 py-4"><div className='inline-flex items-center gap-3'>{manifest.plate}</div></td>
                                                                        <td className="px-6 py-4"><div className='inline-flex items-center gap-3'>{manifest.totalKm}</div></td>
                                                                        <td className="px-6 py-4"><div className='inline-flex items-center gap-3'>{formatHours(manifest.workingHours)}</div></td>
                                                                        <td className="px-6 py-4"><div className='inline-flex items-center gap-3'>{manifest.returnedPackages}</div></td>
                                                                        <td className="px-6 py-4"><div className='inline-flex items-center gap-3'>{manifest.totalPackages}</div></td>
                                                                    </tr>
                                                                ))}
                                                                <tr className='bg-gray-100 dark:bg-gray-700'>
                                                                    <td colSpan="3" className="px-6 py-4">Monthly Totals</td>
                                                                    <td className="px-6 py-4">
                                                                        <div className='inline-flex items-center gap-3'>
                                                                            <span>{userManifests[driver][year][month].manifests.length}</span>
                                                                            <FaRegFileAlt />
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className='inline-flex items-center gap-3'>
                                                                            <span>{userManifests[driver][year][month].totalKm}</span>
                                                                            <LuTruck />
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className='inline-flex items-center gap-3'>
                                                                            <span>{formatHours(userManifests[driver][year][month].totalWorkingHours)}</span>
                                                                            <CiClock2 />
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className='inline-flex items-center gap-3'>
                                                                            <span>{userManifests[driver][year][month].totalReturnedPackages}</span>
                                                                            <LuPackageX />
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className='inline-flex items-center gap-3'>
                                                                            <span>{userManifests[driver][year][month].totalPackages}</span>
                                                                            <LuPackageCheck />
                                                                        </div>
                                                                    </td>
                                                                </tr>

                                                            </tbody>
                                                        </table>
                                                    )}
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DashTable;
