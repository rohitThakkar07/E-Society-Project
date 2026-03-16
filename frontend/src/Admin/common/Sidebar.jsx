import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const [openFinance, setOpenFinance] = useState(false);
  const [openFacility, setOpenFacility] = useState(false);

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
      isActive 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  const dropdownItemClass = ({ isActive }) =>
    `text-sm py-2 px-4 rounded-r-lg transition-colors border-l-2 ${
      isActive 
        ? "text-blue-500 font-bold border-blue-500 bg-blue-500/5" 
        : "text-slate-500 border-slate-800 hover:text-white hover:border-slate-600"
    }`;

  return (
    <aside 
      className={`bg-slate-900 text-white h-screen sticky top-0 left-0 z-40 transition-all duration-300 border-r border-slate-800 flex flex-col ${
        isOpen ? "w-72" : "w-20"
      }`}
    >
      {/* Branding */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800 mb-4 overflow-hidden whitespace-nowrap">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex-shrink-0 flex items-center justify-center font-black text-xl shadow-inner">
          E
        </div>
        {isOpen && <span className="ml-3 font-bold text-lg tracking-tight">E-SOCIETY</span>}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar pb-10">
        
        {/* --- Single Links --- */}
        <NavLink to="/admin" end className={navItemClass} title="Dashboard">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          {isOpen && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/admin/residents" className={navItemClass} title="Residents">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {isOpen && <span>Residents</span>}
        </NavLink>

        <NavLink to="/admin/guards" className={navItemClass} title="Guards">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          {isOpen && <span>Guards</span>}
        </NavLink>

        {/* --- Finance Dropdown --- */}
        <div className="pt-1">
          <button onClick={() => setOpenFinance(!openFinance)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-slate-400 hover:bg-slate-800 hover:text-white ${!isOpen && "justify-center"}`}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {isOpen && <><span className="flex-1 text-left">Finance</span><svg className={`w-4 h-4 transition-transform ${openFinance ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg></>}
          </button>
          {isOpen && openFinance && (
            <div className="mt-1 ml-6 flex flex-col">
              <NavLink to="/admin/maintenance/dashboard" className={dropdownItemClass}>Maintenance</NavLink>
              <NavLink to="/admin/expense/dashboard" className={dropdownItemClass}>Expense</NavLink>
            </div>
          )}
        </div>

        {/* --- Facility Dropdown --- */}
        <div className="pt-1">
          <button onClick={() => setOpenFacility(!openFacility)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-slate-400 hover:bg-slate-800 hover:text-white ${!isOpen && "justify-center"}`}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            {isOpen && <><span className="flex-1 text-left">Facility</span><svg className={`w-4 h-4 transition-transform ${openFacility ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg></>}
          </button>
          {isOpen && openFacility && (
            <div className="mt-1 ml-6 flex flex-col">
              <NavLink to="/admin/facility/dashboard" className={dropdownItemClass}>Dashboard</NavLink>
              <NavLink to="/admin/facility/book" className={dropdownItemClass}>New Booking</NavLink>
              <NavLink to="/admin/facility/list" className={dropdownItemClass}>Booking List</NavLink>
            </div>
          )}
        </div>

        {/* --- Remaining Single Links --- */}
        <NavLink to="/admin/visitors" className={navItemClass} title="Visitors">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          {isOpen && <span>Visitors</span>}
        </NavLink>

        <NavLink to="/admin/complaints" className={navItemClass} title="Complaints">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
          {isOpen && <span>Complaints</span>}
        </NavLink>

        <NavLink to="/admin/flats" className={navItemClass} title="Flats">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          {isOpen && <span>Flats</span>}
        </NavLink>

        <NavLink to="/admin/roles" className={navItemClass} title="Roles">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          {isOpen && <span>Roles & Rights</span>}
        </NavLink>

      </nav>
    </aside>
  );
};

export default Sidebar;