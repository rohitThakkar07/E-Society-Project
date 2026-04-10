import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../../../store/slices/facilityBookingSlice";

// ── Safe helpers: API returns populated objects OR plain IDs ────────────────

// facility is populated → { _id, name, location } OR a plain string fallback
const getFacilityName = (facility) => {
  if (!facility) return "—";
  if (typeof facility === "object") return facility.name || "—";
  return facility;
};

// resident is populated → { _id, name, flatNumber } OR plain string
const getResidentLabel = (resident) => {
  if (!resident) return "—";
  if (typeof resident === "object") {
    const name = resident.name || "";
    const flat = resident.flatNumber || resident.flat || "";
    return [name, flat].filter(Boolean).join(" — ") || "—";
  }
  return resident;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ── Status badge colours ────────────────────────────────────────────────────
const statusStyle = {
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-600",
  Pending:  "bg-yellow-100 text-yellow-700",
  Cancelled:"bg-gray-100 text-gray-500",
};

const BookingList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { bookings, loading } = useSelector((state) => state.booking);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [facilityFilter, setFacilityFilter] = useState("All");

  // Fetch from API on mount
  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  // Build unique facility names for the filter dropdown (from populated data)
  const facilityNames = [
    ...new Set(
      bookings
        .map((b) => getFacilityName(b.facility))
        .filter((n) => n !== "—")
    ),
  ];

  // Filter logic
  const filtered = bookings.filter((b) => {
    const residentLabel = getResidentLabel(b.resident).toLowerCase();
    const facilityName  = getFacilityName(b.facility);

    const matchSearch   = residentLabel.includes(search.toLowerCase());
    const matchStatus   = statusFilter === "All" || b.status === statusFilter;
    const matchFacility = facilityFilter === "All" || facilityName === facilityFilter;

    return matchSearch && matchStatus && matchFacility;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking List</h1>
          <p className="text-gray-500 text-sm">Manage all facility bookings</p>
        </div>
        <button
          onClick={() => navigate("/admin/facility/book")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          + New Booking
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by resident or flat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm w-full sm:w-64 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={facilityFilter}
          onChange={(e) => setFacilityFilter(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Facilities</option>
          {facilityNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Active filter count badge */}
        {(search || statusFilter !== "All" || facilityFilter !== "All") && (
          <button
            onClick={() => { setSearch(""); setStatusFilter("All"); setFacilityFilter("All"); }}
            className="text-xs text-red-500 hover:text-red-700 border border-red-100 bg-red-50 px-3 py-2 rounded-lg transition"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resident</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Facility</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              // Loading skeleton rows
              [...Array(4)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length > 0 ? (
              filtered.map((booking, index) => (
                <tr key={booking._id} className="hover:bg-gray-50 transition-colors">

                  {/* Row number */}
                  <td className="px-5 py-4 text-gray-400 text-xs">{index + 1}</td>

                  {/* Resident — safely extract from populated object */}
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">
                      {getResidentLabel(booking.resident)}
                    </p>
                  </td>

                  {/* Facility — safely extract from populated object */}
                  <td className="px-5 py-4 text-gray-600">
                    {getFacilityName(booking.facility)}
                  </td>

                  {/* Booking Date */}
                  <td className="px-5 py-4 text-gray-600">
                    {formatDate(booking.bookingDate)}
                  </td>

                  {/* Time Slot */}
                  <td className="px-5 py-4 text-gray-600 font-mono text-xs">
                    {booking.startTime && booking.endTime
                      ? `${booking.startTime} – ${booking.endTime}`
                      : "—"}
                  </td>

                  {/* Booking Status Badge */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        statusStyle[booking.status] || "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {booking.status || "—"}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => navigate(`/admin/facility/booking/${booking._id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                    >
                      View
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-sm">No bookings found</p>
                    {(search || statusFilter !== "All" || facilityFilter !== "All") && (
                      <p className="text-xs">Try adjusting your filters</p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {bookings.length} bookings
          </div>
        )}
      </div>

    </div>
  );
};

export default BookingList;