import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

/* ─── Icons ─────────────────────────────────────────────────────────────── */
const Ico = ({ d, size = 18 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"
    style={{ flexShrink: 0 }} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}>
    <path d={d} />
  </svg>
);

const ChevronRight = ({ open }) => (
  <svg width={13} height={13} fill="none" stroke="currentColor" viewBox="0 0 24 24"
    style={{ flexShrink: 0, transition: "transform 0.25s ease", transform: open ? "rotate(90deg)" : "rotate(0deg)", opacity: 0.5 }}
    strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

const ArrowDot = ({ active }) => (
  <svg width={6} height={6} viewBox="0 0 6 6" style={{ flexShrink: 0 }}>
    <circle cx={3} cy={3} r={3} fill={active ? "#6c63ff" : "rgba(255,255,255,0.18)"} />
  </svg>
);

/* ─── Section divider / label ────────────────────────────────────────────── */
const SectionLabel = ({ isOpen, label }) =>
  isOpen ? (
    <p style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
      color: "#3d4f6b", textTransform: "uppercase",
      padding: "22px 22px 8px", userSelect: "none", whiteSpace: "nowrap"
    }}>{label}</p>
  ) : (
    <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "18px 16px" }} />
  );

/* ─── Shared nav styles ──────────────────────────────────────────────────── */
const getNavStyle = (isActive, isOpen) => ({
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: isOpen ? "10px 16px 10px 20px" : "10px 0",
  justifyContent: isOpen ? "flex-start" : "center",
  borderRadius: 10,
  margin: "1px 10px",
  cursor: "pointer",
  textDecoration: "none",
  fontSize: 13.5,
  fontWeight: isActive ? 600 : 500,
  fontFamily: "'DM Sans', sans-serif",
  letterSpacing: "0.01em",
  color: isActive ? "#fff" : "#6b7f96",
  background: isActive
    ? "linear-gradient(135deg, rgba(108,99,255,0.25) 0%, rgba(108,99,255,0.12) 100%)"
    : "transparent",
  boxShadow: isActive ? "inset 0 0 0 1px rgba(108,99,255,0.3)" : "none",
  transition: "all 0.18s ease",
  position: "relative",
  overflow: "hidden",
  whiteSpace: "nowrap",
});

/* Active left accent bar */
const ActiveBar = ({ isActive }) =>
  isActive ? (
    <span style={{
      position: "absolute", left: 0, top: "18%", bottom: "18%",
      width: 3, borderRadius: "0 3px 3px 0",
      background: "linear-gradient(180deg, #8b85ff, #6c63ff)",
    }} />
  ) : null;

/* ─── Icon color wrapper ─────────────────────────────────────────────────── */
const IconWrap = ({ isActive, children }) => (
  <span style={{ color: isActive ? "#8b85ff" : "#4a5c73", flexShrink: 0, transition: "color 0.18s ease" }}>
    {children}
  </span>
);

/* ─── Drop button (expandable parent) ───────────────────────────────────── */
const DropBtn = ({ isOpen, onClick, icon, label, open, active }) => (
  <button onClick={onClick} style={{
    ...getNavStyle(active, isOpen),
    width: "calc(100% - 20px)",
    border: "none",
    textAlign: "left",
  }}>
    <ActiveBar isActive={active} />
    <IconWrap isActive={active}>{icon}</IconWrap>
    {isOpen && (
      <>
        <span style={{ flex: 1 }}>{label}</span>
        <ChevronRight open={open} />
      </>
    )}
  </button>
);

/* ─── Sub-item ───────────────────────────────────────────────────────────── */
const dropItemStyle = (isActive) => ({
  display: "flex", alignItems: "center", gap: 10,
  padding: "8px 16px 8px 44px",
  borderRadius: 8, margin: "1px 10px",
  textDecoration: "none",
  fontSize: 13, fontWeight: isActive ? 600 : 400,
  fontFamily: "'DM Sans', sans-serif",
  color: isActive ? "#fff" : "#5a6e82",
  background: isActive ? "rgba(108,99,255,0.15)" : "transparent",
  transition: "all 0.15s ease",
  whiteSpace: "nowrap",
  cursor: "pointer",
});

const matchesPath = (pathname, basePath) =>
  pathname === basePath || pathname.startsWith(`${basePath}/`);

const isPathActive = (pathname, patterns = []) =>
  patterns.some((pattern) => matchesPath(pathname, pattern));

