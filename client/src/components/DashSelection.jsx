import React, { useEffect, useState } from 'react'
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
  HiOutlineExclamationCircle
} from 'react-icons/hi';
import { Button, Modal, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BsBuildingsFill } from "react-icons/bs";
import { FaMapMarkedAlt, FaShuttleVan } from "react-icons/fa";

export default function DashSelection() {
  const { currentUser } = useSelector((state) => state.user)
  const [stantions, setStantions] = useState([]);
  const [plate, setPlate] = useState('');
  const [tor, setTor] = useState('');
  const [stantion, setStantion] = useState('');
  const [plates, setPlates] = useState([]);
  const [tors, setTors] = useState([]);
  const [showModalStantion, setShowModalStantion] = useState(false)
  const [showModalPlate, setShowModalPlate] = useState(false)
  const [showModalTor, setShowModalTor] = useState(false)
  const [publishError, setPublishError] = useState(false)


  useEffect(() => {
    const fetchStantions = async () => {
      try {
        const res = await fetch(`/api/stantion/getstantions`)
        const data = await res.json()
        if (res.ok) {
          setStantions(data)
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    const fetchPlates = async () => {
      try {
        const res = await fetch(`/api/plate/getplates`)
        const data = await res.json()
        if (res.ok) {
          setPlates(data)
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    const fetchTors = async () => {
      try {
        const res = await fetch(`/api/tor/gettors`)
        const data = await res.json()
        if (res.ok) {
          setTors(data)
        }
      } catch (error) {
        console.log(error.message)
      }
    }

    if (currentUser.isAdmin) {
      fetchStantions()
      fetchPlates()
      fetchTors()
    }
  }, [currentUser._id])

  const handleSubmitStantion = async (e) => {
    e.preventDefault();
    try {
      // Perform the necessary validation or data processing here before submission

      const res = await fetch('/api/stantion/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name:stantion}),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        // Stantion created successfully, update the stantions state
        setStantions([...stantions, data]); // Assuming the response contains the created stantion object
        setShowModalStantion(false);
        setPublishError('');
        setStantion('')
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmitTor = async (e) => {
    e.preventDefault();
    try {
      // Perform the necessary validation or data processing here before submission

      const res = await fetch('/api/tor/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name:tor}),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        // Tor created successfully, update the tors state
        setTors([...tors, data]); // Assuming the response contains the created tor object
        setShowModalTor(false);
        setPublishError('');
        setTor('')
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  const handleSubmitPlate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/plate/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: plate }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        // Plate created successfully, update the plates state
        setPlates([...plates, data]); // Assuming the response contains the created plate object
        setShowModalPlate(false);
        setPlate(''); // Clear the plate name input field
        setPublishError('');
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='p-3 md:mx-auto'>
      <div className='flex-wrap flex gap-4 justify-center'>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Vehicle</h3>
              <p className='text-2xl'>{plates.length}</p>
            </div>
            <HiOutlineUserGroup className='bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg' />
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
              <h3 className='text-gray-500 text-md uppercase'>
                Total Tor's
              </h3>
              <p className='text-2xl'>{tors.length}</p>
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
              <h3 className='text-gray-500 text-md uppercase'>Total Stantions</h3>
              <p className='text-2xl'>{stantions.length}</p>
            </div>
            <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex  gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {0}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
      </div>
      <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent vehicle</h1>
            <Button onClick={() =>
              setShowModalPlate(true)} outline gradientDuoTone='greenToBlue'>
              Add
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Vehicle</Table.HeadCell>
            </Table.Head>
            {plates &&
              plates.map((plate) => (
                <Table.Body key={plate._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>{new Date(plate.createdAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>{plate.name}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent stantions</h1>
            <Button outline gradientDuoTone='greenToBlue'
              onClick={
                () => setShowModalStantion(true)}>
              Add
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Stantion</Table.HeadCell>
            </Table.Head>
            {stantions &&
              stantions.map((stantion) => (
                <Table.Body key={stantion._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {new Date(stantion.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell >{stantion.name}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent tor's</h1>
            <Button outline gradientDuoTone='greenToBlue'
              onClick={
                () => setShowModalTor(true)
              }>
              Add
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Tor</Table.HeadCell>
            </Table.Head>
            {tors &&
              tors.map((tor) => (
                <Table.Body key={tor._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {new Date(tor.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{tor.name}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
      <Modal show={showModalTor} onClose={() => setShowModalTor(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <FaMapMarkedAlt className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:tet-gray-400'>You want to add new tor?</h3>
            <input type="text" value={tor} onChange={(e) => setTor(e.target.value)} placeholder="Enter Plate Name" />
            {publishError && <p className="text-red-500">{publishError}</p>}
            <div className="flex justify-center gap-4 mt-3">
              <Button color='succes' onClick={handleSubmitTor}>Add Tor</Button>
              <Button color='gray' onClick={() => setShowModalTor(false)}>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showModalPlate} onClose={() => setShowModalPlate(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <FaShuttleVan  className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:tet-gray-400">You want to add new vehicle?</h3>
            <input type="text" value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="Enter Plate Name" />
            {publishError && <p className="text-red-500">{publishError}</p>}
            <div className="flex justify-center gap-4 mt-3">
              <Button color="success" onClick={handleSubmitPlate}>
                Add Plate
              </Button>
              <Button color="gray" onClick={() => setShowModalPlate(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showModalStantion} onClose={() => setShowModalStantion(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <BsBuildingsFill  className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:tet-gray-400'>You want to add new stantion?</h3>
            <input type="text" value={stantion} onChange={(e) => setStantion(e.target.value)} placeholder="Enter Stantion Name" />
            {publishError && <p className="text-red-500">{publishError}</p>}
            <div className="flex justify-center gap-4 mt-3">
              <Button color='succes' onClick={handleSubmitStantion}>Add Stantion</Button>
              <Button color='gray' onClick={() => setShowModalStantion(false)}>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
