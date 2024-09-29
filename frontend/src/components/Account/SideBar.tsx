// Sidebar.tsx
import YourProfile from './YourProfile';
import UpdateProfile from './UpdateProfile';

const Sidebar = () => {
    return (
        <div style={{ width: '200px', height: '100vh', padding: '20px', borderRight: '1px solid #ccc', boxSizing: 'border-box' }}>
            <h2 style={{ marginTop: '20px' }}>Your Profile</h2>
            <YourProfile />
            <h2 style={{ marginTop: '20px' }}>Update Profile</h2>
            <UpdateProfile />
        </div>
    );
};

export default Sidebar;
