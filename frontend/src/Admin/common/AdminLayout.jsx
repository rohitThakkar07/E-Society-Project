import React, { useState, useEffect, useRef } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useLocation } from 'react-router-dom';

import ScrollToTop from "../../components/ScrollToTop";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const mainRef = useRef(null);



  // Force light theme for Admin Portal to ensure consistent visibility
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.style.colorScheme = "light";
  }, []);

  return (
    <div className="flex bg-[#F3F6F9] h-screen overflow-hidden text-slate-900 font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <ScrollToTop containerRef={mainRef} />

          <div className="max-w-[1600px] mx-auto min-h-full">
            
              <div
                key={location.pathname}
               
               
               
               
              >
                <Outlet />
              </div>
            
          </div>
        </main>
      </div>
    </div>
  );
};


export default AdminLayout;