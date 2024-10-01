// Sidebar.tsx
import React from 'react';

interface SidebarProps {
    onSelect: (component: 'profile' | 'update') => void; // Define allowed values
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ 
                width: '200px', 
                padding: '20px', 
                backgroundColor: '#101827', // Dark background
                borderRight: '1px solid #ccc', 
                boxSizing: 'border-box', 
                marginTop: '105px', // Align with the "Your Profile" heading
                height: '745px'
            }}>
                <h2 style={{ 
                    cursor: 'pointer', 
                    color: '#BFF38A' // Glovo yellow for accent
                }} onClick={() => onSelect('profile')}>
                    Your Profile
                </h2>
                <h2 style={{ 
                    marginTop: '20px', 
                    cursor: 'pointer', 
                    color: '#BFF38A' // Glovo yellow for accent
                }} onClick={() => onSelect('update')}>
                    Update Profile
                </h2>
            </div>
            
        </div>
    );
    
    
};

export default Sidebar;
