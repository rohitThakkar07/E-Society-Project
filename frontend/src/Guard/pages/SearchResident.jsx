// src/Guard/pages/SearchResident.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, Phone, Plus, Home, User, UserCheck } from "lucide-react";
import { fetchResidents } from "../../store/slices/residentSlice";

const SearchResident = () => {
  const dispatch = useDispatch();
  const { residents = [], loading } = useSelector((s) => s.resident || {});
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchResidents());
  }, [dispatch]);

  // Client-side filter — all active residents, filtered by query
  const results = useMemo(() => {
    const active = residents.filter((r) => r.status === "Active");
    if (!query.trim()) return active;
    const q = query.toLowerCase();
    return active.filter(
      (r) =>
        `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
        r.wing?.toLowerCase().includes(q) ||
        r.flatNumber?.toLowerCase().includes(q) ||
        r.mobileNumber?.includes(q)
    );
  }, [residents, query]);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* PAGE HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-5">
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
          Search Resident
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Find any active resident by name, flat, wing or mobile
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* SEARCH INPUT */}
        <div className="relative mb-6">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            placeholder="e.g. Sharma, A-204, Wing B, 9876543210…"
            className="w-full pl-14 pr-5 py-4 border border-slate-200 rounded-3xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition"
          />
        </div>

        {/* COUNT */}
        {!loading && (
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-4">
            {results.length} resident{results.length !== 1 ? "s" : ""} {query ? "found" : "available"}
          </p>
        )}

        {/* LOADING */}
        {loading && (
          <div className="text-center py-16 text-slate-400 text-sm">
            Loading residents…
          </div>
        )}

        {/* RESULTS */}
        {!loading && results.length > 0 && (
          <div className="space-y-3">
            {results.map((r) => (
              <div
                key={r._id}
                className="bg-white rounded-3xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm hover:border-blue-100 hover:shadow-md transition"
              >
                {/* Avatar */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">
                  {r.firstName?.[0]?.toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-900 text-base truncate">
                    {r.firstName} {r.lastName}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                      <Home size={12} className="text-slate-400" />
                      {r.wing}-{r.flatNumber}
                    </span>
                    {r.mobileNumber && (
                      <span className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                        <Phone size={12} className="text-slate-400" />
                        {r.mobileNumber}
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      r.residentType === "Owner" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                    }`}>
                      {r.residentType}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <Link
                  to="/guard/visitor/add"
                  state={{ residentId: r._id }}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md shadow-blue-100 shrink-0"
                >
                  <UserCheck size={14} /> Add Visitor
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY state */}
        {!loading && query && results.length === 0 && (
          <div className="text-center py-16">
            <User size={48} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No residents match "{query}"</p>
            <p className="text-slate-400 text-sm mt-1">Try first name, flat number, wing or mobile</p>
          </div>
        )}

        {/* Initial empty state */}
        {!loading && !query && results.length === 0 && (
          <div className="text-center py-16">
            <User size={48} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No active residents found</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchResident;