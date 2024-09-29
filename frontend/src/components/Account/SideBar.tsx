// SideBar.tsx
const SideBar = () => {
    return (
        <div style={{ 
            width: '200px', 
            height: '100vh', 
            padding: '20px', 
            borderRight: '1px solid #ccc', 
            boxSizing: 'border-box' 
        }}>
            <h2 style={{ marginTop: '100px' }}>Your Profile</h2>
            <h2 style={{ marginTop: '35px' }}>Update Profile</h2>
        </div>
    );
};

export default SideBar;
