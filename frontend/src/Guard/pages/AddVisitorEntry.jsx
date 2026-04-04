// src/Guard/pages/AddVisitorEntry.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User, Phone, MapPin, FileText, Car, Shield,
  Search, CheckCircle, ChevronLeft, Send, Loader2, ChevronDown, X, Clock
} from "lucide-react";
import { createVisitor } from "../../store/slices/visitorSlice";
import { fetchResidents } from "../../store/slices/residentSlice";
import API from "../../service/api";
import { toast } from "react-toastify";

const PURPOSES = ["Visit", "Delivery", "Service", "Guest", "Other"];

const AddVisitorEntry = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem("userData") || "{}");

  // Redux residents
  const { residents = [], loading: residentsLoading } = useSelector((s) => s.resident || {});

  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [resident, setResident] = useState(null);
  const [createdVisitor, setCreatedVisitor] = useState(null);
  const [otp,  setOtp]  = useState("");
  const [otpTimer, setOtpTimer] = useState(300); // 5 min = 300 seconds
  const [timerActive, setTimerActive] = useState(false);
  const [form, setForm] = useState({
    visitorName:  "",
    mobileNumber: "",
    purpose:      "Visit",
    vehicleNumber: "",
    notes:        "",
  });

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const dropdownRef = useRef(null);

  // Load all residents on mount
  useEffect(() => {
    dispatch(fetchResidents());
  }, [dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Active residents only, filtered by search
  const activeResidents = useMemo(() => {
    const all = residents.filter((r) => r.status === "Active");
    if (!searchQ.trim()) return all;
    const q = searchQ.toLowerCase();
    return all.filter((r) =>
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
      r.wing?.toLowerCase().includes(q) ||
      r.flatNumber?.toLowerCase().includes(q) ||
      r.mobileNumber?.includes(q)
    );
  }, [residents, searchQ]);

  const selectResident = (r) => {
    setResident(r);
    setSearchQ("");
    setDropdownOpen(false);
    setStep(2);
  };
  // ── OTP countdown timer ────────────────────────────────────────────────────
  useEffect(() => {
    if (!timerActive) return;
    if (otpTimer <= 0) { setTimerActive(false); return; }
    const t = setInterval(() => setOtpTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timerActive, otpTimer]);

  const startTimer = () => { setOtpTimer(300); setTimerActive(true); };

  const fmtTimer = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  // Format unit display — avoid B-B-104 double wing
  const formatUnit = (wing, flatNumber) => {
    if (!wing || !flatNumber) return flatNumber || wing || "—";
    // flatNumber may already include wing prefix (e.g. "B-104" when wing="B")
    if (flatNumber.startsWith(`${wing}-`) || flatNumber.startsWith(wing)) return flatNumber;
    return `${wing}-${flatNumber}`;
  };


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
      startTimer(); // start 5-min countdown
      toast.info("OTP sent to resident's email.");
    } catch {
      // toast already shown in slice
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Verify OTP ─────────────────────────────────────────────────────
  const getVisitorId = () => {
    const id = createdVisitor?.data?._id ?? createdVisitor?._id;
    if (!id) return null;
    return typeof id === "object" && id !== null && typeof id.toString === "function" ? id.toString() : id;
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) { toast.error("Enter valid 6-digit OTP."); return; }
    const visitorId = getVisitorId();
    if (!visitorId) { toast.error("Visitor ID is invalid."); return; }

    setLoading(true);
    try {
      await API.post(`/visitor/verify-otp/${visitorId}`, { otp });
      toast.success("✅ OTP verified! Visitor entry approved.");
      navigate("/guard/visitors");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const visitorId = getVisitorId();
    if (!visitorId) { toast.error("Visitor ID is invalid."); return; }

    setLoading(true);
    try {
      await API.post(`/visitor/resend-otp/${visitorId}`);
      startTimer(); // reset 5-min countdown
      setOtp("");   // clear any partial OTP
      toast.success("New OTP sent to resident.");
    } catch {
      toast.error("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleBypassEntry = async () => {
    if (!window.confirm("Allow entry without OTP? (Override)")) return;
    const visitorId = getVisitorId();
    if (!visitorId) { toast.error("Visitor ID is invalid."); return; }

    setLoading(true);
    try {
      await API.put(`/visitor/allow-entry/${visitorId}`);
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

        {/* ── STEP 1: Select Resident ──────────────────────────────────── */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User size={28} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
                Select Resident
              </h2>
              <p className="text-sm text-slate-500">Choose the resident being visited from the society list</p>
            </div>

            {/* Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className={`w-full flex items-center justify-between px-4 py-4 border-2 rounded-2xl text-sm font-medium transition-all bg-slate-50 ${
                  dropdownOpen ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {resident ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                      {resident.firstName?.[0]}
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-slate-800">{resident.firstName} {resident.lastName}</span>
                      <span className="ml-2 text-xs text-blue-500 font-semibold">{resident.wing}-{resident.flatNumber}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-400">
                    {residentsLoading ? "Loading residents…" : "Select a resident…"}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  {resident && (
                    <span
                      onClick={(e) => { e.stopPropagation(); setResident(null); }}
                      className="p-1 hover:bg-slate-200 rounded-lg transition"
                    >
                      <X size={14} className="text-slate-400" />
                    </span>
                  )}
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </div>
              </button>

              {/* Dropdown Panel */}
              {dropdownOpen && (
                <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                  {/* Search inside dropdown */}
                  <div className="p-3 border-b border-slate-100">
                    <div className="relative">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        autoFocus
                        value={searchQ}
                        onChange={(e) => setSearchQ(e.target.value)}
                        placeholder="Search by name, wing, flat or mobile…"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      {searchQ && (
                        <button
                          onClick={() => setSearchQ("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Resident List */}
                  <div className="max-h-72 overflow-y-auto">
                    {residentsLoading ? (
                      <div className="flex items-center justify-center gap-2 py-8 text-slate-400 text-sm">
                        <Loader2 size={16} className="animate-spin" />
                        Loading residents…
                      </div>
                    ) : activeResidents.length === 0 ? (
                      <div className="py-8 text-center text-sm text-slate-400">
                        {searchQ ? "No residents match your search." : "No active residents found."}
                      </div>
                    ) : (
                      activeResidents.map((r) => (
                        <button
                          key={r._id}
                          onClick={() => selectResident(r)}
                          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-blue-50 transition text-left border-b border-slate-50 last:border-0"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {r.firstName?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800 text-sm truncate">
                              {r.firstName} {r.lastName}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">
                                {r.wing}-{r.flatNumber}
                              </span>
                              {r.mobileNumber && (
                                <span className="text-[11px] text-slate-400 font-medium">
                                  {r.mobileNumber}
                                </span>
                              )}
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                r.residentType === "Owner" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                              }`}>
                                {r.residentType}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Footer count */}
                  {!residentsLoading && (
                    <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                      {activeResidents.length} active resident{activeResidents.length !== 1 ? "s" : ""} {searchQ ? "found" : "available"}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirm button (appears after selection) */}
            {resident && (
              <button
                onClick={() => setStep(2)}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition shadow-lg shadow-blue-100"
              >
                <CheckCircle size={18} />
                Continue with {resident.firstName} {resident.lastName}
              </button>
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
              An OTP has been sent to the resident's registered email address.
            </p>
            <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left">
              <p className="text-xs font-bold text-slate-500 mb-1">VISITOR</p>
              <p className="font-black text-slate-800">{createdVisitor.visitorName}</p>
              <p className="text-sm text-slate-500">
                {formatUnit(createdVisitor.wing, createdVisitor.flatNumber)} · {createdVisitor.purpose}
              </p>
            </div>

            {/* Countdown Timer */}
            <div className={`flex items-center justify-center gap-2 mb-6 px-4 py-3 rounded-2xl text-sm font-black ${
              otpTimer <= 0
                ? "bg-red-50 text-red-500"
                : otpTimer <= 30
                ? "bg-red-50 text-red-500 animate-pulse"
                : "bg-amber-50 text-amber-600"
            }`}>
              <Clock size={16} />
              {otpTimer > 0
                ? <span>OTP expires in <span className="tabular-nums">{fmtTimer(otpTimer)}</span></span>
                : <span>OTP expired — please resend</span>
              }
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