import React from 'react'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function AreaChartComp() {
    const [users, setUsers] = useState([]);
    const [manifests, setManifests] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalManifests, setTotalManifests] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthManifests, setLastMonthManifests] = useState(0);
    const { currentUser } = useSelector((state) => state.user);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/user/getusers?limit=5');
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    setTotalUsers(data.totalUsers);
                    setLastMonthUsers(data.lastMonthUsers);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        const fetchManifests = async () => {
            try {
                const res = await fetch('/api/manifest/getmanifests?limit=5');
                const data = await res.json();
                if (res.ok) {

                    setManifests(data.manifests);
                    setTotalManifests(data.totalManifests);
                    setLastMonthManifests(data.lastMonthManifests);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchUsers();
            fetchManifests();
        }
    }, [currentUser]);

    const CustomTooltip = ({ active, payload, driverName }) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
                    <p className="text-medium text-lg">{driverName}</p>
                    <p className='text-sm text-blue-400'>
                        Driver 1:
                        <span className='ml-2'>{payload[0].value} hours</span>
                    </p>
                    <p className='text-sm text-indigo-400'>
                        Driver 2:
                        <span className='ml-2'>{payload[1].value} hours</span>
                    </p>
                </div>
            )
        }
    }


    return (
        <ResponsiveContainer width='100%' height='100%'>
            <AreaChart width={500} height={400} data={manifests} margin={{right:30}}>
                <XAxis />
                <YAxis dataKey={"packages"} />
                <CartesianGrid strokeDasharray={'5 5'} />
                <Tooltip content={<CustomTooltip/>} />
                <Legend />
                <Area
                    type={'monotone'}
                    dataKey={'packages'}
                    stroke='#2563eb'
                    fill='#3b82f6'
                    stackId={1}
                />
                <Area
                    type={'monoton'}
                    dataKey={'returnedPackages'}
                    stroke='#7c3aed'
                    fill='#8b5cf6'
                    stackId={1}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}
