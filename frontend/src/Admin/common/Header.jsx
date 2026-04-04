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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-3 flex justify-between items-center h-20">
      <div className="flex items-center gap-6">
        <button
          onClick={toggleSidebar}
          className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-600 active:scale-95"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h12M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 border-r border-gray-100 pr-8">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-none mb-1">{user.name || "Admin"}</p>
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-tighter">
              {localStorage.getItem("role") || "Staff"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-500">
            {user.name?.charAt(0) || "A"}
          </div>
        </div>

        <button
          onClick={() => setShowForgotModal(true)}
          className="bg-white text-slate-800 border border-slate-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-all active:scale-95"
        >
          Reset Password
        </button>

        <button 
          onClick={handleLogout}
          disabled={loading}
          className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "..." : "Logout"}
        </button>
      </div>

      {showForgotModal && <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />}
    </header>
  );
};

export default Header;