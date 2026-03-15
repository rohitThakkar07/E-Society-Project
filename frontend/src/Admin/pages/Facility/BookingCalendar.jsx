import React from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const BookingCalendar = () => {
  const navigate = useNavigate();

  // Dummy Booking Events (Replace with API later)
  const events = [
    {
      id: "1",
      title: "Hall - Flat A101",
      date: "2026-03-05",
      backgroundColor: "#22c55e",
    },
    {
      id: "2",
      title: "Gym - Flat B202",
      date: "2026-03-07",
      backgroundColor: "#f59e0b",
    },
    {
      id: "3",
      title: "Swimming Pool - Flat C303",
      date: "2026-03-10",
      backgroundColor: "#3b82f6",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Booking Calendar</h1>
          <p className="text-gray-500">
            View and manage facility bookings
          </p>
        </div>

        <button
          onClick={() => navigate("/facility/book")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          New Booking
        </button>
      </div>

      {/* CALENDAR CARD */}
      <div className="bg-white rounded-xl shadow p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          height="auto"
          eventClick={(info) => {
            navigate(`/facility/booking/${info.event.id}`);
          }}
        />
      </div>

    </div>
  );
};

export default BookingCalendar;