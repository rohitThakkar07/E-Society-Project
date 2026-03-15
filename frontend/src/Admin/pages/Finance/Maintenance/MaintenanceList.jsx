import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MaintenanceList = () => {
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("All");
  const navigate = useNavigate();
  // Dummy Data (Replace with API later)
  const maintenanceData = [
    { id: 1, resident: "Flat A-101", month: "March", amount: 2000, status: "Paid" },
    { id: 2, resident: "Flat B-202", month: "March", amount: 2000, status: "Pending" },
    { id: 3, resident: "Flat C-303", month: "February", amount: 2000, status: "Paid" },
    { id: 4, resident: "Flat D-404", month: "January", amount: 2000, status: "Pending" },
  ];

  // Filter Logic
  const filteredData = maintenanceData.filter((item) => {
    const matchesSearch = item.resident
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesMonth =
      monthFilter === "All" || item.month === monthFilter;

    return matchesSearch && matchesMonth;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Maintenance List</h1>
          <p className="text-gray-500">Track and manage payments</p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by Flat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="All">All Months</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Resident</th>
              <th className="p-4">Month</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium">{item.resident}</td>
                  <td className="p-4">{item.month}</td>
                  <td className="p-4">₹{item.amount.toLocaleString()}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === "Paid"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="text-blue-600 hover:underline mr-3" onClick={()=>navigate(`/maintenance/${item.id}`)}>
                      View
                    </button>
                    <button className="text-green-600 hover:underline" onClick={
                      ()=>{
                        navigate(`/maintenance/${item.id}/invoice`)
                      }
                    }>
                      Generate Invoice
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default MaintenanceList;