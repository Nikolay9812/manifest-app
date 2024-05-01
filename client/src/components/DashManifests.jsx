import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Modal, Button } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { formatHours } from '../utils'

export default function DashManifests() {
    const { currentUser } = useSelector((state) => state.user)
    const [userManifests, setUserManifests] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [manifestIdToDelete, setManifestIdToDelete] = useState('')

    useEffect(() => {
        const fetchManifests = async () => {
            try {
                const res = await fetch(`/api/manifest/getmanifests`)
                const data = await res.json()
                if (res.ok) {
                    const manifestsWithUsernames = await Promise.all(data.manifests.map(async (manifest) => {
                        const userRes = await fetch(`/api/user/${manifest.userId}`)
                        const userData = await userRes.json()
                        if (userRes.ok) {
                            return { ...manifest, username: userData.username }
                        } else {
                            return { ...manifest, username: 'Unknown' }
                        }
                    }))
                    setUserManifests(manifestsWithUsernames)
                    if (data.manifests.length < 9) {
                        setShowMore(false)
                    }
                }
            } catch (error) {
                console.log(error.message)
            }
        }

        if (currentUser.isAdmin) {
            fetchManifests()
        }
    }, [currentUser._id])

    const handleShowMore = async () => {
        const startIndex = userManifests.length
        try {
            const res =
                await fetch(`/api/manifest/getmanifests?startIndex=${startIndex}`)

            const data = await res.json()

            if (res.ok) {
                const manifestsWithUsernames = await Promise.all(data.manifests.map(async (manifest) => {
                    const userRes = await fetch(`/api/user/${manifest.userId}`);
                    const userData = await userRes.json();
                    if (userRes.ok) {
                        return { ...manifest, username: userData.username };
                    } else {
                        return { ...manifest, username: 'Unknown' };
                    }
                }));

                setUserManifests((prev) => [...prev, ...manifestsWithUsernames])
                if (data.manifests.length < 9) {
                    setShowMore(false)
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteManifest = async () => {
        setShowModal(false)
        try {
            const res = await fetch(`/api/manifest/deletemanifest/${manifestIdToDelete}/${currentUser._id}`, {
                method: 'DELETE'
            })

            const data = await res.json()

            if (!res.ok) {
                console.log(data.message)
            } else {
                setUserManifests((prev) => prev.filter((manifest) => manifest._id !== manifestIdToDelete))
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 
    scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {
                currentUser.isAdmin && userManifests.length > 0 ? (
                    <>
                        <Table hoverable className='shadow-md'>
                            <Table.Head>
                                <Table.HeadCell>Employ username</Table.HeadCell>
                                <Table.HeadCell>Date updated</Table.HeadCell>
                                <Table.HeadCell>Manifest stantion</Table.HeadCell>
                                <Table.HeadCell>Manifest plate</Table.HeadCell>
                                <Table.HeadCell>Manifest Km</Table.HeadCell>
                                <Table.HeadCell>Manifest hours</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                                <Table.HeadCell>
                                    <span>Edit</span>
                                </Table.HeadCell>
                            </Table.Head>
                            {userManifests.map((manifest) => (
                                <Table.Body className='divide-y' key={manifest._id}>
                                    <Table.Row className={`bg-white dark:border-gray-700 dark:bg-gray-800 ${manifest.returnedPackages !== 0 ? 'bg-red-100 dark:bg-red-900':''}`}>
                                        <Table.Cell>
                                            {manifest.username}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {new Date(manifest.updatedAt).toLocaleDateString()}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link to={`/manifest/${manifest.slug}`}>
                                                <h1>{manifest.stantion}</h1>
                                                <p>{manifest.tor}</p>
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link className='font-medium text-gray-900 dark:text-white' to={`/manifest/${manifest.slug}`}>
                                                {manifest.plate}
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <p>{manifest.kmStart}</p>
                                            <p>{manifest.kmEnd}</p>
                                            <p>{manifest.totalKm}</p>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <p>{new Date(manifest.startTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>
                                            <p>{new Date(manifest.endTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>
                                            <p>{formatHours(manifest.workingHours)}</p>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span
                                                onClick={() => {
                                                    setShowModal(true)
                                                    setManifestIdToDelete(manifest._id)
                                                }}
                                                className='font-medium text-red-500 hover:underline cursor-pointer'>
                                                Delete
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link className='text-teal- hover:underline' to={`/update-manifest/${manifest._id}`}>
                                                <span>
                                                    Edit
                                                </span>
                                            </Link>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                        </Table>
                        {
                            showMore && (
                                <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>Show more</button>
                            )
                        }
                    </>
                ) : (
                    <p>You have no manifests yet!</p>
                )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:tet-gray-400'>Are you sure you want to delete this manifest?</h3>
                        <div className="flex justify-center gap-4">
                            <Button type='submi' color='failure' onClick={handleDeleteManifest}>Yes, I'm sure</Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>No,cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>)

}
