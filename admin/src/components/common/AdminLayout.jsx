import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {Outlet} from 'react-router-dom';
const AdminLayout = ()=>{
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar isOpen={sidebarOpen} />
            <div className="flex-1">
                <Outlet/>
            </div>

        </div>
        </>
    )
}
export default AdminLayout;