import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Select } from 'flowbite-react';

const UserSelector = ({ onUserSelect }) => {
    const [users, setUsers] = useState([]);
    const { currentUser } = useSelector((state) => state.user);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`/api/user/getusers`);
            const data = await res.json();
            if (res.ok) {
                setUsers(data.users);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        if (currentUser.isAdmin) {
            fetchUsers();
        }
    }, [currentUser]);

    const handleUserChange = (event) => {
        const selectedUserId = event.target.value;
        onUserSelect(selectedUserId);
    };

    if (!currentUser.isAdmin) return null;

    return (
        <div className="mb-4">
            <Select onChange={handleUserChange} className="w-full">
                <option value="">Select a user</option>
                {users.map(user => (
                    <option key={user._id} value={user._id}>{user.username}</option>
                ))}
            </Select>
        </div>
    );
};

export default UserSelector;
