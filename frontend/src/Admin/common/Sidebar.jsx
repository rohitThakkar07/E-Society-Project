import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

/* ── Drop-down button ───────────────────────────────────────────────────── */
const DropBtn = ({ isOpen, onClick, icon, label, open, active }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
      active ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    } ${!isOpen ? "justify-center" : ""}`}
  >
    <span className="flex-shrink-0">{icon}</span>
    {isOpen && (
      <>
        <span className="flex-1 text-left">{label}</span>
        <svg className={`w-4 h-4 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M19 9l-7 7-7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </>
    )}
  </button>
);

/* ── Section divider ────────────────────────────────────────────────────── */
const SectionLabel = ({ isOpen, label }) =>
  isOpen ? (
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pt-5 pb-1.5">{label}</p>
  ) : (
    <div className="border-t border-slate-100 my-3 mx-3" />
  );

/* ── Icon helper ────────────────────────────────────────────────────────── */
const Ico = ({ d, cls = "w-[18px] h-[18px] flex-shrink-0" }) => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════════════ */
const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const [openFacility,  setOpenFacility]  = useState(location.pathname.includes("/facility"));
  const [openCommunity, setOpenCommunity] = useState(
    location.pathname.includes("/notice") || location.pathname.includes("/poll")
  );

  /* nav-link class helper */
  const navItem = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
      isActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;

  /* sub-item class helper */
  const dropItem = ({ isActive }) =>
    `text-[13px] py-2 px-3 rounded-lg transition-colors flex items-center gap-2 ${
      isActive ? "text-blue-700 font-semibold bg-blue-50" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
    }`;

  return (
    <aside className={`bg-white text-slate-800 h-screen sticky top-0 left-0 z-40 transition-all duration-300 border-r border-slate-200 flex flex-col shadow-sm ${isOpen ? "w-64" : "w-[70px]"}`}>

      {/* ── Brand ── */}
      <div className="h-[70px] flex items-center px-4 border-b border-slate-100 mb-1 overflow-hidden whitespace-nowrap flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex-shrink-0 flex items-center justify-center font-black text-lg text-white shadow-md">E</div>
        {isOpen && (
          <div className="ml-3">
            <p className="font-black text-slate-900 text-base leading-none">E-SOCIETY</p>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Admin Portal</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-10 space-y-0.5" style={{ scrollbarWidth: "none" }}>

        {/* ── MAIN ── */}
        {/* <SectionLabel isOpen={isOpen} label="Main" /> */}

        <NavLink to="/admin" end className={navItem} title="Dashboard">
          <Ico d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          {isOpen && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/admin/residents" className={navItem} title="Residents">
          <Ico d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          {isOpen && <span>Residents</span>}
        </NavLink>

        <NavLink to="/admin/flat/list" className={navItem} title="Flats">
          <Ico d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          {isOpen && <span>Flats</span>}
        </NavLink>

        <NavLink to="/admin/guards" className={navItem} title="Guards">
          <Ico d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          {isOpen && <span>Guards</span>}
        </NavLink>

        {/* ── OPERATIONS ── */}
        {/* <SectionLabel isOpen={isOpen} label="Operations" /> */}

        <NavLink to="/admin/visitors" className={navItem} title="Visitors">
          <Ico d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          {isOpen && <span>Visitors</span>}
        </NavLink>

        <NavLink to="/admin/event/list" className={navItem} title="Events">
          <Ico d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          {isOpen && <span>Events</span>}
        </NavLink>

        <NavLink to="/admin/complaints" className={navItem} title="Complaints">
          <Ico d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          {isOpen && <span>Complaints</span>}
        </NavLink>

        {/* Facility (dropdown) */}
        <div>
          <DropBtn
            isOpen={isOpen}
            onClick={() => setOpenFacility(!openFacility)}
            open={openFacility}
            active={location.pathname.includes("/facility")}
            label="Facility"
            icon={<Ico d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />}
          />
          {isOpen && openFacility && (
            <div className="mt-1 ml-8 flex flex-col space-y-0.5 border-l-2 border-slate-100 pl-3">
              <NavLink to="/admin/facility/dashboard"     className={dropItem}>Dashboard</NavLink>
              <NavLink to="/admin/facility-booking/list"  className={dropItem}>Bookings</NavLink>
              <NavLink to="/admin/facility/calendar"      className={dropItem}>Calendar</NavLink>
            </div>
          )}
        </div>

        {/* ── MAINTENANCE (separate) ── */}
        {/* <SectionLabel isOpen={isOpen} label="Maintenance" /> */}

        <NavLink
          to="/admin/maintenance/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
              isActive || location.pathname.includes("/maintenance")
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`
          }
          title="Maintenance"
        >
          <Ico d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          {isOpen && <span>Maintenance</span>}
        </NavLink>

        {/* ── EXPENSE (separate) ── */}
        {/* <SectionLabel isOpen={isOpen} label="Expense" /> */}

        <NavLink
          to="/admin/expense/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
              isActive || location.pathname.includes("/expense")
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`
          }
          title="Expense"
        >
          <Ico d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          {isOpen && <span>Expense</span>}
        </NavLink>

        {/* ── PAYMENTS ── */}
        {/* <SectionLabel isOpen={isOpen} label="Payments" /> */}

        <NavLink to="/admin/payments" className={navItem} title="Payments">
          <Ico d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          {isOpen && <span>Payments</span>}
        </NavLink>

        {/* ── COMMUNITY ── */}
        {/* <SectionLabel isOpen={isOpen} label="Community" /> */}

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
            <div className="mt-1 ml-8 flex flex-col space-y-0.5 border-l-2 border-slate-100 pl-3">
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