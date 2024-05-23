import { Button, Modal } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export default function DashTable() {
    const { currentUser } = useSelector((state) => state.user)
    const [users, setUsers] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`)
                const data = await res.json()
                if (res.ok) {
                    setUsers(data.users)
                    if (data.users.length < 9) {
                        setShowMore(false)
                    }
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        if (currentUser.isAdmin) {
            fetchUsers()
        }
    }, [currentUser._id])

    const handleShowMore = async () => {
        const startIndex = users.length
        try {
            const res =
                await fetch(`/api/user/getusers?startIndex=${startIndex}`)

            const data = await res.json()

            if (res.ok) {
                setUsers((prev) => [...prev, ...data.users])
                if (data.users.length < 9) {
                    setShowMore(false)
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='md:mx-auto p-3'>
            {
                currentUser.isAdmin && users.length > 0 ? (
                    <>
                        {
                            showMore && (
                                <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>Show more</button>
                            )
                        }
                    </>
                ) : (
                    <p>You have no users yet!</p>
                )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <h3 className='mb-5 text-lg text-gray-500 dark:tet-gray-400'>Are you sure you want to delete this user?</h3>
                        <div className="flex justify-center gap-4">
                            <Button color='failure' >Yes, I'm sure</Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>No,cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>)
}
