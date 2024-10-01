// Sidebar.tsx
import React from 'react';

// Define props for the Sidebar component
interface SidebarProps {
    onSelect: (component: 'profile' | 'update') => void; // Function to handle component selection
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ 
                width: '200px',           // Fixed width for sidebar
                padding: '20px',         // Padding inside the sidebar
                backgroundColor: '#101827', // Dark background
                borderRight: '1px solid #ccc', // Right border for separation
                boxSizing: 'border-box',  // Include padding and border in element's total width and height
                marginTop: '105px',      // Align with the "Your Profile" heading
                height: '745px'          // Fixed height for sidebar
            }}>
                <h2 style={{ 
                    cursor: 'pointer',      // Pointer cursor on hover
                    color: '#BFF38A'        // Glovo yellow for accent
                }} onClick={() => onSelect('profile')}>
                    Your Profile
                </h2>
                <h2 style={{ 
                    marginTop: '20px',      // Space between items
                    cursor: 'pointer',      // Pointer cursor on hover
                    color: '#BFF38A'        // Glovo yellow for accent
                }} onClick={() => onSelect('update')}>
                    Update Profile
                </h2>
            </div>
        </div>
    );
};

export default Sidebar;
