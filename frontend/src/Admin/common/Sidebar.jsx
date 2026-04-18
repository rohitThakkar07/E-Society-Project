import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const DropBtn = ({ isOpen, onClick, icon, label, open, active }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-[13px] font-medium group ${
      active ? "text-white bg-white/5" : "text-slate-400 hover:text-white hover:bg-white/5"
    } ${!isOpen ? "justify-center" : ""}`}
  >
    <span className={`flex-shrink-0 transition-colors ${active ? "text-[#4F6EF7]" : "text-slate-500 group-hover:text-slate-300"}`}>{icon}</span>
    {isOpen && (
      <>
        <span className="flex-1 text-left">{label}</span>
        <svg className={`w-3 h-3 transition-transform flex-shrink-0 opacity-50 ${open ? "rotate-180" : "-rotate-90"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M19 9l-7 7-7-7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </>
    )}
  </button>
);

const SectionLabel = ({ isOpen, label }) =>
  isOpen ? (
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] px-4 pt-6 pb-2 select-none">{label}</p>
  ) : (
    <div className="border-t border-slate-800/50 my-5 mx-4" />
  );

const Ico = ({ d, cls = "w-[18px] h-[18px] flex-shrink-0" }) => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={d} />
  </svg>
);

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const [openFacility,  setOpenFacility]  = useState(location.pathname.includes("/facility"));
  const [openCommunity, setOpenCommunity] = useState(
    location.pathname.includes("/notice") || location.pathname.includes("/poll")
  );

  /* nav-link class helper */
  const navItem = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-[13px] font-medium group ${
      isActive ? "text-white bg-[#4F6EF7]/10" : "text-slate-400 hover:text-white hover:bg-white/5"
    }`;

  const iconColor = (isActive) => isActive ? "text-[#4F6EF7]" : "text-slate-500 group-hover:text-slate-300 transition-colors";

  const dropItem = ({ isActive }) =>
    `text-[13px] py-1.5 px-3 rounded-md transition-colors flex items-center gap-2 font-medium ${
      isActive ? "text-[#4F6EF7] bg-[#4F6EF7]/5" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
    }`;

  return (
    <aside className={`text-white h-screen sticky top-0 left-0 z-40 transition-all duration-300 flex flex-col shadow-2xl border-r border-slate-800/40 ${isOpen ? "w-[260px]" : "w-0 opacity-0 -translate-x-full overflow-hidden"}`} style={{ background: "#111C2B" }}>

      {/* Brand Logo */}
      <div className="h-[70px] flex items-center px-5 border-b border-slate-800/50 overflow-hidden whitespace-nowrap flex-shrink-0">
        <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-black text-lg text-white shadow-lg overflow-hidden bg-gradient-to-br from-[#4F6EF7] to-[#8B5CF6]">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        {isOpen && (
          <div className="ml-3">
            <p className="font-bold text-white text-[20px] leading-none tracking-tight">e-Society</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-8 space-y-0.5 custom-scrollbar scrollbar-hide">

        <SectionLabel isOpen={isOpen} label="Menu" />

        <NavLink to="/admin" end className={navItem} title="Dashboard">
          {({ isActive }) => (
            <>
              <Ico d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" cls={`w-4 h-4 flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span>Dashboard</span>}
            </>
          )}
        </NavLink>

        <SectionLabel isOpen={isOpen} label="Pages" />

        <NavLink to="/admin/residents" className={navItem} title="Residents">
          {({ isActive }) => (
            <>
              <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" cls={`w-4 h-4 flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span>Residents</span>}
            </>
          )}
        </NavLink>

        <NavLink to="/admin/flat/list" className={navItem} title="Flats">
          {({ isActive }) => (
            <>
              <Ico d="M11 5h2M11 9h2M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" cls={`w-4 h-4 flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span>Flats</span>}
            </>
          )}
        </NavLink>

        <NavLink to="/admin/guards" className={navItem} title="Guards">
          {({ isActive }) => (
            <>
              <Ico d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" cls={`w-4 h-4 flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span>Guards</span>}
            </>
          )}
        </NavLink>

        <SectionLabel isOpen={isOpen} label="Apps" />

        <NavLink to="/admin/visitors" className={navItem} title="Visitors">
          {({ isActive }) => (
            <>
              <Ico d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" cls={`w-4 h-4 flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span>Visitors</span>}
            </>
          )}
        </NavLink>

        <NavLink to="/admin/event/list" className={navItem} title="Events">
          {({ isActive }) => (
            <>
              <Ico d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" cls={`w-4 h-4 flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span>Events</span>}
            </>
          )}
        </NavLink>

        <NavLink to="/admin/complaints" className={navItem} title="Complaints">
          {({ isActive }) => (
            <>
              <Ico d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" cls={`w-4 h-4 flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span>Complaints</span>}
            </>
          )}
        </NavLink>

        <SectionLabel isOpen={isOpen} label="Management" />

        {/* Facility */}
        <div>
          <DropBtn
            isOpen={isOpen}
            onClick={() => setOpenFacility(!openFacility)}
            open={openFacility}
            active={location.pathname.includes("/facility")}
            label="Facility"
            icon={<Ico d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" cls="w-4 h-4" />}
          />
          {isOpen && openFacility && (
            <div className="mt-1 ml-9 flex flex-col space-y-1">
              <NavLink to="/admin/facility/dashboard"     className={dropItem}>Dashboard</NavLink>
              <NavLink to="/admin/facility-booking/list"  className={dropItem}>Bookings</NavLink>
              <NavLink to="/admin/facility/calendar"      className={dropItem}>Calendar</NavLink>
            </div>
          )}
        </div>

        <NavLink
          to="/admin/maintenance/dashboard"
          className={navItem}
          title="Maintenance"
        >
          {({ isActive }) => (
            <>
              <Ico d="M9 17v-2m3 2v-4m3 4v-6m2 10H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z" cls={`w-4 h-4 flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span>Maintenance</span>}
            </>
          )}
        </NavLink>

        <NavLink
          to="/admin/expense/dashboard"
          className={navItem}
          title="Expense"
        >
          {({ isActive }) => (
            <>
              <Ico d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" cls={`w-4 h-4 flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span>Expense</span>}
            </>
          )}
        </NavLink>

        <NavLink to="/admin/payments" className={navItem} title="Payments" >
          {({ isActive }) => (
            <>
              <Ico d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" cls={`w-4 h-4 flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span>Payments</span>}
            </>
          )}
        </NavLink>

        <SectionLabel isOpen={isOpen} label="General" />

        <div>
          <DropBtn
            isOpen={isOpen}
            onClick={() => setOpenCommunity(!openCommunity)}
            open={openCommunity}
            active={location.pathname.includes("/notice") || location.pathname.includes("/poll")}
            label="Community"
            icon={<Ico d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />}
          />
          {isOpen && openCommunity && (
            <div className="mt-1 ml-9 flex flex-col space-y-1 pr-2">
              <NavLink to="/admin/notice/list"     className={dropItem}>Notice Board</NavLink>
              <NavLink to="/admin/poll/list"       className={dropItem}>Polls &amp; Voting</NavLink>
            </div>
          )}
        </div>

      </nav>
    </aside>
  );
};

export default Sidebar;