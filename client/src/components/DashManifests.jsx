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
                        const userRes = await fetch(`/api/user/${manifest.userId}`);
                        const userData = await userRes.json();

                        // Initialize an empty object to store the updated manifest details
                        let updatedManifest = {
                            ...manifest,
                            username: userData.username,
                            profilePicture: userData.profilePicture // Assuming profilePicture is directly available in userData
                        };

                        if (!manifest.secondUserId) {
                            // If secondUserId is not defined, set the second username as 'Unknown'
                            updatedManifest.secondUsername = '';
                            updatedManifest.secondProfilePicture = ''; // Assuming secondProfilePicture field in manifest
                        } else {
                            // If secondUserId is defined, fetch the second user's username and profile picture
                            const secondUserRes = await fetch(`/api/user/${manifest.secondUserId}`);
                            const secondUserData = await secondUserRes.json();

                            if (secondUserRes.ok) {
                                updatedManifest.secondUsername = secondUserData.username;
                                updatedManifest.secondProfilePicture = secondUserData.profilePicture; // Assuming profilePicture is directly available in secondUserData
                            } else {
                                updatedManifest.secondUsername = 'Unknown';
                                updatedManifest.secondProfilePicture = ''; // Assuming secondProfilePicture field in manifest
                            }
                        }

                        return updatedManifest;
                    }));

                    setUserManifests(manifestsWithUsernames);


                    setUserManifests(manifestsWithUsernames);

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

    const handleApproveManifest = async (manifestId, currentStatus) => {
        let newStatus = '';
        switch (currentStatus) {
            case 'inProgress':
                newStatus = 'approved';
                break;
            case 'approved':
                newStatus = 'disapproved';
                break;
            case 'disapproved':
            default:
                newStatus = 'inProgress';
                break;
        }

        try {
            const res = await fetch(`/api/manifest/approvemanifest/${manifestId}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.log(data.message);
            } else {
                setUserManifests((prev) =>
                    prev.map((manifest) => {
                        if (manifest._id === manifestId) {
                            return { ...manifest, status: newStatus };
                        }
                        return manifest;
                    })
                );
            }
        } catch (error) {
            console.log(error.message);
        }
    };




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
                                <Table.HeadCell>Status</Table.HeadCell>
                            </Table.Head>
                            {userManifests.map((manifest) => (
                                <Table.Body className='divide-y' key={manifest._id}>
                                    <Table.Row className={`bg-white dark:border-gray-700 dark:bg-gray-800 ${manifest.status === 'inProgress' ? 'bg-yellow-100 dark:bg-yellow-900' : manifest.status === 'approved' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                                        <Table.Cell>
                                            <Link to={`/manifest/${manifest.slug}`}>
                                                <div className="relative w-10 h-10">
                                                    <div className="group">
                                                        <img src={manifest.profilePicture} alt="" className='absolute w-full h-full rounded-full z-10 border-2 dark:border-slate-500 border-slate-300 transition-scale duration-300 hover:scale-150 hover:z-50' />
                                                        <div className="absolute bottom-12 left-0 w-full dark:border-slate-500 border-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                                                            <span className="text-xs text-gray-700 dark:text-gray-300 px-1">{manifest.username}</span>
                                                        </div>
                                                    </div>
                                                    {manifest.secondUserId && manifest.secondProfilePicture &&
                                                        <div className="group">
                                                            <img src={manifest.secondProfilePicture} alt="" className='absolute w-full h-full rounded-full ml-4 border-2 dark:border-slate-600 border-slate-400 transition-scale duration-300 hover:scale-150 hover:z-50' />
                                                            <div className="absolute bottom-12 left-[50px] w-full bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                                                                <span className="text-xs text-gray-700 dark:text-gray-300 px-1">{manifest.secondUsername}</span>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </Link>
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
                                            <p>{new Date(manifest.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            <p>{new Date(manifest.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
                                        <Table.Cell>
                                            <span
                                                onClick={() => handleApproveManifest(manifest._id, manifest.status)}
                                                className={`font-medium ${manifest.status === 'inProgress'
                                                    ? 'text-yellow-500'
                                                    : manifest.status === 'approved'
                                                        ? 'text-green-500'
                                                        : 'text-red-500'
                                                    } hover:underline cursor-pointer`}
                                            >
                                                {manifest.status === 'inProgress'
                                                    ? 'Approve'
                                                    : manifest.status === 'approved'
                                                        ? 'Approved'
                                                        : 'Disapprove'}
                                            </span>

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
