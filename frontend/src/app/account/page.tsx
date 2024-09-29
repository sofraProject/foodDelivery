"use client";

import SideBar from "@/components/Account/SideBar";

const Account = () => {
    return(
        <div style={{ display: 'flex' }}>
        <SideBar />
        <div style={{ padding: '20px', flex: 1 }}>
            {/* Main content can go here */}
        </div>
    </div>
    )
}

export default Account