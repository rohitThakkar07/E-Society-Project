import React, { useState, useEffect, useRef } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="flex bg-[#F8FAFC] h-screen overflow-hidden text-slate-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto p-6 lg:p-10">
          <ScrollToTop containerRef={mainRef} />

          <div className="max-w-[1600px] mx-auto min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};


export default AdminLayout;