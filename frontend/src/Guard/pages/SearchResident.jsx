// src/Guard/pages/SearchResident.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, Phone, Home, User, UserCheck, Users } from "lucide-react";
import { fetchResidents } from "../../store/slices/residentSlice";

const ACCENT = "#4F6EF7";

const SearchResident = () => {
  const dispatch = useDispatch();
  const { residents = [], loading } = useSelector((s) => s.resident || {});
  const [query, setQuery] = useState("");

  useEffect(() => { dispatch(fetchResidents()); }, [dispatch]);

  const results = useMemo(() => {
    const active = residents.filter((r) => r.status === "Active");
    if (!query.trim()) return active;
    const q = query.toLowerCase();
    return active.filter((r) =>
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
      r.wing?.toLowerCase().includes(q) ||
      r.flatNumber?.toLowerCase().includes(q) ||
      r.mobileNumber?.includes(q)
    );
  }, [residents, query]);

  return (
    <div className="p-6 space-y-5 min-h-full" style={{ background: "#F4F5FA" }}>

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Search Resident</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Find any active resident by name, flat, wing or mobile
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            placeholder="e.g. Sharma, A-204, Wing B, 9876543210…"
            className="w-full pl-12 pr-5 py-3.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 bg-slate-50 transition font-medium"
          />
        </div>

        {/* Result Count */}
        {!loading && (
          <div className="flex items-center justify-between mt-3 px-1">
            <p className="text-xs text-slate-400 font-semibold">
              {results.length} resident{results.length !== 1 ? "s" : ""}{" "}
              {query ? "found" : "available"}
            </p>
            {query && (
              <button onClick={() => setQuery("")}
                      className="text-xs font-semibold transition-colors"
                      style={{ color: ACCENT }}>
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
               style={{ background: "#EEF1FE" }}>
            <Search size={20} style={{ color: ACCENT }} />
          </div>
          <p className="text-sm text-slate-400">Loading residents…</p>
        </div>
      )}

      {/* Results Table */}
      {!loading && results.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100"
               style={{ gridTemplateColumns: "2fr 1fr 1fr 0.8fr", background: "#F8FAFC" }}>
            <div>Resident</div>
            <div className="hidden sm:block">Contact</div>
            <div className="hidden sm:block">Type</div>
            <div className="text-center">Action</div>
          </div>

          {results.map((r) => (
            <div key={r._id}
                 className="grid px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors items-center"
                 style={{ gridTemplateColumns: "2fr 1fr 1fr 0.8fr" }}>
              {/* Resident */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0"
                     style={{ background: ACCENT }}>
                  {r.firstName?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate">
                    {r.firstName} {r.lastName}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Home size={11} className="text-slate-400" />
                    <span className="text-xs text-slate-500">{r.wing}-{r.flatNumber}</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                {r.mobileNumber ? (
                  <>
                    <Phone size={11} className="text-slate-400" />
                    {r.mobileNumber}
                  </>
                ) : "—"}
              </div>

              {/* Type badge */}
              <div className="hidden sm:block">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={r.residentType === "Owner"
                        ? { background: "#E8F5E9", color: "#16A34A" }
                        : { background: "#FFF8E1", color: "#F59E0B" }}>
                  {r.residentType}
                </span>
              </div>

              {/* Action */}
              <div className="flex justify-center">
                <Link to="/guard/visitor/add" state={{ residentId: r._id }}
                      className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl text-white transition shadow-sm"
                      style={{ background: ACCENT }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  <UserCheck size={13} /> Add Visitor
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty — no results for query */}
      {!loading && query && results.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
               style={{ background: "#F1F5F9" }}>
            <User size={24} className="text-slate-300" />
          </div>
          <p className="font-semibold text-slate-500">No residents match "{query}"</p>
          <p className="text-sm text-slate-400 mt-1">Try first name, flat number, wing or mobile</p>
        </div>
      )}

      {/* Empty — no residents */}
      {!loading && !query && results.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
               style={{ background: "#EEF1FE" }}>
            <Users size={24} style={{ color: ACCENT }} />
          </div>
          <p className="font-semibold text-slate-500">No active residents found</p>
          <p className="text-sm text-slate-400 mt-1">Residents will appear here once added by the admin</p>
        </div>
      )}
    </div>
  );
};

export default SearchResident;