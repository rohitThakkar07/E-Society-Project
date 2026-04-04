import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  Bell, Calendar, Users, Shield, Wrench, DollarSign,
  ArrowRight, Building2, Clock, ChevronRight, Star,
  Zap, Lock, BarChart3, MapPin, Sparkles, LayoutDashboard
} from "lucide-react";
import { fetchNotices } from "../../store/slices/noticeSlice";
import { fetchEvents } from "../../store/slices/eventSlice";
import { fetchResidentFlat } from "../../store/slices/flatSlice";

const Home = () => {
  const dispatch = useDispatch();
  const [time, setTime] = useState(new Date());

  const { list: notices = [], loading: noticeLoading } = useSelector((s) => s.notice || {});
  const { events = [], loading: eventLoading } = useSelector((s) => s.event || {});
  const { singleFlat: flat, loading: flatLoading } = useSelector((s) => s.flat || {});
  
  const auth = useSelector((s) => s.auth);
  const user = auth?.user || JSON.parse(localStorage.getItem("userData") || "{}");
  const role = user?.role?.toLowerCase();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchNotices());
      dispatch(fetchEvents());
      if (role === "resident" && user?._id) {
        dispatch(fetchResidentFlat(user._id));
      }
      toast.success(`Welcome back, ${user?.firstName || 'Resident'}!`, {
        icon: '👋',
        style: { borderRadius: '15px', background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }
      });
    }
  }, [dispatch, isLoggedIn, role, user?._id]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const upcomingEvents = events?.filter(e => new Date(e.date) >= new Date()) || [];

  const greeting = (() => {
    const h = time.getHours();
    if (h < 12) return { text: "Good Morning", emoji: "☀️", col: "from-orange-400 to-amber-500" };
    if (h < 17) return { text: "Good Afternoon", emoji: "🌤️", col: "from-blue-400 to-cyan-500" };
    return { text: "Good Evening", emoji: "🌙", col: "from-indigo-500 to-purple-600" };
  })();

  const stats = [
    { label: "Notices", value: notices?.length || 0, icon: Bell, color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)", loading: noticeLoading },
    { label: "Events", value: events?.length || 0, icon: Calendar, color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)", loading: eventLoading },
    { label: "Wing / Block", value: flat?.block || flat?.wing || user?.wing || "—", icon: Building2, color: "#10b981", bg: "rgba(16, 185, 129, 0.1)", loading: flatLoading },
    { label: "Flat Number", value: flat?.flatNumber || user?.flatNumber || "—", icon: MapPin, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)", loading: flatLoading },
  ];

  const quickLinks = [
    { label: "Pay Maintenance", icon: DollarSign, to: "/maintenance", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)", roles: ["resident", "admin"] },
    { label: "Raise Complaint", icon: Wrench,     to: "/complaints",  color: "#f97316", bg: "rgba(249, 115, 22, 0.1)", roles: ["resident", "admin"] },
    { label: "Book Facility",   icon: Building2,  to: "/facilities",  color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)", roles: ["resident"] },
    { label: "Visitor Log",icon: Users,to: "/visitors",    color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.1)", roles: ["resident", "admin"] },
    { label: "Notice Board",icon: Bell,to: "/notices",color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)", roles: ["resident", "admin"] },
    { label: "Events",icon: Calendar,to: "/events",color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)", roles: ["resident", "admin"] },
  ];

  const features = [
    { icon: DollarSign, title: "Smart Payments",  desc: "Pay maintenance fees online in seconds. Auto-reminders ensure you never miss a due date.", color: "#10b981" },
    { icon: Shield,     title: "Gated Security",  desc: "Real-time visitor logs, guard management and digital entry passes for complete security.", color: "#3b82f6" },
    { icon: Users,      title: "Community Hub",   desc: "Connect with neighbors through notices, polls, events and community discussions.",         color: "#8b5cf6" },
  ];

  const testimonials = [
    { name: "Priya Sharma", flat: "A-204", text: "Managing maintenance payments has never been easier. Love the instant receipt!", stars: 5 },
    { name: "Rajesh Mehta", flat: "B-101", text: "The visitor management system is a game changer for our society security.",       stars: 5 },
    { name: "Anita Patel",  flat: "C-302", text: "Events and notices are now instantly visible. Feels like a real community!",       stars: 5 },
  ];

  const visibleLinks = isLoggedIn ? quickLinks.filter((l) => l.roles.includes(role)) : quickLinks.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#01040f] text-slate-200 font-sans overflow-x-hidden">
      <Toaster position="bottom-right" />
      
      {/* GLOW DECORATION */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-blue-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[5%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[130px] rounded-full" />
      </div>

      {/* HERO SECTION */}
      <section className="relative px-6 pt-28 pb-20 lg:pt-40 lg:pb-32 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 items-center gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900 border border-slate-800 mb-8 backdrop-blur-md">
              <Sparkles size={16} className="text-blue-400 animate-pulse" />
              <span className={`text-xs font-black uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r ${greeting.col}`}>
                {greeting.text}{isLoggedIn ? `, ${user?.firstName || 'Resident'}` : ""} {greeting.emoji}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] mb-10 tracking-tighter">
              Modern <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
                Community.
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-lg leading-relaxed mb-12 font-medium opacity-80">
              The smartest way to manage your society. Experience seamless payments and robust security in one place.
            </p>

            {/* BUTTONS FIXED HERE (Items-Center) */}
            <div className="flex flex-row items-center flex-wrap gap-6">
              {/* PRIMARY BUTTON */}
              <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(37, 99, 235, 0.6)" }} whileTap={{ scale: 0.95 }}>
                <Link to={isLoggedIn ? "/maintenance" : "/login"} className="h-[60px] px-10 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                   {isLoggedIn ? "Dashboard" : "Get Started"} <ArrowRight size={20} />
                </Link>
              </motion.div>

              {/* SECONDARY BUTTON */}
              <motion.div whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.4)" }} whileTap={{ scale: 0.95 }}>
                <Link to="/notices" className="h-[60px] px-10 bg-slate-900 border border-slate-800 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center">
                  View Board
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* SECURITY CARD UI */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative hidden lg:block">
            <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[60px] shadow-2xl relative z-10 overflow-hidden group">
              <div className="flex items-center justify-between mb-12">
                <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-3xl flex items-center justify-center border border-blue-500/20 shadow-inner"><Shield size={32} /></div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 flex items-center justify-end gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> System Verified
                  </p>
                  <p className="text-slate-500 text-[10px] font-bold">AES-256 SECURED</p>
                </div>
              </div>
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 bg-white/5 border border-white/5 rounded-3xl flex items-center px-5 gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
                    <div className="h-2 bg-slate-800 w-1/2 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* NOTIFICATION CARD (FRONT & FLOATING) */}
            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 bg-slate-900 border border-slate-700 p-6 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-[999] backdrop-blur-xl flex items-center gap-5 cursor-pointer hover:border-blue-500 transition-colors"
            >
              <div className="bg-orange-500/20 p-3 rounded-2xl text-orange-400 shadow-lg">
                <Bell size={24} className="animate-bounce" />
              </div>
              <div>
                <p className="text-sm font-black text-white">Security Alert</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">New Notice Published</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      {isLoggedIn && (
        <section className="px-6 mb-24 max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {stats.map((s, idx) => (
            <motion.div 
              whileHover={{ y: -10, backgroundColor: "rgba(15, 23, 42, 0.6)", borderColor: "rgba(255,255,255,0.1)" }} 
              key={idx} 
              className="bg-slate-900/30 border border-slate-800/60 p-8 rounded-[40px] flex flex-col items-start gap-6 backdrop-blur-md transition-all"
            >
              <div style={{ color: s.color, backgroundColor: s.bg }} className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">
                <s.icon size={28} />
              </div>
              <div>
                <h4 className="text-3xl font-black text-white tracking-tighter">
                  {s.loading ? <span className="animate-pulse">...</span> : s.value}
                </h4>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </section>
      )}

      {/* QUICK ACCESS GRID */}
      <section className="px-6 py-28 bg-slate-900/10 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-2">Service Terminal</h2>
            <div className="w-16 h-1 bg-blue-600 rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {visibleLinks.map((link, idx) => (
              <motion.div key={idx} whileHover={{ y: -10, scale: 1.05 }} whileTap={{ scale: 0.9 }}>
                <Link to={link.to} className="group flex flex-col items-center p-10 bg-slate-950 border border-slate-800 rounded-[45px] hover:border-blue-500/40 transition-all shadow-xl">
                  <div style={{ color: link.color, backgroundColor: link.bg }} className="p-6 rounded-[24px] mb-6 group-hover:rotate-6 transition-all duration-300">
                    <link.icon size={32} />
                  </div>
                  <span className="text-xs font-black text-slate-300 group-hover:text-white uppercase transition-colors">{link.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVITY FEED */}
      {isLoggedIn && (
        <section className="px-6 py-32 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* NOTICES PANEL */}
            <motion.div whileHover={{ y: -5 }} className="bg-slate-900/40 border border-slate-800 rounded-[50px] overflow-hidden backdrop-blur-md">
              <div className="p-10 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
                <div className="flex items-center gap-4">
                  <div className="bg-rose-500/10 p-3 rounded-2xl text-rose-500"><Bell size={24} /></div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Broadcast Board</h3>
                </div>
                <Link to="/notices" className="text-xs font-black text-blue-500 tracking-widest uppercase hover:underline">Full Feed</Link>
              </div>
              <div className="p-4 space-y-2">
                {notices.length > 0 ? notices.slice(0, 3).map((n) => (
                  <div key={n._id} className="p-6 hover:bg-white/5 rounded-3xl transition-all group flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-bold text-slate-200 group-hover:text-white mb-1 transition-colors">{n.title}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase"><Clock size={12} className="inline mr-1" /> {new Date(n.createdAt).toDateString()}</p>
                    </div>
                    <ChevronRight size={20} className="text-slate-700 group-hover:translate-x-1 transition-all" />
                  </div>
                )) : <div className="p-10 text-center text-slate-600 uppercase font-black text-xs tracking-widest">No active notices</div>}
              </div>
            </motion.div>

            {/* EVENTS PANEL */}
            <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[50px] p-10 text-white relative shadow-2xl overflow-hidden group shadow-blue-900/40">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[90px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
              <div className="flex items-center justify-between mb-12 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/10"><Calendar size={24} /></div>
                   <h3 className="text-2xl font-bold tracking-tight">Timeline</h3>
                </div>
                <Link to="/events" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-blue-600 transition-all shadow-lg"><ArrowRight size={22}/></Link>
              </div>
              <div className="space-y-6 relative z-10">
                {upcomingEvents.length > 0 ? upcomingEvents.slice(0, 2).map((e) => (
                  <motion.div key={e._id} whileHover={{ scale: 1.03 }} className="bg-white/10 border border-white/20 backdrop-blur-xl p-6 rounded-[35px] flex items-center gap-6 group/event">
                    <div className="bg-white text-blue-600 w-16 h-16 rounded-3xl flex flex-col items-center justify-center font-black shadow-xl group-hover/event:bg-blue-500 group-hover/event:text-white transition-all">
                      <span className="text-2xl leading-none">{new Date(e.date).getDate()}</span>
                      <span className="text-[10px] uppercase font-bold">{new Date(e.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div>
                      <p className="font-bold text-xl mb-1">{e.title}</p>
                      <p className="text-xs text-blue-100 opacity-70 font-bold uppercase flex items-center gap-2"><MapPin size={14} /> {e.location || "Clubhouse"}</p>
                    </div>
                  </motion.div>
                )) : <p className="text-blue-100 italic text-center py-10 opacity-50 font-bold tracking-widest">Quiet for now...</p>}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* FEATURES SECTION */}
      <section className="py-24 px-6 bg-slate-900/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <motion.div key={i} whileHover={{ y: -10 }} className="p-10 bg-slate-900/40 border border-slate-800 rounded-[45px] hover:border-blue-500/30 transition-all">
              <div className="text-blue-500 mb-8"><f.icon size={40} strokeWidth={1.5} /></div>
              <h3 className="text-2xl font-bold text-white mb-4 leading-none">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-32 px-6 max-w-7xl mx-auto text-center">
        <div className="mb-24">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-4 leading-none">Resident Feedback</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((t, idx) => (
            <motion.div key={idx} whileHover={{ y: -10 }} className="p-10 bg-slate-900/20 border border-slate-800 rounded-[50px] relative transition-all group backdrop-blur-sm">
              <div className="flex justify-center gap-1 mb-8 text-amber-500">
                {[...Array(t.stars)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-slate-300 italic mb-10 leading-relaxed font-medium">"{t.text}"</p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg">{t.name[0]}</div>
                <div className="text-left">
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase">Resident {t.flat}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 border-t border-slate-900 bg-[#000208] text-center">
         <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-[18px] flex items-center justify-center font-black text-white italic text-xl shadow-[0_0_30px_rgba(37,99,235,0.3)]">E</div>
            <span className="text-2xl font-black tracking-tighter text-white">E-SOCIETY</span>
         </div>
         <p className="text-slate-700 text-xs font-black uppercase tracking-[0.5em] leading-none">Built for Excellence. © 2026</p>
      </footer>
    </div>
  );
};

export default Home;