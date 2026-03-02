import React, { useState, useMemo } from "react";

const VisitorReports = () => {
  const [filterType, setFilterType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Dummy Data (Replace with API)
  const visitors = [
    {
      id: 1,
      name: "Raj Patel",
      flat: "A-101",
      purpose: "Delivery",
      phone: "9876543210",
      status: "Checked In",
      created_at: "2026-03-01",
    },
    {
      id: 2,
      name: "Aman Shah",
      flat: "B-202",
      purpose: "Delivery",
      phone: "9876500000",
      status: "Checked Out",
      created_at: "2026-03-02",
    },
    {
      id: 3,
      name: "Kunal Mehta",
      flat: "C-303",
      purpose: "Delivery",
      phone: "9898989898",
      status: "Pending",
      created_at: "2026-03-03",
    },
  ];

  // Optimized Filtering
  const filteredVisitors = useMemo(() => {
    let filtered = [...visitors];

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    if (filterType === "today") {
      filtered = filtered.filter(v => v.created_at === todayStr);
    }

    if (filterType === "week") {
      const firstDayOfWeek = new Date(today);
      firstDayOfWeek.setDate(today.getDate() - today.getDay());

      filtered = filtered.filter(v => {
        const visitorDate = new Date(v.created_at);
        return visitorDate >= firstDayOfWeek && visitorDate <= today;
      });
    }

    if (filterType === "month") {
      filtered = filtered.filter(v => {
        const visitorDate = new Date(v.created_at);
        return (
          visitorDate.getMonth() === today.getMonth() &&
          visitorDate.getFullYear() === today.getFullYear()
        );
      });
    }

    if (filterType === "custom" && startDate && endDate) {
      filtered = filtered.filter(v => {
        return v.created_at >= startDate && v.created_at <= endDate;
      });
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter(v => v.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.flat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.phone.includes(searchTerm)
      );
    }

    return filtered;
  }, [filterType, statusFilter, searchTerm, startDate, endDate]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">Visitor Management</h1>

      {/* FILTER SECTION */}
      <div className="bg-white p-5 rounded-xl shadow mb-6 flex flex-wrap gap-4">

        {/* Filter Type */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="custom">Custom Range</option>
        </select>

        {/* Custom Date Range */}
        {filterType === "custom" && (
          <>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-4 py-2 rounded-lg"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-4 py-2 rounded-lg"
            />
          </>
        )}

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="All">All Status</option>
          <option value="Checked In">Checked In</option>
          <option value="Checked Out">Checked Out</option>
          <option value="Pending">Pending</option>
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name, flat, phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded-lg flex-1"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Flat</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Purpose</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredVisitors.map(visitor => (
              <tr key={visitor.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{visitor.name}</td>
                <td className="p-4">{visitor.flat}</td>
                <td className="p-4">{visitor.phone}</td>
                <td className="p-4">{visitor.purpose}</td>
                <td className="p-4">{visitor.created_at}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    visitor.status === "Checked In"
                      ? "bg-green-100 text-green-600"
                      : visitor.status === "Checked Out"
                      ? "bg-gray-200 text-gray-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}>
                    {visitor.status}
                  </span>
                </td>
              </tr>
            ))}

            {filteredVisitors.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No visitors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default VisitorReports;