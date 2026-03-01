import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const [openModules, setOpenModules] = useState(false);

  return (
    <aside className={`bg-gray-900 text-white min-h-screen transition-all duration-300 overflow-hidden ${isOpen ? "w-64 p-5" : "w-20 p-3"}`}>
      <nav className="flex flex-col gap-2">
        {/* Dashboard */}
        <NavLink to="/" end className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-colors ${
          isActive ? "bg-blue-600 text-white font-semibold" : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`} title="Dashboard">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          {isOpen && <span>Dashboard</span>}
        </NavLink>

        {/* Residents */}
        <NavLink to="/residents" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-colors ${
          isActive ? "bg-blue-600 text-white font-semibold" : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`} title="Residents">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 12a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          {isOpen && <span>Residents</span>}
        </NavLink>

        {/* Guards */}
        <NavLink to="/guards" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-colors ${
          isActive ? "bg-blue-600 text-white font-semibold" : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`} title="Security Guards">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          {isOpen && <span>Guards</span>}
        </NavLink>

        {/* Visitors */}
        <NavLink to="/visitors" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-colors ${
          isActive ? "bg-blue-600 text-white font-semibold" : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`} title="Visitors">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          {isOpen && <span>Visitors</span>}
        </NavLink>

        {/* Payments */}
        <NavLink to="/payments" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-colors ${
          isActive ? "bg-blue-600 text-white font-semibold" : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`} title="Payments">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
          {isOpen && <span>Payments</span>}
        </NavLink>

        {/* Expenses */}
        <NavLink to="/expenses" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-colors ${
          isActive ? "bg-blue-600 text-white font-semibold" : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`} title="Expenses">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          {isOpen && <span>Expenses</span>}
        </NavLink>


        {/* Modules Dropdown */}
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setOpenModules((prev) => !prev)}
            aria-expanded={openModules}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
            title="Modules"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm10 0a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2V5zM2 13a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6zm10 0a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2v-6z" />
            </svg>
            {isOpen && <span className="font-medium">Modules</span>}
            {isOpen && (
              <svg className={`w-4 h-4 ml-auto transform transition-transform ${openModules ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {isOpen && (
            <div className={`mt-2 pl-3 pr-1 transition-all ${openModules ? "block" : "hidden"}`}>
              <NavLink to="/maintenance" className={({ isActive }) => `flex items-center gap-3 p-2 rounded-md ${
                isActive ? "bg-blue-600 text-white font-semibold" : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 17v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" />
                </svg>
                Maintenance
              </NavLink>
            </div>
          )}
        </div>

        {/* Complaints */}
        <NavLink to="/complaints" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-colors ${
          isActive ? "bg-blue-600 text-white font-semibold" : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`} title="Complaints">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
          </svg>
          {isOpen && <span>Complaints</span>}
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;