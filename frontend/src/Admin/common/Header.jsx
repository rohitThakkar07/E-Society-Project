import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ForgotPasswordModal from "./ForgotPasswordModal";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const role = localStorage.getItem("role") || "Admin";

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/auth/logout`);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.clear();
      setLoading(false);
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 flex justify-between items-center h-[70px] flex-shrink-0">
      {/* Left: Hamburger */}
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-500 hover:text-slate-700 active:scale-95"
        title="Toggle Sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h12M4 18h16" />
        </svg>
      </button>

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Reset Password */}
        <button
          onClick={() => setShowForgotModal(true)}
          className="hidden sm:flex items-center gap-2 text-sm text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Reset Password
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200" />

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-none">{user.name || "Admin"}</p>
            <p className="text-xs text-blue-600 font-semibold capitalize mt-0.5">{role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center font-bold text-blue-700 text-sm">
            {(user.name?.charAt(0) || "A").toUpperCase()}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {loading ? "..." : "Logout"}
        </button>
      </div>

      {showForgotModal && <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />}
    </header>
  );
};

export default Header;