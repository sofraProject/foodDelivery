import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import { useAuth } from '../../hooks/useAuth';
import Image from 'next/image';

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

const UpdateProfile = () => {
    const { isAuthenticated, decodedUser } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const fetchUserData = async () => {
        if (isAuthenticated && decodedUser?.id) {
            try {
                const response = await axios.get(`${serverDomain}/api/users/${decodedUser.id}`);
                setUserData(response.data);
                setName(response.data.name);
                setEmail(response.data.email);
            } catch (error) {
                console.error("Error retrieving user data", error);
            }
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [isAuthenticated, decodedUser]);

    const handleUpdateName = async () => {
        try {
            await axios.put(`${serverDomain}/api/users/${userData.id}`, { name });
            setIsEditingName(false);
            fetchUserData(); // Refresh data after update
        } catch (error) {
            console.error("Error updating name:", error);
        }
    };

    const handleUpdateEmail = async () => {
        try {
            await axios.put(`${serverDomain}/api/users/${userData.id}`, { email });
            setIsEditingEmail(false);
            fetchUserData(); // Refresh data after update
        } catch (error) {
            console.error("Error updating email:", error);
        }
    };

    const handleUpdatePassword = async () => {
        try {
            await axios.put(`${serverDomain}/api/users/${userData.id}/password`, { password: newPassword });
            setIsEditingPassword(false);
            fetchUserData(); // Refresh data after update
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
            await axios.put(`${serverDomain}/api/users/${userData.id}/profile-picture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchUserData(); // Refresh data after update
            setProfilePicture(null); // Reset the profile picture state
        } catch (error) {
            console.error("Error updating profile picture:", error);
        }
    };

    if (!userData) return <div>Loading...</div>;

    return (
        <div className="flex items-start justify-start min-h-screen bg-gradient-to-r from-[#BFF38A] to-[#F2F2F2] p-4">
            <div className="w-full max-w-md mt-24">
                <h2 className="text-2xl font-bold mb-6 text-left text-[#101827]">Update Profile</h2>

                <div className="flex justify-between mb-4">
                    <span className="block text-lg font-semibold text-[#101827]">{name}</span>
                    <span className="text-[#34C759] cursor-pointer ml-auto" onClick={() => setIsEditingName(true)}>Edit</span>
                </div>

                <div className="flex justify-between mb-4">
                    <span className="block text-lg font-semibold text-[#101827]">{email}</span>
                    <span className="text-[#34C759] cursor-pointer ml-auto" onClick={() => setIsEditingEmail(true)}>Edit</span>
                </div>

                <div className="flex justify-between mb-4">
                    <span className="block text-lg font-semibold text-[#101827]">Change Password:</span>
                    <span className="text-[#34C759] cursor-pointer ml-auto" onClick={() => setIsEditingPassword(true)}>Edit</span>
                </div>

                {isEditingName && (
                    <Modal title="Edit your name" onClose={() => setIsEditingName(false)} onSave={handleUpdateName}>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full p-2 border border-[#e0ffbc] rounded-md"
                        />
                    </Modal>
                )}

                {isEditingEmail && (
                    <Modal title="Edit your email" onClose={() => setIsEditingEmail(false)} onSave={handleUpdateEmail}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full p-2 border border-[#e0ffbc] rounded-md"
                        />
                    </Modal>
                )}

                {isEditingPassword && (
                    <Modal title="Change your password" onClose={() => setIsEditingPassword(false)} onSave={handleUpdatePassword}>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full p-2 border border-[#e0ffbc] rounded-md"
                        />
                    </Modal>
                )}

                <h2 className="text-xl font-bold mt-6 mb-4 text-left text-[#101827]">Update Profile Picture</h2>
                <form onSubmit={handleProfilePictureSubmit} className="space-y-4">
                    <div>
                        <Image
                            src={`${serverDomain}/${userData.imageUrl}`}
                            alt="Profile"
                            width={160}
                            height={160}
                            className="rounded-full border-4 border-[#34C759] shadow-lg"
                        />
                    </div>
                    <label className="flex items-center mt-1">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                            className="hidden"
                        />
                        <span className="inline-block p-2 bg-[#34C759] text-white rounded-md cursor-pointer hover:bg-[#2b9c43]">
                            Choose File
                        </span>
                    </label>
                    <button type="submit" className="mt-4 px-4 py-2 bg-[#34C759] text-white rounded-md hover:bg-[#2b9c43]">
                        Update Picture
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;
