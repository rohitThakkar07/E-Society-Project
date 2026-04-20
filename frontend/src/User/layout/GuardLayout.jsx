// src/User/layout/GuardLayout.jsx
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Shield, Home, Users, Search, LogOut, Menu, X,
  UserCheck, ClipboardList, Bell, ChevronRight
} from "lucide-react";
import societyConfig from "../../assets/societyConfig";

const SIDEBAR_BG   = "#1E2235";
const SIDEBAR_ITEM = "#2B3050";
const ACCENT       = "#4F6EF7";

const GuardLayout = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("userData") || "{}");

  const { visitors = [] } = useSelector((s) => s.visitor || {});
  const pendingCount = visitors.filter((v) => v.status === "Pending").length;

  const navItems = [
    { to: "/guard",                 icon: Home,          label: "Dashboard",         end: true  },
    { to: "/guard/visitor/add",     icon: UserCheck,     label: "New Visitor Entry", end: false },
    { to: "/guard/visitors",        icon: Users,         label: "Visitor Log",       end: false, badge: pendingCount },
    { to: "/guard/gate-log",        icon: ClipboardList, label: "Gate Log",          end: false },
    { to: "/guard/search-resident", icon: Search,        label: "Search Resident",   end: false },
  ];

  const logout = () => { localStorage.clear(); navigate("/login"); };

  /* breadcrumb label from pathname */
  const getBreadcrumb = () => {
    const p = location.pathname;
    if (p === "/guard")                       return "Dashboard";
    if (p.includes("visitor/add"))            return "New Visitor Entry";
    if (p.includes("visitors"))              return "Visitor Log";
    if (p.includes("gate-log"))              return "Gate Log";
    if (p.includes("search-resident"))       return "Search Resident";
    if (p.includes("visitor/"))              return "Visitor Details";
    return "Guard Portal";
  };

  const SidebarContent = ({ onClose }) => (
    <div style={{ background: SIDEBAR_BG }} className="flex flex-col h-full">

      {/* Brand */}
      <div className="flex items-center justify-between px-5 pt-6 pb-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
               style={{ background: ACCENT }}>
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <p className="font-extrabold text-white text-[15px] leading-none tracking-wide">{societyConfig.name.toUpperCase()}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1"
               style={{ color: "#F5A623" }}>Guard Portal</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition">
            <X size={18} className="text-white/60" />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="mx-5 mb-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />

      {/* Nav label */}
      <p className="px-5 text-[10px] font-black uppercase tracking-[0.15em] mb-2"
         style={{ color: "rgba(255,255,255,0.3)" }}>Navigation</p>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-4">
        {navItems.map((item) => {
          const Icon  = item.icon;
          const exact = item.end ? location.pathname === item.to : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={() =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                  exact
                    ? "text-white"
                    : "hover:bg-white/5"
                }`
              }
              style={({ isActive }) => ({
                background: exact ? ACCENT : "transparent",
                color: exact ? "#fff" : "rgba(255,255,255,0.55)",
              })}
            >
              <Icon size={17} className="flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge > 0 && !exact && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                      style={{ background: "#F5A623", color: "#fff" }}>
                  {item.badge}
                </span>
              )}
              {exact && <ChevronRight size={14} className="opacity-60" />}
            </NavLink>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />

      {/* User card */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl"
             style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0"
               style={{ background: ACCENT }}>
            {user?.name?.[0]?.toUpperCase() || "G"}
          </div>
          <div className="flex-1 min-w-0 text-center">
            <p className="text-xs font-bold text-white truncate">{user?.name || "Guard"}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-2 w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ color: "#FF6B6B" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,107,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', sans-serif", background: "#F4F5FA" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }
      `}</style>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0 shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 shadow-2xl z-50">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Right Side */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="flex-shrink-0 bg-white border-b border-slate-100 px-5 h-14 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(true)}
                    className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 transition">
              <Menu size={20} className="text-slate-600" />
            </button>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-slate-400 font-medium">Guard Portal</span>
              <ChevronRight size={14} className="text-slate-300" />
              <span className="font-semibold text-slate-700">{getBreadcrumb()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                   style={{ background: "#FFF3CD", color: "#B45309" }}>
                <Bell size={13} />
                {pendingCount} Pending
              </div>
            )}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow"
                   style={{ background: ACCENT }}>
                {user?.name?.[0]?.toUpperCase() || "G"}
              </div>
              <div className="hidden sm:block text-center mt-1">
                <p className="text-xs font-bold text-slate-700 leading-none">{user?.name || "Guard"}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default GuardLayout;