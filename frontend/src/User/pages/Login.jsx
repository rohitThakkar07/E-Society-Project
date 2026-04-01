import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from 'axios';
import {
  Eye,
  EyeOff,
  Building2,
  UserCircle,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  CheckCircle2,
  X,
} from 'lucide-react';

const API_URL = "http://localhost:4000/api/auth";

/* ─────────────────────────── FORGOT PASSWORD MODAL ─────────────────────── */

const ForgotPasswordModal = ({ onClose }) => {
  // step: 1 = enter email, 2 = enter OTP, 3 = new password, 4 = success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const startResendTimer = () => {
    setResendTimer(60);
    timerRef.current = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  /* Step 1: Send OTP */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email"); return; }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
      toast.success("OTP sent! Check your inbox.");
      setStep(2);
      startResendTimer();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* OTP box input handlers */
  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      otpRefs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft" && index > 0) otpRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  /* Resend OTP */
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
      toast.success("New OTP sent!");
      setOtp(["", "", "", "", "", ""]);
      startResendTimer();
      otpRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  /* Step 2: Verify OTP */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { toast.error("Enter the complete 6-digit OTP"); return; }
    setStep(3);
  };

  /* Step 3: Reset password */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (newPassword !== confirmNewPassword) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/reset-password`, {
        email,
        otp: otp.join(""),
        newPassword,
      });
      toast.success(data.message || "Password reset successfully!");
      setStep(4);
    } catch (err) {
      const msg = err.response?.data?.message || "Reset failed";
      if (msg.toLowerCase().includes("expired") || msg.toLowerCase().includes("invalid")) {
        toast.error(msg + " Please start over.");
        setStep(1);
        setOtp(["", "", "", "", "", ""]);
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── UI ── */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(8px)", background: "rgba(15,23,42,0.7)" }}>

      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">

        {/* Header strip */}
        <div className="bg-blue-600 px-8 pt-8 pb-6 text-white relative">
          <button onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 transition-colors">
            <X size={18} />
          </button>
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-white/15 p-2 rounded-xl">
              <KeyRound size={22} />
            </div>
            <h2 className="text-xl font-black tracking-tight">Forgot Password</h2>
          </div>

          {/* Step indicator */}
          {step < 4 && (
            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3].map(s => (
                <React.Fragment key={s}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all
                    ${step > s ? "bg-white border-white text-blue-600"
                      : step === s ? "bg-white/20 border-white text-white"
                      : "bg-white/10 border-white/30 text-white/50"}`}>
                    {step > s ? <CheckCircle2 size={14} /> : s}
                  </div>
                  {s < 3 && <div className={`flex-1 h-0.5 rounded-full transition-all ${step > s ? "bg-white" : "bg-white/25"}`} />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <div className="px-8 py-7">

          {/* ─── STEP 1: Email ─── */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                  Enter your registered email address and we'll send you a 6-digit OTP to reset your password.
                </p>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative mt-1">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-10 pr-4 py-3.5 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="group w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <>Send OTP <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          )}

          {/* ─── STEP 2: OTP ─── */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <p className="text-sm text-slate-500 leading-relaxed">
                We sent a 6-digit OTP to <span className="font-bold text-slate-700">{email}</span>. Enter it below.
              </p>

              {/* OTP boxes */}
              <div className="flex gap-2.5 justify-center" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => (otpRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => handleOtpKeyDown(e, i)}
                    className={`w-11 h-13 text-center text-xl font-black rounded-xl border-2 outline-none transition-all
                      ${digit ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-800"}
                      focus:border-blue-500 focus:bg-white`}
                    style={{ height: "52px" }}
                  />
                ))}
              </div>

              {/* Resend */}
              <p className="text-center text-xs text-slate-400">
                Didn't receive it?{" "}
                <button type="button" onClick={handleResend}
                  disabled={resendTimer > 0 || loading}
                  className={`font-bold transition-colors ${resendTimer > 0 ? "text-slate-300 cursor-default" : "text-blue-600 hover:underline"}`}>
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                </button>
              </p>

              <button type="submit" disabled={otp.join("").length < 6}
                className="group w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                Verify OTP <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button type="button" onClick={() => { setStep(1); setOtp(["","","","","",""]); }}
                className="w-full text-xs text-slate-400 hover:text-slate-600 transition-colors">
                ← Use a different email
              </button>
            </form>
          )}

          {/* ─── STEP 3: New Password ─── */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-sm text-slate-500 mb-1 leading-relaxed">
                OTP verified ✅ &mdash; Now set a new password for your account.
              </p>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-10 pr-12 py-3.5 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <button type="button" onClick={() => setShowNew(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Strength bar */}
                {newPassword && (
                  <div className="flex gap-1 mt-1.5 px-1">
                    {[1,2,3,4].map(i => {
                      const strength = newPassword.length >= 10 && /[A-Z]/.test(newPassword) && /\d/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword) ? 4
                        : newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /\d/.test(newPassword) ? 3
                        : newPassword.length >= 6 ? 2 : 1;
                      return <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= strength ? (strength === 1 ? "bg-red-400" : strength === 2 ? "bg-yellow-400" : strength === 3 ? "bg-blue-400" : "bg-green-400") : "bg-slate-100"}`} />;
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    placeholder="Repeat your password"
                    required
                    className={`w-full bg-slate-50 border-2 rounded-2xl pl-10 pr-12 py-3.5 outline-none focus:bg-white transition-all text-sm font-medium
                      ${confirmNewPassword && confirmNewPassword !== newPassword ? "border-red-400 focus:border-red-400" : "border-slate-100 focus:border-blue-500"}`}
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmNewPassword && confirmNewPassword !== newPassword && (
                  <p className="text-xs text-red-500 ml-1 mt-0.5">Passwords do not match</p>
                )}
              </div>

              <button type="submit" disabled={loading}
                className="group w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs mt-2">
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <>Reset Password <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          )}

          {/* ─── STEP 4: Success ─── */}
          {step === 4 && (
            <div className="text-center py-4 space-y-5">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={44} className="text-green-500" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Password Reset!</h3>
                <p className="text-sm text-slate-500">Your password has been updated successfully. You can now sign in with your new password.</p>
              </div>
              <button onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-blue-200 transition-all uppercase tracking-widest text-xs">
                Back to Sign In
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────── LOGIN PAGE ────────────────────────────── */

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    blockUnit: "",
    role: "Resident",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await axios.post(`${API_URL}/login`, formData);
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("userData", JSON.stringify(user));
        toast.success(`Welcome back!`);
        const userRole = user.role.toLowerCase();
        navigate(userRole === "admin" ? "/admin" : "/");
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match!");
          return;
        }
        await axios.post(`${API_URL}/register`, formData);
        toast.success("Society Admin Registered! Please Login.");
        setIsLogin(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative font-sans bg-slate-100">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      {/* Main Card */}
      <div className="w-full max-w-[1000px] min-h-[600px] grid lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.3)] overflow-hidden relative z-10 border border-white/20">

        {/* LEFT PANEL */}
        <div className="hidden lg:flex flex-col justify-center p-16 bg-slate-900 text-white relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-blue-600 p-2 rounded-lg shadow-lg">
                <Building2 size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter">e-Society</h1>
            </div>

            <h2 className="text-4xl font-bold mb-6 leading-tight tracking-tight">
              {isLogin ? "Digitalizing your" : "Start your digital"} <br />
              <span className="text-blue-400 font-black">{isLogin ? "community living." : "society journey."}</span>
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              A comprehensive solution for gated communities to manage maintenance, security, and resident engagement seamlessly.
            </p>

            {!isLogin && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest">
                <ShieldCheck size={14} /> Admin Setup Mode
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-8 lg:p-14 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              {isLogin ? "Sign In" : "Society Setup"}
            </h3>
            <p className="text-slate-500 text-sm font-medium">
              {isLogin ? "Welcome back! Enter your credentials." : "Register as an Admin to configure your society."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <input type="text" name="fullName" placeholder="Name" onChange={handleChange} required className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-10 pr-4 py-3.5 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium" />
                    <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone</label>
                  <div className="relative">
                    <input type="tel" name="phone" placeholder="987..." onChange={handleChange} required className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-10 pr-4 py-3.5 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium" />
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <input type="email" name="email" placeholder="name@example.com" onChange={handleChange} required className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-10 pr-4 py-3.5 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium" />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:underline uppercase tracking-widest transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-10 pr-12 py-3.5 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1 animate-in fade-in duration-300">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                  <input type="password" name="confirmPassword" placeholder="••••••••" onChange={handleChange} required className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-10 pr-4 py-3.5 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium" />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>
            )}

            <button type="submit" className="group w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
              {isLogin ? "Sign In" : "Setup Society"}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* TOGGLE SECTION */}
          <div className="text-center mt-10 pt-8 border-t border-slate-50">
            <p className="text-slate-500 text-xs font-medium">
              {isLogin ? (
                <>
                  Building a new community?{" "}
                  <button
                    onClick={() => { setIsLogin(false); setFormData(prev => ({ ...prev, role: "Admin" })); }}
                    className="text-blue-600 font-black hover:underline"
                  >
                    Admin register for setup the society
                  </button>
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <button onClick={() => setIsLogin(true)} className="text-blue-600 font-black hover:underline">
                    Back to Sign In
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </div>
  );
};

export default Login;