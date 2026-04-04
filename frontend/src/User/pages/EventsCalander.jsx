import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, MapPin, Clock, Plus, X, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { fetchEvents, createEvent, deleteEvent } from "../../store/slices/eventSlice";

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

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear(), month = date.getMonth();
    const first = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    return { first, days };
  };
  const { first, days } = getDaysInMonth(currentMonth);
  const eventDates = (events || []).map(e => new Date(e.date).toDateString());

  const typeColors = ["bg-blue-50 border-blue-200 text-blue-700", "bg-violet-50 border-violet-200 text-violet-700",
    "bg-emerald-50 border-emerald-200 text-emerald-700", "bg-amber-50 border-amber-200 text-amber-700"];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-4 sm:p-6 transition-colors duration-300">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={20} className="text-blue-500" />
              <h1 className="text-2xl font-bold text-slate-800">Events</h1>
            </div>
            <p className="text-sm text-slate-400">{upcoming.length} upcoming events</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 rounded-xl flex overflow-hidden">
              {["list", "calendar"].map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-4 py-2 text-sm font-medium transition capitalize ${view === v ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
                  {v}
                </button>
              ))}
            </div>
            {isAdmin && (
              <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition">
                <Plus size={16} /> Add Event
              </button>
            )}
          </div>
        </div>

        {/* LIST VIEW */}
        {view === "list" && (
          <div className="space-y-8">
            {/* UPCOMING */}
            <div>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Upcoming</h2>
              {loading ? (
                <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-slate-100" />)}</div>
              ) : upcoming.length ? (
                <div className="space-y-3">
                  {upcoming.map((e, i) => (
                    <div key={e._id} onClick={() => setSelected(e)}
                      className={`bg-white rounded-2xl border shadow-sm p-5 cursor-pointer hover:shadow-md transition flex gap-5 items-start ${typeColors[i % 4]}`}>
                      <div className="text-center min-w-[52px] bg-white rounded-xl p-2 shadow-sm">
                        <p className="text-2xl font-bold leading-none text-slate-800">{new Date(e.date).getDate()}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{new Date(e.date).toLocaleString("default", { month: "short" })}</p>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 mb-1">{e.title}</h3>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                          {e.time && <span className="flex items-center gap-1"><Clock size={11} />{e.time}</span>}
                          {e.location && <span className="flex items-center gap-1"><MapPin size={11} />{e.location}</span>}
                          {e.organizer && <span className="flex items-center gap-1"><Users size={11} />{e.organizer}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-center py-10 text-slate-400 bg-white rounded-2xl border border-slate-100">No upcoming events</p>}
            </div>

            {/* PAST */}
            {past.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Past Events</h2>
                <div className="space-y-3">
                  {past.slice(0, 5).map((e) => (
                    <div key={e._id} onClick={() => setSelected(e)}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition flex gap-5 items-start opacity-60">
                      <div className="text-center min-w-[52px]">
                        <p className="text-2xl font-bold leading-none text-slate-400">{new Date(e.date).getDate()}</p>
                        <p className="text-xs text-slate-300 mt-0.5">{new Date(e.date).toLocaleString("default", { month: "short" })}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-600">{e.title}</h3>
                        {e.location && <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin size={11} />{e.location}</p>}
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
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-2 hover:bg-slate-100 rounded-lg transition"><ChevronLeft size={16} /></button>
              <h2 className="font-bold text-slate-800">
                {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
              </h2>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-2 hover:bg-slate-100 rounded-lg transition"><ChevronRight size={16} /></button>
            </div>
            <div className="grid grid-cols-7 text-center border-b border-slate-100">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                <div key={d} className="py-3 text-xs font-bold text-slate-400">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {Array.from({ length: first }).map((_, i) => <div key={`e-${i}`} className="aspect-square" />)}
              {Array.from({ length: days }).map((_, i) => {
                const d = i + 1;
                const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d).toDateString();
                const hasEvent = eventDates.includes(dateStr);
                const isToday = new Date().toDateString() === dateStr;
                return (
                  <div key={d} className={`aspect-square flex flex-col items-center justify-center text-sm cursor-default border-t border-slate-50
                    ${isToday ? "bg-slate-900 text-white rounded-xl m-1" : "text-slate-600 hover:bg-slate-50 transition"}`}>
                    {d}
                    {hasEvent && <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isToday ? "bg-blue-300" : "bg-blue-500"}`} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[130] flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-50 text-blue-600 rounded-xl px-4 py-2 text-center">
                <p className="text-3xl font-bold leading-none">{new Date(selected.date).getDate()}</p>
                <p className="text-xs mt-0.5">{new Date(selected.date).toLocaleString("default", { month: "long", year: "numeric" })}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">{selected.title}</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">{selected.description}</p>
            <div className="space-y-2 text-sm text-slate-500">
              {selected.time && <p className="flex items-center gap-2"><Clock size={14} className="text-slate-400" />{selected.time}</p>}
              {selected.location && <p className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" />{selected.location}</p>}
              {selected.organizer && <p className="flex items-center gap-2"><Users size={14} className="text-slate-400" />{selected.organizer}</p>}
            </div>
            {isAdmin && (
              <button onClick={() => { dispatch(deleteEvent(selected._id)); setSelected(null); }}
                className="mt-5 w-full text-red-500 border border-red-100 hover:bg-red-50 py-2.5 rounded-xl text-sm font-medium transition">
                Delete Event
              </button>
            )}
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[130] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">Add Event</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              {[
                { label: "Title", key: "title", type: "text", placeholder: "Event title" },
                { label: "Date", key: "date", type: "date" },
                { label: "Time", key: "time", type: "time" },
                { label: "Location", key: "location", type: "text", placeholder: "Community hall, Garden..." },
                { label: "Organizer", key: "organizer", type: "text", placeholder: "Committee / Person name" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{f.label}</label>
                  <input required={["title","date"].includes(f.key)} type={f.type} value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                    className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Event details..." className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[var(--accent)] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsCalendar;