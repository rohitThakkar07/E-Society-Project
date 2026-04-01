// import React, { useState, useEffect, useRef } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import {
//   Home, LogOut, Menu, X, ChevronDown,
//   Wrench, DollarSign, Users, Shield, Bell, User, Settings
// } from "lucide-react";

// const Header = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [scrolled, setScrolled] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   const user = JSON.parse(localStorage.getItem("userData") || "{}");
//   const role = user?.role?.toLowerCase();
//   const isLoggedIn = !!localStorage.getItem("token");

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpenDropdown(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const logout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   const navItems = [
//     {
//       label: "Operations",
//       icon: <Wrench size={14} />,
//       roles: ["resident", "admin", "guard"],
//       children: [
//         { label: "Visitor Management", to: "/visitors", roles: ["admin"] },
//         { label: "Book Facilities", to: "/facilities", roles: ["resident"] },
//         { label: "Gate Entry Logs", to: "/gate-logs", roles: ["guard", "admin"] },
//       ],
//     },
//     {
//       label: "Finances",
//       icon: <DollarSign size={14} />,
//       roles: ["resident", "admin"],
//       children: [
//         { label: "Pay Maintenance", to: "/maintenance", roles: ["resident", "admin"] },
//         { label: "My Invoices", to: "/invoices", roles: ["resident", "admin"] },
//         { label: "Society Expenses", to: "/expenses", roles: ["admin"] },
//       ],
//     },
//     {
//       label: "Community",
//       icon: <Users size={14} />,
//       roles: ["resident", "admin"],
//       children: [
//         { label: "Notice Board", to: "/notices", roles: ["resident", "admin"] },
//         { label: "Discussions & Polls", to: "/polls", roles: ["resident", "admin"] },
//         { label: "Events Calendar", to: "/events", roles: ["resident", "admin"] },
//       ],
//     },
//   ];

//   const hasAccess = (roles) => roles.includes(role);

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Fraunces:wght@700;800&display=swap');
        
//         .header-nav { font-family: 'Outfit', sans-serif; }
//         .brand-text { font-family: 'Fraunces', serif; }
        
//         .nav-dropdown { 
//           animation: dropIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
//           box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1);
//         }
        
//         @keyframes dropIn {
//           from { opacity: 0; transform: translateY(-8px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }

//         .active-link {
//           color: #2563eb !important;
//           background: #eff6ff !important;
//         }

//         .glass-header {
//           background: rgba(255, 255, 255, 0.8);
//           backdrop-filter: blur(12px);
//           border-bottom: 1px solid rgba(226, 232, 240, 0.8);
//         }
//       `}</style>

//       <nav className={`header-nav sticky top-0 z-[100] transition-all duration-300 ${
//         scrolled ? "glass-header shadow-sm py-1" : "bg-white border-b border-slate-100 py-2"
//       }`}>
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="flex items-center justify-between h-16">

//             {/* LOGO */}
//             <NavLink to="/" className="flex items-center gap-3 group transition-transform active:scale-95">
//               <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:bg-blue-700 transition-all">
//                 <Shield size={20} className="text-white" />
//               </div>
//               <div className="flex flex-col">
//                 <span className="brand-text text-slate-900 text-xl font-extrabold leading-none tracking-tight">
//                   e-Society
//                 </span>
//                 <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1">
//                   Management
//                 </span>
//               </div>
//             </NavLink>

//             {/* DESKTOP NAV */}
//             <div ref={dropdownRef} className="hidden lg:flex items-center gap-2">
//               <NavLink
//                 to="/"
//                 className={({ isActive }) =>
//                   `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
//                     isActive ? "active-link" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
//                   }`
//                 }
//               >
//                 <Home size={16} /> Home
//               </NavLink>

//               {isLoggedIn && navItems.map((item) =>
//                 hasAccess(item.roles) ? (
//                   <div key={item.label} className="relative">
//                     <button
//                       onMouseEnter={() => setOpenDropdown(item.label)}
//                       onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
//                       className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
//                         openDropdown === item.label
//                           ? "bg-slate-100 text-slate-900"
//                           : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
//                       }`}
//                     >
//                       {item.label}
//                       <ChevronDown
//                         size={14}
//                         className={`transition-transform duration-300 ${openDropdown === item.label ? "rotate-180 text-blue-600" : "text-slate-400"}`}
//                       />
//                     </button>

//                     {openDropdown === item.label && (
//                       <div 
//                         onMouseLeave={() => setOpenDropdown(null)}
//                         className="nav-dropdown absolute top-full left-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl p-2 z-50"
//                       >
//                         {item.children
//                           .filter((c) => hasAccess(c.roles))
//                           .map((child) => (
//                             <Link
//                               key={child.to}
//                               to={child.to}
//                               onClick={() => setOpenDropdown(null)}
//                               className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
//                             >
//                               <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-blue-400" />
//                               {child.label}
//                             </Link>
//                           ))}
//                       </div>
//                     )}
//                   </div>
//                 ) : null
//               )}

//               {isLoggedIn && hasAccess(["resident", "admin"]) && (
//                 <NavLink
//                   to="/raise-complaint"
//                   className={({ isActive }) =>
//                     `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
//                       isActive ? "active-link" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
//                     }`
//                   }
//                 >
//                   <Bell size={16} /> Help Desk
//                 </NavLink>
//               )}

//               {/* VERTICAL DIVIDER */}
//               <div className="w-px h-6 bg-slate-200 mx-2" />

//               {/* USER ACTIONS */}
//               {!isLoggedIn ? (
//                 <Link
//                   to="/login"
//                   className="bg-slate-900 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-md shadow-slate-200 active:scale-95"
//                 >
//                   Login
//                 </Link>
//               ) : (
//                 <div className="flex items-center gap-2">
//                   <NavLink
//                     to="/profile"
//                     className={({ isActive }) =>
//                       `flex items-center gap-2 px-2 py-1.5 rounded-2xl transition-all ${
//                         isActive ? "bg-blue-50 ring-1 ring-blue-100" : "hover:bg-slate-50"
//                       }`
//                     }
//                   >
//                     <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
//                       <User size={18} className="text-white" />
//                     </div>
//                     <div className="hidden xl:flex flex-col pr-2">
//                         <span className="text-xs font-black text-slate-800 leading-none">
//                             {user?.name?.split(" ")[0] || "Account"}
//                         </span>
//                         <span className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-wider">
//                             {role}
//                         </span>
//                     </div>
//                   </NavLink>

//                   <button
//                     onClick={logout}
//                     className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
//                     title="Logout"
//                   >
//                     <LogOut size={18} />
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* MOBILE TOGGLE */}
//             <button
//               className="lg:hidden text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition"
//               onClick={() => setMenuOpen(!menuOpen)}
//             >
//               {menuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* MOBILE MENU */}
//         {menuOpen && (
//           <div className="lg:hidden bg-white border-t border-slate-100 animate-revealUp px-6 pb-8 pt-4 space-y-2 max-h-[80vh] overflow-y-auto">
//             <NavLink to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl">
//               <Home size={18} /> Home
//             </NavLink>

//             {isLoggedIn && navItems.map((item) =>
//               hasAccess(item.roles) ? (
//                 <div key={item.label} className="pt-2">
//                   <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
//                     {item.label}
//                   </p>
//                   <div className="grid grid-cols-1 gap-1">
//                     {item.children
//                       .filter((c) => hasAccess(c.roles))
//                       .map((child) => (
//                         <Link
//                           key={child.to}
//                           to={child.to}
//                           onClick={() => setMenuOpen(false)}
//                           className="block px-4 py-3 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-2xl ml-2"
//                         >
//                           {child.label}
//                         </Link>
//                       ))}
//                   </div>
//                 </div>
//               ) : null
//             )}

//             <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
//               {!isLoggedIn ? (
//                 <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-center bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100">
//                   Login to Account
//                 </Link>
//               ) : (
//                 <>
//                   <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl">
//                     <User size={18} /> My Profile
//                   </Link>
//                   <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition">
//                     <LogOut size={18} /> Logout
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </nav>
//     </>
//   );
// };

// export default Header;

// src/User/common/Header.jsx  — UPDATED
// Changes from original:
//   1. Added "Guard Panel" link in nav for users with role="guard"
//   2. Added /guard/visitors to gate-logs guard dropdown child
//   3. Minor: logout clears and redirects

import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Home, LogOut, Menu, X, ChevronDown,
  Wrench, DollarSign, Users, Shield, Bell, User, Activity
} from "lucide-react";

