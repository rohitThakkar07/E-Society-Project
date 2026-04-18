import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import ChangePasswordModal from "./ChangePasswordModal";
import { fetchComplaints } from "../../store/slices/complaintSlice";
import { fetchBookings } from "../../store/slices/facilityBookingSlice";
import { FiBell, FiCalendar, FiAlertCircle, FiCheckCircle, FiClock, FiSettings, FiMaximize2, FiLogOut } from "react-icons/fi";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);
  
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const role = localStorage.getItem("role") || "Admin";

  const { complaints = [] } = useSelector((s) => s.complaint);
  const { bookings = [] } = useSelector((s) => s.booking);

  useEffect(() => {
    dispatch(fetchComplaints());
    dispatch(fetchBookings());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    ...(complaints.filter(c => c.status === "Pending").map(c => ({
      id: c._id,
      title: "New Complaint",
      desc: c.title,
      type: "complaint",
      time: c.createdAt,
      icon: <FiAlertCircle className="text-red-500" />,
      link: "/admin/complaints"
    }))),
    ...(bookings.filter(b => b.status === "Pending").map(b => ({
      id: b._id,
      title: "New Booking Request",
      desc: `${b.facilityId?.name || "Facility"} by Flat ${b.residentId?.flatId?.number || "N/A"}`,
      type: "booking",
      time: b.createdAt,
      icon: <FiCalendar className="text-blue-500" />,
      link: "/admin/facility-booking/list"
    })))
  ].sort((a,b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

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

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else if (document.exitFullscreen) document.exitFullscreen();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-4 sm:px-6 flex justify-between items-center h-[70px] flex-shrink-0 shadow-sm shadow-slate-100/50">
      
      {/* Left: Sidebar Toggle & Greeting */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2.5 hover:bg-slate-50 rounded-lg transition-all text-slate-500 hover:text-[#4F6EF7] active:scale-95"
          title="Toggle Sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h12M4 18h16" />
          </svg>
        </button>

      
      </div>

      {/* Right side Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center border-l border-slate-100 pl-4 gap-1 sm:gap-2">
          
          <button 
            onClick={toggleFullScreen}
            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-xl transition-all hover:text-[#4F6EF7]"
            title="Toggle Fullscreen"
          >
            <FiMaximize2 size={18} />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotif(!showNotif)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all relative ${showNotif ? "bg-slate-100 text-[#4F6EF7]" : "text-slate-500 hover:bg-slate-50 hover:text-[#4F6EF7]"}`}
            >
              <FiBell size={18} />
              {notifications.length > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                  <span className="text-sm font-black text-slate-800 uppercase tracking-widest">Notifications</span>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-black rounded-md">{notifications.length} New</span>
                </div>
                
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div 
                        key={n.id}
                        onClick={() => { navigate(n.link); setShowNotif(false); }}
                        className="p-4 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0 group"
                      >
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 group-hover:border-indigo-200 transition-colors">
                            {n.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 leading-snug">{n.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">{n.desc}</p>
                            <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              <FiClock size={10} />
                              {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-slate-400">
                      <FiCheckCircle size={40} className="mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-bold uppercase tracking-widest">All caught up!</p>
                      <p className="text-[10px] mt-1">No pending complaints or bookings.</p>
                    </div>
                  )}
                </div>

                <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/30 text-center">
                  <button 
                    onClick={() => { navigate("/admin/complaints"); setShowNotif(false); }}
                    className="text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition"
                  >
                    View All Activities
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowChangeModal(true)}
            title="Account Settings"
            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-xl transition-all hover:text-[#4F6EF7]"
          >
            <FiSettings size={18} />
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-100 hidden sm:block mx-1" />

        {/* User Info & Profile Dropdown */}
        <div className="flex items-center gap-3 pl-2 group relative cursor-pointer py-2">
          <div className="text-right hidden sm:block overflow-hidden">
            <p className="text-sm font-bold text-slate-800 leading-none truncate max-w-[100px]">{user.name || "Admin"}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-wider">{role}</p>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-[#4F6EF7] text-sm overflow-hidden transition-all group-hover:border-[#4F6EF7]/30 shadow-inner">
             {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : (user.name?.charAt(0) || "A").toUpperCase()}
          </div>

          {/* Simple Hover Menu */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <button 
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <FiLogOut size={16} />
              {loading ? "Logging out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </div>

      {showChangeModal && <ChangePasswordModal onClose={() => setShowChangeModal(false)} />}
    </header>
  );
};

export default Header;