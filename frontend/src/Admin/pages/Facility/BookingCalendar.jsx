import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../../../store/slices/facilityBookingSlice";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// Colour per booking status
const STATUS_COLORS = {
  Approved: { bg: "#22c55e", border: "#16a34a" },
  Pending: { bg: "#f59e0b", border: "#d97706" },
  Rejected: { bg: "#ef4444", border: "#dc2626" },
  Cancelled: { bg: "#9ca3af", border: "#6b7280" },
};

// Safely extract name from a populated object or plain string
const getFacilityName = (facility) => {
  if (!facility) return "Facility";
  if (typeof facility === "object") return facility.name || "Facility";
  return facility;
};

const getResidentLabel = (resident) => {
  if (!resident) return "";
  if (typeof resident === "object") {
    return resident.flatNumber || resident.flat || resident.name || "";
  }
  return resident;
};

const BookingCalendar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { bookings, loading } = useSelector((state) => state.booking);

  console.log(bookings);
  // Fetch all bookings on mount
  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  // Transform bookings → FullCalendar event objects
  const events = useMemo(() =>
    bookings.map((b) => {
      const colors = STATUS_COLORS[b.status] || STATUS_COLORS.Pending;
      const facilityName = getFacilityName(b.facility);
      const residentLabel = getResidentLabel(b.resident);

      return {
        id: b._id,
        title: residentLabel
          ? `${facilityName} — ${residentLabel}`
          : facilityName,
        // Use start+end for time-grid views; bookingDate for day-grid
        start: b.bookingDate
          ? `${b.bookingDate.split("T")[0]}T${b.startTime || "00:00"}`
          : undefined,
        end: b.bookingDate
          ? `${b.bookingDate.split("T")[0]}T${b.endTime || "00:00"}`
          : undefined,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        textColor: "#ffffff",
        extendedProps: { status: b.status },
      };
    }),
    [bookings]);

  // Summary counts for the legend
  const counts = useMemo(() => ({
    Approved: bookings.filter((b) => b.status === "Approved").length,
    Pending: bookings.filter((b) => b.status === "Pending").length,
    Rejected: bookings.filter((b) => b.status === "Rejected").length,
    Cancelled: bookings.filter((b) => b.status === "Cancelled").length,
  }), [bookings]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Calendar</h1>
          <p className="text-sm text-gray-500">View and manage all facility bookings</p>
        </div>
        <button
          onClick={() => navigate("/admin/facility/book")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium self-start sm:self-auto"
        >
          + New Booking
        </button>
      </div>

      {/* LEGEND + COUNTS */}
      <div className="flex flex-wrap gap-3 mb-5">
        {Object.entries(STATUS_COLORS).map(([status, colors]) => (
          <div
            key={status}
            className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm text-sm"
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors.bg }}
            />
            <span className="text-gray-600">{status}</span>
            <span className="font-semibold text-gray-800">{counts[status]}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-white px-3 py-1.5 rounded-full border border-gray-100">
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading...
          </div>
        )}
      </div>

      {/* CALENDAR CARD */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
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
          // Tooltip-style label on hover via event title
          eventDidMount={(info) => {
            info.el.title = info.event.title;
          }}
          eventClick={(info) => {
            navigate(`/admin/facility/booking/${info.event.id}`);
          }}
          // Show time in week/day views
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          // Subtle today highlight
          dayCellClassNames={(arg) =>
            arg.isToday ? ["!bg-blue-50"] : []
          }
          // Refetch when component re-renders with new bookings
          eventContent={(arg) => (
            <div className="px-1 py-0.5 truncate text-xs font-medium">
              {arg.timeText && (
                <span className="opacity-80 mr-1">{arg.timeText}</span>
              )}
              {arg.event.title}
            </div>
          )}
        />
      </div>

      {/* EMPTY STATE */}
      {!loading && bookings.length === 0 && (
        <div className="mt-6 text-center py-10 text-gray-400">
          <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">No bookings yet. Create one to see it on the calendar.</p>
        </div>
      )}

    </div>
  );
};

export default BookingCalendar;