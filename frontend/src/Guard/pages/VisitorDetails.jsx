// src/Guard/pages/VisitorDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronLeft, Phone, MapPin, Clock, Car, Shield,
  CheckCircle, XCircle, LogOut, RefreshCw, Loader2, User
} from "lucide-react";
import { fetchVisitorById, markExit } from "../../store/slices/visitorSlice";
import API from "../../service/api";
import { toast } from "react-toastify";

const ACCENT = "#4F6EF7";

const STATUS_CONFIG = {
  Pending:  { bg: "#FFF8E1", color: "#F59E0B", dot: "#F59E0B", icon: "⏳", label: "Pending"  },
  Approved: { bg: "#E8F5E9", color: "#16A34A", dot: "#16A34A", icon: "✅", label: "Approved" },
  Inside:   { bg: "#E3F2FD", color: "#1D4ED8", dot: "#1D4ED8", icon: "🏠", label: "Inside"   },
  Exited:   { bg: "#F1F5F9", color: "#64748B", dot: "#94A3B8", icon: "🚶", label: "Exited"   },
  Denied:   { bg: "#FEE2E2", color: "#DC2626", dot: "#DC2626", icon: "🚫", label: "Denied"   },
};

const VisitorDetail = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleVisitor: visitor, loading } = useSelector((s) => s.visitor || {});

  const user   = JSON.parse(localStorage.getItem("userData") || "{}");
  const isGuard = ["guard", "admin"].includes(user?.role?.toLowerCase());

  const [otp,        setOtp]        = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [actionLoad, setActionLoad] = useState(false);

  useEffect(() => { dispatch(fetchVisitorById(id)); }, [dispatch, id]);

  if (loading || !visitor) {
    return (
      <div className="min-h-full flex items-center justify-center" style={{ background: "#F4F5FA" }}>
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-slate-300" size={28} />
          <p className="text-sm text-slate-400">Loading visitor details…</p>
        </div>
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
      setShowOtpBox(false); setOtp("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP.");
    } finally { setOtpLoading(false); }
  };

  const handleResendOTP = async () => {
    setOtpLoading(true);
    try {
      await API.post(`/visitor/resend-otp/${id}`);
      toast.success("OTP resent to resident.");
    } catch { toast.error("Failed to resend OTP."); } finally { setOtpLoading(false); }
  };

  const handleOverride = async () => {
    if (!window.confirm("Allow entry without OTP?")) return;
    setActionLoad(true);
    try {
      await API.put(`/visitor/allow-entry/${id}`);
      toast.success("Entry allowed (override).");
      dispatch(fetchVisitorById(id));
    } catch { toast.error("Action failed."); } finally { setActionLoad(false); }
  };

  const handleDeny = async () => {
    if (!window.confirm("Deny this visitor?")) return;
    setActionLoad(true);
    try {
      await API.put(`/visitor/deny/${id}`);
      toast.success("Visitor denied.");
      dispatch(fetchVisitorById(id));
    } catch { toast.error("Action failed."); } finally { setActionLoad(false); }
  };

  const handleExit = async () => {
    if (!window.confirm("Mark visitor as exited?")) return;
    setActionLoad(true);
    await dispatch(markExit(id));
    dispatch(fetchVisitorById(id));
    setActionLoad(false);
  };

  const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
           style={{ background: "#EEF1FE" }}>
        <Icon size={15} style={{ color: ACCENT }} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-700 mt-0.5">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-full space-y-5" style={{ background: "#F4F5FA" }}>

      {/* Back + Title */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)}
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition shadow-sm">
          <ChevronLeft size={18} className="text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-800">Visitor Details</h1>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full"
              style={{ background: sc.bg, color: sc.color }}>
          <span className="w-2 h-2 rounded-full" style={{ background: sc.dot }} />
          {sc.label}
        </span>
      </div>

      {/* Visitor Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md flex-shrink-0"
               style={{ background: ACCENT }}>
            {visitor.visitorName?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{visitor.visitorName}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{visitor.purpose} Visit</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DetailItem icon={Phone}  label="Mobile"     value={visitor.mobileNumber || "—"} />
          <DetailItem icon={MapPin} label="Flat"       value={visitor.wing && visitor.flatNumber && String(visitor.flatNumber).startsWith(visitor.wing) ? visitor.flatNumber : `${visitor.wing || "?"}-${visitor.flatNumber || "?"}`} />
          <DetailItem icon={Clock}  label="Entry Time" value={
            visitor.entryTime
              ? new Date(visitor.entryTime).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
              : "Not entered yet"
          } />
          <DetailItem icon={LogOut} label="Exit Time"  value={
            visitor.exitTime
              ? new Date(visitor.exitTime).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
              : "Still inside"
          } />
          {visitor.vehicleNumber && (
            <DetailItem icon={Car} label="Vehicle" value={visitor.vehicleNumber} />
          )}
          {visitor.notes && (
            <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Notes</p>
              <p className="text-sm text-slate-600">{visitor.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Visiting Resident */}
      {visitor.visitingResident && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Visiting Resident</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0"
                 style={{ background: ACCENT }}>
              {visitor.visitingResident.firstName?.[0]}
            </div>
            <div>
              <p className="font-bold text-slate-800">
                {visitor.visitingResident.firstName} {visitor.visitingResident.lastName}
              </p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: ACCENT }}>
                {visitor.visitingResident.wing && visitor.visitingResident.flatNumber && String(visitor.visitingResident.flatNumber).startsWith(visitor.visitingResident.wing) ? visitor.visitingResident.flatNumber : `${visitor.visitingResident.wing || "?"}-${visitor.visitingResident.flatNumber || "?"}`}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{visitor.visitingResident.mobileNumber}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions — Pending */}
      {isPending && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{ background: "#FFF8E1" }}>
              <Shield size={18} style={{ color: "#F59E0B" }} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Pending Verification</h3>
              <p className="text-xs text-slate-500">OTP was sent to resident's email</p>
            </div>
          </div>

          {!showOtpBox ? (
            <button onClick={() => setShowOtpBox(true)}
                    className="w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-xl transition shadow-lg"
                    style={{ background: "#16A34A" }}>
              <Shield size={16} /> Enter OTP
            </button>
          ) : (
            <div className="space-y-3">
              <input value={otp}
                     onChange={(e) => setOtp(e.target.value.replace(/\D/, "").slice(0, 6))}
                     placeholder="• • • • • •" inputMode="numeric" maxLength={6}
                     className="w-full text-center text-3xl font-black tracking-[0.5em] py-4 border-2 rounded-xl focus:outline-none bg-slate-50 transition"
                     style={{ borderColor: otp.length === 6 ? "#16A34A" : "#E2E8F0" }} />
              <button onClick={handleVerifyOTP} disabled={otpLoading || otp.length !== 6}
                      className="w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-xl transition shadow-lg disabled:opacity-50"
                      style={{ background: "#16A34A" }}>
                {otpLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                Verify & Allow
              </button>
              <button onClick={handleResendOTP} disabled={otpLoading}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-sm transition">
                Resend OTP to Resident
              </button>
            </div>
          )}

          {isGuard && (
          <div className="flex gap-3">
            <button onClick={handleOverride} disabled={actionLoad}
                    className="flex-1 py-2.5 font-semibold rounded-xl text-sm transition"
                    style={{ background: "#FFF3E0", color: "#F59E0B" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FFE0B2"}
                    onMouseLeave={e => e.currentTarget.style.background = "#FFF3E0"}>
              {actionLoad ? "…" : "Override Entry"}
            </button>
            <button onClick={handleDeny} disabled={actionLoad}
                    className="flex-1 py-2.5 font-semibold rounded-xl text-sm transition"
                    style={{ background: "#FEE2E2", color: "#DC2626" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FECACA"}
                    onMouseLeave={e => e.currentTarget.style.background = "#FEE2E2"}>
              {actionLoad ? "…" : "Deny Entry"}
            </button>
          </div>
          )}
        </div>
      )}

      {/* Actions — Inside */}
      {isInside && isGuard && (
        <button onClick={handleExit} disabled={actionLoad}
                className="w-full flex items-center justify-center gap-3 text-white font-bold py-4 rounded-2xl text-base transition shadow-xl disabled:opacity-50"
                style={{ background: "#F59E0B" }}>
          {actionLoad ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} />}
          Mark Exit
        </button>
      )}

      {/* Done state */}
      {isDone && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
               style={{ background: sc.bg }}>
            {visitor.status === "Exited"
              ? <CheckCircle size={24} style={{ color: sc.color }} />
              : <XCircle size={24} style={{ color: sc.color }} />}
          </div>
          <p className="font-bold text-slate-700">
            This visitor {visitor.status === "Exited" ? "has exited" : "was denied entry"}.
          </p>
          <button onClick={() => navigate(-1)}
                  className="mt-4 text-sm font-semibold hover:underline"
                  style={{ color: ACCENT }}>
            ← Back to log
          </button>
        </div>
      )}
    </div>
  );
};

export default VisitorDetail;