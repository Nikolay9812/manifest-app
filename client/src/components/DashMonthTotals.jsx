import { Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { formatHours } from '../utils'
import { CiClock2 } from "react-icons/ci";
import { TbTruckDelivery } from "react-icons/tb";
import { LuFileSignature, LuPackageCheck, LuPackageX, LuUser2 } from "react-icons/lu";

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
        <div key={userData._id}>
          <div className="flex justify-between gap-4 p-3 text-xl">
            <div className="flex items-center gap-2">
            <LuUser2 />
              {userData.username}
            </div>
            <div className="flex items-center gap-2">
            <LuFileSignature />
              {userData.totalsByMonth.length}
            </div>
            <div className="flex items-center gap-2">
              <CiClock2 />
              {formatHours(userData.totalsByMonth.reduce((acc, curr) => acc + curr.totalHours, 0))}
            </div>
            <div className="flex items-center gap-2">
              <TbTruckDelivery />
              {userData.totalsByMonth.reduce((acc, curr) => acc + curr.totalKilometers, 0)}
            </div>
            <div className="flex items-center gap-2 text-green-500">
              <LuPackageCheck />
              {userData.totalsByMonth.reduce((acc, curr) => acc + curr.totalPackages, 0)}
            </div>
            <div className="flex items-center gap-2 text-red-500">
              <LuPackageX />
              {userData.totalsByMonth.reduce((acc, curr) => acc + curr.totalReturnedPackages, 0)}
            </div>
          </div>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Month</Table.HeadCell>
              <Table.HeadCell>Total Hours</Table.HeadCell>
              <Table.HeadCell>Total Kilometers</Table.HeadCell>
              <Table.HeadCell>Total Packages</Table.HeadCell>
              <Table.HeadCell>Total Returned Packages</Table.HeadCell>
            </Table.Head>
            {userData.totalsByMonth.map((data, index) => (
              <Table.Body className='divide-y' key={index}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{data.month}</Table.Cell>
                  <Table.Cell>{formatHours(data.totalHours)}</Table.Cell>
                  <Table.Cell>{data.totalKilometers}</Table.Cell>
                  <Table.Cell>{data.totalPackages}</Table.Cell>
                  <Table.Cell>{data.totalReturnedPackages}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>
      ))}
    </div>
  );
};

export default DashMonthTotals;