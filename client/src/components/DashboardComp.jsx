import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { formatHours } from '../utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Rectangle } from 'recharts';


export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [manifests, setManifests] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalmanifests, setTotalManifests] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthManifests, setLastMonthManifests] = useState(0);
  const [sortedUsersByDeliveredPackages, setSortedUsersByDeliveredPackages] = useState(null); // State to track the user with most returned packages
  const { currentUser } = useSelector((state) => state.user);
  console.log(sortedUsersByDeliveredPackages);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=5');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
          setSortedUsersByDeliveredPackages(data.sortedUsersByDeliveredPackages);
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

  return (
    <div className='p-3 md:mx-auto'>
      <div className='flex-wrap flex gap-4 justify-center'>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
              <p className='text-2xl'>{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className='bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex  gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>
                Total Comments
              </h3>
              <p className='text-2xl'>{0}</p>
            </div>
            <HiAnnotation className='bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex  gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {0}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total manifests</h3>
              <p className='text-2xl'>{totalmanifests}</p>
            </div>
            <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex  gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthManifests}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
      </div>
      <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent users</h1>
            <Button outline gradientDuoTone='greenToBlue'>
              <Link to={'/dashboard?tab=users'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Registered</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt='user'
                        className='w-10 h-10 rounded-full bg-gray-500'
                      />
                    </Table.Cell>
                    <Table.Cell>{new Date(user.createdAt).toDateString()}</Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent manifests</h1>
            <Button outline gradientDuoTone='greenToBlue'>
              <Link to={'/dashboard?tab=manifests'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Manifest driver</Table.HeadCell>
              <Table.HeadCell>Manifest stantion</Table.HeadCell>
              <Table.HeadCell>Manifest km</Table.HeadCell>
              <Table.HeadCell>Manifest packages</Table.HeadCell>
              <Table.HeadCell>Manifest returned packages</Table.HeadCell>
              <Table.HeadCell>Manifest hours</Table.HeadCell>
            </Table.Head>
            {manifests &&
              manifests.map((manifest) => (
                <Table.Body key={manifest._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {manifest.driverName}
                    </Table.Cell>
                    <Table.Cell className='w-96'>{manifest.stantion}</Table.Cell>
                    <Table.Cell className='w-96'>{manifest.totalKm}</Table.Cell>
                    <Table.Cell className='w-96'>{manifest.totalPackages}</Table.Cell>
                    <Table.Cell className='w-96'>{manifest.returnedPackages}</Table.Cell>
                    <Table.Cell className='w-5'>{formatHours(manifest.workingHours)}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1">
      
          
      <BarChart
          width={500}
          height={300}
          data={sortedUsersByDeliveredPackages}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="username" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalReturnedPackages" stackId="a" fill="red" />
        </BarChart>
        <BarChart
          width={500}
          height={300}
          data={sortedUsersByDeliveredPackages}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="username" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalDeliveredPackages" stackId="a" fill="#82ca9d" />
        </BarChart>
        <BarChart
          width={500}
          height={300}
          data={sortedUsersByDeliveredPackages}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="username" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalKilometers" stackId="a" fill="#8884d8" />
        </BarChart>
        <BarChart
          width={500}
          height={300}
          data={sortedUsersByDeliveredPackages}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="username" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalWorkingHours" stackId="a" fill="#0088FE" />
        </BarChart>
      
        </div>
    </div>
  );
}