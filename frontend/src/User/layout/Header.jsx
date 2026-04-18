import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

import {
  Home,
  LogOut,
  Menu,
  X,
  ChevronDown,
  DollarSign,
  Building2,
  Bell,
  Activity,
  ShieldCheck,
  CreditCard,
  PieChart,
  Megaphone,
  Calendar,
  MessageSquare,
  Sun,
  Moon,
  LogIn,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import societyConfig from "../../assets/societyConfig";

import logo from "../../assets/logo-dwarkesh.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [userDataTick, setUserDataTick] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { dark, toggle } = useTheme();

  // Stable header logic
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onUserData = () => setUserDataTick((t) => t + 1);
    window.addEventListener("esociety-userdata-updated", onUserData);
    return () => window.removeEventListener("esociety-userdata-updated", onUserData);
  }, []);

  const user = useMemo(() => JSON.parse(localStorage.getItem("userData") || "{}"), [userDataTick]);
  const role = user?.role?.toLowerCase();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const navItems = [
    {
      label: "Operations",
      roles: ["resident", "admin", "guard"],
      children: [
        { label: "Visitor", to: "/visitors", roles: ["admin", "resident"], desc: "Track arrivals", icon: ShieldCheck },
        { label: "Book Facilities", to: "/facilities", roles: ["resident"], desc: "Clubhouse & Gym", icon: Calendar },
        { label: "Gate Entry Logs", to: "/gate-logs", roles: ["guard", "admin", "resident"], desc: "Visitor history", icon: Activity },
      ],
    },
    {
      label: "Finances",
      roles: ["resident", "admin"],
      children: [
        { label: "Pay Maintenance", to: "/maintenance", roles: ["resident", "admin"], desc: "Online payments", icon: CreditCard },
        { label: "My Invoices", to: "/invoices", roles: ["resident", "admin"], desc: "Billing history", icon: PieChart },
        { label: "Society Expenses", to: "/expenses", roles: ["admin"], desc: "Audit reports", icon: DollarSign },
      ],
    },
    {
      label: "Community",
      roles: ["resident", "admin"],
      children: [
        { label: "Notice Board", to: "/notices", roles: ["resident", "admin"], desc: "Latest updates", icon: Megaphone },
        { label: "Discussions & Polls", to: "/polls", roles: ["resident", "admin"], desc: "Have your say", icon: MessageSquare },
        { label: "Events Calendar", to: "/events", roles: ["resident", "admin"], desc: "Society gatherings", icon: Calendar },
      ],
    },
  ];

  const hasAccess = (roles) => roles.includes(role);

  const isParentActive = (item) => {
    return item.children.some((child) => location.pathname === child.to);
  };

  const linkBase = "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[13px] font-bold transition-all duration-300";
  const linkIdle = "text-[var(--nav-link)] hover:text-[var(--text)] hover:bg-[var(--accent-soft)]";
  const linkActive = "text-[var(--accent)] bg-[var(--nav-active-bg)] border border-[var(--border)] shadow-sm";

  const flatMobileLinks = navItems
    .filter((item) => isLoggedIn && hasAccess(item.roles))
    .flatMap((item) =>
      item.children.filter((c) => hasAccess(c.roles)).map((c) => ({ ...c, group: item.label }))
    );

  const logoVariants = {
    animate: {
      y: [0, -2, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 4, repeat: Infinity, ease: "linear" },
      },
    },
  };

  return (
    <>
      <style>{`
        @keyframes auraPulse { 
          0% { text-shadow: 0 0 2px var(--accent); } 
          50% { text-shadow: 0 0 12px var(--accent), 0 0 20px #8B5CF6; opacity: 0.9; } 
          100% { text-shadow: 0 0 2px var(--accent); }
        }
        .text-glow-aura { animation: auraPulse 5s infinite ease-in-out; } 
      `}</style>

      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? "shadow-xl py-1 border-b border-[var(--border)]" : "py-1.5 border-b border-transparent"
          }`}
        style={{
          background: "var(--header-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="w-full mx-auto px-4 sm:px-6 flex items-center justify-between min-h-[3.5rem]">
          <NavLink to="/" className="flex items-center shrink-0 py-1 transition-opacity hover:opacity-90">
            <img 
              src={logo} 
              alt="Dwarkesh Residency" 
              className="object-contain"
              style={{ height: '38px', width: 'auto' }} 
            />
          </NavLink>


          <div ref={dropdownRef} className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {isLoggedIn && navItems.map((item) => hasAccess(item.roles) && (
              <div key={item.label} className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  className={`${linkBase} ${isParentActive(item) ? linkActive : linkIdle} ${openDropdown === item.label ? "bg-[var(--accent-soft)]" : ""
                    }`}
                >
                  {item.label}
                  <ChevronDown size={13} className={`transition-transform duration-300 ${openDropdown === item.label ? "rotate-180" : ""}`} />
                </button>

                {openDropdown === item.label && (
                  <div
                    onMouseLeave={() => setOpenDropdown(null)}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-64 rounded-2xl p-1.5 z-50 user-glass shadow-2xl border border-[var(--border)]"
                    style={{ background: "var(--card)" }}
                  >
                    {item.children.filter((c) => hasAccess(c.roles)).map((child) => {
                      const Icon = child.icon;
                      const active = location.pathname === child.to;
                      return (
                        <Link
                          key={child.to}
                          to={child.to}
                          onClick={() => setOpenDropdown(null)}
                          className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${active ? "bg-[var(--nav-active-bg)] border-l-4 border-[var(--accent)]" : "hover:bg-[var(--accent-soft)] border-l-4 border-transparent"
                            }`}
                        >
                          <div className={`mt-0.5 p-1.5 rounded-lg ${active ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "bg-[var(--bg)] text-[var(--text-muted)] shadow-inner"}`}>
                            <Icon size={13} strokeWidth={2.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[13px] font-bold block truncate text-[var(--text)]">{child.label}</span>
                            <span className="text-[9px] text-[var(--text-muted)] font-bold">{child.desc}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>


          <div className="flex items-center gap-3 pr-1">

            <NavLink to="/" end className={({ isActive }) => `hidden lg:flex ${linkBase} ${isActive ? linkActive : linkIdle}`}>
              <Home size={15} strokeWidth={2.5} /> Home
            </NavLink>

            {isLoggedIn && hasAccess(["resident", "admin"]) && (
              <NavLink to="/raise-complaint" className={({ isActive }) => `hidden md:flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all ${isActive ? "bg-orange-500/10 text-orange-500" : "text-orange-500 hover:bg-orange-500/5"
                }`}>
                <Bell size={14} /> Help Desk
              </NavLink>
            )}

            <button
              type="button"
              onClick={toggle}
              className="p-2.5 rounded-xl transition-all duration-300 hover:bg-[var(--accent-soft)] text-[var(--text)] active:scale-90"
            >
              
                <div
                  key={dark ? "dark" : "light"}
                 
                 
                 
                 
                >
                  {dark ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
                </div>
              
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <NavLink to="/profile" className={({ isActive }) => `flex items-center gap-2 p-1 rounded-full border transition-all ${isActive ? "bg-[var(--nav-active-bg)] border-[var(--border)]" : "border-transparent hover:bg-[var(--accent-soft)]"}`}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs bg-[var(--accent)] text-white shadow-lg">
                    {user?.name?.[0] || "U"}
                  </div>
                  <div className="hidden lg:flex flex-col min-w-0 pr-1">
                    <span className="text-[11px] font-black text-[var(--text)] leading-none truncate capitalize">{user?.name?.split(" ")[0]}</span>
                    <span className="text-[8px] font-extrabold text-[var(--accent)] uppercase tracking-tighter opacity-80">{role}</span>
                  </div>
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
                >
                  <LogOut size={19} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <NavLink to="/login" title="Login" className="p-2 rounded-xl bg-[var(--accent)] text-white shadow-lg active:scale-90 transition-all hover:opacity-90">
                <LogIn size={19} strokeWidth={2.5} />
              </NavLink>
            )}

            <button
              className="lg:hidden p-2 rounded-xl text-[var(--text)] hover:bg-[var(--accent-soft)]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>


      
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md lg:hidden" onClick={() => setMenuOpen(false)} />
            <aside className="fixed top-0 right-0 bottom-0 z-[120] w-[260px] bg-[var(--card)] border-l border-[var(--border)] flex flex-col shadow-2xl">
              <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
                <img src={logo} alt={societyConfig.name} className="h-8 object-contain" />
                <button onClick={() => setMenuOpen(false)} className="p-2 rounded-xl bg-[var(--bg)] shadow-inner"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
                <NavLink to="/" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${linkBase} py-3.5 ${isActive ? linkActive : linkIdle}`}>
                  <Home size={16} /> Home
                </NavLink>
                {flatMobileLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className={({ isActive }) => `flex items-center gap-4 p-3.5 rounded-2xl ${isActive ? linkActive : "bg-[var(--bg)]/50 hover:bg-[var(--accent-soft)]"}`}>
                    <link.icon size={18} className="text-[var(--accent)]" />
                    <div className="flex flex-col">
                      <span className="text-sm font-black">{link.label}</span>
                      <span className="text-[9px] uppercase font-bold opacity-50">{link.group}</span>
                    </div>
                  </NavLink>
                ))}
              </div>
              <div className="p-4 border-t border-[var(--border)] bg-[var(--bg)]">
                {isLoggedIn && <button onClick={handleLogout} className="w-full py-3.5 rounded-2xl bg-red-500 text-white font-black text-sm flex items-center justify-center gap-3 active:scale-95"><LogOut size={18} /> LOG OUT</button>}
              </div>
            </aside>
          </>
        )}
      
    </>
  );
};

export default Header;