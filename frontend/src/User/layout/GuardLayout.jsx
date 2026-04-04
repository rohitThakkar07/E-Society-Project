// src/Guard/layout/GuardLayout.jsx
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Shield, Home, Users, Search, LogOut, Menu, X,
  UserCheck, Activity
} from "lucide-react";

const GuardLayout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("userData") || "{}");

  // Badge count for pending visitors
  const { visitors = [] } = useSelector((s) => s.visitor || {});
  const pendingCount = visitors.filter((v) => v.status === "Pending").length;

  const navItems = [
    { to: "/guard",                 icon: Home,       label: "Dashboard",          end: true },
    { to: "/guard/visitor/add",     icon: UserCheck,  label: "New Visitor Entry",  end: false },
    { to: "/guard/visitors",        icon: Users,      label: "Visitor Log",        end: false, badge: pendingCount },
    { to: "/guard/gate-log",        icon: Activity,   label: "Gate Log",           end: false },
    { to: "/guard/search-resident", icon: Search,     label: "Search Resident",    end: false },
  ];

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <p className="font-black text-slate-900 text-base leading-none" style={{ fontFamily: "'Fraunces', serif" }}>
            e-Society
          </p>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
            Guard Panel
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span className="bg-amber-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 border-t border-slate-100" />

      {/* User + Logout */}
      <div className="px-4 py-5 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
            {user?.name?.[0]?.toUpperCase() || "G"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-slate-800 truncate">{user?.name || "Guard"}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Security Guard</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition text-sm"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="flex h-screen overflow-hidden bg-slate-50">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:wght@800;900&display=swap');`}</style>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="md:hidden bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setOpen(true)} className="p-2 hover:bg-slate-100 rounded-xl">
            <Menu size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-blue-600" />
            <span className="font-black text-slate-900 text-sm">Guard Panel</span>
          </div>
          {pendingCount > 0 && (
            <span className="bg-amber-400 text-white text-[10px] font-black px-2.5 py-1 rounded-full">
              {pendingCount} pending
            </span>
          )}
        </div>

        {/* Page */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default GuardLayout;