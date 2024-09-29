// Sidebar.tsx
import React from 'react';

interface SidebarProps {
    onSelect: (component: 'profile' | 'update') => void; // Define allowed values
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
    return (
        <div style={{ width: '200px', height: '100vh', padding: '20px', borderRight: '1px solid #ccc', boxSizing: 'border-box' }}>
            <h2 style={{ marginTop: '100px', cursor: 'pointer' }} onClick={() => onSelect('profile')}>Your Profile</h2>
            <h2 style={{ marginTop: '20px', cursor: 'pointer' }} onClick={() => onSelect('update')}>Update Profile</h2>
        </div>
    );
};

export default Sidebar;
