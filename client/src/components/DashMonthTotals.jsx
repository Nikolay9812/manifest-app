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
        <>
            {userTotals.map((userData) => (
                <div key={userData.userId}>
                    <h2>User: {userData.username}</h2>
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
                    </Table>
                </div>
            ))}
        </>
    );
};

export default DashMonthTotals;
