// src/components/Account/UpdateProfile.tsx
import React, { useEffect, useState } from 'react';
import { RootState, AppDispatch } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../redux/features/authSlice'; // Adjust the import as needed
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

const UpdateProfile = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, decodedUser } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated && decodedUser?.id) {
                try {
                    const response = await axios.get(
                        `${serverDomain}/api/users/${decodedUser.id}`
                    );
                    setUserData(response.data);
                    setName(response.data.name);
                    setEmail(response.data.email);
                } catch (error) {
                    console.error("Error retrieving user data", error);
                }
            }
        };
        fetchUserData();
    }, [isAuthenticated, decodedUser]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userData) {
            console.error("User not found.");
            return; // Shouldn't happen, but safe to check
        }

        try {
            const response = await axios.put(`${serverDomain}/api/users/${userData.id}`, {
                name,
                email,
            });

            // Dispatch the updateUser action with the response data
            dispatch(updateUser(response.data)); // Make sure your updateUser action can handle the payload
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <div className="mt-52">
            <h2 className="text-xl font-bold mb-4">Update Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Update
                </button>
            </form>
        </div>
    );
};

export default UpdateProfile;
