import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Bell, Calendar, Users, Shield, Wrench, DollarSign,
  ArrowRight, Building2, CheckCircle, Clock, TrendingUp
} from "lucide-react";
import {fetchNotices} from "../../store/slices/noticeSlice"
import {fetchEvents} from "../../store/slices/eventSlice";

const Home = () => {
  const dispatch = useDispatch();
  const notices = useSelector((s) => s.notice?.list   ?? []);
  const events  = useSelector((s) => s.event?.events  ?? []);
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const role = user?.role?.toLowerCase();
  const isLoggedIn = !!localStorage.getItem("token");

  console.log("notice"+notices)
  console.log(events)
  useEffect(() => {
    dispatch(fetchNotices());
    dispatch(fetchEvents());
  }, [dispatch]);

  const quickLinks = [
    { label: "Pay Maintenance", icon: <DollarSign size={22} />, to: "/maintenance", color: "bg-emerald-50 text-emerald-600 border-emerald-100", roles: ["resident", "admin"] },
    { label: "Raise Complaint", icon: <Wrench size={22} />, to: "/raise-complaint", color: "bg-orange-50 text-orange-600 border-orange-100", roles: ["resident", "admin"] },
    { label: "Book Facility", icon: <Building2 size={22} />, to: "/facilities", color: "bg-blue-50 text-blue-600 border-blue-100", roles: ["resident"] },
    { label: "Visitor Log", icon: <Users size={22} />, to: "/visitors", color: "bg-violet-50 text-violet-600 border-violet-100", roles: ["resident", "admin"] },
    { label: "Notice Board", icon: <Bell size={22} />, to: "/notices", color: "bg-rose-50 text-rose-600 border-rose-100", roles: ["resident", "admin"] },
    { label: "Events", icon: <Calendar size={22} />, to: "/events", color: "bg-amber-50 text-amber-600 border-amber-100", roles: ["resident", "admin"] },
  ];

  const visibleLinks = isLoggedIn
    ? quickLinks.filter((l) => l.roles.includes(role))
    : quickLinks;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-slate-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        .hero-gradient { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%); }
        .card-hover { transition: all 0.25s ease; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.10); }
        .fade-in { animation: fadeUp 0.6s ease both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
      `}</style>

      {/* HERO */}
      <section className="hero-gradient text-white px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 fade-in">
            <Shield size={14} className="text-blue-300" />
            <span className="text-blue-100">Smart Society Management</span>
          </div>
          <h1 className="fade-in stagger-1 text-5xl md:text-6xl font-bold mb-5 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Welcome{isLoggedIn && user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="fade-in stagger-2 text-lg text-blue-100 max-w-xl mx-auto mb-10">
            Everything your society needs — payments, complaints, visitors, events — all in one place.
          </p>
          {!isLoggedIn && (
            <div className="fade-in stagger-3 flex gap-3 justify-center flex-wrap">
              <Link to="/login" className="bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition flex items-center gap-2">
                Get Started <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* STATS BAR */}
      {isLoggedIn && (
        <section className="bg-white border-b border-slate-100 px-6 py-5">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Notices", value: notices?.length || 0, icon: <Bell size={16} />, color: "text-rose-500" },
              { label: "Upcoming Events", value: events?.filter(e => new Date(e.date) >= new Date()).length || 0, icon: <Calendar size={16} />, color: "text-blue-500" },
              { label: "Your Wing", value: user?.wing || "—", icon: <Building2 size={16} />, color: "text-emerald-500" },
              { label: "Flat", value: user?.flatNumber || "—", icon: <TrendingUp size={16} />, color: "text-amber-500" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <div className={`${s.color} bg-white p-2 rounded-lg shadow-sm`}>{s.icon}</div>
                <div>
                  <p className="text-xl font-bold text-slate-800">{s.value}</p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* QUICK LINKS */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {visibleLinks.map((link) => (
              <Link key={link.to} to={isLoggedIn ? link.to : "/login"} className={`card-hover flex flex-col items-center gap-3 p-5 rounded-2xl border ${link.color} text-center`}>
                <div className="p-3 bg-white rounded-xl shadow-sm">{link.icon}</div>
                <span className="text-sm font-semibold leading-tight">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NOTICES + EVENTS */}
      {isLoggedIn && (
        <section className="px-6 pb-16">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">

            {/* NOTICES */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-rose-500" />
                  <h3 className="font-bold text-slate-800">Latest Notices</h3>
                </div>
                <Link to="/notices" className="text-xs text-blue-500 font-medium flex items-center gap-1 hover:underline">
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-slate-50">
                {notices?.slice(0, 4).map((n) => (
                  <div key={n._id} className="px-5 py-3 hover:bg-slate-50 transition">
                    <p className="text-sm font-medium text-slate-700 truncate">{n.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {!notices?.length && <p className="px-5 py-6 text-sm text-slate-400 text-center">No notices yet</p>}
              </div>
            </div>

            {/* EVENTS */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500" />
                  <h3 className="font-bold text-slate-800">Upcoming Events</h3>
                </div>
                <Link to="/events" className="text-xs text-blue-500 font-medium flex items-center gap-1 hover:underline">
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-slate-50">
                {events?.filter(e => new Date(e.date) >= new Date()).slice(0, 4).map((e) => (
                  <div key={e._id} className="px-5 py-3 hover:bg-slate-50 transition flex items-center gap-3">
                    <div className="bg-blue-50 text-blue-600 rounded-xl px-3 py-2 text-center min-w-[48px]">
                      <p className="text-lg font-bold leading-none">{new Date(e.date).getDate()}</p>
                      <p className="text-xs">{new Date(e.date).toLocaleString("default", { month: "short" })}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{e.title}</p>
                      <p className="text-xs text-slate-400">{e.location || "Society Premises"}</p>
                    </div>
                  </div>
                ))}
                {!events?.filter(e => new Date(e.date) >= new Date()).length && (
                  <p className="px-5 py-6 text-sm text-slate-400 text-center">No upcoming events</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FEATURES FOR VISITORS */}
      {!isLoggedIn && (
        <section className="px-6 pb-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Everything in one place</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: <DollarSign size={24} />, title: "Easy Payments", desc: "Pay maintenance fees online, track invoices and payment history.", color: "text-emerald-600 bg-emerald-50" },
                { icon: <Shield size={24} />, title: "Secure & Gated", desc: "Manage visitor entries, gate logs and security guard access.", color: "text-blue-600 bg-blue-50" },
                { icon: <Users size={24} />, title: "Community First", desc: "Stay connected through notices, polls, events and discussions.", color: "text-violet-600 bg-violet-50" },
              ].map((f) => (
                <div key={f.title} className="card-hover bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>{f.icon}</div>
                  <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;