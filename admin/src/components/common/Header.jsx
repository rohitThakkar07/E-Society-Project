import React from "react";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          title="Toggle Sidebar"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">Admin</span>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;