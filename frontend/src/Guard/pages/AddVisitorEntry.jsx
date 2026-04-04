// src/Guard/pages/AddVisitorEntry.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User, Phone, MapPin, FileText, Car, Shield,
  Search, CheckCircle, ChevronLeft, Send, Loader2,
  ChevronDown, X, Clock, Check
} from "lucide-react";
import { createVisitor } from "../../store/slices/visitorSlice";
import { fetchResidents } from "../../store/slices/residentSlice";
import API from "../../service/api";
import { toast } from "react-toastify";

const ACCENT = "#4F6EF7";
const PURPOSES = ["Visit", "Delivery", "Service", "Guest", "Other"];

const AddVisitorEntry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData") || "{}");

  const { residents = [], loading: residentsLoading } = useSelector((s) => s.resident || {});

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resident, setResident] = useState(null);
  const [createdVisitor, setCreatedVisitor] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(300);
  const [timerActive, setTimerActive] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const dropdownRef = useRef(null);

  const [form, setForm] = useState({
    visitorName: "", mobileNumber: "", purpose: "Visit",
    vehicleNumber: "", notes: "",
  });

  useEffect(() => { dispatch(fetchResidents()); }, [dispatch]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!timerActive) return;
    if (otpTimer <= 0) { setTimerActive(false); return; }
    const t = setInterval(() => setOtpTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timerActive, otpTimer]);

  const startTimer = () => { setOtpTimer(300); setTimerActive(true); };

  const fmtTimer = (s) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, "0")}`;
  };

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
    setResident(r); setSearchQ(""); setDropdownOpen(false); setStep(2);
  };

  const formatUnit = (wing, flatNumber) => {
    if (!wing || !flatNumber) return flatNumber || wing || "—";
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
        wing: resident.wing,
        flatNumber: resident.flatNumber,
        loggedBy: user?.profileId || null,
      };
      const result = await dispatch(createVisitor(payload)).unwrap();
      setCreatedVisitor(result);
      setStep(3);
      startTimer();
    } catch { } finally { setLoading(false); }
  };

  const getVisitorId = () => {
    const id = createdVisitor?.data?._id ?? createdVisitor?._id;
    if (!id) return null;
    return typeof id === "object" && id !== null ? id.toString() : id;
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
    } finally { setLoading(false); }
  };

  const handleResendOTP = async () => {
    const visitorId = getVisitorId();
    if (!visitorId) { toast.error("Visitor ID is invalid."); return; }
    setLoading(true);
    try {
      await API.post(`/visitor/resend-otp/${visitorId}`);
      startTimer(); setOtp("");
      toast.success("New OTP sent to resident.");
    } catch { toast.error("Failed to resend OTP."); } finally { setLoading(false); }
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
    } catch { toast.error("Failed to allow entry."); } finally { setLoading(false); }
  };

  /* Step labels */
  const STEPS = ["Select Resident", "Visitor Details", "OTP Verification"];

  return (
    <div className="p-6 min-h-full" style={{ background: "#F4F5FA" }}>

      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition shadow-sm">
          <ChevronLeft size={18} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">New Visitor Entry</h1>
          <p className="text-xs text-slate-500 mt-0.5">Step {step} of 3 — {STEPS[step - 1]}</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-8 max-w-lg">
        {STEPS.map((label, i) => {
          const num = i + 1;
          const done = num < step;
          const active = num === step;
          return (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: done ? "#16A34A" : active ? ACCENT : "#E2E8F0",
                    color: done || active ? "#fff" : "#94A3B8",
                  }}>
                  {done ? <Check size={15} /> : num}
                </div>
                <p className="text-[10px] font-semibold mt-1.5 whitespace-nowrap"
                  style={{ color: active ? ACCENT : done ? "#16A34A" : "#94A3B8" }}>
                  {label}
                </p>
              </div>
              {i < 2 && (
                <div className="flex-1 h-0.5 mb-5 mx-2 rounded-full"
                  style={{ background: done ? "#16A34A" : "#E2E8F0" }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="max-w-lg">

        {/* ── STEP 1: Select Resident ─────────────────────────────────────── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "#EEF1FE" }}>
                <User size={20} style={{ color: ACCENT }} />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Select Resident</h2>
                <p className="text-xs text-slate-500">Choose the resident being visited</p>
              </div>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button type="button" onClick={() => setDropdownOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-3 border-2 rounded-xl text-sm font-medium transition-all bg-slate-50"
                style={{ borderColor: dropdownOpen ? ACCENT : "#E2E8F0" }}>
                {resident ? (
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                      style={{ background: ACCENT }}>
                      {resident.firstName?.[0]}
                    </div>
                    <span className="font-semibold text-slate-800">
                      {resident.firstName} {resident.lastName}
                      <span className="ml-2 text-xs font-bold" style={{ color: ACCENT }}>
                        {resident.wing}-{resident.flatNumber}
                      </span>
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400">
                    {residentsLoading ? "Loading residents…" : "Select a resident…"}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  {resident && (
                    <span onClick={(e) => { e.stopPropagation(); setResident(null); }}
                      className="p-1 hover:bg-slate-200 rounded-lg transition">
                      <X size={13} className="text-slate-400" />
                    </span>
                  )}
                  <ChevronDown size={15} className={`text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-3 border-b border-slate-100">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input autoFocus value={searchQ}
                        onChange={(e) => setSearchQ(e.target.value)}
                        placeholder="Search by name, wing, flat or mobile…"
                        className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2" />
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {residentsLoading ? (
                      <div className="flex items-center justify-center gap-2 py-8 text-slate-400 text-sm">
                        <Loader2 size={15} className="animate-spin" /> Loading residents…
                      </div>
                    ) : activeResidents.length === 0 ? (
                      <div className="py-8 text-center text-sm text-slate-400">
                        {searchQ ? "No residents match." : "No active residents found."}
                      </div>
                    ) : (
                      activeResidents.map((r) => (
                        <button key={r._id} onClick={() => selectResident(r)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition text-left border-b border-slate-50 last:border-0">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                            style={{ background: ACCENT }}>
                            {r.firstName?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 text-sm truncate">
                              {r.firstName} {r.lastName}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                                style={{ background: "#EEF1FE", color: ACCENT }}>
                                {r.wing}-{r.flatNumber}
                              </span>
                              {r.mobileNumber && (
                                <span className="text-[11px] text-slate-400">{r.mobileNumber}</span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                  {!residentsLoading && (
                    <div className="px-4 py-2 border-t border-slate-100 text-[11px] text-slate-400 bg-slate-50">
                      {activeResidents.length} active resident{activeResidents.length !== 1 ? "s" : ""}{" "}
                      {searchQ ? "found" : "available"}
                    </div>
                  )}
                </div>
              )}
            </div>

            {resident && (
              <button onClick={() => setStep(2)}
                className="mt-5 w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-xl transition shadow-lg"
                style={{ background: ACCENT }}>
                <CheckCircle size={17} />
                Continue with {resident.firstName} {resident.lastName}
              </button>
            )}
          </div>
        )}

        {/* ── STEP 2: Visitor Details ─────────────────────────────────────── */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            {/* Selected Resident Banner */}
            {resident && (
              <div className="flex items-center gap-3 p-3 rounded-xl mb-5 border"
                style={{ background: "#EEF1FE", borderColor: ACCENT + "30" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ background: ACCENT }}>
                  {resident.firstName?.[0]}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm">{resident.firstName} {resident.lastName}</p>
                  <p className="text-xs font-semibold" style={{ color: ACCENT }}>
                    {resident.wing}-{resident.flatNumber}
                  </p>
                </div>
                <button onClick={() => { setStep(1); setResident(null); setSearchQ(""); }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition">
                  Change
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Visitor Name */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Visitor Name *
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required value={form.visitorName}
                    onChange={(e) => setForm({ ...form, visitorName: e.target.value })}
                    placeholder="Full name of visitor"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 bg-slate-50" />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Visitor Mobile *
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required value={form.mobileNumber}
                    onChange={(e) => setForm({ ...form, mobileNumber: e.target.value.replace(/\D/, "").slice(0, 10) })}
                    placeholder="10-digit mobile number" inputMode="numeric"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 bg-slate-50" />
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Purpose of Visit
                </label>
                <div className="flex flex-wrap gap-2">
                  {PURPOSES.map((p) => (
                    <button key={p} type="button" onClick={() => setForm({ ...form, purpose: p })}
                      className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
                      style={form.purpose === p
                        ? { background: ACCENT, color: "#fff", borderColor: ACCENT }
                        : { background: "#F8FAFC", color: "#64748B", borderColor: "#E2E8F0" }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Vehicle Number <span className="normal-case font-normal text-slate-400">(optional)</span>
                </label>
                <div className="relative">
                  <Car size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={form.vehicleNumber}
                    onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value.toUpperCase() })}
                    placeholder="MH04 AB 1234"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 bg-slate-50" />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Notes <span className="normal-case font-normal text-slate-400">(optional)</span>
                </label>
                <textarea value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any additional details…" rows={2}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 bg-slate-50 resize-none" />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 py-3 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition">
                  ← Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 text-white font-bold py-3 rounded-xl transition shadow-lg disabled:opacity-60"
                  style={{ background: ACCENT }}>
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {loading ? "Sending OTP…" : "Send OTP to Resident"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── STEP 3: OTP Verification ─────────────────────────────────────── */}
        {step === 3 && createdVisitor && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            {/* OTP Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "#FFF8E1" }}>
                <Shield size={24} style={{ color: "#F59E0B" }} />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">OTP Verification</h2>
                <p className="text-xs text-slate-500">OTP sent to resident's registered email</p>
              </div>
            </div>

            {/* Visitor Summary */}
            <div className="p-3 bg-slate-50 rounded-xl mb-5 border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Visitor</p>
              <p className="font-bold text-slate-800 text-sm">{createdVisitor.visitorName}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {formatUnit(createdVisitor.wing, createdVisitor.flatNumber)} · {createdVisitor.purpose}
              </p>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl mb-5 text-sm font-bold"
              style={{
                background: otpTimer <= 30 ? "#FEE2E2" : "#FFF8E1",
                color: otpTimer <= 30 ? "#DC2626" : "#F59E0B",
              }}>
              <Clock size={15} />
              {otpTimer > 0
                ? <span>OTP expires in <span className="tabular-nums">{fmtTimer(otpTimer)}</span></span>
                : <span>OTP expired — please resend</span>}
            </div>

            {/* OTP Input */}
            <div className="mb-5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                Enter 6-Digit OTP from Resident
              </label>
              <input value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/, "").slice(0, 6))}
                placeholder="• • • • • •"
                inputMode="numeric" maxLength={6}
                className="w-full text-center text-3xl font-black tracking-[0.5em] py-4 border-2 rounded-xl focus:outline-none bg-slate-50 transition"
                style={{ borderColor: otp.length === 6 ? "#16A34A" : "#E2E8F0" }} />
            </div>

            <button onClick={handleVerifyOTP} disabled={loading || otp.length !== 6}
              className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition shadow-lg disabled:opacity-50 mb-3"
              style={{ background: "#16A34A" }}>
              {loading ? <Loader2 size={17} className="animate-spin" /> : <CheckCircle size={17} />}
              Verify & Allow Entry
            </button>

            <div className="flex gap-3">
              <button onClick={handleResendOTP} disabled={loading}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition">
                Resend OTP
              </button>
              <button onClick={handleBypassEntry} disabled={loading}
                className="flex-1 py-2.5 font-semibold rounded-xl text-sm transition"
                style={{ background: "#FFF3E0", color: "#F59E0B" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FFE0B2"}
                onMouseLeave={e => e.currentTarget.style.background = "#FFF3E0"}>
                Override Entry
              </button>
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-3">
              OTP expires in 5 minutes. Use Override only if resident is unreachable.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddVisitorEntry;