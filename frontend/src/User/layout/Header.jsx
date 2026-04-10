import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Home, LogOut, Menu, X, ChevronDown,
  Wrench, DollarSign, Users, Shield, Bell, User
} from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const role = user?.role?.toLowerCase();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
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

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Operations",
      icon: <Wrench size={14} />,
      roles: ["resident", "admin", "guard"],
      children: [
        { label: "Visitor Management", to: "/visitors", roles: ["admin"] },
        { label: "Book Facilities", to: "/facilities", roles: ["resident"] },
        { label: "Gate Entry Logs", to: "/gate-logs", roles: ["guard", "admin"] },
      ],
    },
    {
      label: "Finances",
      icon: <DollarSign size={14} />,
      roles: ["resident", "admin"],
      children: [
        { label: "Pay Maintenance", to: "/maintenance", roles: ["resident", "admin"] },
        { label: "My Invoices", to: "/invoices", roles: ["resident", "admin"] },
        { label: "Society Expenses", to: "/expenses", roles: ["admin"] },
      ],
    },
    {
      label: "Community",
      icon: <Users size={14} />,
      roles: ["resident", "admin"],
      children: [
        { label: "Notice Board", to: "/notices", roles: ["resident", "admin"] },
        { label: "Discussions & Polls", to: "/polls", roles: ["resident", "admin"] },
        { label: "Events Calendar", to: "/events", roles: ["resident", "admin"] },
      ],
    },
  ];

  const hasAccess = (roles) => roles.includes(role);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        .header-nav { font-family: 'Outfit', sans-serif; }
        .nav-dropdown { animation: dropIn 0.18s ease; }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-link-active { color: #60a5fa !important; }
      `}</style>

      <nav className={`header-nav sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-gray-950/95 backdrop-blur shadow-xl" : "bg-gray-900"
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-0">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg group-hover:bg-blue-400 transition-colors">
                <Shield size={16} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                e-Society <span className="text-blue-400">Management</span>
              </span>
            </NavLink>

            {/* DESKTOP MENU */}
            <div ref={dropdownRef} className="hidden lg:flex items-center gap-1">

              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`
                }
              >
                <Home size={14} /> Home
              </NavLink>

              {/* DROPDOWN ITEMS */}
              {isLoggedIn && navItems.map((item) =>
                hasAccess(item.roles) ? (
                  <div key={item.label} className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        openDropdown === item.label
                          ? "bg-gray-700 text-white"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                      <ChevronDown
                        size={13}
                        className={`transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                      />
                    </button>

                    {openDropdown === item.label && (
                      <ul className="nav-dropdown absolute top-full left-0 mt-1 w-52 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                        {item.children
                          .filter((c) => hasAccess(c.roles))
                          .map((child) => (
                            <li key={child.to}>
                              <Link
                                to={child.to}
                                onClick={() => setOpenDropdown(null)}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                ) : null
              )}

              {/* HELP DESK */}
              {isLoggedIn && hasAccess(["resident", "admin"]) && (
                <NavLink
                  to="/raise-complaint"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`
                  }
                >
                  <Bell size={14} /> Help Desk
                </NavLink>
              )}

              {/* DIVIDER */}
              <div className="w-px h-6 bg-gray-700 mx-1" />

              {/* AUTH */}
              {!isLoggedIn ? (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`
                    }
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <User size={12} className="text-white" />
                    </div>
                    <span>{user?.name?.split(" ")[0] || "Profile"}</span>
                  </NavLink>

                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-sm font-medium px-3 py-2 rounded-lg transition-all border border-red-500/20 hover:border-red-500"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* MOBILE BUTTON */}
            <button
              className="lg:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="lg:hidden bg-gray-900 border-t border-gray-800 px-4 pb-4 pt-2 space-y-1">
            <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm">
              <Home size={15} /> Home
            </Link>

            {isLoggedIn && navItems.map((item) =>
              hasAccess(item.roles) ? (
                <div key={item.label}>
                  <p className="px-3 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {item.label}
                  </p>
                  {item.children
                    .filter((c) => hasAccess(c.roles))
                    .map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm ml-2"
                      >
                        {child.label}
                      </Link>
                    ))}
                </div>
              ) : null
            )}

            {isLoggedIn && hasAccess(["resident", "admin"]) && (
              <Link to="/raise-complaint" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm">
                <Bell size={15} /> Help Desk
              </Link>
            )}

            <div className="pt-2 border-t border-gray-800 mt-2">
              {!isLoggedIn ? (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition">
                  Login
                </Link>
              ) : (
                <div className="space-y-1">
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm">
                    <User size={15} /> Profile
                  </Link>
                  <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2.5 text-red-400 hover:text-white hover:bg-red-600 rounded-lg text-sm transition">
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;