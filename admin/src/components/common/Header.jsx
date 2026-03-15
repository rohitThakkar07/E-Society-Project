import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Safely get user name from storage
  const user = JSON.parse(localStorage.getItem("userData") || "{}");

  const handleLogout = async () => {
    setLoading(true);
    try {
      // API call to backend logout route
      await axios.post("http://localhost:4000/api/auth/logout");
      
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      // We proceed with local logout even if the server call fails
    } finally {
      // Clear all auth data
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userData");
      
      setLoading(false);
      navigate("/login"); // Redirect to login page
    }
  };

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-100">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16M4 6h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-800">Admin Dashboard</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-gray-900">{user.name || "Admin"}</span>
          <span className="text-xs text-gray-500 capitalize">{localStorage.getItem("role") || "Staff"}</span>
        </div>
        
        <button 
          onClick={handleLogout}
          disabled={loading}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm
            ${loading 
              ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
              : "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"}`}
        >
          {loading ? "Processing..." : "Logout"}
        </button>
      </div>
    </header>
  );
};

export default Header;