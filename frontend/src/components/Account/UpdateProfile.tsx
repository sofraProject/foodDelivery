import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import Modal from './Modal';
import { useAuth } from '../../hooks/useAuth';

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

const UpdateProfile = () => {
    const { isAuthenticated, decodedUser } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated && decodedUser?.id) {
                try {
                    const response = await axios.get(`${serverDomain}/api/users/${decodedUser.id}`);
                    setUserData(response.data);
                    setName(response.data.name);
                    setEmail(response.data.email);
                    setProfilePicture(response.data.imageUrl);
                } catch (error) {
                    console.error("Error retrieving user data", error);
                }
            }
        };
        fetchUserData();
    }, [isAuthenticated, decodedUser]);

    const handleUpdateName = async () => {
        try {
            await axios.put(`${serverDomain}/api/users/${userData.id}`, { name });
            setIsEditingName(false);
        } catch (error) {
            console.error("Error updating name:", error);
        }
    };

    const handleUpdateEmail = async () => {
        try {
            await axios.put(`${serverDomain}/api/users/${userData.id}`, { email });
            setIsEditingEmail(false);
        } catch (error) {
            console.error("Error updating email:", error);
        }
    };

    const handleUpdatePassword = async () => {
        try {
            await axios.put(`${serverDomain}/api/users/${userData.id}/password`, { password: newPassword });
            setIsEditingPassword(false);
        } catch (error) {
            console.error("Error updating password:", error);
        }
    };

    return (
        <div className="flex items-start justify-start min-h-screen bg-gradient-to-r from-primary to-neutral p-4 mt-4">
            <div className="w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-left">Update Profile</h2>

                <div className="flex justify-between mb-4">
                    <span className="block text-sm font-medium">Name: {name}</span>
                    <span className="text-blue-600 cursor-pointer" onClick={() => setIsEditingName(true)}>Edit</span>
                </div>

                <div className="flex justify-between mb-4">
                    <span className="block text-sm font-medium">Email: {email}</span>
                    <span className="text-blue-600 cursor-pointer" onClick={() => setIsEditingEmail(true)}>Edit</span>
                </div>

                <div className="flex justify-between mb-4">
                    <span className="block text-sm font-medium">Change Password:</span>
                    <span className="text-blue-600 cursor-pointer" onClick={() => setIsEditingPassword(true)}>Edit</span>
                </div>

                {/* Profile Picture */}
                <h2 className="text-xl font-bold mt-6 mb-4 text-left">Profile Picture</h2>
                <div className="flex items-center justify-center mb-4">
                    <Image
                        src={`${serverDomain}/${profilePicture ? profilePicture.replace(/\\/g, '/') : 'uploads/default-avatar.jpg'}`}
                        alt="Profile"
                        width={160}
                        height={160}
                        className="rounded-full border-4 border-accent shadow-lg transform transition-transform duration-300 hover:scale-110"
                    />
                </div>

                {isEditingName && (
                    <Modal title="Edit your name" onClose={() => setIsEditingName(false)}>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-md"
                        />
                        <div className="flex justify-between mt-4">
                            <button onClick={() => setIsEditingName(false)} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">
                                Cancel
                            </button>
                            <button onClick={handleUpdateName} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Save
                            </button>
                        </div>
                    </Modal>
                )}

                {isEditingEmail && (
                    <Modal title="Edit your email" onClose={() => setIsEditingEmail(false)}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-md"
                        />
                        <div className="flex justify-between mt-4">
                            <button onClick={() => setIsEditingEmail(false)} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">
                                Cancel
                            </button>
                            <button onClick={handleUpdateEmail} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Save
                            </button>
                        </div>
                    </Modal>
                )}

                {isEditingPassword && (
                    <Modal title="Change your password" onClose={() => setIsEditingPassword(false)}>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-md"
                        />
                        <div className="flex justify-between mt-4">
                            <button onClick={() => setIsEditingPassword(false)} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">
                                Cancel
                            </button>
                            <button onClick={handleUpdatePassword} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Save
                            </button>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default UpdateProfile;
