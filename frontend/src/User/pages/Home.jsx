import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import {
  Bell,
  Calendar,
  Users,
  Shield,
  Wrench,
  DollarSign,
  ArrowRight,
  Building2,
  Clock,
  ChevronRight,
  Star,
  MapPin,
  Sparkles,
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
    }
  }, [dispatch, isLoggedIn, role, user?._id]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const upcomingEvents = events?.filter((e) => new Date(e.date) >= new Date()) || [];

  const greeting = (() => {
    const h = time.getHours();
    if (h < 12) return { text: "Good Morning", emoji: "☀️", col: "from-orange-400 to-amber-500" };
    if (h < 17) return { text: "Good Afternoon", emoji: "🌤️", col: "from-sky-400 to-cyan-500" };
    return { text: "Good Evening", emoji: "🌙", col: "from-indigo-400 to-violet-600" };
  })();

  const stats = [
    { label: "Notices", value: notices?.length || 0, icon: Bell, color: "#ef4444", bg: "rgba(239, 68, 68, 0.12)", loading: noticeLoading },
    { label: "Events", value: events?.length || 0, icon: Calendar, color: "#3b82f6", bg: "rgba(59, 130, 246, 0.12)", loading: eventLoading },
    { label: "Wing / Block", value: flat?.block || flat?.wing || user?.wing || "—", icon: Building2, color: "#10b981", bg: "rgba(16, 185, 129, 0.12)", loading: flatLoading },
    { label: "Flat Number", value: flat?.flatNumber || user?.flatNumber || "—", icon: MapPin, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)", loading: flatLoading },
  ];

  const quickLinks = [
    { label: "Pay Maintenance", icon: DollarSign, to: "/maintenance", color: "#10b981", bg: "rgba(16, 185, 129, 0.12)", roles: ["resident", "admin"] },
    { label: "Raise Complaint", icon: Wrench, to: "/raise-complaint", color: "#f97316", bg: "rgba(249, 115, 22, 0.12)", roles: ["resident", "admin"] },
    { label: "Book Facility", icon: Building2, to: "/facilities", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.12)", roles: ["resident"] },
    { label: "Visitor Log", icon: Users, to: "/visitors", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.12)", roles: ["resident", "admin"] },
    { label: "Notice Board", icon: Bell, to: "/notices", color: "#ef4444", bg: "rgba(239, 68, 68, 0.12)", roles: ["resident", "admin"] },
    { label: "Events", icon: Calendar, to: "/events", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)", roles: ["resident", "admin"] },
  ];

  const features = [
    { icon: DollarSign, title: "Smart Payments", desc: "Pay maintenance online in seconds with reminders and instant receipts.", color: "#10b981" },
    { icon: Shield, title: "Gated Security", desc: "Visitor logs, guard workflows, and digital entry for safer premises.", color: "#3b82f6" },
    { icon: Users, title: "Community Hub", desc: "Notices, polls, and events—stay connected with your neighbors.", color: "#8b5cf6" },
  ];

  const testimonials = [
    { name: "Priya Sharma", flat: "A-204", text: "Managing maintenance payments has never been easier. Love the instant receipt!", stars: 5 },
    { name: "Rajesh Mehta", flat: "B-101", text: "The visitor management system is a game changer for our society security.", stars: 5 },
    { name: "Anita Patel", flat: "C-302", text: "Events and notices are now instantly visible. Feels like a real community!", stars: 5 },
  ];

  const visibleLinks = isLoggedIn ? quickLinks.filter((l) => l.roles.includes(role)) : quickLinks.slice(0, 3);

  return (
    <div className="user-page user-page-mesh font-sans overflow-x-hidden">
      <Toaster position="bottom-right" toastOptions={{ className: "font-sans" }} />

      <section className="relative px-4 sm:px-6 pt-16 pb-14 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 sm:mb-8 backdrop-blur-md"
              style={{ background: "color-mix(in srgb, var(--card) 88%, transparent)", borderColor: "var(--border)" }}
            >
              <Sparkles size={16} className="text-[var(--accent)] animate-pulse" />
              <span className={`text-xs font-black uppercase tracking-[0.18em] bg-clip-text text-transparent bg-gradient-to-r ${greeting.col}`}>
                {greeting.text}
                {isLoggedIn ? `, ${user?.firstName || user?.name?.split?.(" ")?.[0] || "Resident"}` : ""} {greeting.emoji}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-[var(--text)] leading-[0.95] mb-6 sm:mb-8 tracking-tight">
              Modern{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] via-indigo-400 to-violet-500">
                community.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[var(--text-muted)] max-w-lg leading-relaxed mb-8 sm:mb-10 font-medium">
              The smartest way to run your society—payments, security, and updates in one beautiful portal.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Link to={isLoggedIn ? "/maintenance" : "/login"} className="user-btn-primary w-full sm:w-auto min-h-[52px] px-8">
                  {isLoggedIn ? "Go to payments" : "Get started"} <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Link to="/notices" className="user-btn-ghost w-full sm:w-auto min-h-[52px] px-8">
                  Notice board
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75 }}
            className="relative hidden lg:block"
          >
            <div
              className="user-glass p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
              style={{ boxShadow: "var(--shadow-lg)" }}
            >
              <div className="flex items-center justify-between mb-10">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center border shadow-inner text-[var(--accent)]"
                  style={{ background: "var(--accent-soft)", borderColor: "var(--border)" }}
                >
                  <Shield size={32} strokeWidth={1.75} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1 flex items-center justify-end gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live
                  </p>
                  <p className="text-[var(--text-muted)] text-[10px] font-bold">Encrypted session</p>
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-14 rounded-2xl flex items-center px-4 gap-4 border"
                    style={{ background: "var(--accent-bg)", borderColor: "var(--border)" }}
                  >asdfasf
                    <div className="w-8 h-8 rounded-full animate-pulse opacity-60" style={{ background: "var(--border)" }} />
                    <div className="h-2 rounded-full flex-1 max-w-[55%] opacity-40" style={{ background: "var(--border)" }} />
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-6 p-5 rounded-[1.75rem] z-[5] flex items-center gap-4 cursor-pointer border user-glass max-w-[calc(100%-1rem)]"
              style={{ boxShadow: "var(--shadow-lg)" }}
            >
              <div className="bg-orange-500/15 p-3 rounded-2xl text-orange-500">
                <Bell size={22} className="animate-bounce" />
              </div>
              <div>
                <p className="text-sm font-black text-[var(--text)]">New update</p>
                <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-tight">Check the notice board</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {isLoggedIn && (
        <section className="px-4 sm:px-6 mb-16 sm:mb-20 max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => (
            <motion.div
              whileHover={{ y: -6 }}
              key={idx}
              className="user-card p-6 sm:p-8 rounded-[1.75rem] flex flex-col items-start gap-4"
            >
              <div style={{ color: s.color, backgroundColor: s.bg }} className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center">
                <s.icon size={26} />
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl font-black text-[var(--text)] tracking-tight">
                  {s.loading ? <span className="animate-pulse">…</span> : s.value}
                </h4>
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </section>
      )}

      <section
        className="px-4 sm:px-6 py-16 sm:py-24 border-y transition-colors duration-500"
        style={{ background: "color-mix(in srgb, var(--accent-bg) 35%, transparent)", borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text)] tracking-tight uppercase mb-2">Services</h2>
            <div className="w-14 h-1 rounded-full bg-[var(--accent)]" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
            {visibleLinks.map((link, idx) => (
              <motion.div key={idx} whileHover={{ y: -6 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to={link.to}
                  className="group flex flex-col items-center p-6 sm:p-8 rounded-[1.75rem] border transition-all duration-300 min-h-[140px] justify-center"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  <div
                    style={{ color: link.color, backgroundColor: link.bg }}
                    className="p-4 sm:p-5 rounded-2xl mb-4 group-hover:rotate-6 transition-transform duration-300"
                  >
                    <link.icon size={28} />
                  </div>
                  <span className="text-[10px] sm:text-xs font-black text-[var(--text-muted)] group-hover:text-[var(--text)] uppercase text-center leading-tight transition-colors">
                    {link.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {isLoggedIn && (
        <section className="px-4 sm:px-6 py-16 sm:py-24 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            <motion.div whileHover={{ y: -4 }} className="user-card rounded-[2rem] overflow-hidden">
              <div
                className="p-6 sm:p-8 border-b flex justify-between items-center gap-4"
                style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--card) 70%, var(--accent-bg))" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-rose-500/10 p-3 rounded-2xl text-rose-500 shrink-0">
                    <Bell size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text)] tracking-tight truncate">Broadcast board</h3>
                </div>
                <Link to="/notices" className="text-xs font-black text-[var(--accent)] tracking-widest uppercase hover:underline shrink-0">
                  All
                </Link>
              </div>
              <div className="p-3 sm:p-4 space-y-1">
                {notices.length > 0 ? (
                  notices.slice(0, 3).map((n) => (
                    <div
                      key={n._id}
                      className="p-4 sm:p-5 rounded-2xl transition-all flex items-center justify-between gap-3 cursor-pointer hover:bg-[var(--accent-soft)]"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-[var(--text)] mb-1 truncate">{n.title}</p>
                        <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase flex items-center gap-1">
                          <Clock size={12} /> {new Date(n.createdAt).toDateString()}
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-[var(--text-muted)] shrink-0" />
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-[var(--text-muted)] uppercase font-black text-xs tracking-widest">No notices yet</div>
                )}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-[2rem] p-8 sm:p-10 text-white relative shadow-2xl overflow-hidden border border-white/10"
              style={{
                background: "linear-gradient(145deg, color-mix(in srgb, var(--accent) 85%, #312e81), #3730a3)",
              }}
            >
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="flex items-center justify-between mb-8 sm:mb-10 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/15">
                    <Calendar size={22} />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">Upcoming</h3>
                </div>
                <Link
                  to="/events"
                  className="w-11 h-11 bg-white/15 rounded-full flex items-center justify-center hover:bg-white hover:text-indigo-600 transition-all"
                >
                  <ArrowRight size={20} />
                </Link>
              </div>
              <div className="space-y-4 relative z-10">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.slice(0, 2).map((e) => (
                    <motion.div
                      key={e._id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/10 border border-white/15 backdrop-blur-md p-5 rounded-[1.75rem] flex items-center gap-4 sm:gap-5"
                    >
                      <div className="bg-white text-indigo-600 w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black shadow-lg shrink-0">
                        <span className="text-xl leading-none">{new Date(e.date).getDate()}</span>
                        <span className="text-[10px] uppercase font-bold">{new Date(e.date).toLocaleString("default", { month: "short" })}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-lg mb-0.5 truncate">{e.title}</p>
                        <p className="text-xs text-white/80 font-bold uppercase flex items-center gap-2">
                          <MapPin size={12} className="shrink-0" /> {e.location || "Clubhouse"}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-white/70 italic text-center py-8 font-bold tracking-widest text-sm">No upcoming events</p>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section
        className="py-16 sm:py-20 px-4 sm:px-6 border-y transition-colors duration-500"
        style={{ background: "color-mix(in srgb, var(--card) 40%, var(--bg))", borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 lg:gap-10">
          {features.map((f, i) => (
            <motion.div key={i} whileHover={{ y: -6 }} className="user-card p-8 sm:p-10 rounded-[2rem]">
              <div className="mb-6" style={{ color: f.color }}>
                <f.icon size={36} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-[var(--text)] mb-3 leading-tight">{f.title}</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--text)] tracking-tight mb-3">Resident feedback</h2>
          <div className="w-16 h-1 bg-[var(--accent)] mx-auto rounded-full" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 text-left">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className="user-card p-8 sm:p-10 rounded-[2rem] transition-shadow"
            >
              <div className="flex justify-center gap-1 mb-6 text-amber-500">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-[var(--text)] italic mb-8 leading-relaxed font-medium">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white shadow-lg text-sm"
                  style={{ background: "linear-gradient(135deg, var(--accent), #6366f1)" }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-[var(--text)] font-bold text-sm">{t.name}</p>
                  <p className="text-[var(--text-muted)] text-[10px] font-black tracking-widest uppercase">Flat {t.flat}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
