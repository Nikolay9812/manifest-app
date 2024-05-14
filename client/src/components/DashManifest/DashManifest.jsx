import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ManifestTable from './ManifestTable';
import ManifestModal from './ManifestModal';
import ManifestTotals from './ManifestTotals';
import { Spinner } from 'flowbite-react';

export default function DashManifests() {
    const { currentUser } = useSelector((state) => state.user);
    const [manifests, setManifests] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [manifestIdToDelete, setManifestIdToDelete] = useState('');
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState({
        totalKm: 0,
        totalDelivered: 0,
        totalHours: 0,
        totalReturned: 0
    });

    useEffect(() => {
        const fetchManifests = async () => {
            try {
                let manifestsEndpoint = '/api/manifest/getmanifests';

                if (!currentUser.isAdmin) {
                    manifestsEndpoint = '/api/manifest/getusermanifests';
                    const res = await fetch('/api/manifest/getusermanifests');
                    const data = await res.json();
                    if (res.ok) {
                        setTotals(data.totals);
                    }
                }

                const res = await fetch(manifestsEndpoint);
                const data = await res.json()
                if (res.ok) {

                    setManifests(data.manifests);
                    setTotals(data.totals)
                    setLoading(false);

                    if (data.manifests.length < 9) {
                        setShowMore(false)
                    }
                }
            } catch (error) {
                console.log(error.message)
            }
        }

        fetchManifests()

    }, [currentUser.isAdmin])

    const handleShowMore = async () => {
        const startIndex = manifests.length
        try {
            let manifestsEndpoint = '/api/manifest/getmanifests';
            if (!currentUser.isAdmin) {
                manifestsEndpoint = '/api/manifest/getusermanifests';
            }

            const res = await fetch(`${manifestsEndpoint}?startIndex=${startIndex}`);
            const data = await res.json();

            if (res.ok) {

                setManifests((prev) => [...prev, ...data.manifests])
                
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
                setManifests((prev) => prev.filter((manifest) => manifest._id !== manifestIdToDelete))
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
                setManifests((prev) =>
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
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <Spinner size="xl" />
                </div>
            ) : (
                <>
                    {manifests.length > 0 ? (
                        <>
                            {!currentUser.isAdmin && (
                                <ManifestTotals
                                    totals={totals}
                                />
                            )}
                            <ManifestTable
                                manifests={manifests}
                                onDeleteManifest={(manifestId) => {
                                    setShowModal(true);
                                    setManifestIdToDelete(manifestId);
                                }}
                                onApproveManifest={handleApproveManifest}
                                isAdmin={currentUser.isAdmin}
                            />
                            {showMore && (
                                <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>Show more</button>
                            )}
                            <ManifestModal
                                show={showModal}
                                onClose={() => setShowModal(false)}
                                onDeleteManifest={handleDeleteManifest}
                            />
                        </>
                    ) : (
                        <p>You have no manifests yet!</p>
                    )}
                </>
            )}
        </div>
    );
}
