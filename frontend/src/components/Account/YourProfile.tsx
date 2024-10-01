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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-primary to-neutral p-4">
            <div className="bg-secondary rounded-lg shadow-2xl p-8 flex flex-col items-center w-full h-auto max-w-md mx-auto transition-transform transform hover:scale-105">
                <div className="relative mb-4 z-10">
                    <Image
                        src={`${serverDomain}/${userData.imageUrl}`}
                        alt="Profile"
                        width={160}
                        height={160}
                        className="rounded-full border-4 border-accent shadow-lg transform transition-transform duration-300 hover:scale-110"
                    />
                </div>
                <h2 className="text-dark text-3xl font-bold mb-1 z-10">{userData.name}</h2>
                <p className="text-lightText text-sm mb-1 z-10">{userData.email}</p>
                <p className="text-success text-md font-medium mb-4 z-10">{userData.role}</p>
                <p className="text-lightText text-xs z-10 text-center">
                    {`Member since: ${new Date(userData.createdAt).toLocaleDateString()}`}
                </p>
            </div>
        </div>
    );
    
    
    
    
    
    
    
    
    
};

export default YourProfile;
