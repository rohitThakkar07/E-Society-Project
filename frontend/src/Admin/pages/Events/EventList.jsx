import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2, FiPlus, FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";
import { fetchEvents, deleteEvent } from "../../../store/slices/eventSlice";
import { FiClock } from "react-icons/fi";

const EventList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { events = [], loading } = useSelector((state) => state.event);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    const now = new Date();
    if (tab === "upcoming") return events.filter((e) => new Date(e.date) >= now).sort((a,b) => new Date(a.date)-new Date(b.date));
    if (tab === "past") return events.filter((e) => new Date(e.date) < now).sort((a,b) => new Date(b.date)-new Date(a.date));
    return events;
  }, [events, tab]);

  const confirmAndDelete = (id) => {
    if (window.confirm("Delete this event?")) {
      dispatch(deleteEvent(id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <FiCalendar className="text-indigo-600" /> Events
          </h1>
          <p className="text-sm text-gray-500">Add / edit / delete events and manage the public calendar.</p>
        </div>
        <button
          onClick={() => navigate("/admin/event/add")}
          className="admin-btn-primary"
        >
          <FiPlus /> Add Event
        </button>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-6 w-fit flex gap-1">
        { ["all", "upcoming", "past"].map((name) => (
          <button
            key={name}
            onClick={() => setTab(name)}
            className={`px-5 py-2 rounded-xl uppercase text-sm font-semibold transition ${tab===name ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-slate-50"}`}
          >
            {name}
          </button>
        )) }
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map((i) => (<div key={i} className="h-24 rounded-2xl bg-white animate-pulse border border-gray-100" />))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-500 font-bold uppercase tracking-widest">No events found.</div>
      ) : (
        <div className="admin-table-wrap shadow-sm">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Category</th>
                <th>Date & Time</th>
                <th>Location</th>
                <th>Organizer</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event._id} className="hover:bg-slate-50 transition-colors">
                  <td>
                    <div className="font-bold text-slate-800">{event.title}</div>
                    <div className="text-[10px] text-slate-400 max-w-[200px] truncate">{event.description}</div>
                  </td>
                  <td>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter bg-indigo-50 text-indigo-600 border border-indigo-100">
                      {event.category || "General"}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <FiCalendar size={12} className="text-slate-400" />
                      {new Date(event.date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-0.5">
                        <FiClock size={10} />
                        {event.time}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <FiMapPin size={12} className="text-slate-400" />
                      {event.location || "N/A"}
                    </div>
                  </td>
                  <td className="text-xs font-bold text-slate-600">
                    {event.organizer || "Community"}
                  </td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => navigate(`/admin/event/edit/${event._id}`)}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        <FiEdit size={14} />
                      </button>
                      <button 
                        onClick={() => confirmAndDelete(event._id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventList;
