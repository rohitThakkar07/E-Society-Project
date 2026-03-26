import React, { useState } from "react";
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
  ShieldCheck
} from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    blockUnit: "",
    role: "Resident", // Default role, handled implicitly on login
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = "http://localhost:4000/api/auth";

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
    // ✅ FIX: Modern Society Image with Blur Overlay
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative font-sans bg-slate-100">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          // A premium, modern residential society image
          backgroundImage: "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop')",
        }}
      />
      
      {/* ✅ FIX: Blur and Tint Overlay to make the image 'best' and 'blurred' */}
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
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Password</label>
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
                    onClick={() => {
                      setIsLogin(false);
                      setFormData(prev => ({ ...prev, role: "Admin" }));
                    }}
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
    </div>
  );
};

export default Login;