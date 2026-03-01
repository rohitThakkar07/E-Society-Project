import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  // A helper function to apply Tailwind classes based on the active state
  const linkStyles = ({ isActive }) => 
    `p-3 rounded-lg transition-colors ${
      isActive 
        ? "bg-blue-600 text-white font-semibold" // Active state styles
        : "text-gray-300 hover:bg-gray-800 hover:text-white" // Inactive state styles
    }`;

  return (
    <aside className="w-64 bg-gray-900 text-white p-5 min-h-screen">
      {/* <h2 className="text-2xl font-bold mb-8 pl-2">Admin Panel</h2> */}

      <nav className="flex flex-col gap-2">
        {/* We use the 'end' prop here so Dashboard only highlights when the URL is exactly "/" */}
        <NavLink to="/" end className={linkStyles}>
          Dashboard
        </NavLink>
        <NavLink to="/residents" className={linkStyles}>
          Residents
        </NavLink>
        <NavLink to="/guards" className={linkStyles}>
          Security Guards
        </NavLink>
        <NavLink to="/visitors" className={linkStyles}>
          Visitors
        </NavLink>
        <NavLink to="/payments" className={linkStyles}>
          Maintenance
        </NavLink>
        <NavLink to="/expenses" className={linkStyles}>
          Expenses
        </NavLink>
        <NavLink to="/complaints" className={linkStyles}>
          Complaints
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;