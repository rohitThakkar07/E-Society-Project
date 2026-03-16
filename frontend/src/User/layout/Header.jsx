import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const user = JSON.parse(localStorage.getItem("userData"));
  const role = user?.role;

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 shadow-md">
      <div className="px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <NavLink to="/" className="text-white font-bold text-2xl">
          e-Society Management
        </NavLink>

        {/* MOBILE BUTTON */}
        <button
          className="lg:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* DESKTOP MENU */}
        <ul className="hidden lg:flex items-center gap-6 text-white">

          <li>
            <Link to="/" className="hover:text-gray-300">
              Home
            </Link>
          </li>

          {/* OPERATIONS */}
          {(role === "resident" || role === "admin") && (
            <li className="relative group">
              <span className="cursor-pointer hover:text-gray-300">
                Operations
              </span>

              <ul className="absolute left-0 mt-3 w-48 bg-white text-black rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">

                {(role === "resident" || role === "admin") && (
                  <li>
                    <Link
                      className="block px-4 py-2 hover:bg-gray-100"
                      to="/visitors"
                    >
                      Visitor Management
                    </Link>
                  </li>
                )}

                {role === "resident" && (
                  <li>
                    <Link
                      className="block px-4 py-2 hover:bg-gray-100"
                      to="/facilities"
                    >
                      Book Facilities
                    </Link>
                  </li>
                )}

                {(role === "guard" || role === "admin") && (
                  <li>
                    <Link
                      className="block px-4 py-2 hover:bg-gray-100"
                      to="/gate-logs"
                    >
                      Gate Entry Logs
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          )}

          {/* FINANCES */}
          {(role === "resident" || role === "admin") && (
            <li className="relative group">
              <span className="cursor-pointer hover:text-gray-300">
                Finances
              </span>

              <ul className="absolute left-0 mt-3 w-48 bg-white text-black rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">

                <li>
                  <Link
                    className="block px-4 py-2 hover:bg-gray-100"
                    to="/maintenance"
                  >
                    Pay Maintenance
                  </Link>
                </li>

                <li>
                  <Link
                    className="block px-4 py-2 hover:bg-gray-100"
                    to="/invoices"
                  >
                    My Invoices
                  </Link>
                </li>

                {role === "admin" && (
                  <li>
                    <Link
                      className="block px-4 py-2 hover:bg-gray-100"
                      to="/expenses"
                    >
                      Society Expenses
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          )}

          {/* COMMUNITY */}
          {(role === "resident" || role === "admin") && (
            <li className="relative group">
              <span className="cursor-pointer hover:text-gray-300">
                Community
              </span>

              <ul className="absolute left-0 mt-3 w-48 bg-white text-black rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">

                <li>
                  <Link
                    className="block px-4 py-2 hover:bg-gray-100"
                    to="/notices"
                  >
                    Notice Board
                  </Link>
                </li>

                <li>
                  <Link
                    className="block px-4 py-2 hover:bg-gray-100"
                    to="/polls"
                  >
                    Discussions & Polls
                  </Link>
                </li>

                <li>
                  <Link
                    className="block px-4 py-2 hover:bg-gray-100"
                    to="/events"
                  >
                    Events Calendar
                  </Link>
                </li>
              </ul>
            </li>
          )}

          {/* GUARD MENU */}
          {(role === "guard" || role === "admin") && (
            <li>
              <Link to="/gate-logs" className="hover:text-gray-300">
                Gate Logs
              </Link>
            </li>
          )}

          {/* HELP DESK */}
          {(role === "resident" || role === "admin") && (
            <li>
              <Link to="/raise-complaint" className="hover:text-gray-300">
                Help Desk
              </Link>
            </li>
          )}

          {/* LOGIN / LOGOUT */}
          {!role ? (
            <li>
              <Link
                to="/login"
                className="bg-white text-blue-600 font-bold px-4 py-2 rounded hover:bg-gray-200"
              >
                Login
              </Link>
            </li>
          ) : (
            <li>
              <button
                onClick={logout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden bg-gray-800 text-white px-4 pb-4 space-y-2">

          <Link to="/" className="block py-2">
            Home
          </Link>

          {(role === "resident" || role === "admin") && (
            <>
              <Link to="/visitors" className="block py-2">
                Visitor Management
              </Link>

              <Link to="/facilities" className="block py-2">
                Book Facilities
              </Link>

              <Link to="/maintenance" className="block py-2">
                Pay Maintenance
              </Link>
            </>
          )}

          {(role === "guard" || role === "admin") && (
            <Link to="/gate-logs" className="block py-2">
              Gate Logs
            </Link>
          )}

          {(role === "resident" || role === "admin") && (
            <Link to="/raise-complaint" className="block py-2">
              Help Desk
            </Link>
          )}

          {!role ? (
            <Link
              to="/login"
              className="block bg-white text-blue-600 font-bold px-4 py-2 rounded text-center mt-3"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={logout}
              className="block bg-red-500 px-4 py-2 rounded w-full mt-3"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;