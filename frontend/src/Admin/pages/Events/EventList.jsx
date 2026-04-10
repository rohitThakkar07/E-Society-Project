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
  const [tab, setTab] = useState("upcoming");

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
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-500">No events found.</div>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map((event) => (
            <div key={event._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{event.category || "General"}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/admin/event/edit/${event._id}`)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                    <FiEdit size={16} />
                  </button>
                  <button onClick={() => confirmAndDelete(event._id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                <span><FiCalendar size={14} className="inline mr-1" />{new Date(event.date).toLocaleDateString()}</span>
                {event.time && <span><FiClock size={14} className="inline mr-1" />{event.time}</span>}
                {event.location && <span><FiMapPin size={14} className="inline mr-1" />{event.location}</span>}
              </div>
              <p className="mt-2 text-sm text-gray-700">{event.description || "No description provided."}</p>
              <p className="mt-3 text-xs text-gray-500">Organized by: {event.organizer || "Community"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
