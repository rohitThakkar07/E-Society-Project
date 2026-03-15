import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 shadow-md">
      <div className="px-4 py-3 flex items-center justify-between">
        
        {/* LOGO */}
        <NavLink to="/" className="text-white font-bold text-2xl">
          e-Society Management
        </NavLink>

        {/* HAMBURGER */}
        <button
          className="lg:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
         
        {/* DESKTOP MENU */}
        <ul className="hidden lg:flex items-center gap-6 text-white">
          <li>
            <Link to="/" className="hover:text-gray-300">Home</Link>
          </li>

          {/* Operations */}
          <li className="relative group">
            <span className="cursor-pointer hover:text-gray-300">Operations</span>
            <ul className="absolute left-0 mt-3 w-48 bg-white text-black rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <li><Link className="block px-4 py-2 hover:bg-gray-100" to="/visitors">Visitor Management</Link></li>
              <li><Link className="block px-4 py-2 hover:bg-gray-100" to="/facilities">Book Facilities</Link></li>
              <li><Link className="block px-4 py-2 hover:bg-gray-100" to="/gate-logs">Gate Entry Logs</Link></li>
            </ul>
          </li>

          {/* Finances */}
          <li className="relative group">
            <span className="cursor-pointer hover:text-gray-300">Finances</span>
            <ul className="absolute left-0 mt-3 w-48 bg-white text-black rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <li><Link className="block px-4 py-2 hover:bg-gray-100" to="/maintenance">Pay Maintenance</Link></li>
              <li><Link
               className="block px-4 py-2 hover:bg-gray-100" to="/invoices">My Invoices</Link></li>
              <li><Link className="block px-4 py-2 hover:bg-gray-100" to="/expenses">Society Expenses</Link></li>
            </ul>
          </li>

          {/* Community */}
          <li className="relative group">
            <span className="cursor-pointer hover:text-gray-300">Community</span>
            <ul className="absolute left-0 mt-3 w-48 bg-white text-black rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <li><Link className="block px-4 py-2 hover:bg-gray-100" to="/notices">Notice Board</Link></li>
              <li><Link className="block px-4 py-2 hover:bg-gray-100" to="/polls">Discussions & Polls</Link></li>
              <li><Link className="block px-4 py-2 hover:bg-gray-100" to="/events">Events Calendar</Link></li>
            </ul>
          </li>

          {/* Help Desk */}
          <li className="relative group">
            <span className="cursor-pointer hover:text-gray-300">Help Desk</span>
            <ul className="absolute left-0 mt-3 w-48 bg-white text-black rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <li><Link className="block px-4 py-2 hover:bg-gray-100" to="/raise-complaint">Raise Complaint</Link></li>
              <li><Link className="block px-4 py-2 hover:bg-gray-100" to="/complaint-status">Track Status</Link></li>
              <li><hr /></li>
              <li><Link className="block px-4 py-2 text-red-600 font-bold hover:bg-gray-100" to="/emergency">Emergency Alerts</Link></li>
            </ul>
          </li>

          <li>
            <Link to="/login" className="bg-white text-blue-600 font-bold px-4 py-2 rounded hover:bg-gray-200">
              Login
            </Link>
          </li>
        </ul>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden bg-gray-800 text-white px-4 pb-4 space-y-2">
          
          <Link to="/" className="block py-2">Home</Link>

          {/* Operations */}
          <div>
            <button onClick={() => toggleDropdown("operations")} className="w-full text-left py-2">
              Operations
            </button>
            {openDropdown === "operations" && (
              <div className="pl-4 space-y-1">
                <Link to="/visitors" className="block py-1">Visitor Management</Link>
                <Link to="/facilities" className="block py-1">Book Facilities</Link>
                <Link to="/gate-logs" className="block py-1">Gate Entry Logs</Link>
              </div>
            )}
          </div>

          {/* Finances */}
          <div>
            <button onClick={() => toggleDropdown("finances")} className="w-full text-left py-2">
              Finances
            </button>
            {openDropdown === "finances" && (
              <div className="pl-4 space-y-1">
                <Link to="/maintenance" className="block py-1">Pay Maintenance</Link>
                <Link to="/invoices" className="block py-1">My Invoices</Link>
                <Link to="/expenses" className="block py-1">Society Expenses</Link>
              </div>
            )}
          </div>

          {/* Community */}
          <div>
            <button onClick={() => toggleDropdown("community")} className="w-full text-left py-2">
              Community
            </button>
            {openDropdown === "community" && (
              <div className="pl-4 space-y-1">
                <Link to="/notices" className="block py-1">Notice Board</Link>
                <Link to="/polls" className="block py-1">Discussions & Polls</Link>
                <Link to="/events" className="block py-1">Events Calendar</Link>
              </div>
            )}
          </div>

          {/* Help Desk */}
          <div>
            <button onClick={() => toggleDropdown("help")} className="w-full text-left py-2">
              Help Desk
            </button>
            {openDropdown === "help" && (
              <div className="pl-4 space-y-1">
                <Link to="/raise-complaint" className="block py-1">Raise Complaint</Link>
                <Link to="/complaint-status" className="block py-1">Track Status</Link>
                <Link to="/emergency" className="block py-1 text-red-400 font-bold">Emergency Alerts</Link>
              </div>
            )}
          </div>

          <Link to="/login" className="block bg-white text-blue-600 font-bold px-4 py-2 rounded text-center mt-3">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Header;