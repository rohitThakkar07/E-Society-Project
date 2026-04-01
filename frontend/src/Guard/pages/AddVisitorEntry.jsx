// src/Guard/pages/AddVisitorEntry.jsx
import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User, Phone, MapPin, FileText, Car, Shield,
  Search, CheckCircle, ChevronLeft, Send, Loader2
} from "lucide-react";
import { createVisitor } from "../../store/slices/visitorSlice";
import API from "../../service/api";
import { toast } from "react-toastify";

const PURPOSES = ["Visit", "Delivery", "Service", "Guest", "Other"];

const AddVisitorEntry = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem("userData") || "{}");

  const [step,    setStep]    = useState(1);  // 1=Search Resident, 2=Fill Form, 3=OTP
  const [loading, setLoading] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [resident, setResident] = useState(null);
  const [createdVisitor, setCreatedVisitor] = useState(null);
  const [otp,  setOtp]  = useState("");
  const [form, setForm] = useState({
    visitorName:  "",
    mobileNumber: "",
    purpose:      "Visit",
    vehicleNumber: "",
    notes:        "",
  });

  // ── Step 1: Search Resident ────────────────────────────────────────────────
  const searchResidents = useCallback(async (q) => {
    if (q.length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await API.get(`/visitor/search-residents?q=${q}`);
      setResults(res.data?.data || []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleSearchChange = (e) => {
    const v = e.target.value;
    setSearchQ(v);
    searchResidents(v);
  };

  const selectResident = (r) => {
    setResident(r);
    setSearchQ(`${r.firstName} ${r.lastName} — ${r.wing}-${r.flatNumber}`);
    setResults([]);
    setStep(2);
  };

  // ── Step 2: Submit Form → create visitor & send OTP ───────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resident) { toast.error("Please select a resident first."); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        visitingResident: resident._id,
        wing:             resident.wing,
        flatNumber:       resident.flatNumber,
        loggedBy:         user?.profileId || null,
      };
      const result = await dispatch(createVisitor(payload)).unwrap();
      setCreatedVisitor(result);
      setStep(3);
      toast.info("OTP sent to resident's mobile.");
    } catch {
      // toast already shown in slice
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Verify OTP ─────────────────────────────────────────────────────
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) { toast.error("Enter valid 6-digit OTP."); return; }
    setLoading(true);
    try {
      await API.post(`/visitor/verify-otp/${createdVisitor._id}`, { otp });
      toast.success("✅ OTP verified! Visitor entry approved.");
      navigate("/guard/visitors");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await API.post(`/visitor/resend-otp/${createdVisitor._id}`);
      toast.success("OTP resent to resident.");
    } catch {
      toast.error("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleBypassEntry = async () => {
    if (!window.confirm("Allow entry without OTP? (Override)")) return;
    setLoading(true);
    try {
      await API.put(`/visitor/allow-entry/${createdVisitor._id}`);
      toast.success("Visitor entry allowed (manual override).");
      navigate("/guard/visitors");
    } catch {
      toast.error("Failed to allow entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen bg-slate-50">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:wght@800;900&display=swap');`}</style>

      {/* HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition">
          <ChevronLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
            New Visitor Entry
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Step {step} of 3 — {step === 1 ? "Find Resident" : step === 2 ? "Visitor Details" : "OTP Verification"}
          </p>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="bg-white border-b border-slate-100 px-6 py-3">
        <div className="max-w-xl mx-auto flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                s < step ? "bg-emerald-500 text-white" : s === step ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
              }`}>
                {s < step ? <CheckCircle size={16} /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-1 rounded-full transition-all ${s < step ? "bg-emerald-400" : "bg-slate-100"}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-8">

        {/* ── STEP 1: Search Resident ────────────────────────────────────── */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
                Find Resident
              </h2>
              <p className="text-sm text-slate-500">Search by name, flat number, wing or mobile</p>
            </div>

            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQ}
                onChange={handleSearchChange}
                placeholder="e.g. Priya, A-204, 9876543210…"
                className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
              {searching && (
                <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />
              )}
            </div>

            {results.length > 0 && (
              <div className="mt-3 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
                {results.map((r) => (
                  <button key={r._id} onClick={() => selectResident(r)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-blue-50 transition border-b border-slate-50 last:border-0 text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {r.firstName?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{r.firstName} {r.lastName}</p>
                      <p className="text-xs text-slate-400">{r.wing}-{r.flatNumber} · {r.mobileNumber}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchQ.length >= 2 && results.length === 0 && !searching && (
              <p className="text-center text-sm text-slate-400 mt-4">No residents found. Try a different search.</p>
            )}
          </div>
        )}

        {/* ── STEP 2: Visitor Details Form ──────────────────────────────────── */}
        {step === 2 && (
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            {/* Selected Resident Preview */}
            {resident && (
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  {resident.firstName?.[0]}
                </div>
                <div className="flex-1">
                  <p className="font-black text-slate-800">{resident.firstName} {resident.lastName}</p>
                  <p className="text-xs text-blue-600 font-bold">{resident.wing}-{resident.flatNumber}</p>
                </div>
                <button onClick={() => { setStep(1); setResident(null); setSearchQ(""); }}
                  className="text-xs text-slate-500 font-bold hover:text-blue-600 transition"
                >
                  Change
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Visitor Name */}
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">
                  Visitor Name *
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    value={form.visitorName}
                    onChange={(e) => setForm({ ...form, visitorName: e.target.value })}
                    placeholder="Full name of visitor"
                    className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">
                  Visitor Mobile *
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    value={form.mobileNumber}
                    onChange={(e) => setForm({ ...form, mobileNumber: e.target.value.replace(/\D/, "").slice(0, 10) })}
                    placeholder="10-digit mobile number"
                    inputMode="numeric"
                    className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">
                  Purpose of Visit
                </label>
                <div className="flex flex-wrap gap-2">
                  {PURPOSES.map((p) => (
                    <button key={p} type="button"
                      onClick={() => setForm({ ...form, purpose: p })}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        form.purpose === p
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle Number */}
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">
                  Vehicle Number (optional)
                </label>
                <div className="relative">
                  <Car size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={form.vehicleNumber}
                    onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value.toUpperCase() })}
                    placeholder="MH04 AB 1234"
                    className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 block">
                  Notes (optional)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any additional details…"
                  rows={2}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 resize-none"
                />
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-black py-4 rounded-2xl transition shadow-lg shadow-blue-200"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                {loading ? "Sending OTP…" : "Send OTP to Resident"}
              </button>
            </form>
          </div>
        )}

        {/* ── STEP 3: OTP Verification ───────────────────────────────────────── */}
        {step === 3 && createdVisitor && (
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm text-center">
            <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Shield size={36} className="text-amber-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
              OTP Verification
            </h2>
            <p className="text-sm text-slate-500 mb-2">
              An OTP has been sent to the resident's registered mobile number.
            </p>
            <div className="bg-slate-50 rounded-2xl p-4 mb-8 text-left">
              <p className="text-xs font-bold text-slate-500 mb-1">VISITOR</p>
              <p className="font-black text-slate-800">{createdVisitor.visitorName}</p>
              <p className="text-sm text-slate-500">{createdVisitor.wing}-{createdVisitor.flatNumber} · {createdVisitor.purpose}</p>
            </div>

            {/* OTP Input */}
            <div className="mb-6">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3 block">
                Enter 6-Digit OTP from Resident
              </label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/, "").slice(0, 6))}
                placeholder="• • • • • •"
                inputMode="numeric"
                maxLength={6}
                className="w-full text-center text-3xl font-black tracking-[0.5em] py-5 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 bg-slate-50"
              />
            </div>

            <button onClick={handleVerifyOTP} disabled={loading || otp.length !== 6}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition shadow-lg shadow-emerald-100 mb-3"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
              Verify & Allow Entry
            </button>

            <div className="flex gap-3">
              <button onClick={handleResendOTP} disabled={loading}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition"
              >
                Resend OTP
              </button>
              <button onClick={handleBypassEntry} disabled={loading}
                className="flex-1 py-3 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold rounded-2xl text-sm transition"
              >
                Override Entry
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-4">OTP expires in 5 minutes. Use Override only if resident is unreachable.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddVisitorEntry;