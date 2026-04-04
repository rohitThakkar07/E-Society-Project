import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const DropBtn = ({ isOpen, onClick, icon, label, open, active }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
      active
        ? "text-white bg-slate-800"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    } ${!isOpen ? "justify-center" : ""}`}
  >
    {icon}
    {isOpen && (
      <>
        <span className="flex-1 text-left">{label}</span>
        <svg
          className={`w-4 h-4 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </>
    )}
  </button>
);

const SectionLabel = ({ isOpen, label }) =>
  isOpen ? (
    <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-3 pt-4 pb-1">{label}</p>
  ) : (
    <div className="border-t border-slate-800 my-2 mx-3" />
  );

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  // Auto-open dropdowns if current route is inside them
  const [openFinance,  setOpenFinance]  = useState(location.pathname.includes("/maintenance") || location.pathname.includes("/expense"));
  const [openFacility, setOpenFacility] = useState(location.pathname.includes("/facility"));
  const [openCommunity,setOpenCommunity]= useState(location.pathname.includes("/notice") || location.pathname.includes("/poll") || location.pathname.includes("/alert"));

  const navItem = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  const dropItem = ({ isActive }) =>
    `text-sm py-2 px-4 rounded-r-lg transition-colors border-l-2 ${
      isActive
        ? "text-blue-400 font-semibold border-blue-500 bg-blue-500/5"
        : "text-slate-500 border-slate-800 hover:text-white hover:border-slate-600"
    }`;


  return (
    <aside
      className={`bg-slate-900 text-white h-screen sticky top-0 left-0 z-40 transition-all duration-300 border-r border-slate-800 flex flex-col ${
        isOpen ? "w-72" : "w-20"
      }`}
    >
      {/* Branding */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800 mb-2 overflow-hidden whitespace-nowrap flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex-shrink-0 flex items-center justify-center font-black text-xl shadow-inner">
          E
        </div>
        {isOpen && <span className="ml-3 font-bold text-lg tracking-tight">E-SOCIETY</span>}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 pb-10 custom-scrollbar">

        {/* ── MAIN ─────────────────────────────────────────────────── */}
        <SectionLabel isOpen={isOpen} label="Main" />

        <NavLink to="/admin" end className={navItem} title="Dashboard">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {isOpen && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/admin/residents" className={navItem} title="Residents">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {isOpen && <span>Residents</span>}
        </NavLink>

        <NavLink to="/admin/flat/list" className={navItem} title="Flats">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {isOpen && <span>Flats</span>}
        </NavLink>

        <NavLink to="/admin/guards" className={navItem} title="Guards">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          {isOpen && <span>Guards</span>}
        </NavLink>

        {/* ── OPERATIONS ───────────────────────────────────────────── */}
        <SectionLabel isOpen={isOpen} label="Operations" />

        <NavLink to="/admin/visitors" className={navItem} title="Visitors">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          {isOpen && <span>Visitors</span>}
        </NavLink>

        <NavLink to="/admin/event/list" className={navItem} title="Events">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {isOpen && <span>Events</span>}
        </NavLink>

        <NavLink to="/admin/complaints" className={navItem} title="Complaints">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          {isOpen && <span>Complaints</span>}
        </NavLink>

        {/* Facility dropdown */}
        <div>
          <DropBtn
            isOpen={isOpen}
            onClick={() => setOpenFacility(!openFacility)}
            open={openFacility}
            active={location.pathname.includes("/facility")}
            label="Facility"
            icon={
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          {isOpen && openFacility && (
            <div className="mt-1 ml-6 flex flex-col space-y-0.5">
              <NavLink to="/admin/facility/dashboard" className={dropItem}>Dashboard</NavLink>
              <NavLink to="/admin/facility/book"      className={dropItem}>New Booking</NavLink>
              <NavLink to="/admin/facility-booking/list" className={dropItem}>Booking List</NavLink>
              <NavLink to="/admin/facility/calendar"  className={dropItem}>Calendar</NavLink>
            </div>
          )}
        </div>

        {/* ── FINANCE ──────────────────────────────────────────────── */}
        <SectionLabel isOpen={isOpen} label="Finance" />

        {/* Finance dropdown */}
        <div>
          <DropBtn
            isOpen={isOpen}
            onClick={() => setOpenFinance(!openFinance)}
            open={openFinance}
            active={location.pathname.includes("/maintenance") || location.pathname.includes("/expense")}
            label="Finance"
            icon={
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          {isOpen && openFinance && (
            <div className="mt-1 ml-6 flex flex-col space-y-0.5">
              <NavLink to="/admin/maintenance/dashboard" className={dropItem}>Maintenance</NavLink>
              <NavLink to="/admin/maintenance/list"      className={dropItem}>Maintenance List</NavLink>
              <NavLink to="/admin/maintenance/generate"      className={dropItem}>Generate Maintenance</NavLink>
              <NavLink to="/admin/payments" className={dropItem}>Payments</NavLink>
              <NavLink to="/admin/expense/dashboard"     className={dropItem}>Expense</NavLink>
              <NavLink to="/admin/expense/list"          className={dropItem}>Expense List</NavLink>
              <NavLink to="/admin/expense/report"        className={dropItem}>Expense Report</NavLink>
            </div>
          )}
        </div>

        {/* ── COMMUNITY ────────────────────────────────────────────── */}
        <SectionLabel isOpen={isOpen} label="Community" />

        {/* Community dropdown */}
        <div>
          <DropBtn
            isOpen={isOpen}
            onClick={() => setOpenCommunity(!openCommunity)}
            open={openCommunity}
            active={location.pathname.includes("/notice") || location.pathname.includes("/poll") || location.pathname.includes("/alert")}
            label="Community"
            icon={
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          {isOpen && openCommunity && (
            <div className="mt-1 ml-6 flex flex-col space-y-0.5">
              <NavLink to="/admin/notice/list"     className={dropItem}>Notice Board</NavLink>
              <NavLink to="/admin/poll/list"       className={dropItem}>Polls & Voting</NavLink>
              <NavLink to="/admin/alert/dashboard" className={dropItem}>Emergency Alerts</NavLink>
            </div>
          )}
        </div>

        {/* ── SETTINGS ─────────────────────────────────────────────── */}
        {/* <SectionLabel label="Settings" /> */}

        {/* <NavLink to="/admin/roles" className={navItem} title="Roles & Rights">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {isOpen && <span>Roles & Rights</span>}
        </NavLink> */}

      </nav>
    </aside>
  );
};

export default Sidebar;