import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const DropBtn = ({ isOpen, onClick, icon, label, open, active }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-[15px] py-[11px] transition-all text-[14.5px] font-medium group ${
      active ? "text-[#727cf5]" : "text-[#97a1af] hover:text-white"
    } ${isOpen ? "px-[25px]" : "justify-center px-0"}`}
  >
    <span className={`flex-shrink-0 transition-colors ${active ? "text-[#727cf5]" : "text-[#97a1af] group-hover:text-white"}`}>{icon}</span>
    {isOpen && (
      <>
        <span className="flex-1 text-left whitespace-nowrap">{label}</span>
        <svg className={`w-[14px] h-[14px] transition-transform duration-300 flex-shrink-0 opacity-60 ${open ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </>
    )}
  </button>
);

const SectionLabel = ({ isOpen, label }) =>
  isOpen ? (
    <p className="text-[11px] font-bold text-[#424e5e] uppercase tracking-[1px] px-[25px] pt-[25px] pb-[10px] select-none whitespace-nowrap">{label}</p>
  ) : (
    <div className="border-t border-gray-700/20 my-5 mx-4" />
  );

const Ico = ({ d, cls = "w-[18px] h-[18px] flex-shrink-0" }) => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={d} />
  </svg>
);

const SubIcon = ({ isActive }) => (
  <svg className={`w-[12px] h-[12px] flex-shrink-0 transition-colors duration-200 ${isActive ? "text-[#727cf5]" : "text-[#97a1af]/50 group-hover:text-white"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
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
    `flex items-center gap-[15px] py-[11px] transition-all text-[14.5px] font-medium group ${
      isActive ? "text-[#727cf5]" : "text-[#97a1af] hover:text-white"
    } ${isOpen ? "px-[25px]" : "justify-center px-0"}`;

  const iconColor = (isActive) => isActive ? "text-[#727cf5]" : "text-[#97a1af] group-hover:text-white transition-colors";

  const dropItem = ({ isActive }) =>
    `text-[14px] py-[9px] pl-[55px] pr-[20px] transition-all flex items-center gap-[12px] font-medium group ${
      isActive ? "text-[#727cf5]" : "text-[#97a1af] hover:text-white"
    }`;

  return (
    <aside className={`h-screen sticky top-0 left-0 z-40 transition-all duration-300 ease-in-out flex flex-col overflow-hidden ${isOpen ? "w-[240px]" : "w-[75px]"}`} style={{ background: "#0b1222" }}>

      {/* Brand Logo */}
      <div className={`h-[75px] flex items-center whitespace-nowrap flex-shrink-0 ${isOpen ? "px-[25px]" : "justify-center px-0"}`}>
        {isOpen ? (
          <div className="flex items-center font-['Public_Sans',_sans-serif]">
            <span className="text-[#727cf5] font-normal text-[22px] tracking-tight ml-0.5">e-</span>
            <span className="text-white font-bold text-[22px] tracking-tight">Society</span>
          </div>
        ) : (
          <div className="flex items-center font-['Public_Sans',_sans-serif]">
            <span className="text-[#727cf5] font-bold text-[24px] tracking-tight">e</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden pb-10 space-y-0 custom-scrollbar scrollbar-hide">

        <SectionLabel isOpen={isOpen} label="Main" />

        <NavLink to="/admin" end className={navItem}>
          {({ isActive }) => (
            <>
              <Ico d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" cls={`w-[18px] h-[18px] flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span className="whitespace-nowrap">Dashboard</span>}
            </>
          )}
        </NavLink>

        <SectionLabel isOpen={isOpen} label="Apps" />

        <NavLink to="/admin/residents" className={navItem}>
          {({ isActive }) => (
            <>
              <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" cls={`w-[18px] h-[18px] flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span className="whitespace-nowrap">Residents</span>}
            </>
          )}
        </NavLink>

        <NavLink to="/admin/flat/list" className={navItem}>
          {({ isActive }) => (
            <>
              <Ico d="M11 5h2M11 9h2M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" cls={`w-[18px] h-[18px] flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span className="whitespace-nowrap">Flats</span>}
            </>
          )}
        </NavLink>

        <NavLink to="/admin/guards" className={navItem}>
          {({ isActive }) => (
            <>
              <Ico d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" cls={`w-[18px] h-[18px] flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span className="whitespace-nowrap">Guards</span>}
            </>
          )}
        </NavLink>

        <NavLink to="/admin/visitors" className={navItem}>
          {({ isActive }) => (
            <>
              <Ico d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" cls={`w-[18px] h-[18px] flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span className="whitespace-nowrap">Visitors</span>}
            </>
          )}
        </NavLink>

        <NavLink to="/admin/event/list" className={navItem}>
          {({ isActive }) => (
            <>
              <Ico d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" cls={`w-[18px] h-[18px] flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span className="whitespace-nowrap">Events</span>}
            </>
          )}
        </NavLink>

        <NavLink to="/admin/complaints" className={navItem}>
          {({ isActive }) => (
            <>
              <Ico d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" cls={`w-[18px] h-[18px] flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span className="whitespace-nowrap">Complaints</span>}
            </>
          )}
        </NavLink>

        <SectionLabel isOpen={isOpen} label="Management" />

        <div>
          <DropBtn
            isOpen={isOpen}
            onClick={() => setOpenFacility(!openFacility)}
            open={openFacility}
            active={location.pathname.includes("/facility")}
            label="Facility"
            icon={<Ico d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />}
          />
          <div className={`grid transition-all duration-300 ease-in-out ${isOpen && openFacility ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">
              <div className="flex flex-col space-y-0 py-1">
                <NavLink to="/admin/facility/dashboard" className={dropItem}>
                  {({ isActive }) => <><SubIcon isActive={isActive} /> <span className="whitespace-nowrap">Dashboard</span></>}
                </NavLink>
                <NavLink to="/admin/facility-booking/list" className={dropItem}>
                  {({ isActive }) => <><SubIcon isActive={isActive} /> <span className="whitespace-nowrap">Bookings</span></>}
                </NavLink>
                <NavLink to="/admin/facility/calendar" className={dropItem}>
                  {({ isActive }) => <><SubIcon isActive={isActive} /> <span className="whitespace-nowrap">Calendar</span></>}
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        <NavLink to="/admin/maintenance/dashboard" className={navItem}>
          {({ isActive }) => (
            <>
              <Ico d="M9 17v-2m3 2v-4m3 4v-6m2 10H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z" cls={`w-[18px] h-[18px] flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span className="whitespace-nowrap">Maintenance</span>}
            </>
          )}
        </NavLink>

        <NavLink to="/admin/expense/dashboard" className={navItem}>
          {({ isActive }) => (
            <>
              <Ico d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" cls={`w-[18px] h-[18px] flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span className="whitespace-nowrap">Expense</span>}
            </>
          )}
        </NavLink>

        <NavLink to="/admin/payments" className={navItem}>
          {({ isActive }) => (
            <>
              <Ico d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" cls={`w-[18px] h-[18px] flex-shrink-0 ${iconColor(isActive)}`} />
              {isOpen && <span className="whitespace-nowrap">Payments</span>}
            </>
          )}
        </NavLink>

        <div>
          <DropBtn
            isOpen={isOpen}
            onClick={() => setOpenCommunity(!openCommunity)}
            open={openCommunity}
            active={location.pathname.includes("/notice") || location.pathname.includes("/poll")}
            label="Community"
            icon={<Ico d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />}
          />
          <div className={`grid transition-all duration-300 ease-in-out ${isOpen && openCommunity ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">
              <div className="flex flex-col space-y-0 py-1">
                <NavLink to="/admin/notice/list" className={dropItem}>
                  {({ isActive }) => <><SubIcon isActive={isActive} /> <span className="whitespace-nowrap">Notice Board</span></>}
                </NavLink>
                <NavLink to="/admin/poll/list" className={dropItem}>
                  {({ isActive }) => <><SubIcon isActive={isActive} /> <span className="whitespace-nowrap">Polls &amp; Voting</span></>}
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;