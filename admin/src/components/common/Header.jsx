import React from "react";

const Header = () => {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">Admin</span>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;