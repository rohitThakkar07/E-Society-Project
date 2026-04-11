import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
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
  RefreshCw,
  CheckCircle2,
  X,
  Sparkles,
  Fingerprint,
} from "lucide-react";
import { ThemeProvider } from "../context/ThemeContext";
import societyConfig from "../../assets/societyConfig";

function getAuthApiUrl() {
  const raw = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:4000/api";
  return raw.endsWith("/api") ? `${raw}/auth` : `${raw}/api/auth`;
}

const API_URL = getAuthApiUrl();

const SOCIETY_HERO =
  import.meta.env.VITE_LOGIN_HERO_URL ||
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=85";

/* ── Forgot password (backend: POST /api/auth/forgot-password, /reset-password) ── */

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

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startResendTimer = () => {
    setResendTimer(60);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/forgot-password`, { email: email.trim() });
      toast.success("OTP sent. Check your inbox.");
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
    if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
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
      await axios.post(`${API_URL}/forgot-password`, { email: email.trim() });
      toast.success("New OTP sent");
      setOtp(["", "", "", "", "", ""]);
      startResendTimer();
      otpRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Enter the full 6-digit OTP");
      return;
    }
    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/reset-password`, {
        email: email.trim(),
        otp: otp.join(""),
        newPassword,
      });
      toast.success(data.message || "Password reset successfully");
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

  const inputBase =
    "w-full rounded-md border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] pl-11 pr-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)] transition";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--text) 55%, transparent)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-md overflow-hidden rounded-xl border shadow-2xl"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div
          className="relative px-6 py-5 text-white"
          style={{ background: "linear-gradient(120deg, var(--accent), #6366f1)" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-md p-2 hover:bg-white/15 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-white/15 p-2.5 backdrop-blur">
              <Fingerprint size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Reset password</h2>
              <p className="text-xs text-white/80">OTP is sent to your registered email</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6" style={{ color: "var(--text)" }}>
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <p className="text-sm text-[var(--text-muted)]">Enter the email you use for {societyConfig.name}.</p>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputBase}
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="user-btn-primary w-full justify-center rounded-md py-3.5"
              >
                {loading ? <RefreshCw className="animate-spin" size={18} /> : <>Send OTP <ArrowRight size={18} /></>}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <p className="text-center text-sm text-[var(--text-muted)]">
                Code sent to <span className="font-semibold text-[var(--text)]">{email}</span>
              </p>
              <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    className="h-12 w-10 rounded-md border border-[var(--border)] bg-[var(--bg)] text-center text-lg font-bold text-[var(--accent)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0 || loading}
                className="w-full text-xs font-bold uppercase tracking-wider text-[var(--accent)] disabled:opacity-40"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
              </button>
              <button type="submit" className="user-btn-primary w-full justify-center rounded-md py-3.5">
                Continue
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className={`${inputBase} pr-11`}
                  placeholder="New password (min 6 chars)"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  className={`${inputBase} pr-11`}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="user-btn-primary w-full justify-center rounded-md py-3.5"
              >
                {loading ? <RefreshCw className="animate-spin" size={18} /> : "Update password"}
              </button>
            </form>
          )}

          {step === 4 && (
            <div className="space-y-5 py-2 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                <CheckCircle2 size={36} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-[var(--text)]">You&apos;re all set</h3>
              <p className="text-sm text-[var(--text-muted)]">Password updated. Sign in with your new password.</p>
              <button type="button" onClick={onClose} className="user-btn-primary w-full justify-center rounded-md py-3.5">
                Back to sign in
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* ── Login / register ── */

const LoginInner = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inactiveToastShown = useRef(false);

  useEffect(() => {
    if (searchParams.get("inactive") === "1" && !inactiveToastShown.current) {
      inactiveToastShown.current = true;
      toast.error("Account is inactive. Contact admin.");
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    blockUnit: "",
    role: "Resident",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const fieldClass =
    "w-full rounded-md border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] pl-11 pr-3 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)] transition";

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
        const display = user.fullName || user.name || "Resident";
        toast.success(`Welcome back, ${display}!`);
        const userRole = user.role.toLowerCase();
        navigate(userRole === "admin" ? "/admin" : "/");
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }
        await axios.post(`${API_URL}/register`, formData);
        toast.success("Registration complete. Please sign in.");
        setIsLogin(true);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[var(--bg)] font-sans text-[var(--text)] transition-colors duration-500">
      <div className="pointer-events-none fixed inset-0 -z-0 opacity-40">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${SOCIETY_HERO})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--bg) 75%, transparent) 0%, color-mix(in srgb, var(--accent) 12%, var(--bg)) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-10 lg:flex-row lg:items-stretch lg:gap-10 lg:px-8">
        {/* Hero panel */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 flex min-h-[220px] w-full overflow-hidden rounded-xl border shadow-lg sm:min-h-[280px] lg:mb-0 lg:min-h-[560px] lg:max-w-md lg:flex-col lg:justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <img
            src={SOCIETY_HERO}
            alt="Society community"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
          <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-white/15 p-2.5 backdrop-blur">
                <Building2 size={26} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.35em] text-white/70">{societyConfig.name}</p>
                <p className="text-lg font-black tracking-tight">Community portal</p>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-black leading-tight tracking-tight lg:text-4xl">
                Secure living,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-indigo-200">
                  simplified.
                </span>
              </h1>
              <p className="max-w-sm text-sm leading-relaxed text-white/80">
                Maintenance, visitors, notices, and payments—aligned with how your society runs every day.
              </p>
              <div className="flex items-center gap-3 rounded-md border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
                <ShieldCheck size={22} className="shrink-0 text-emerald-300" />
                <p className="text-xs font-semibold text-white/90">Encrypted access · Role-based permissions</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="w-full max-w-md rounded-xl border p-6 shadow-xl backdrop-blur-xl sm:p-8"
          style={{
            background: "color-mix(in srgb, var(--card) 92%, transparent)",
            borderColor: "var(--border)",
          }}
        >
          <div className="mb-8 text-center lg:text-left">
            <span className="mb-3 inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--accent)]">
              <Sparkles size={12} /> {isLogin ? "Sign in" : "Create account"}
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--text)]">
              {isLogin ? "Welcome back" : "Join your society"}
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {isLogin ? "Use your registered email and password." : "Register as an administrator (if enabled)."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        Full name
                      </label>
                      <div className="relative">
                        <UserCircle className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Your name"
                          onChange={handleChange}
                          required={!isLogin}
                          className={fieldClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+91..."
                          onChange={handleChange}
                          required={!isLogin}
                          className={fieldClass}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  onChange={handleChange}
                  required
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                  className={`${fieldClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    onChange={handleChange}
                    required={!isLogin}
                    className={fieldClass}
                  />
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              type="submit"
              className="user-btn-primary mt-4 w-full justify-center rounded-md py-3.5 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                <>
                  {isLogin ? "Sign in" : "Register"}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* <div className="mt-8 border-t border-[var(--border)] pt-6 text-center text-sm text-[var(--text-muted)]">
            {isLogin ? "Need an account?" : "Already registered?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData((prev) => ({ ...prev, role: isLogin ? "Admin" : "Resident" }));
              }}
              className="font-bold text-[var(--accent)] hover:underline"
            >
              {isLogin ? "Switch to register" : "Back to sign in"}
            </button>
          </div> */}
        </motion.div>
      </div>

      <AnimatePresence>{showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}</AnimatePresence>
    </div>
  );
};

const Login = () => (
  <ThemeProvider>
    <LoginInner />
  </ThemeProvider>
);

export default Login;
