import React, { useEffect, useState } from 'react';
import { RootState, AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/features/authSlice';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

const UpdateProfile = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, decodedUser } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

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

    const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userData) return; 

        try {
            const response = await axios.put(`${serverDomain}/api/users/${userData.id}`, {
                name,
                email,
            });
            dispatch(updateUser(response.data));
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userData) return;

        try {
            const response = await axios.put(`${serverDomain}/api/users/${userData.id}/password`, {
                password: newPassword,
            });
            console.log("Password updated successfully:", response.data);
        } catch (error) {
            console.error("Error updating password:", error);
        }
    };

    const handleProfilePictureSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userData || !profilePicture) return;

        const formData = new FormData();
        formData.append('profilePicture', profilePicture);

        try {
            const response = await axios.put(`${serverDomain}/api/users/${userData.id}/profile-picture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            dispatch(updateUser(response.data));
        } catch (error) {
            console.error("Error updating profile picture:", error);
        }
    };

    return (
        <div className="mt-52 flex justify-center space-x-8">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Update Profile</h2>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
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
                    <div>
                        <label className="block text-sm font-medium">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Update
                    </button>
                </form>

                <h2 className="text-xl font-bold mt-6 mb-4">Update Profile Picture</h2>
                <form onSubmit={handleProfilePictureSubmit} className="space-y-4">
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Update Picture
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;
