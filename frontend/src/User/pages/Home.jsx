import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Bell, Calendar, Users, Shield, Wrench, DollarSign,
  ArrowRight, Building2, Clock, ChevronRight, Star,
  Zap, Lock, BarChart3, Heart, MapPin, Phone
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
      if (role === "resident") {
        const userId = user?._id || null;
        console.log(userId)
        if (userId) {
          console.log("call fetchresident ")
          dispatch(fetchResidentFlat(userId));
        }
      }
    }
  }, [dispatch, isLoggedIn, role,user?._id]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const upcomingEvents = events?.filter(e => new Date(e.date) >= new Date()) || [];

  const getGreeting = () => {
    const h = time.getHours();
    if (h < 12) return { text: "Good Morning", emoji: "☀️" };
    if (h < 17) return { text: "Good Afternoon", emoji: "🌤️" };
    return { text: "Good Evening", emoji: "🌙" };
  };

  const greeting = getGreeting();
  const firstName = user?.firstName || user?.name?.split(" ")[0] || "Resident";

  const stats = [
    { label: "Notices", value: notices?.length || 0, icon: Bell, color: "#ef4444", bg: "#fef2f2" },
    { label: "Events", value: events?.length || 0, icon: Calendar, color: "#3b82f6", bg: "#eff6ff" },
    { 
      label: "Wing / Block", 
      value: flat?.block || user?.wing || "—", 
      icon: Building2, 
      color: "#10b981", 
      bg: "#f0fdf4" 
    },
    { 
      label: "Flat Number", 
      value: flat?.flatNumber || user?.flatNumber || "—", 
      icon: MapPin, 
      color: "#f59e0b", 
      bg: "#fffbeb" 
    },
  ];

  const quickLinks = [
    { label: "Pay Maintenance", icon: DollarSign, to: "/maintenance", color: "#10b981", bg: "#f0fdf4", border: "#d1fae5", roles: ["resident", "admin"] },
    { label: "Raise Complaint", icon: Wrench,     to: "/complaints",  color: "#f97316", bg: "#fff7ed", border: "#fed7aa", roles: ["resident", "admin"] },
    { label: "Book Facility",   icon: Building2,  to: "/facilities",  color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", roles: ["resident"] },
    { label: "Visitor Log",     icon: Users,      to: "/visitors",    color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe", roles: ["resident", "admin"] },
    { label: "Notice Board",    icon: Bell,       to: "/notices",     color: "#ef4444", bg: "#fef2f2", border: "#fecaca", roles: ["resident", "admin"] },
    { label: "Events",          icon: Calendar,   to: "/events",      color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", roles: ["resident", "admin"] },
  ];

  const visibleLinks = isLoggedIn
    ? quickLinks.filter((l) => l.roles.includes(role))
    : quickLinks.slice(0, 3);

  const features = [
    { icon: DollarSign, title: "Smart Payments",  desc: "Pay maintenance fees online in seconds. Auto-reminders ensure you never miss a due date.", color: "#10b981" },
    { icon: Shield,     title: "Gated Security",  desc: "Real-time visitor logs, guard management and digital entry passes for complete security.", color: "#3b82f6" },
    { icon: Users,      title: "Community Hub",   desc: "Connect with neighbors through notices, polls, events and community discussions.",         color: "#8b5cf6" },
    { icon: BarChart3,  title: "Live Reports",    desc: "Transparent financial reports, complaint tracking and facility usage at your fingertips.",  color: "#f59e0b" },
    { icon: Zap,        title: "Instant Alerts",  desc: "Emergency notifications, maintenance updates and event reminders delivered instantly.",     color: "#ef4444" },
    { icon: Lock,       title: "Safe & Private",  desc: "Bank-grade encryption protects all your personal data and transaction history.",            color: "#06b6d4" },
  ];

  const testimonials = [
    { name: "Priya Sharma", flat: "A-204", text: "Managing maintenance payments has never been easier. Love the instant receipt!", stars: 5 },
    { name: "Rajesh Mehta", flat: "B-101", text: "The visitor management system is a game changer for our society security.",       stars: 5 },
    { name: "Anita Patel",  flat: "C-302", text: "Events and notices are now instantly visible. Feels like a real community!",       stars: 5 },
  ];

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:wght@700;800;900&display=swap');

        .hero-bg {
          background-color: #f8fafc;
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.7) 100%),
            url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80');
          background-size: cover;
          background-position: center right;
          position: relative;
        }

        .hero-pill {
          background: white;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .float-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          animation: floatAnim 4s ease-in-out infinite;
        }

        @keyframes floatAnim {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .reveal { animation: revealUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .d1 { animation-delay: 0.1s; }
        .d2 { animation-delay: 0.2s; }
        .d3 { animation-delay: 0.3s; }

        .card-lift { transition: all 0.3s ease; }
        .card-lift:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.06); }

        .section-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #3b82f6;
        }

        .shimmer {
          background: linear-gradient(90deg, #f0f4f8 25%, #e8edf2 50%, #f0f4f8 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>

      {/* HERO */}
      <section className="hero-bg px-6 py-20 md:py-32 overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-12">
          <div className="z-10 text-left">
            <div className="reveal d1 inline-flex items-center gap-2 hero-pill rounded-full px-4 py-2 text-sm mb-6">
              <span className="text-lg">{greeting.emoji}</span>
              <span className="text-slate-600 font-bold">{greeting.text}{isLoggedIn ? `, ${firstName}` : ""}</span>
            </div>
            <h1 className="reveal d2 mb-6 leading-[1.1] text-slate-900" style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 900 }}>
              Elevate Your <br />
              <span className="text-blue-600">Community Living.</span>
            </h1>
            <p className="reveal d3 text-lg text-slate-600 max-w-md leading-relaxed mb-10">
              The smartest way to manage your society. Experience seamless payments,
              robust security, and a more connected neighborhood.
            </p>
            <div className="reveal d3 flex flex-wrap gap-4">
              {isLoggedIn ? (
                <Link to="/maintenance" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-200">
                  Dashboard <ArrowRight size={18} />
                </Link>
              ) : (
                <Link to="/login" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-slate-200">
                  Get Started <ArrowRight size={18} />
                </Link>
              )}
              <Link to="/notices" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-8 py-4 rounded-2xl border border-slate-200 transition-all">
                View Notices
              </Link>
            </div>
          </div>

          <div className="relative hidden md:flex justify-center items-center">
            <div className="float-card p-6 rounded-[32px] w-full max-w-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><Shield size={24} /></div>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase">Verified</span>
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Gate Security Active</h3>
              <p className="text-sm text-slate-500 mb-6">Real-time visitor tracking and digital authorization in progress.</p>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                    <div className="flex-1">
                      <div className="h-2 bg-slate-200 w-1/2 rounded mb-2" />
                      <div className="h-1.5 bg-slate-100 w-1/3 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 float-card p-4 rounded-2xl hidden lg:block" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Bell size={20} /></div>
                <div>
                  <p className="text-xs font-black text-slate-800">New Notice</p>
                  <p className="text-[10px] text-slate-400">2 mins ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      {isLoggedIn && (
        <section className="bg-white border-b border-slate-100 px-6 py-6 shadow-sm relative z-20">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => {
              const Icon = s.icon;
              // ✅ flatLoading drives the shimmer for Wing & Flat cards
              const isLoading = s.label === "Wing" || s.label === "Flat"
                ? flatLoading
                : s.label === "Notices" ? noticeLoading : eventLoading;
              return (
                <div key={s.label} className="card-lift flex items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-white">
                  <div style={{ background: s.bg, borderRadius: "14px", padding: "12px" }}>
                    <Icon size={20} style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                      {isLoading ? (
                        <span className="shimmer inline-block w-8 h-6 rounded" />
                      ) : (
                        s.value
                      )}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* QUICK ACCESS */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="section-label mb-3">Your Terminal</p>
          <h2 className="text-4xl font-bold text-slate-900 mb-10" style={{ fontFamily: "'Fraunces', serif" }}>Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {visibleLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.to} to={isLoggedIn ? link.to : "/login"}
                  className="card-lift flex flex-col items-center gap-4 p-6 rounded-3xl text-center border border-slate-100 bg-slate-50/50"
                >
                  <div style={{ background: link.bg, borderRadius: "18px", padding: "16px" }}>
                    <Icon size={24} style={{ color: link.color }} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* LIVE FEED */}
      {isLoggedIn && (
        <section className="px-6 pb-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <p className="section-label mb-3">Activity Stream</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-10" style={{ fontFamily: "'Fraunces', serif" }}>What's Happening</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* NOTICES */}
              <div className="bg-slate-50/50 rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-50 p-2 rounded-lg text-red-500"><Bell size={18} /></div>
                    <h3 className="font-black text-slate-800 uppercase tracking-tight">Latest Notices</h3>
                  </div>
                  <Link to="/notices" className="text-xs text-blue-600 font-bold flex items-center gap-1">See All <ChevronRight size={14} /></Link>
                </div>
                <div className="p-2">
                  {noticeLoading ? (
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="px-4 py-5 border-b border-slate-50">
                        <div className="shimmer h-4 w-3/4 rounded mb-2" />
                        <div className="shimmer h-3 w-1/3 rounded" />
                      </div>
                    ))
                  ) : notices?.length > 0 ? (
                    notices.slice(0, 4).map((n) => (
                      <div key={n._id} className="hover:bg-white m-1 rounded-2xl px-5 py-4 transition cursor-pointer border border-transparent hover:border-slate-100 hover:shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold text-slate-700 line-clamp-1">{n.title}</p>
                          <ChevronRight size={16} className="text-slate-300" />
                        </div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="p-10 text-sm text-slate-400 text-center font-medium">No notices currently active.</p>
                  )}
                </div>
              </div>

              {/* EVENTS */}
              <div className="bg-slate-50/50 rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-500"><Calendar size={18} /></div>
                    <h3 className="font-black text-slate-800 uppercase tracking-tight">Society Calendar</h3>
                  </div>
                  <Link to="/events" className="text-xs text-blue-600 font-bold flex items-center gap-1">Calendar <ChevronRight size={14} /></Link>
                </div>
                <div className="p-2">
                  {eventLoading ? (
                    [...Array(3)].map((_, i) => <div key={i} className="px-4 py-5 shimmer m-2 rounded-2xl h-16" />)
                  ) : upcomingEvents.length > 0 ? (
                    upcomingEvents.slice(0, 4).map((e) => (
                      <div key={e._id} className="hover:bg-white m-1 rounded-2xl px-5 py-4 transition flex items-center gap-4 border border-transparent hover:border-slate-100 hover:shadow-sm cursor-pointer">
                        <div className="bg-blue-600 rounded-2xl p-3 text-center min-w-[56px] shadow-lg shadow-blue-100">
                          <p className="text-xl font-black text-white leading-none">{new Date(e.date).getDate()}</p>
                          <p className="text-[10px] font-bold text-blue-100 uppercase mt-1">{new Date(e.date).toLocaleString("default", { month: "short" })}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-700 line-clamp-1">{e.title}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={12} /> {e.location || "Clubhouse"}</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300" />
                      </div>
                    ))
                  ) : (
                    <p className="p-10 text-sm text-slate-400 text-center font-medium">No upcoming events found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="px-6 py-20 bg-slate-50/30 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-3">Modern Living</p>
            <h2 className="text-4xl font-bold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>Tailored for Excellence</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card-lift bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
                  <div style={{ background: f.color + "15", borderRadius: "20px", padding: "16px", display: "inline-flex", marginBottom: "24px" }}>
                    <Icon size={24} style={{ color: f.color }} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-xl mb-3">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-3">Community Voice</p>
            <h2 className="text-4xl font-bold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>Resident Testimonials</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="card-lift bg-slate-50/50 rounded-[32px] border border-slate-100 p-8">
                <div className="flex gap-1 mb-6 text-orange-400">
                  {[...Array(t.stars)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-slate-600 text-base leading-relaxed mb-8 italic font-medium">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold shadow-lg">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-400 font-bold">Resident {t.flat}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;