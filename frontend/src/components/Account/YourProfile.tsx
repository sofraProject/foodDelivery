import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

const YourProfile = () => {
    const { isAuthenticated, decodedUser } = useAuth();
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated && decodedUser?.id) {
                try {
                    const response = await axios.get(`${serverDomain}/api/users/${decodedUser.id}`);
                    setUserData(response.data);
                } catch (error) {
                    console.error("Error retrieving user data", error);
                }
            }
        };
        fetchUserData();
    }, [isAuthenticated, decodedUser]);

    if (!userData) {
        return <div className="mt-20 text-center">Loading...</div>;
    }

    // Replace backslashes with forward slashes
    const imageUrl = (userData.imageUrl ? userData.imageUrl.replace(/\\/g, '/') : 'uploads/default-avatar.jpg');

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center w-80">
                <Image
                    src={`${serverDomain}/${imageUrl}`}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="rounded-full border-4 border-blue-500 mx-auto mb-4"
                />
                <h2 className="text-xl font-bold mb-1">{userData.name}</h2>
                <p className="text-sm text-gray-600 mb-1">{userData.email}</p>
                <p className="text-md text-blue-500 mb-2">{userData.role}</p>
                <p className="text-xs text-gray-500">
                    {`Member since: ${new Date(userData.createdAt).toLocaleDateString()}`}
                </p>
            </div>
        </div>
    );
};

export default YourProfile;
