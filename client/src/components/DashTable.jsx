import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useSelector } from 'react-redux';
import { formatHours, formatTimeForInput } from '../utils';

const DashTable = () => {
    const { currentUser } = useSelector((state) => state.user)
    const [userManifests, setUserManifests] = useState([])

    const [colDefs, setColDefs] = useState([
        { field: "driverName", rowGroup: true, hide: true },
        { field: "year", rowGroup: true, hide: true },
        { field: "month", rowGroup: true, hide:true, },
        { field: "createdAt", },
        { field: "stantion", },
        { field: "tor", },
        { field: "plate", },
        { field: "kmStart", },
        { field: "kmEnd", },
        { field: "totalKm",},
        { field: "startTime", },
        { field: "endTime", },
        { field: "workingHours", },
        { field: "packages", },
        { field: "returnedPackages",},
        { field: "totalPackages",},
    ]);

    useEffect(() => {
        const fetchManifests = async () => {
            try {
                const res = await fetch(`/api/manifest/getallmanifests`)
                const data = await res.json()
                if (res.ok) {
                    const processedData = data.map(item => ({
                        ...item,
                        createdAt: new Date(item.createdAt).toLocaleDateString(),
                        year: new Date(item.createdAt).getFullYear(),
                        month: new Date(item.createdAt).toLocaleString('en-US', { month: 'long' }),
                        startTime: formatTimeForInput(item.startTime),
                        endTime: formatTimeForInput(item.endTime),
                        workingHours: formatHours(item.workingHours),
                    }));
                    setUserManifests(processedData);
                }
            } catch (error) {
                console.log(error.message)
            }
        }

        if (currentUser.isAdmin) {
            fetchManifests()
        }
    }, [currentUser._id])

    return (
        <div
            className="ag-theme-quartz-dark w-full h-[500px] p-6" // applying the grid theme
        >
            <AgGridReact
                rowData={userManifests}
                columnDefs={colDefs}
            />
        </div>
    );
};

export default DashTable;
