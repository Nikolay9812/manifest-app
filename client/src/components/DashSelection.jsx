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

export default function DashSelection() {
  const { currentUser } = useSelector((state) => state.user)
  const [stantions, setStantions] = useState([]);
  const [plates, setPlates] = useState([]);
  const [tors, setTors] = useState([]);
  const [showModal, setShowModal] = useState(false)


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
            <Button outline gradientDuoTone='greenToBlue'>
              <Link to={'/dashboard?tab=users'}>Add</Link>
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
            <Button outline gradientDuoTone='greenToBlue'>
              <Link to={'/dashboard?tab=posts'}>Add</Link>
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
            <Button outline gradientDuoTone='greenToBlue'>
              <Link to={'/dashboard?tab=posts'}>Add</Link>
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
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:tet-gray-400'>Are you sure you want to delete this user?</h3>
                        <div className="flex justify-center gap-4">
                            <Button color='failure' onClick={0}>Yes, I'm sure</Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>No,cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
    </div>
  )
}
