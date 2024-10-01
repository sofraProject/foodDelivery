"use client";

import { useState } from 'react';
import Sidebar from '@/components/Account/SideBar';
import YourProfile from "@/components/Account/YourProfile";
import UpdateProfile from "@/components/Account/UpdateProfile";

const Account = () => {
    // State to manage the currently selected component
    const [selectedComponent, setSelectedComponent] = useState<'profile' | 'update'>('profile');

    // Function to render the selected component
    const renderComponent = () => {
        switch (selectedComponent) {
            case 'profile':
                return <YourProfile />;
            case 'update':
                return <UpdateProfile />;
            default:
                return <YourProfile />;
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            {/* Sidebar for selecting components */}
            <Sidebar onSelect={setSelectedComponent} />
            <div style={{ padding: '20px', flex: 1 }}>
                {/* Render the currently selected component */}
                {renderComponent()}
            </div>
        </div>
    );
};

export default Account;
