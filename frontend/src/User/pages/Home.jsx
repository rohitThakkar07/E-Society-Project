import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  MapPin,
  Sparkles,
  CreditCard,
  UserCheck,
  Zap,
  ShieldCheck,
  Home as HomeIcon,
  Wifi,
  TreePine,
  Car,
  Dumbbell,
  Waves,
  Camera,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Phone,
} from "lucide-react";
import { fetchNotices } from "../../store/slices/noticeSlice";
import { fetchEvents } from "../../store/slices/eventSlice";
import { fetchResidentFlat } from "../../store/slices/flatSlice";
import societyConfig from "../../assets/societyConfig";

/* ─── Unsplash image URLs (no auth needed) ─── */
const SOCIETY_IMAGES = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
];

const FLAT_IMAGES = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
];

const AMENITY_IMAGES = {
  gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80",
  pool: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=500&q=80",
  garden: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&q=80",
  parking: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=500&q=80",
};

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [heroImg, setHeroImg] = useState(0);

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

  /* auto-rotate hero image */
  useEffect(() => {
    const t = setInterval(() => setHeroImg((p) => (p + 1) % SOCIETY_IMAGES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const upcomingEvents = events?.filter((e) => new Date(e.date) >= new Date()) || [];

  const greeting = (() => {
    const h = time.getHours();
    if (h < 12) return { text: "Good Morning", emoji: "☀️", col: "from-orange-400 to-amber-500" };
    if (h < 17) return { text: "Good Afternoon", emoji: "🌤️", col: "from-sky-400 to-cyan-500" };
    return { text: "Good Evening", emoji: "🌙", col: "from-indigo-400 to-violet-600" };
  })();

  const stats = [
    { label: "Notices", value: notices?.length || 0, icon: Bell, color: "#ef4444", bg: "rgba(239,68,68,0.1)", loading: noticeLoading },
    { label: "Events", value: events?.length || 0, icon: Calendar, color: "#3b82f6", bg: "rgba(59,130,246,0.1)", loading: eventLoading },
    { label: "Wing", value: flat?.block || flat?.wing || user?.wing || "A", icon: Building2, color: "#10b981", bg: "rgba(16,185,129,0.1)", loading: flatLoading },
    { label: "Flat", value: flat?.flatNumber || user?.flatNumber || "101", icon: MapPin, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", loading: flatLoading },
  ];

  const quickLinks = [
    { label: "Maintenance", icon: DollarSign, to: "/maintenance", color: "#10b981", bg: "rgba(16,185,129,0.15)", roles: ["resident", "admin"] },
    { label: "Complaints", icon: Wrench, to: "/raise-complaint", color: "#f97316", bg: "rgba(249,115,22,0.15)", roles: ["resident", "admin"] },
    { label: "Facilities", icon: Zap, to: "/facilities", color: "#3b82f6", bg: "rgba(59,130,246,0.15)", roles: ["resident"] },
    { label: "Visitors", icon: ShieldCheck, to: "/visitors", color: "#8b5cf6", bg: "rgba(139,92,246,0.15)", roles: ["resident", "admin"] },
    { label: "Notices", icon: Bell, to: "/notices", color: "#ef4444", bg: "rgba(239,68,68,0.15)", roles: ["resident", "admin"] },
    { label: "Events", icon: Calendar, to: "/events", color: "#f59e0b", bg: "rgba(245,158,11,0.15)", roles: ["resident", "admin"] },
  ];

  const visibleLinks = isLoggedIn ? quickLinks.filter((l) => l.roles.includes(role)) : quickLinks.slice(0, 3);

  /* ─── data for public sections ─── */
  const societyStats = [
    { value: "148", label: "Resident Families", icon: Users, color: "#6366f1" },
    { value: "4", label: "Residential Wings", icon: Building2, color: "#10b981" },
    { value: "24/7", label: "Security Coverage", icon: Shield, color: "#3b82f6" },
    { value: "12+", label: "Premium Amenities", icon: Sparkles, color: "#f59e0b" },
  ];

  const amenities = [
    { name: "Gymnasium", icon: Dumbbell, img: AMENITY_IMAGES.gym, desc: "Fully equipped modern gym" },
    { name: "Swimming Pool", icon: Waves, img: AMENITY_IMAGES.pool, desc: "Olympic-size heated pool" },
    { name: "Landscaped Garden", icon: TreePine, img: AMENITY_IMAGES.garden, desc: "5-acre green retreat" },
    { name: "Covered Parking", icon: Car, img: AMENITY_IMAGES.parking, desc: "2 slots per flat" },
  ];

  const coreFeatures = [
    {
      icon: Shield,
      title: "Smart Security",
      desc: "Digital visitor entry with QR/OTP approvals, real-time gate notifications, and complete movement logs.",
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.08)",
    },
    {
      icon: DollarSign,
      title: "Online Payments",
      desc: "Pay maintenance dues in seconds. Get instant invoices and track outstanding balances from your phone.",
      color: "#10b981",
      bg: "rgba(16,185,129,0.08)",
    },
    {
      icon: Wrench,
      title: "Complaint Tracking",
      desc: "Raise plumbing, electrical or maintenance issues and watch them resolve with live status updates.",
      color: "#f97316",
      bg: "rgba(249,115,22,0.08)",
    },
    {
      icon: Calendar,
      title: "Facility Booking",
      desc: "Reserve the clubhouse, gym, or sports area with a live availability calendar and instant confirmation.",
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.08)",
    },
    {
      icon: Bell,
      title: "Community Notices",
      desc: "Stay updated with society announcements, meeting minutes, event reminders, and emergency alerts.",
      color: "#ef4444",
      bg: "rgba(239,68,68,0.08)",
    },
    {
      icon: BarChart3,
      title: "Financial Reports",
      desc: "Admins get clear expense reports, income summaries, and fund utilisation breakdowns at a glance.",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.08)",
    },
  ];

  const flatTypes = [
    { type: "2 BHK",  img: FLAT_IMAGES[0], flats: 64, tag: "Compact" },
    { type: "3 BHK",  img: FLAT_IMAGES[1], flats: 112, tag: "Popular" },
    { type: "4 BHK",  img: FLAT_IMAGES[2], flats: 72, tag: "Spacious" },
  ];

  const contactInfo = [
    { label: "Society Office", value: `+91 ${societyConfig.contact.phone.replace(/(\d{5})(\d{5})/, "$1 $2")}`, icon: Phone },
    { label: "Security Gate", value: `+91 ${societyConfig.contact.phone.replace(/(\d{5})(\d{5})/, "$1 $2")}`, icon: Shield },
    { label: "Emergency", value: `+91 ${societyConfig.contact.phone.replace(/(\d{5})(\d{5})/, "$1 $2")}`, icon: AlertCircle },
  ];

  return (
    <div className="user-page user-page-mesh font-sans overflow-x-hidden pt-28">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .aura-text { animation: auraPulse 4s infinite ease-in-out; }
        @keyframes auraPulse {
          0%,100% { text-shadow: 0 0 10px rgba(99,102,241,0.3); }
          50% { text-shadow: 0 0 25px rgba(99,102,241,0.7), 0 0 40px rgba(139,92,246,0.5); }
        }
        .user-page { font-family: 'DM Sans', sans-serif !important; }
        .hero-img { transition: opacity 0.8s ease; }
        .img-overlay { background: linear-gradient(135deg, rgba(10,10,30,0.6) 0%, rgba(10,10,30,0.2) 100%); }
        .amenity-card:hover .amenity-img { transform: scale(1.05); }
        .amenity-img { transition: transform 0.5s ease; }
        .flat-card:hover .flat-img { transform: scale(1.04); }
        .flat-img { transition: transform 0.5s ease; }
      `}</style>

      <Toaster position="bottom-right" />

      {/* ═══════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════ */}
      <section className="relative w-full">
        {/* Full-width Background Image for Hero */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg)]/95 via-[var(--bg)]/75 to-[var(--bg)]/95 z-10 backdrop-blur-[4px]" />
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070" alt="Beautiful Society" className="w-full h-full object-cover mix-blend-luminosity opacity-40 dark:opacity-20 transform scale-105" />
        </div>

        <div className="relative z-10 px-4 sm:px-6 py-10 lg:py-24 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 items-center gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--card)] mb-8 shadow-sm backdrop-blur-xl">
              <Sparkles size={16} className="text-amber-500 animate-pulse" />
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r ${greeting.col}`}>
                {greeting.text}{isLoggedIn ? `, ${user?.name?.split(" ")[0]}` : ""} {greeting.emoji}
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black text-[var(--text)] leading-[0.9] mb-8 tracking-tighter">
              Modern <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-500 aura-text">
                community.
              </span>
            </h1>

            <p className="text-lg text-[var(--text-muted)] max-w-md leading-relaxed mb-10 font-medium opacity-80">
              The smartest way to run your society — payments, security, complaints and community updates in one beautiful portal.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link to={isLoggedIn ? "/maintenance" : "/login"} className="px-8 py-3.5 rounded-2xl bg-indigo-600 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                {isLoggedIn ? "Payments" : "Get started"} <ArrowRight size={18} />
              </Link>
              <Link to="/notices" className="px-8 py-3.5 flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--text)] font-black uppercase text-xs tracking-widest hover:bg-[var(--bg)] transition-all">
                Notice board
              </Link>
            </div>
          </motion.div>

          {/* Hero right — society photo carousel */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative">
            <div className="relative rounded-[3rem] overflow-hidden h-[420px] border border-[var(--border)] shadow-2xl">
              {SOCIETY_IMAGES.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Society"
                  className={`hero-img absolute inset-0 w-full h-full object-cover ${i === heroImg ? "opacity-100" : "opacity-0"}`}
                />
              ))}
              <div className="img-overlay absolute inset-0" />

              {/* overlay content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live & Active</span>
                </div>
                <h3 className="text-2xl font-black mb-1">{societyConfig.name}</h3>
                <p className="text-sm text-white/70 flex items-center gap-2"><MapPin size={12} />{societyConfig.address}, {societyConfig.city}</p>
              </div>

              {/* dot indicators */}
              <div className="absolute top-6 right-6 flex gap-2">
                {SOCIETY_IMAGES.map((_, i) => (
                  <button key={i} onClick={() => setHeroImg(i)} className={`w-2 h-2 rounded-full transition-all ${i === heroImg ? "bg-white w-6" : "bg-white/40"}`} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SOCIETY STATS (always visible)
      ═══════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 mb-20 max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {societyStats.map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -8 }} 
            className="p-8 rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] flex flex-col items-start gap-6 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: s.color + "20", color: s.color }}>
              <s.icon size={28} />
            </div>
            <div>
              <h4 className="text-4xl font-black tracking-tighter text-[var(--text)]">{s.value}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-1 opacity-60">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ═══════════════════════════════════════════════
          LOGGED-IN: PERSONAL STATS
      ═══════════════════════════════════════════════ */}
      {isLoggedIn && (
        <section className="px-4 sm:px-8 mb-12 max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-black tracking-tight text-[var(--text)] uppercase">Your Dashboard</h2>
            <div className="h-1.5 w-16 bg-indigo-600 rounded-full mt-3" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={i} whileHover={{ y: -8 }} className="p-8 rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] flex flex-col items-start gap-6 shadow-sm hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: s.color }}>
                  <s.icon size={28} />
                </div>
                <div>
                  <h4 className="text-4xl font-black tracking-tighter text-[var(--text)]">{s.value}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-1 opacity-60">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          HUB SERVICES
      ═══════════════════════════════════════════════ */}
      {/* <section className="py-24 border-y border-[var(--border)] bg-indigo-500/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="mb-14">
            <h2 className="text-3xl font-black tracking-tight text-[var(--text)] uppercase">Hub Services</h2>
            <div className="h-1.5 w-20 bg-indigo-600 rounded-full mt-3" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {visibleLinks.map((link, idx) => (
              <motion.div key={idx} whileHover={{ y: -10, scale: 1.05 }}>
                <Link to={link.to} className="flex flex-col items-center p-8 rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] transition-all duration-500 shadow-sm overflow-hidden group relative">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: link.color }} />
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-12" style={{ backgroundColor: link.bg, color: link.color }}>
                    <link.icon size={32} />
                  </div>
                  <span className="text-[11px] font-black text-[var(--text-muted)] group-hover:text-[var(--text)] uppercase tracking-widest text-center transition-colors">
                    {link.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ═══════════════════════════════════════════════
          LOGGED-IN: NOTICES & EVENTS
      ═══════════════════════════════════════════════ */}
      {isLoggedIn && (
        <section className="px-4 sm:px-8 py-24 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Notices */}
            <div className="bg-[var(--card)] rounded-[3rem] border border-[var(--border)] overflow-hidden hover:shadow-2xl transition-all">
              <div className="p-8 border-b border-[var(--border)] flex justify-between items-center bg-rose-500/[0.03]">
                <div className="flex items-center gap-4">
                  <Bell size={24} className="text-rose-500" />
                  <h3 className="text-2xl font-black tracking-tight">Society Updates</h3>
                </div>
                <Link to="/notices" className="text-[10px] font-black uppercase text-rose-500 hover:underline tracking-widest">View All</Link>
              </div>
              <div className="p-6 space-y-2">
                {notices.slice(0, 3).map((n, i) => (
                  <Link key={i} to="/notices" className="flex items-center justify-between p-5 rounded-2xl hover:bg-[var(--bg)] transition-all group">
                    <div className="min-w-0">
                      <p className="font-bold text-[var(--text)] truncate">{n.title}</p>
                      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase mt-1 opacity-50">{new Date(n.createdAt).toDateString()}</p>
                    </div>
                    <ChevronRight size={18} className="text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Events */}
            <div className="bg-indigo-700 text-white rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[100px] rounded-full" />
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-4">
                    <Calendar size={24} />
                    <h3 className="text-2xl font-black tracking-tight">Upcoming Events</h3>
                  </div>
                  <Link to="/events" className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white hover:text-indigo-700 transition-all">
                    <ArrowRight />
                  </Link>
                </div>
                <div className="space-y-6">
                  {upcomingEvents.slice(0, 2).map((e, i) => (
                    <div key={i} className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/10 border border-white/10 backdrop-blur-sm">
                      <div className="w-16 h-16 rounded-2xl bg-white text-indigo-700 flex flex-col items-center justify-center font-black shadow-lg shrink-0">
                        <span className="text-2xl leading-none">{new Date(e.date).getDate()}</span>
                        <span className="text-[10px] uppercase">{new Date(e.date).toLocaleString("default", { month: "short" })}</span>
                      </div>
                      <div>
                        <p className="font-black text-xl leading-tight">{e.title}</p>
                        <p className="text-[10px] font-bold uppercase mt-2 opacity-70 flex items-center gap-2"><MapPin size={12} />{e.location || "Society Area"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          CORE FEATURES (always visible)
      ═══════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-[var(--text)] uppercase">Everything you need</h2>
            <div className="h-1.5 w-20 bg-indigo-600 rounded-full mt-3" />
            <p className="text-[var(--text-muted)] mt-4 max-w-lg">One platform built for modern gated communities — residents, admins, and security all in sync.</p>
          </div>
          {!isLoggedIn && (
            <Link to="/login" className="shrink-0 px-6 py-3.5 rounded-2xl bg-indigo-600 text-white font-black uppercase text-xs tracking-widest flex items-center gap-3 hover:-translate-y-1 transition-all shadow-lg shadow-indigo-600/20">
              Join Now <ArrowRight size={16} />
            </Link>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              whileHover={{ y: -6 }} 
              className="p-8 rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: f.bg, color: f.color }}>
                <f.icon size={28} />
              </div>
              <h3 className="text-xl font-black text-[var(--text)] mb-3">{f.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed opacity-80">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FLAT TYPES — Photo Gallery
      ═══════════════════════════════════════════════ */}
      <section className="py-24 border-t border-[var(--border)] bg-[var(--card)]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="mb-14">
            <h2 className="text-3xl font-black tracking-tight text-[var(--text)] uppercase">Our Flats</h2>
            <div className="h-1.5 w-20 bg-indigo-600 rounded-full mt-3" />
            <p className="text-[var(--text-muted)] mt-4 max-w-md">Thoughtfully designed living spaces with every modern comfort.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {flatTypes.map((f, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }} 
                className="flat-card rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] overflow-hidden shadow-sm hover:shadow-2xl transition-all"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={f.img} alt={f.type} className="flat-img w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">
                    {f.tag}
                  </span>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black text-[var(--text)] mb-1">{f.type}</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-6">{f.area} · {f.flats} flats</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle2 size={16} />
                      <span className="text-xs font-bold">Available</span>
                    </div>
                    <div className="w-px h-4 bg-[var(--border)]" />
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <HomeIcon size={14} />
                      <span className="text-xs font-bold">Fully Furnished</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          AMENITIES — Photo Grid
      ═══════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="mb-14">
          <h2 className="text-3xl font-black tracking-tight text-[var(--text)] uppercase">Premium Amenities</h2>
          <div className="h-1.5 w-20 bg-indigo-600 rounded-full mt-3" />
          <p className="text-[var(--text-muted)] mt-4 max-w-md">World-class facilities built for an exceptional lifestyle.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((a, i) => (
            <motion.div key={i} whileHover={{ y: -8 }} className="amenity-card rounded-[2.5rem] overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-2xl transition-all relative group">
              <div className="h-48 overflow-hidden">
                <img src={a.img} alt={a.name} className="amenity-img w-full h-full object-cover" />
              </div>
              <div className="p-6 bg-[var(--card)]">
                <div className="flex items-center gap-3 mb-2">
                  <a.icon size={18} className="text-indigo-500" />
                  <h4 className="font-black text-[var(--text)]">{a.name}</h4>
                </div>
                <p className="text-xs text-[var(--text-muted)] opacity-70">{a.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════ */}
      <section className="py-24 border-t border-[var(--border)] bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-black tracking-tight uppercase">How it works</h2>
            <div className="h-1.5 w-20 bg-white/40 rounded-full mt-3 mx-auto" />
            <p className="text-white/70 mt-4">Three simple steps to a fully managed community.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { step: "01", title: "Admin Setup", desc: "Admin configures society wings, resident profiles, facility availability, and financial rules." },
              { step: "02", title: "Residents Login", desc: "Residents access notices, book facilities, manage visitors, pay maintenance, and raise complaints." },
              { step: "03", title: "Security & Reports", desc: "Security guards log all entries. Admins get real-time reports, expense tracking, and alerts." },
            ].map((s, i) => (
              <motion.div key={i} whileHover={{ y: -6 }} className="p-10 rounded-[2.5rem] bg-white/10 border border-white/10 backdrop-blur-sm">
                <div className="text-6xl font-black text-white/20 mb-6 leading-none">{s.step}</div>
                <h3 className="text-xl font-black mb-3">{s.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CONTACT STRIP
      ═══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-[3rem] bg-[var(--card)] border border-[var(--border)] p-10 lg:p-12 flex flex-col xl:flex-row items-center justify-between gap-12 shadow-sm overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 w-full xl:w-1/3 text-center xl:text-left">
            <h2 className="text-3xl font-black text-[var(--text)] mb-3 tracking-tight">Need assistance?</h2>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-md mx-auto xl:mx-0">
              Our society office and security team are available round the clock for emergencies and general queries.
            </p>
          </div>
          
          <div className="relative z-10 w-full xl:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            {contactInfo.map((c, i) => (
              <div key={i} className="flex flex-col items-center sm:items-start sm:flex-row gap-4 p-6 rounded-[2rem] bg-[var(--bg)] border border-[var(--border)] hover:border-indigo-500/30 transition-all shadow-sm hover:shadow-md group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <c.icon size={20} />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-70 mb-1">{c.label}</p>
                  <p className="font-black text-[13px] text-[var(--text)] tracking-wide">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA (non-logged-in only)
      ═══════════════════════════════════════════════ */}
      {!isLoggedIn && (
        <section className="py-24 px-4 sm:px-8 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--card)] mb-8">
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Join the community</span>
          </div>
          <h2 className="text-5xl font-black text-[var(--text)] tracking-tighter mb-6 leading-[0.95]">
            Ready to simplify <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              society life?
            </span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-lg mx-auto mb-10 leading-relaxed">
            Log in to your resident portal and manage everything — from maintenance dues to visitor approvals — without a single phone call.
          </p>
          <div className="flex flex-wrap gap-5 justify-center">
            <Link to="/login" className="px-10 py-3.5 rounded-2xl bg-indigo-600 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
              Resident Login <ArrowRight size={18} />
            </Link>
            <Link to="/notices" className="px-10 py-3.5 flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--text)] font-black uppercase text-xs tracking-widest hover:bg-[var(--bg)] transition-all">
              View Notices
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;