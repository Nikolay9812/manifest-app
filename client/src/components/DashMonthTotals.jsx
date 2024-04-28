import { Table } from 'flowbite-react';
import { useEffect, useState } from 'react';

const DashMonthTotals = () => {
    const [userTotals, setUserTotals] = useState([]);

    useEffect(() => {
        const fetchUserTotals = async () => {
            try {
                const res = await fetch('/api/manifest/aggregateTotalsByUser');
                if (res.ok) {
                    const data = await res.json();
                    setUserTotals(data);
                } else {
                    console.error('Failed to fetch user totals:', res.statusText);
                }
            } catch (error) {
                console.error('Error fetching user totals:', error);
            }
        };

        fetchUserTotals();
    }, []);

    return (
        <div className='p-3 m-auto'>
            {userTotals.length > 0 && userTotals.map((userData) => (
                <div key={userData.userId}>
                    <div className="p-3 m-auto">
                        <h2>User: {userData.username}</h2>
                    </div>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Month</Table.HeadCell>
                            <Table.HeadCell>Total Hours</Table.HeadCell>
                            <Table.HeadCell>Total Kilometers</Table.HeadCell>
                            <Table.HeadCell>Total Packages</Table.HeadCell>
                            <Table.HeadCell>Total Returned Packages</Table.HeadCell>
                        </Table.Head>
                        {userData.totalsByMonth.map((data) => (
                            <Table.Body className='divide-y' key={`${userData.userId}-${data.month}`}>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>{data.month}</Table.Cell>
                                    <Table.Cell>{data.totalHours}</Table.Cell>
                                    <Table.Cell>{data.totalKilometers}</Table.Cell>
                                    <Table.Cell>{data.totalPackages}</Table.Cell>
                                    <Table.Cell>{data.totalReturnedPackages}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                        <div className="flex gap-6">
                        <div>{userData.totalsByMonth.reduce((acc, curr) => acc + curr.totalHours, 0)}</div>
                        <div>{userData.totalsByMonth.reduce((acc, curr) => acc + curr.totalKilometers, 0)}</div>
                        <div>{userData.totalsByMonth.reduce((acc, curr) => acc + curr.totalPackages, 0)}</div>
                        <div>{userData.totalsByMonth.reduce((acc, curr) => acc + curr.totalReturnedPackages, 0)}</div>
                        </div>

                    </Table>
                </div>
            ))}
        </div>
    );
};

export default DashMonthTotals;
