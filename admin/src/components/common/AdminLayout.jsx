import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {Outlet} from 'react-router-dom';
const AdminLayout = ()=>{

    return (
        <>
        <Header/>
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar/>
            <div className="flex-1">
                <Outlet/>
            </div>

        </div>
        </>
    )
}
export default AdminLayout;