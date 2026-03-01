import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BookingList = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [facilityFilter, setFacilityFilter] = useState("All");

  // Dummy Data (Replace with API later)
  const bookingData = [
    {
      id: 1,
      resident: "Flat A-101",
      facility: "Hall",
      date: "2026-03-10",
      status: "Pending",
      payment: "Unpaid",
    },
    {
      id: 2,
      resident: "Flat B-202",
      facility: "Gym",
      date: "2026-03-12",
      status: "Approved",
      payment: "Paid",
    },
    {
      id: 3,
      resident: "Flat C-303",
      facility: "Swimming Pool",
      date: "2026-03-15",
      status: "Rejected",
      payment: "Unpaid",
    },
  ];

  // Filter Logic
  const filteredBookings = bookingData.filter((booking) => {
    const matchesSearch = booking.resident
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || booking.status === statusFilter;

    const matchesFacility =
      facilityFilter === "All" ||
      booking.facility === facilityFilter;

    return matchesSearch && matchesStatus && matchesFacility;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Booking List</h1>
          <p className="text-gray-500">Manage all facility bookings</p>
        </div>

        <button
          onClick={() => navigate("/facility/book")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          New Booking
        </button>
      </div>

      {/* FILTER SECTION */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4">

        <input
          type="text"
          placeholder="Search by resident..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full sm:w-64"
        />

        <select
          value={facilityFilter}
          onChange={(e) => setFacilityFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="All">All Facilities</option>
          <option value="Gym">Gym</option>
          <option value="Hall">Hall</option>
          <option value="Swimming Pool">Swimming Pool</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Resident</th>
              <th className="p-4">Facility</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">
                    {booking.resident}
                  </td>
                  <td className="p-4">{booking.facility}</td>
                  <td className="p-4">{booking.date}</td>

                  {/* Status Badge */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : booking.status === "Rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  {/* Payment Badge */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.payment === "Paid"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {booking.payment}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        navigate(`/facility/booking/${booking.id}`)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default BookingList;