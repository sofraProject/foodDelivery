"use client";

import { useState } from 'react';
import Sidebar from '@/components/Account/SideBar';
import YourProfile from "@/components/Account/YourProfile";
import UpdateProfile from "@/components/Account/UpdateProfile";

const Account = () => {
    const [selectedComponent, setSelectedComponent] = useState<'profile' | 'update'>('profile'); // Define allowed values

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
            <Sidebar onSelect={setSelectedComponent} />
            <div style={{ padding: '20px', flex: 1 }}>
                {renderComponent()}
            </div>
        </div>
    );
};

export default Account;
