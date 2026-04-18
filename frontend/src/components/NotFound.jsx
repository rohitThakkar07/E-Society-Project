import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Inter',sans-serif]">
      <div className="max-w-md w-full text-center">
        {/* Animated Icon Container */}
        <div className="relative mb-8 flex justify-center">
          <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center animate-pulse">
            <svg 
              className="w-16 h-16 text-indigo-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          {/* Floating dots decoration */}
          <div className="absolute top-0 right-1/4 w-3 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]" />
          <div className="absolute bottom-4 left-1/4 w-4 h-4 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.5s]" />
        </div>

        <h1 className="text-8xl font-black text-slate-800 tracking-tighter mb-2">404</h1>
        <h2 className="text-2xl font-bold text-slate-700 mb-4 uppercase tracking-widest">Lost in Space</h2>
        
        <p className="text-slate-500 mb-10 leading-relaxed font-medium">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            Go to Home
          </button>
        </div>

        {/* Subtle Footer Links */}
        <div className="mt-16 pt-8 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Popular Pages</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-bold text-indigo-600">
            <button onClick={() => navigate("/admin/dashboard")} className="hover:underline">Admin Dashboard</button>
            <button onClick={() => navigate("/notice")} className="hover:underline">Notice Board</button>
            <button onClick={() => navigate("/complaint")} className="hover:underline">Complaints</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
