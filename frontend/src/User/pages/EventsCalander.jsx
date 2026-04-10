import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, MapPin, Clock, Plus, X, ChevronLeft, ChevronRight, Users, Sparkles, ArrowRight } from "lucide-react";
import { fetchEvents, createEvent, deleteEvent } from "../../store/slices/eventSlice";
import { ListSkeleton } from "../../components/PageLoader";

const EventsCalendar = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((s) => s.event);
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [view, setView] = useState("list"); // list | calendar
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", date: "", time: "", location: "", organizer: "" });

  useEffect(() => { dispatch(fetchEvents()); }, [dispatch]);

  const upcoming = (events || []).filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = (events || []).filter(e => new Date(e.date) < new Date()).sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleCreate = async (e) => {
    e.preventDefault();
    await dispatch(createEvent(form));
    setShowForm(false);
    setForm({ title: "", description: "", date: "", time: "", location: "", organizer: "" });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear(), month = date.getMonth();
    const first = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    return { first, days };
  };
  const { first, days } = getDaysInMonth(currentMonth);
  const eventDates = (events || []).map(e => new Date(e.date).toDateString());

  // Glow Color Palette
  const typeColors = [
    { bg: "rgba(59, 130, 246, 0.05)", border: "border-blue-500/20", text: "text-blue-500", glow: "shadow-blue-500/10" },
    { bg: "rgba(139, 92, 246, 0.05)", border: "border-purple-500/20", text: "text-purple-500", glow: "shadow-purple-500/10" },
    { bg: "rgba(16, 185, 129, 0.05)", border: "border-emerald-500/20", text: "text-emerald-500", glow: "shadow-emerald-500/10" },
    { bg: "rgba(245, 158, 11, 0.05)", border: "border-amber-500/20", text: "text-amber-500", glow: "shadow-amber-500/10" }
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-4 sm:p-8 transition-all duration-500">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fadeUp 0.5s ease forwards; }
      `}</style>

      <div className="max-w-6xl mx-auto m-12">
        
        {/* HEADER SECTION WITH GLASS MORPHISM */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-8 mb-10 shadow-sm transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)]">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px] animate-pulse" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-[11px] font-black uppercase tracking-widest mb-4 border border-blue-500/20">
                <Sparkles size={14} className="animate-pulse" />
                Community Events
              </div>
              <h1 className="text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl flex items-center gap-3">
                <Calendar className="text-blue-500" size={36} /> Society Events
              </h1>
              <p className="mt-3 text-sm font-medium text-[var(--text-muted)] opacity-70 max-w-lg">
                Stay updated with upcoming meetings, festivals, and community gatherings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-1.5 flex shadow-inner">
                {["list", "calendar"].map(v => (
                  <button key={v} onClick={() => setView(v)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${view === v ? "bg-slate-900 text-white shadow-xl scale-105" : "text-[var(--text-muted)] hover:bg-[var(--border)]"}`}>
                    {v}
                  </button>
                ))}
              </div>
              {isAdmin && (
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all hover:-translate-y-1 shadow-lg shadow-blue-600/20 active:scale-95">
                  <Plus size={16} /> Add Event
                </button>
              )}
            </div>
          </div>
        </section>

        {/* LIST VIEW */}
        {view === "list" && (
          <div className="space-y-10 animate-fade-up">
            {/* UPCOMING */}
            <div>
              <h2 className="flex items-center gap-3 text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-6">
                Upcoming Highlights <div className="h-px flex-1 bg-[var(--border)] opacity-50" />
              </h2>
              {loading ? (
                <ListSkeleton rows={4} rowClassName="h-24 rounded-3xl" />
              ) : upcoming.length ? (
                <div className="grid gap-4 sm:grid-cols-1">
                  {upcoming.map((e, i) => {
                    const color = typeColors[i % 4];
                    return (
                      <div key={e._id} onClick={() => setSelected(e)}
                        style={{ animationDelay: `${i * 100}ms` }}
                        className={`group relative bg-[var(--card)] rounded-[2rem] border ${color.border} p-6 cursor-pointer transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl ${color.glow} flex flex-col sm:flex-row gap-6 items-center animate-fade-up opacity-0`}>
                        
                        <div className={`text-center min-w-[70px] ${color.bg} rounded-2xl p-4 border ${color.border} group-hover:scale-110 transition-transform`}>
                          <p className={`text-3xl font-black leading-none ${color.text}`}>{new Date(e.date).getDate()}</p>
                          <p className={`text-[10px] font-black uppercase mt-1 ${color.text} opacity-70`}>{new Date(e.date).toLocaleString("default", { month: "short" })}</p>
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="text-xl font-black text-[var(--text)] mb-2 group-hover:text-blue-500 transition-colors">{e.title}</h3>
                          <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider opacity-60">
                            {e.time && <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-500" />{e.time}</span>}
                            {e.location && <span className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-500" />{e.location}</span>}
                            {e.organizer && <span className="flex items-center gap-1.5"><Users size={14} className="text-blue-500" />By {e.organizer}</span>}
                          </div>
                        </div>
                        <ArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" size={20} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 rounded-[3rem] border-2 border-dashed border-[var(--border)] bg-[var(--card)] opacity-50">
                  <p className="font-black uppercase tracking-widest text-[var(--text-muted)]">Quiet on the front... No events yet.</p>
                </div>
              )}
            </div>

            {/* PAST */}
            {past.length > 0 && (
              <div className="opacity-70 grayscale-[0.5] hover:grayscale-0 transition-all duration-700">
                <h2 className="flex items-center gap-3 text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-6">
                  Past Memories <div className="h-px flex-1 bg-[var(--border)] opacity-30" />
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {past.slice(0, 4).map((e) => (
                    <div key={e._id} onClick={() => setSelected(e)}
                      className="bg-[var(--card)] rounded-3xl border border-[var(--border)] p-5 cursor-pointer hover:bg-[var(--bg)] transition-all flex gap-5 items-center">
                      <div className="text-center min-w-[50px] opacity-50">
                        <p className="text-2xl font-black leading-none">{new Date(e.date).getDate()}</p>
                        <p className="text-[10px] font-bold uppercase">{new Date(e.date).toLocaleString("default", { month: "short" })}</p>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-[var(--text)] truncate">{e.title}</h3>
                        <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-1 truncate"><MapPin size={12} />{e.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CALENDAR VIEW */}
        {view === "calendar" && (
          <div className="bg-[var(--card)] rounded-[2.5rem] border border-[var(--border)] shadow-2xl overflow-hidden animate-fade-up">
            <div className="flex items-center justify-between px-8 py-6 bg-[linear-gradient(to_right,var(--card),var(--bg))] border-b border-[var(--border)]">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-3 hover:bg-blue-500/10 text-blue-500 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-blue-500/20"><ChevronLeft size={20} /></button>
              <h2 className="text-xl font-black text-[var(--text)] uppercase tracking-tighter">
                {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
              </h2>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-3 hover:bg-blue-500/10 text-blue-500 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-blue-500/20"><ChevronRight size={20} /></button>
            </div>
            <div className="grid grid-cols-7 text-center border-b border-[var(--border)] bg-[var(--bg)]/50">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                <div key={d} className="py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 p-2">
              {Array.from({ length: first }).map((_, i) => <div key={`e-${i}`} className="aspect-square" />)}
              {Array.from({ length: days }).map((_, i) => {
                const d = i + 1;
                const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d).toDateString();
                const hasEvent = eventDates.includes(dateStr);
                const isToday = new Date().toDateString() === dateStr;
                return (
                  <div key={d} className={`aspect-square flex flex-col items-center justify-center text-sm relative group cursor-pointer
                    ${isToday ? "bg-blue-600 text-white rounded-[1.5rem] shadow-lg shadow-blue-600/30 scale-90 z-10" : "text-[var(--text)] hover:bg-blue-500/5 transition rounded-[1.5rem]"}`}>
                    <span className="font-black">{d}</span>
                    {hasEvent && <div className={`w-1.5 h-1.5 rounded-full absolute bottom-3 ${isToday ? "bg-white" : "bg-blue-500 shadow-[0_0_8px_#3b82f6]"}`} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL WITH BLUR */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 transition-all duration-500 animate-in fade-in" onClick={() => setSelected(null)}>
          <div className="bg-[var(--card)] rounded-[3rem] shadow-2xl max-w-md w-full p-8 border border-[var(--border)] relative overflow-hidden animate-fade-up" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setSelected(null)} className="p-2 bg-[var(--bg)] rounded-xl text-[var(--text-muted)] hover:text-red-500 transition-colors border border-[var(--border)]"><X size={20} /></button>
            </div>
            
            <div className="bg-blue-600 text-white rounded-[2rem] w-24 h-24 flex flex-col items-center justify-center shadow-xl shadow-blue-600/20 mb-6">
                <p className="text-4xl font-black leading-none">{new Date(selected.date).getDate()}</p>
                <p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-80">{new Date(selected.date).toLocaleString("default", { month: "short" })}</p>
            </div>

            <h2 className="text-3xl font-black text-[var(--text)] mb-4 leading-tight">{selected.title}</h2>
            <div className="bg-[var(--bg)] rounded-3xl p-6 border border-[var(--border)] mb-6">
                <p className="text-[var(--text-muted)] text-sm font-medium leading-relaxed">{selected.description || "No detailed description provided for this community event."}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
              <div className="flex items-center gap-3 bg-[var(--bg)] p-3 rounded-2xl border border-[var(--border)]"><Clock size={16} className="text-blue-500" />{selected.time || "TBA"}</div>
              <div className="flex items-center gap-3 bg-[var(--bg)] p-3 rounded-2xl border border-[var(--border)]"><MapPin size={16} className="text-blue-500" />{selected.location || "Society Grounds"}</div>
              <div className="flex items-center gap-3 bg-[var(--bg)] p-3 rounded-2xl border border-[var(--border)]"><Users size={16} className="text-blue-500" />Organizer: {selected.organizer || "Community Board"}</div>
            </div>

            {isAdmin && (
              <button onClick={() => { dispatch(deleteEvent(selected._id)); setSelected(null); }}
                className="mt-8 w-full text-red-500 border border-red-500/20 bg-red-500/5 hover:bg-red-500 hover:text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                Delete Event
              </button>
            )}
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-[var(--card)] rounded-[3rem] shadow-2xl max-w-md w-full p-8 border border-[var(--border)] max-h-[90vh] overflow-y-auto animate-fade-up">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-[var(--text)] uppercase tracking-tight">Schedule Event</h2>
              <button onClick={() => setShowForm(false)} className="p-2 bg-[var(--bg)] rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-red-500 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-6">
              {[
                { label: "Event Title", key: "title", type: "text", placeholder: "e.g. Annual General Meeting" },
                { label: "Date", key: "date", type: "date" },
                { label: "Time", key: "time", type: "time" },
                { label: "Location", key: "location", type: "text", placeholder: "Clubhouse / Garden" },
                { label: "Organizer", key: "organizer", type: "text", placeholder: "Person or Committee" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-2 mb-2 block">{f.label}</label>
                  <input required={["title","date"].includes(f.key)} type={f.type} value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                    className="w-full px-5 py-4 bg-[var(--bg)] border border-[var(--border)] rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
              ))}
              <div>
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-2 mb-2 block">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="What is this event about?" className="w-full px-5 py-4 bg-[var(--bg)] border border-[var(--border)] rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-4 border border-[var(--border)] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:bg-[var(--bg)] transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsCalendar;