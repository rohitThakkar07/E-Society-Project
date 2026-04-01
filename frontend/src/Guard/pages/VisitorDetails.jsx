// src/Guard/pages/VisitorDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronLeft, User, Phone, MapPin, Clock, Car, Shield,
  CheckCircle, XCircle, LogOut, RefreshCw, Loader2, Edit2
} from "lucide-react";
import { fetchVisitorById, markVisitorExit } from "../../store/slices/visitorSlice";
import API from "../../service/api";
import { toast } from "react-toastify";

const STATUS_CONFIG = {
  Pending:  { bg: "#fef3c7", color: "#d97706", icon: "⏳" },
  Approved: { bg: "#dcfce7", color: "#16a34a", icon: "✅" },
  Inside:   { bg: "#dbeafe", color: "#1d4ed8", icon: "🏠" },
  Exited:   { bg: "#f1f5f9", color: "#64748b", icon: "🚶" },
  Denied:   { bg: "#fee2e2", color: "#dc2626", icon: "🚫" },
};

const VisitorDetail = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const { singleVisitor: visitor, loading } = useSelector((s) => s.visitor || {});
  const [otp,         setOtp]         = useState("");
  const [otpLoading,  setOtpLoading]  = useState(false);
  const [showOtpBox,  setShowOtpBox]  = useState(false);
  const [actionLoad,  setActionLoad]  = useState(false);

  useEffect(() => {
    dispatch(fetchVisitorById(id));
  }, [dispatch, id]);

  if (loading || !visitor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <RefreshCw className="animate-spin text-slate-300" size={32} />
      </div>
    );
  }

  const sc        = STATUS_CONFIG[visitor.status] || STATUS_CONFIG.Pending;
  const isPending = visitor.status === "Pending";
  const isInside  = visitor.status === "Inside" || visitor.status === "Approved";
  const isDone    = visitor.status === "Exited" || visitor.status === "Denied";

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) { toast.error("Enter valid 6-digit OTP."); return; }
    setOtpLoading(true);
    try {
      await API.post(`/visitor/verify-otp/${id}`, { otp });
      toast.success("✅ OTP verified! Visitor approved.");
      dispatch(fetchVisitorById(id));
      setShowOtpBox(false);
      setOtp("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtpLoading(true);
    try {
      await API.post(`/visitor/resend-otp/${id}`);
      toast.success("OTP resent to resident.");
    } catch {
      toast.error("Failed to resend OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOverride = async () => {
    if (!window.confirm("Allow entry without OTP?")) return;
    setActionLoad(true);
    try {
      await API.put(`/visitor/allow-entry/${id}`);
      toast.success("Entry allowed (override).");
      dispatch(fetchVisitorById(id));
    } catch {
      toast.error("Action failed.");
    } finally {
      setActionLoad(false);
    }
  };

  const handleDeny = async () => {
    if (!window.confirm("Deny this visitor?")) return;
    setActionLoad(true);
    try {
      await API.put(`/visitor/deny/${id}`);
      toast.success("Visitor denied.");
      dispatch(fetchVisitorById(id));
    } catch {
      toast.error("Action failed.");
    } finally {
      setActionLoad(false);
    }
  };

  const handleExit = async () => {
    if (!window.confirm("Mark visitor as exited?")) return;
    setActionLoad(true);
    await dispatch(markVisitorExit(id));
    dispatch(fetchVisitorById(id));
    setActionLoad(false);
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen bg-slate-50">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:wght@800;900&display=swap');`}</style>

      {/* HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition">
          <ChevronLeft size={20} className="text-slate-600" />
        </button>
        <h1 className="text-xl font-black text-slate-900 flex-1" style={{ fontFamily: "'Fraunces', serif" }}>
          Visitor Details
        </h1>
        <span className="text-sm font-black px-4 py-1.5 rounded-full"
          style={{ background: sc.bg, color: sc.color }}
        >
          {sc.icon} {visitor.status}
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-5">

        {/* VISITOR CARD */}
        <div className="bg-white rounded-3xl border border-slate-100 p-7 shadow-sm">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
              {visitor.visitorName?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                {visitor.visitorName}
              </h2>
              <p className="text-sm text-slate-500 font-medium">{visitor.purpose} Visit</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Phone,   label: "Mobile",    value: visitor.mobileNumber },
              { icon: MapPin,  label: "Flat",      value: `${visitor.wing}-${visitor.flatNumber}` },
              { icon: Clock,   label: "Entry Time", value: visitor.entryTime ? new Date(visitor.entryTime).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "Not entered" },
              { icon: LogOut,  label: "Exit Time",  value: visitor.exitTime ? new Date(visitor.exitTime).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "Still inside" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                  <Icon size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-bold text-slate-700 mt-0.5">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {visitor.vehicleNumber && (
            <div className="mt-4 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
              <Car size={16} className="text-slate-400" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Vehicle</p>
                <p className="font-black text-slate-700 font-mono">{visitor.vehicleNumber}</p>
              </div>
            </div>
          )}
        </div>

        {/* RESIDENT INFO */}
        {visitor.visitingResident && (
          <div className="bg-blue-50 rounded-3xl border border-blue-100 p-6">
            <p className="text-xs font-black text-blue-400 uppercase tracking-wider mb-3">Visiting Resident</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                {visitor.visitingResident.firstName?.[0]}
              </div>
              <div>
                <p className="font-black text-slate-800">
                  {visitor.visitingResident.firstName} {visitor.visitingResident.lastName}
                </p>
                <p className="text-sm text-blue-600 font-bold">
                  {visitor.visitingResident.wing}-{visitor.visitingResident.flatNumber}
                </p>
                <p className="text-xs text-slate-500">{visitor.visitingResident.mobileNumber}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── ACTIONS ─────────────────────────────────────────────────────── */}
        {isPending && (
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-lg" style={{ fontFamily: "'Fraunces', serif" }}>
              Pending Verification
            </h3>
            <p className="text-sm text-slate-500">
              An OTP was sent to the resident's mobile. Enter the OTP they provide.
            </p>

            {!showOtpBox ? (
              <button onClick={() => setShowOtpBox(true)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl transition shadow-lg shadow-emerald-100"
              >
                <Shield size={18} /> Enter OTP
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/, "").slice(0, 6))}
                  placeholder="• • • • • •"
                  inputMode="numeric"
                  maxLength={6}
                  className="w-full text-center text-3xl font-black tracking-[0.5em] py-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 bg-slate-50"
                />
                <button onClick={handleVerifyOTP} disabled={otpLoading || otp.length !== 6}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black py-3.5 rounded-2xl transition"
                >
                  {otpLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                  Verify & Allow
                </button>
                <button onClick={handleResendOTP} disabled={otpLoading}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition"
                >
                  Resend OTP to Resident
                </button>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={handleOverride} disabled={actionLoad}
                className="flex-1 py-3 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold rounded-2xl text-sm transition"
              >
                {actionLoad ? "…" : "Override Entry"}
              </button>
              <button onClick={handleDeny} disabled={actionLoad}
                className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl text-sm transition"
              >
                {actionLoad ? "…" : "Deny Entry"}
              </button>
            </div>
          </div>
        )}

        {isInside && (
          <button onClick={handleExit} disabled={actionLoad}
            className="w-full flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black py-5 rounded-3xl text-lg transition shadow-xl shadow-orange-100"
          >
            {actionLoad ? <Loader2 size={22} className="animate-spin" /> : <LogOut size={22} />}
            Mark Exit
          </button>
        )}

        {isDone && (
          <div className="bg-slate-50 rounded-3xl border border-slate-100 p-6 text-center">
            <p className="text-slate-400 font-bold">
              This visitor {visitor.status === "Exited" ? "has exited" : "was denied"}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorDetail;