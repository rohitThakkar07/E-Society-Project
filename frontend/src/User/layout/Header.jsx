import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Home, LogOut, Menu, X, ChevronDown,
  Wrench, DollarSign, Users, Building2, Bell, User, Activity,
  ShieldCheck, CreditCard, PieChart, Megaphone, Calendar, MessageSquare
} from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const role = user?.role?.toLowerCase();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGOUT CONFIRMATION LOGIC ---
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout from E-Society?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const navItems = [
    {
      label: "Operations",
      roles: ["resident", "admin", "guard"],
      children: [
        { label: "Visitor Management", to: "/visitors", roles: ["admin", "resident"], desc: "Track arrivals", icon: <ShieldCheck size={14}/> },
        { label: "Book Facilities", to: "/facilities", roles: ["resident"], desc: "Clubhouse & Gym", icon: <Calendar size={14}/> },
        { label: "Raise Complaint", to: "/raise-complaint", roles: ["resident"], desc: "Quick resolutions", icon: <Megaphone size={14}/> },
        { label: "Gate Entry Logs", to: "/guard/visitors", roles: ["guard", "admin"], desc: "Security logs", icon: <Activity size={14}/> },
      ],
    },
    {
      label: "Finances",
      roles: ["resident", "admin"],
      children: [
        { label: "Pay Maintenance", to: "/maintenance", roles: ["resident", "admin"], desc: "Online payments", icon: <CreditCard size={14}/> },
        { label: "My Invoices", to: "/invoices", roles: ["resident", "admin"], desc: "Billing history", icon: <PieChart size={14}/> },
        { label: "Society Expenses", to: "/expenses", roles: ["admin"], desc: "Audit reports", icon: <DollarSign size={14}/> },
      ],
    },
    {
      label: "Community",
      roles: ["resident", "admin"],
      children: [
        { label: "Notice Board", to: "/notices", roles: ["resident", "admin"], desc: "Latest updates", icon: <Megaphone size={14}/> },
        { label: "Discussions & Polls", to: "/polls", roles: ["resident", "admin"], desc: "Have your say", icon: <MessageSquare size={14}/> },
        { label: "Events Calendar", to: "/events", roles: ["resident", "admin"], desc: "Society gatherings", icon: <Calendar size={14}/> },
      ],
    },
  ];

  const hasAccess = (roles) => roles.includes(role);

  const isParentActive = (item) => {
    if (location.pathname === "/raise-complaint") return false;
    return item.children.some(child => location.pathname === child.to);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .header-nav { font-family: 'Plus Jakarta Sans', sans-serif; }

        .logo-box {
          background: #2a270f;
          border: 1px solid hsl(177, 15%, 26%);
          box-shadow: 0 0 15px rgba(234, 246, 59, 0.2);
          transition: all 0.4s ease;
        }
        .group:hover .logo-box {
          box-shadow: 0 0 25px #c9ec02;
          transform: rotate(-5deg) scale(1.08);
        }

        .brand-text {
          background: linear-gradient(to right, #f8b806, #d9ff04);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .active-blue {
          color: #60a5fa !important;
          background: rgba(19, 64, 136, 0.8) !important;
          box-shadow: 0 0 20px rgba(34, 101, 209, 0.2);
          border: 1px solid rgba(238, 185, 9, 0.99);
        }

        .active-orange {
          color: #ff4b04 !important;
          background: rgba(251, 146, 60, 0.15) !important;
          box-shadow: 0 0 20px rgba(251, 146, 60, 0.3);
          border: 1px solid rgba(251, 146, 60, 0.4) !important;
        }

        .glass-panel {
          background: rgba(19, 19, 20, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dropdown-item:hover {
          background: linear-gradient(90deg, rgb(240, 74, 8) 0%, transparent 100%);
          transform: translateX(5px);
        }
      `}</style>

      <nav className={`header-nav sticky top-0 z-[100] transition-all duration-500 ${
        scrolled ? "bg-slate-950/90 py-2 border-b border-white/10 shadow-2xl" : "bg-slate-950 py-4 border-b border-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

          <NavLink to="/" className="flex items-center gap-4 group">
            <div className="logo-box w-12 h-12 rounded-2xl flex items-center justify-center">
              <Building2 size={26} className="text-blue-500 group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="brand-text text-2xl font-black tracking-tight leading-none">E-Society</span>
              <span className="text-[9px] font-bold text-blue-500/80 uppercase tracking-[0.4em] mt-1.5">Secure Portal</span>
            </div>
          </NavLink>

          <div ref={dropdownRef} className="hidden lg:flex items-center gap-1">
            <NavLink to="/" end className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${isActive ? "active-blue" : "text-slate-400 hover:text-white"}`}>
              <Home size={16} /> Home
            </NavLink>

            {isLoggedIn && navItems.map((item) => hasAccess(item.roles) && (
              <div key={item.label} className="relative">
                <button
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all 
                    ${isParentActive(item) ? "active-blue" : openDropdown === item.label ? "text-white bg-white/5" : "text-slate-400 hover:text-white"}`}
                >
                  {item.label} <ChevronDown size={14} className={`transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`} />
                </button>
                {openDropdown === item.label && (
                  <div onMouseLeave={() => setOpenDropdown(null)} className="glass-panel absolute top-full left-0 mt-3 w-80 rounded-3xl p-3 z-50 animate-in fade-in zoom-in-95">
                    {item.children.filter(c => hasAccess(c.roles)).map((child) => (
                      <Link key={child.to} to={child.to} onClick={() => setOpenDropdown(null)}
                        className={`dropdown-item flex items-start gap-4 px-4 py-4 rounded-2xl transition-all ${location.pathname === child.to ? "bg-blue-500/10 border-l-4 border-blue-500" : ""}`}
                      >
                        <div className={`mt-1 p-2 rounded-xl border border-white/5 ${location.pathname === child.to ? "text-blue-400" : "text-slate-500"}`}>
                          {child.icon}
                        </div>
                        <div className="flex-1">
                          <span className={`text-sm font-bold block ${location.pathname === child.to ? "text-white" : "text-slate-200"}`}>{child.label}</span>
                          <span className="text-[11px] text-slate-500 font-medium">{child.desc}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoggedIn && hasAccess(["resident", "admin"]) && (
              <NavLink 
                to="/raise-complaint" 
                className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all border border-transparent ${isActive ? "active-orange" : "text-slate-400 hover:text-orange-400"}`}
              >
                <Bell size={16} /> Help Desk
              </NavLink>
            )}

            <div className="w-[1px] h-6 bg-white/10 mx-4" />

            {isLoggedIn && (
              <div className="flex items-center gap-3">
                <NavLink to="/profile" className={({ isActive }) => `flex items-center gap-3 p-1.5 pr-5 rounded-full border transition-all ${isActive ? "active-blue border-blue-500/40" : "border-transparent hover:bg-white/5"}`}>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center text-blue-400 border border-white/10 font-black text-sm">{user?.name?.[0] || "U"}</div>
                  <div className="flex flex-col"><span className="text-[12px] font-extrabold text-slate-100 leading-none capitalize">{user?.name?.split(" ")[0]}</span><span className="text-[9px] font-bold text-blue-500 uppercase mt-1">{role}</span></div>
                </NavLink>
                {/* Updated Logout Button with handleLogout */}
                <button onClick={handleLogout} className="p-2.5 text-slate-500 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-xl" title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;