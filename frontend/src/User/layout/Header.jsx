import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { dark, toggle } = useTheme();

  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const role = user?.role?.toLowerCase();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    if (window.confirm("Are you sure you want to logout from E-Society?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const navItems = [
    {
      label: "Operations",
      roles: ["resident", "admin", "guard"],
      children: [
        { label: "Visitor Management", to: "/visitors", roles: ["admin", "resident"], desc: "Track arrivals", icon: ShieldCheck },
        { label: "Book Facilities", to: "/facilities", roles: ["resident"], desc: "Clubhouse & Gym", icon: Calendar },
        { label: "Raise Complaint", to: "/raise-complaint", roles: ["resident"], desc: "Quick resolutions", icon: Megaphone },
        { label: "Gate Entry Logs", to: "/guard/visitors", roles: ["guard", "admin"], desc: "Security logs", icon: Activity },
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
    if (location.pathname === "/raise-complaint") return false;
    return item.children.some((child) => location.pathname === child.to);
  };

  const linkBase =
    "flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-bold transition-all duration-300";
  const linkIdle = "text-[var(--nav-link)] hover:text-[var(--text)] hover:bg-[var(--accent-soft)]";
  const linkActive =
    "text-[var(--accent)] bg-[var(--nav-active-bg)] border border-[var(--border)] shadow-sm";

  const flatMobileLinks = navItems
    .filter((item) => isLoggedIn && hasAccess(item.roles))
    .flatMap((item) =>
      item.children.filter((c) => hasAccess(c.roles)).map((c) => ({ ...c, group: item.label }))
    );

  return (
    <>
      <nav
        className={`sticky top-0 z-[100] transition-all duration-500 ease-out border-b ${
          scrolled
            ? "shadow-[var(--shadow-lg)] py-2"
            : "py-3 sm:py-4"
        }`}
        style={{
          background: "var(--header-bg)",
          borderColor: "var(--header-border)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between min-h-[3.5rem]">
          <NavLink to="/" className="flex items-center gap-3 sm:gap-4 group shrink-0">
            <motion.div
              whileHover={{ rotate: -6, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center border shadow-lg"
              style={{
                background: "linear-gradient(135deg, color-mix(in srgb, var(--accent) 20%, var(--card)), var(--card))",
                borderColor: "var(--border)",
                boxShadow: "0 8px 24px color-mix(in srgb, var(--accent) 18%, transparent)",
              }}
            >
              <Building2 size={24} className="text-[var(--accent)]" />
            </motion.div>
            <div className="flex flex-col min-w-0">
              <span
                className="text-xl sm:text-2xl font-black tracking-tight leading-none truncate"
                style={{
                  background: "linear-gradient(135deg, var(--accent), #8B5CF6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                E-Society
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-[var(--text-muted)] mt-1 hidden sm:block">
                Resident Portal
              </span>
            </div>
          </NavLink>

          <div className="flex items-center gap-1 sm:gap-2">
            <motion.button
              type="button"
              onClick={toggle}
              aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
              whileTap={{ scale: 0.92 }}
              className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border transition-colors"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={dark ? "dark" : "light"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  className="theme-toggle-icon absolute inset-0 flex items-center justify-center"
                >
                  {dark ? <Sun size={20} strokeWidth={2.2} /> : <Moon size={20} strokeWidth={2.2} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <button
              type="button"
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <div ref={dropdownRef} className="hidden lg:flex items-center gap-0.5 flex-1 justify-end min-w-0">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
              }
            >
              <Home size={16} strokeWidth={2.2} /> Home
            </NavLink>

            {isLoggedIn &&
              navItems.map(
                (item) =>
                  hasAccess(item.roles) && (
                    <div key={item.label} className="relative">
                      <button
                        type="button"
                        onMouseEnter={() => setOpenDropdown(item.label)}
                        className={`${linkBase} ${isParentActive(item) ? linkActive : linkIdle} ${
                          openDropdown === item.label ? "bg-[var(--accent-soft)]" : ""
                        }`}
                      >
                        {item.label}{" "}
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-300 ${openDropdown === item.label ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openDropdown === item.label && (
                        <div
                          onMouseLeave={() => setOpenDropdown(null)}
                          className="absolute top-full left-0 mt-2 w-80 rounded-2xl p-2 z-50 user-glass user-mobile-drawer"
                          style={{ boxShadow: "var(--shadow-lg)" }}
                        >
                          {item.children
                            .filter((c) => hasAccess(c.roles))
                            .map((child) => {
                              const Icon = child.icon;
                              const active = location.pathname === child.to;
                              return (
                                <Link
                                  key={child.to}
                                  to={child.to}
                                  onClick={() => setOpenDropdown(null)}
                                  className={`flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                                    active
                                      ? "bg-[var(--nav-active-bg)] border-l-[3px] border-[var(--accent)]"
                                      : "hover:bg-[var(--accent-soft)] border-l-[3px] border-transparent"
                                  }`}
                                >
                                  <div
                                    className="mt-0.5 p-2 rounded-lg"
                                    style={{
                                      background: active ? "var(--accent-soft)" : "color-mix(in srgb, var(--card) 50%, transparent)",
                                      color: active ? "var(--accent)" : "var(--text-muted)",
                                    }}
                                  >
                                    <Icon size={14} strokeWidth={2} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <span
                                      className={`text-sm font-bold block truncate ${active ? "text-[var(--text)]" : "text-[var(--text)]"}`}
                                    >
                                      {child.label}
                                    </span>
                                    <span className="text-[11px] text-[var(--text-muted)] font-medium">{child.desc}</span>
                                  </div>
                                </Link>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  )
              )}

            {isLoggedIn && hasAccess(["resident", "admin"]) && (
              <NavLink
                to="/raise-complaint"
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive
                      ? "text-orange-500 bg-orange-500/10 border border-orange-500/30"
                      : `${linkIdle} border border-transparent`
                  }`
                }
              >
                <Bell size={16} strokeWidth={2.2} /> Help Desk
              </NavLink>
            )}

            <div
              className="w-px h-7 mx-2 shrink-0 opacity-40"
              style={{ background: "var(--border)" }}
            />

            {isLoggedIn ? (
              <div className="flex items-center gap-2 pl-1">
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-2 p-1 pr-3 rounded-full border transition-all max-w-[200px] ${
                      isActive ? `${linkActive}` : "border-transparent hover:bg-[var(--accent-soft)]"
                    }`
                  }
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shrink-0 border"
                    style={{
                      background: "linear-gradient(145deg, var(--accent-soft), var(--card))",
                      color: "var(--accent)",
                      borderColor: "var(--border)",
                    }}
                  >
                    {user?.name?.[0] || "U"}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-extrabold text-[var(--text)] leading-none truncate capitalize">
                      {user?.name?.split(" ")[0] || "User"}
                    </span>
                    <span className="text-[9px] font-bold text-[var(--accent)] uppercase mt-0.5 truncate">
                      {role}
                    </span>
                  </div>
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl transition-colors hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className={`${linkBase} ${linkIdle} bg-[var(--accent-soft)]`}
              >
                <LogIn size={16} strokeWidth={2.2} />
                Sign in
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] lg:hidden backdrop-blur-sm"
              style={{ background: "color-mix(in srgb, var(--text) 42%, transparent)" }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed top-0 right-0 bottom-0 z-[120] w-[min(100%,20rem)] lg:hidden flex flex-col shadow-2xl border-l user-mobile-drawer"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="flex items-center justify-between p-4 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <span className="font-black text-[var(--text)] tracking-tight">Menu</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-[var(--accent-soft)] text-[var(--text)]"
                  aria-label="Close"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                <NavLink
                  to="/"
                  end
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-3 rounded-xl font-bold text-sm ${isActive ? linkActive : linkIdle}`
                  }
                >
                  <Home size={18} /> Home
                </NavLink>
                {!isLoggedIn && (
                  <NavLink
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl font-bold text-sm ${linkIdle}`}
                  >
                    <LogIn size={18} /> Sign in
                  </NavLink>
                )}
                {flatMobileLinks.map((child) => {
                  const Icon = child.icon;
                  const active = location.pathname === child.to;
                  return (
                    <NavLink
                      key={child.to + child.group}
                      to={child.to}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm transition-colors ${
                        active ? linkActive : linkIdle
                      }`}
                    >
                      <Icon size={18} strokeWidth={2} />
                      <span className="flex flex-col items-start min-w-0">
                        <span className="truncate">{child.label}</span>
                        <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                          {child.group}
                        </span>
                      </span>
                    </NavLink>
                  );
                })}
                {isLoggedIn && hasAccess(["resident", "admin"]) && (
                  <NavLink
                    to="/raise-complaint"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-3 rounded-xl font-bold text-sm ${
                        isActive
                          ? "text-orange-500 bg-orange-500/10 border border-orange-500/25"
                          : linkIdle
                      }`
                    }
                  >
                    <Bell size={18} /> Help Desk
                  </NavLink>
                )}
                {isLoggedIn && (
                  <>
                    <NavLink
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-3 rounded-xl font-bold text-sm ${
                          isActive ? linkActive : linkIdle
                        }`
                      }
                    >
                      Profile
                    </NavLink>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-500/10"
                    >
                      <LogOut size={18} /> Log out
                    </button>
                  </>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