const Header = () => {
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled,     setScrolled]     = useState(false);
  const dropdownRef = useRef(null);
  const navigate    = useNavigate();

  const user      = JSON.parse(localStorage.getItem("userData") || "{}");
  const role      = user?.role?.toLowerCase();
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
        { label: "Visitor Management",  to: "/visitors",     roles: ["admin", "resident"] },
        { label: "Book Facilities",      to: "/facilities",   roles: ["resident"] },
        { label: "Gate Entry Logs",      to: "/guard/visitors", roles: ["guard", "admin"] },  // ← guard link
      ],
    },
    {
      label: "Finances",
      icon: <DollarSign size={14} />,
      roles: ["resident", "admin"],
      children: [
        { label: "Pay Maintenance",  to: "/maintenance", roles: ["resident", "admin"] },
        { label: "My Invoices",      to: "/invoices",    roles: ["resident", "admin"] },
        { label: "Society Expenses", to: "/expenses",    roles: ["admin"] },
      ],
    },
    {
      label: "Community",
      icon: <Users size={14} />,
      roles: ["resident", "admin"],
      children: [
        { label: "Notice Board",       to: "/notices", roles: ["resident", "admin"] },
        { label: "Discussions & Polls",to: "/polls",   roles: ["resident", "admin"] },
        { label: "Events Calendar",    to: "/events",  roles: ["resident", "admin"] },
      ],
    },
  ];

  const hasAccess = (roles) => roles.includes(role);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Fraunces:wght@700;800&display=swap');
        .header-nav { font-family: 'Outfit', sans-serif; }
        .brand-text  { font-family: 'Fraunces', serif; }
        .nav-dropdown {
          animation: dropIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1);
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .active-link { color: #2563eb !important; background: #eff6ff !important; }
        .glass-header {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(226,232,240,0.8);
        }
      `}</style>

      <nav className={`header-nav sticky top-0 z-[100] transition-all duration-300 ${
        scrolled ? "glass-header shadow-sm py-1" : "bg-white border-b border-slate-100 py-2"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <NavLink to="/" className="flex items-center gap-3 group transition-transform active:scale-95">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:bg-blue-700 transition-all">
                <Shield size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="brand-text text-slate-900 text-xl font-extrabold leading-none tracking-tight">
                  e-Society
                </span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1">
                  Management
                </span>
              </div>
            </NavLink>

            {/* DESKTOP NAV */}
            <div ref={dropdownRef} className="hidden lg:flex items-center gap-2">
              <NavLink to="/"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive ? "active-link" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                <Home size={16} /> Home
              </NavLink>

              {/* ── GUARD PANEL LINK (only for guard role) ── */}
              {isLoggedIn && role === "guard" && (
                <NavLink to="/guard"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      isActive ? "active-link" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`
                  }
                >
                  <Activity size={16} /> Guard Panel
                </NavLink>
              )}

              {isLoggedIn && navItems.map((item) =>
                hasAccess(item.roles) ? (
                  <div key={item.label} className="relative">
                    <button
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        openDropdown === item.label
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${openDropdown === item.label ? "rotate-180 text-blue-600" : "text-slate-400"}`}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div
                        onMouseLeave={() => setOpenDropdown(null)}
                        className="nav-dropdown absolute top-full left-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl p-2 z-50"
                      >
                        {item.children.filter((c) => hasAccess(c.roles)).map((child) => (
                          <Link key={child.to} to={child.to} onClick={() => setOpenDropdown(null)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null
              )}

              {isLoggedIn && hasAccess(["resident", "admin"]) && (
                <NavLink to="/raise-complaint"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      isActive ? "active-link" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`
                  }
                >
                  <Bell size={16} /> Help Desk
                </NavLink>
              )}

              <div className="w-px h-6 bg-slate-200 mx-2" />

              {!isLoggedIn ? (
                <Link to="/login"
                  className="bg-slate-900 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-md shadow-slate-200 active:scale-95"
                >
                  Login
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <NavLink to="/profile"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-2 py-1.5 rounded-2xl transition-all ${
                        isActive ? "bg-blue-50 ring-1 ring-blue-100" : "hover:bg-slate-50"
                      }`
                    }
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                      <User size={18} className="text-white" />
                    </div>
                    <div className="hidden xl:flex flex-col pr-2">
                      <span className="text-xs font-black text-slate-800 leading-none">
                        {user?.name?.split(" ")[0] || "Account"}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-wider">
                        {role}
                      </span>
                    </div>
                  </NavLink>
                  <button onClick={logout}
                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <button className="lg:hidden text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-6 pb-8 pt-4 space-y-2 max-h-[80vh] overflow-y-auto">
            <NavLink to="/" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl"
            >
              <Home size={18} /> Home
            </NavLink>

            {isLoggedIn && role === "guard" && (
              <NavLink to="/guard" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-blue-600 font-bold hover:bg-blue-50 rounded-2xl"
              >
                <Activity size={18} /> Guard Panel
              </NavLink>
            )}

            {isLoggedIn && navItems.map((item) =>
              hasAccess(item.roles) ? (
                <div key={item.label} className="pt-2">
                  <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                    {item.label}
                  </p>
                  <div className="grid grid-cols-1 gap-1">
                    {item.children.filter((c) => hasAccess(c.roles)).map((child) => (
                      <Link key={child.to} to={child.to} onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-2xl ml-2"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null
            )}

            <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
              {!isLoggedIn ? (
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="block text-center bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100"
                >
                  Login to Account
                </Link>
              ) : (
                <>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl"
                  >
                    <User size={18} /> My Profile
                  </Link>
                  <button onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;