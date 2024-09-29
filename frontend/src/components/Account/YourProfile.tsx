// src/components/Account/YourProfile.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store'; // Adjust the path based on your structure

const YourProfile = () => {
    const user = useSelector((state: RootState) => state.users.user);

    if (!user) {
        return <div>Loading...</div>; // Handle loading state
    }

    return (
        <div>
            <h2>Your Profile</h2>
            <img src={user.imagesUrl || '/default-avatar.jpg'} alt="Profile" />
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            {/* Add more user fields as needed */}
        </div>
    );
};

export default YourProfile;
