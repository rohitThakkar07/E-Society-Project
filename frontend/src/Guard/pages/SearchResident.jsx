// src/Guard/pages/SearchResident.jsx
import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, User, Phone, MapPin, Plus, Loader2, Home } from "lucide-react";
import API from "../../service/api";

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const SearchResident = () => {
  const [query,     setQuery]     = useState("");
  const [results,   setResults]   = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [searched,  setSearched]  = useState(false);

  const search = useCallback(
    debounce(async (q) => {
      if (q.length < 2) { setResults([]); setSearched(false); return; }
      setLoading(true);
      setSearched(true);
      try {
        const res = await API.get(`/visitor/search-residents?q=${q}`);
        setResults(res.data?.data || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350),
    []
  );

  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    search(v);
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen bg-slate-50">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:wght@800;900&display=swap');`}</style>

      <div className="bg-white border-b border-slate-100 px-6 py-5">
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
          Search Resident
        </h1>
        <p className="text-xs text-slate-400 mt-1">Find resident by name, flat, wing or mobile</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Search Box */}
        <div className="relative mb-6">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={handleChange}
            autoFocus
            placeholder="e.g. Sharma, A-204, Wing B, 9876543210…"
            className="w-full pl-14 pr-5 py-5 border border-slate-200 rounded-3xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
          />
          {loading && (
            <Loader2 size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((r) => (
              <div key={r._id}
                className="bg-white rounded-3xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm hover:border-blue-100 transition"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg flex-shrink-0">
                  {r.firstName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-900 text-lg">{r.firstName} {r.lastName}</p>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <Home size={12} /> {r.wing}-{r.flatNumber}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <Phone size={12} /> {r.mobileNumber}
                    </span>
                  </div>
                </div>
                <Link to={`/guard/visitor/add?resident=${r._id}`}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-md shadow-blue-100"
                >
                  <Plus size={15} /> Visitor
                </Link>
              </div>
            ))}
          </div>
        )}

        {searched && !loading && results.length === 0 && (
          <div className="text-center py-16">
            <User size={48} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No residents found</p>
            <p className="text-slate-400 text-sm mt-1">Try searching by first name, flat number, or mobile</p>
          </div>
        )}

        {!searched && (
          <div className="text-center py-16">
            <Search size={48} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-semibold">Start typing to search residents</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResident;