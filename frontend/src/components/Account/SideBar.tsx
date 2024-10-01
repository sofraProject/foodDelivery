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
                width: '200px',
                padding: '20px',
                backgroundColor: '#101827', // Dark background
                borderRight: '1px solid #ccc',
                boxSizing: 'border-box',
                marginTop: '105px',
                height: '745px'
            }}>
                <div 
                    onClick={() => onSelect('profile')}
                    style={{ 
                        padding: '10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s, color 0.3s',
                        color: '#BFF38A' // Default text color
                    }} 
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#34C759'; // Green background on hover
                        e.currentTarget.style.color = '#000000'; // Change text color to black
                    }} 
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'; // Reset background
                        e.currentTarget.style.color = '#BFF38A'; // Reset text color
                    }}
                >
                    <h2 style={{ margin: 0 }}>Your Profile</h2>
                </div>

                <div 
                    onClick={() => onSelect('update')}
                    style={{ 
                        padding: '10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '20px',
                        transition: 'background-color 0.3s, color 0.3s',
                        color: '#BFF38A' // Default text color
                    }} 
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#34C759'; // Green background on hover
                        e.currentTarget.style.color = '#000000'; // Change text color to black
                    }} 
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'; // Reset background
                        e.currentTarget.style.color = '#BFF38A'; // Reset text color
                    }}
                >
                    <h2 style={{ margin: 0 }}>Update Profile</h2>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
