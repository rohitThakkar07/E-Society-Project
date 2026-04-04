import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion"; // Animation के लिए
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
  Sparkles,
  Fingerprint
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : "http://localhost:4000/api/auth";

/* ─────────────────────────── FORGOT PASSWORD MODAL ─────────────────────── */

const ForgotPasswordModal = ({ onClose }) => {
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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { toast.error("Enter the complete 6-digit OTP"); return; }
    setStep(3);
  };

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden relative"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
               <Fingerprint size={28} />
             </div>
             <h2 className="text-2xl font-black tracking-tight uppercase italic text-white">Security terminal</h2>
          </div>
        </div>

        <div className="p-8 bg-slate-900/50">
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <p className="text-slate-400 text-sm">Forgot your access key? No problem. Enter email below.</p>
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em] ml-1">Registry Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18}/>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="admin@esociety.com" />
                </div>
              </div>
              <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-black text-white transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                {loading ? <RefreshCw className="animate-spin" size={18}/> : <>Transmit OTP <ArrowRight size={18}/></>}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-slate-400 text-sm text-center">Enter the 6-digit signal code sent to <br/><span className="text-white font-bold">{email}</span></p>
              <div className="flex gap-2.5 justify-center" onPaste={handleOtpPaste}>
                {otp.map((d, i) => (
                  <input key={i} ref={el => otpRefs.current[i]=el} type="text" maxLength={1} value={d} onChange={e=>handleOtpChange(e.target.value, i)} onKeyDown={e=>handleOtpKeyDown(e, i)} className="w-12 h-14 bg-slate-950 border border-slate-800 text-center text-xl font-bold text-blue-400 rounded-xl outline-none focus:border-blue-500 transition-all shadow-inner" />
                ))}
              </div>
              <div className="space-y-4">
                <button type="button" onClick={handleResend} disabled={resendTimer > 0 || loading} className={`w-full text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${resendTimer > 0 ? "text-slate-600" : "text-blue-400 hover:text-white"}`}>
                  {resendTimer > 0 ? `Resend Signal in ${resendTimer}s` : "Re-Initialize Signal"}
                </button>
                <button type="submit" className="w-full bg-blue-600 py-4 rounded-2xl font-black text-white uppercase tracking-widest text-xs">Verify Signal Code</button>
              </div>
            </form>
          )}

          {step === 3 && (
             <form onSubmit={handleResetPassword} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-blue-500 tracking-widest ml-1">New Master Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18}/>
                    <input type={showNew ? "text":"password"} value={newPassword} onChange={e=>setNewPassword(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="Min. 6 characters" />
                    <button type="button" onClick={()=>setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">{showNew ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-blue-500 tracking-widest ml-1">Confirm Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18}/>
                    <input type={showConfirm ? "text":"password"} value={confirmNewPassword} onChange={e=>setConfirmNewPassword(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="Repeat key" />
                    <button type="button" onClick={()=>setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">{showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-4 rounded-2xl font-black text-white uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20">Finalize Key Update</button>
             </form>
          )}

          {step === 4 && (
            <div className="text-center space-y-6 py-4 animate-in zoom-in duration-500">
              <div className="flex justify-center"><div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]"><CheckCircle2 size={40} className="text-green-500" /></div></div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Access Restored</h3>
              <p className="text-slate-400 text-sm leading-relaxed">System credentials successfully updated in master database.</p>
              <button onClick={onClose} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 hover:text-white transition-all">Return to Terminal</button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────── LOGIN PAGE ────────────────────────────── */

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state added
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", blockUnit: "", role: "Resident", password: "", confirmPassword: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const response = await axios.post(`${API_URL}/login`, formData);
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("userData", JSON.stringify(user));
        toast.success(`Welcome back, ${user.fullName || 'Resident'}!`);
        const userRole = user.role.toLowerCase();
        navigate(userRole === "admin" ? "/admin" : "/");
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Security codes do not match!");
          setLoading(false);
          return;
        }
        await axios.post(`${API_URL}/register`, formData);
        toast.success("Society Node Registry Complete! Please Login.");
        setIsLogin(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signal Interrupt: Auth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-[#030712] font-sans">
      
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse delay-1000" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      
      {/* 🏙️ Optional: Background Image with Overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 transition-all duration-[20s] hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop')" }} />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-slate-900" />

      {/* Main Glass Card */}
      <motion.div 
        layout
        className="w-full max-w-[1100px] min-h-[650px] grid lg:grid-cols-2 bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden relative z-10"
      >
        
        {/* LEFT PANEL: Branding */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-slate-900 to-black text-white relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-20 group cursor-pointer">
              <motion.div whileHover={{ rotate: 90 }} transition={{ type: "spring" }} className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-500/30">
                <Building2 size={32} className="text-white" />
              </motion.div>
              <div>
                 <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">e-Society</h1>
                 <p className="text-[10px] font-black text-blue-500 tracking-[0.4em] uppercase mt-1">Digital Ecosystem</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={isLogin ? 'login-text' : 'setup-text'}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <h2 className="text-6xl font-black leading-[0.95] tracking-tighter">
                  {isLogin ? "Access the" : "Init Society"} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
                    Digital Node.
                  </span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed font-medium max-w-sm opacity-80 italic">
                  Everything you need to manage security, payments, and residents in a unified ecosystem.
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 flex items-center gap-4 p-6 bg-blue-500/5 border border-blue-500/10 rounded-[2rem] backdrop-blur-md max-w-fit shadow-inner">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                <ShieldCheck size={24}/>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-white uppercase tracking-widest">End-to-End Encrypted</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">V.26.4 SECURITY CORE</p>
              </div>
          </div>
        </div>

        {/* RIGHT PANEL: Form Container */}
        <div className="p-8 lg:p-16 flex flex-col justify-center bg-[#070b14]/50 relative">
          <div className="mb-12 text-center lg:text-left">
            <motion.div layout className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4 mx-auto lg:mx-0">
              <Sparkles size={12} /> {isLogin ? "Identity verification" : "Admin node setup"}
            </motion.div>
            <h3 className="text-4xl font-black text-white tracking-tighter mb-2 uppercase italic">
              {isLogin ? "Sign In" : "Register Hub"}
            </h3>
            <p className="text-slate-500 text-sm font-bold italic">
              {isLogin ? "Enter authority credentials to proceed." : "Establish new administrator protocols."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-5 overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black uppercase text-blue-500 tracking-widest ml-1">Identity Name</label>
                      <div className="relative">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input type="text" name="fullName" placeholder="Rahul Sharma" onChange={handleChange} required className="w-full bg-[#0f172a] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-medium" />
                      </div>
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black uppercase text-blue-500 tracking-widest ml-1">Signal Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input type="tel" name="phone" placeholder="+91..." onChange={handleChange} required className="w-full bg-[#0f172a] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-medium" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase text-blue-500 tracking-widest ml-1">Email Node</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input type="email" name="email" placeholder="signal@society.hub" onChange={handleChange} required className="w-full bg-[#0f172a] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-medium" />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center ml-1">
                 <label className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Master Key</label>
                 {isLogin && (
                    <button type="button" onClick={() => setShowForgot(true)} className="text-[10px] font-black text-blue-400 hover:text-white uppercase transition-colors tracking-widest underline decoration-blue-500/20">Recovery Mode?</button>
                 )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input type={showPassword ? 'text' : 'password'} name="password" placeholder="••••••••" onChange={handleChange} required className="w-full bg-[#0f172a] border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-medium" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
              </div>
            </div>

            <AnimatePresence>
              {!isLogin && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2 group">
                   <label className="text-[10px] font-black uppercase text-blue-500 tracking-widest ml-1">Confirm Master Key</label>
                   <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input type="password" name="confirmPassword" placeholder="••••••••" onChange={handleChange} required className="w-full bg-[#0f172a] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-medium" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button 
              whileHover={{ scale: 1.01, boxShadow: "0 0 40px rgba(37,99,235,0.4)" }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-5 rounded-3xl font-black text-white transition-all flex items-center justify-center gap-3 uppercase tracking-[0.3em] text-xs mt-10 group disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" size={18}/> : isLogin ? "Initialize Session" : "Deploy Admin Profile"}
              <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
          </form>

          {/* TOGGLE SECTION (Simplified & Modern) */}
          <div className="mt-16 text-center relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <span className="relative bg-[#070b14] px-6 py-1 rounded-full border border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Terminal Switcher</span>
            <p className="text-slate-500 text-sm font-bold mt-12">
              {isLogin ? "Need a society setup?" : "Already an authorized admin?"}
              <button 
                onClick={() => {
                   setIsLogin(!isLogin);
                   setFormData(prev => ({ ...prev, role: isLogin ? "Admin" : "Resident" }));
                }} 
                className="ml-3 text-blue-400 hover:text-white font-black uppercase tracking-widest transition-colors underline decoration-blue-500/30 italic"
              >
                {isLogin ? "Register Node" : "Back to Login"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Modal layer */}
      <AnimatePresence>
        {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Login;