/* ─── Tooltip for collapsed state ────────────────────────────────────────── */
const TooltipWrap = ({ isOpen, label, children }) => {
  const [show, setShow] = useState(false);
  if (isOpen) return children;
  return (
    <div style={{ position: "relative" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div style={{
          position: "absolute", left: "calc(100% + 10px)", top: "50%",
          transform: "translateY(-50%)",
          background: "#1e2d42", color: "#e2e8f0",
          fontSize: 12, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
          padding: "5px 10px", borderRadius: 6, whiteSpace: "nowrap",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.08)",
          zIndex: 999, pointerEvents: "none",
        }}>{label}</div>
      )}
    </div>
  );
};

/* ─── Main Sidebar ───────────────────────────────────────────────────────── */
const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const [openFacility, setOpenFacility] = useState(
    isPathActive(location.pathname, ["/admin/facility", "/admin/facility-booking"])
  );
  const [openCommunity, setOpenCommunity] = useState(
    isPathActive(location.pathname, ["/admin/notice", "/admin/poll"])
  );

  const navClass = (isActive) => getNavStyle(isActive, isOpen);
  const getMainLinkActive = (link) => {
    if (link.end) return location.pathname === link.to;
    return isPathActive(location.pathname, link.matchPaths);
  };

  const navLinks = [
    {
      to: "/admin", end: true, label: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      section: "Main",
      matchPaths: ["/admin"],
    },
    {
      to: "/admin/residents", label: "Residents",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      section: "Apps",
      matchPaths: ["/admin/residents"],
    },
    {
      to: "/admin/flat/list", label: "Flats",
      icon: "M11 5h2M11 9h2M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
      matchPaths: ["/admin/flat"],
    },
    {
      to: "/admin/guards", label: "Guards",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      matchPaths: ["/admin/guards"],
    },
    {
      to: "/admin/visitors", label: "Visitors",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      matchPaths: ["/admin/visitors", "/admin/visitor"],
    },
    {
      to: "/admin/event/list", label: "Events",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      matchPaths: ["/admin/event"],
    },
    {
      to: "/admin/complaints", label: "Complaints",
      icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
      matchPaths: ["/admin/complaints"],
    },
  ];

  return (
    <>
      {/* Google Font import */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <aside style={{
        height: "100vh", position: "sticky", top: 0, left: 0, zIndex: 40,
        display: "flex", flexDirection: "column", overflow: "hidden",
        width: isOpen ? 240 : 72,
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        background: "linear-gradient(180deg, #0d1827 0%, #0a1520 100%)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}>

        {/* Brand */}
        <div style={{
          height: 68, display: "flex", alignItems: "center", flexShrink: 0,
          padding: isOpen ? "0 20px" : "0",
          justifyContent: isOpen ? "flex-start" : "center",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          {isOpen ? (
            <div style={{ display: "flex", alignItems: "center", gap: 2, fontFamily: "'DM Sans', sans-serif" }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: "linear-gradient(135deg, #6c63ff, #4f46e5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginRight: 10, boxShadow: "0 4px 12px rgba(108,99,255,0.4)",
              }}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>e</span>
              </div>
              <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>Society</span>
            </div>
          ) : (
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: "linear-gradient(135deg, #6c63ff, #4f46e5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(108,99,255,0.35)",
            }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>e</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingBottom: 24,
          scrollbarWidth: "none" }}>

          {/* Render nav links grouped by section */}
          {navLinks.map((link, i) => {
            const showSection = link.section && (i === 0 || navLinks[i - 1]?.section !== link.section);
            return (
              <React.Fragment key={link.to}>
                {showSection && <SectionLabel isOpen={isOpen} label={link.section} />}
                <TooltipWrap isOpen={isOpen} label={link.label}>
                  {(() => {
                    const isActive = getMainLinkActive(link);
                    return (
                  <NavLink
                    to={link.to}
                    end={link.end}
                    style={() => navClass(isActive)}
                  >
                    {() => (
                      <>
                        <ActiveBar isActive={isActive} />
                        <IconWrap isActive={isActive}>
                          <Ico d={link.icon} />
                        </IconWrap>
                        {isOpen && <span>{link.label}</span>}
                      </>
                    )}
                  </NavLink>
                    );
                  })()}
                </TooltipWrap>
              </React.Fragment>
            );
          })}

          {/* Management section */}
          <SectionLabel isOpen={isOpen} label="Management" />

          {/* Facility dropdown */}
          <TooltipWrap isOpen={isOpen} label="Facility">
            <DropBtn
              isOpen={isOpen}
              onClick={() => setOpenFacility(!openFacility)}
              open={openFacility}
              active={isPathActive(location.pathname, ["/admin/facility", "/admin/facility-booking"])}
              label="Facility"
              icon={<Ico d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />}
            />
          </TooltipWrap>
          <div style={{
            display: "grid", overflow: "hidden",
            gridTemplateRows: isOpen && openFacility ? "1fr" : "0fr",
            opacity: isOpen && openFacility ? 1 : 0,
            transition: "grid-template-rows 0.25s ease, opacity 0.2s ease",
          }}>
            <div style={{ overflow: "hidden" }}>
              <div style={{ paddingTop: 2, paddingBottom: 4 }}>
                {[
                  { to: "/admin/facility/dashboard", label: "Dashboard", matchPaths: ["/admin/facility/dashboard"] },
                  { to: "/admin/facility-booking/list", label: "Bookings", matchPaths: ["/admin/facility-booking", "/admin/facility/booking"] },
                  { to: "/admin/facility/calendar", label: "Calendar", matchPaths: ["/admin/facility/calendar"] },
                ].map(({ to, label, matchPaths }) => (
                  <NavLink key={to} to={to} style={() => dropItemStyle(isPathActive(location.pathname, matchPaths))}>
                    {() => <><ArrowDot active={isPathActive(location.pathname, matchPaths)} /><span>{label}</span></>}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Maintenance */}
          <TooltipWrap isOpen={isOpen} label="Maintenance">
            <NavLink to="/admin/maintenance/dashboard"
              style={() => navClass(isPathActive(location.pathname, ["/admin/maintenance"]))}>
              {() => (
                <>
                  <ActiveBar isActive={isPathActive(location.pathname, ["/admin/maintenance"])} />
                  <IconWrap isActive={isPathActive(location.pathname, ["/admin/maintenance"])}>
                    <Ico d="M9 17v-2m3 2v-4m3 4v-6m2 10H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z" />
                  </IconWrap>
                  {isOpen && <span>Maintenance</span>}
                </>
              )}
            </NavLink>
          </TooltipWrap>

          {/* Expense */}
          <TooltipWrap isOpen={isOpen} label="Expense">
            <NavLink to="/admin/expense/dashboard"
              style={() => navClass(isPathActive(location.pathname, ["/admin/expense"]))}>
              {() => (
                <>
                  <ActiveBar isActive={isPathActive(location.pathname, ["/admin/expense"])} />
                  <IconWrap isActive={isPathActive(location.pathname, ["/admin/expense"])}>
                    <Ico d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </IconWrap>
                  {isOpen && <span>Expense</span>}
                </>
              )}
            </NavLink>
          </TooltipWrap>

          {/* Payments */}
          <TooltipWrap isOpen={isOpen} label="Payments">
            <NavLink to="/admin/payments"
              style={() => navClass(isPathActive(location.pathname, ["/admin/payments"]))}>
              {() => (
                <>
                  <ActiveBar isActive={isPathActive(location.pathname, ["/admin/payments"])} />
                  <IconWrap isActive={isPathActive(location.pathname, ["/admin/payments"])}>
                    <Ico d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </IconWrap>
                  {isOpen && <span>Payments</span>}
                </>
              )}
            </NavLink>
          </TooltipWrap>

          {/* Community dropdown */}
          <TooltipWrap isOpen={isOpen} label="Community">
            <DropBtn
              isOpen={isOpen}
              onClick={() => setOpenCommunity(!openCommunity)}
              open={openCommunity}
              active={isPathActive(location.pathname, ["/admin/notice", "/admin/poll"])}
              label="Community"
              icon={<Ico d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />}
            />
          </TooltipWrap>
          <div style={{
            display: "grid", overflow: "hidden",
            gridTemplateRows: isOpen && openCommunity ? "1fr" : "0fr",
            opacity: isOpen && openCommunity ? 1 : 0,
            transition: "grid-template-rows 0.25s ease, opacity 0.2s ease",
          }}>
            <div style={{ overflow: "hidden" }}>
              <div style={{ paddingTop: 2, paddingBottom: 4 }}>
                {[
                  { to: "/admin/notice/list", label: "Notice Board", matchPaths: ["/admin/notice"] },
                  { to: "/admin/poll/list", label: "Polls & Voting", matchPaths: ["/admin/poll"] },
                ].map(({ to, label, matchPaths }) => (
                  <NavLink key={to} to={to} style={() => dropItemStyle(isPathActive(location.pathname, matchPaths))}>
                    {() => <><ArrowDot active={isPathActive(location.pathname, matchPaths)} /><span>{label}</span></>}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Bottom user pill */}
        {isOpen && (
          <div style={{
            margin: "12px 10px 16px",
            padding: "10px 14px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0,
            }}>A</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "#d4dae4",
                fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Admin
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#4a5c73",
                fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
                Society Manager
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;