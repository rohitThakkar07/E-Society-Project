import React, { useState, useEffect } from "react";
import axios from "axios";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: "", query: "", startDate: "", endDate: "" });

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/payment/list`, {
        params: {
          status: filters.status || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setPayments(res.data.data || []);
      } else {
        setError(res.data.message || "Unable to load payments");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filters.status, filters.startDate, filters.endDate]);

  const filteredPayments = payments.filter((payment) => {
    const q = filters.query.trim().toLowerCase();
    if (!q) return true;
    const residentName = `${payment.resident?.firstName || ""} ${payment.resident?.lastName || ""}`.trim().toLowerCase();
    return (
      (payment.receiptNumber || "").toLowerCase().includes(q) ||
      residentName.includes(q) ||
      (payment.resident?.flatNumber || "").toLowerCase().includes(q) ||
      (payment.razorpayOrderId || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* 2. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Maintenance & Payments</h2>
          <p className="text-sm text-gray-500 mt-1">View all payments, search and filter across residents.</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* 3. Filters */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <input
          value={filters.query}
          onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
          placeholder="Search by invoice, resident, flat or order" 
          className="w-full border p-2 rounded-lg outline-none focus:border-blue-500"
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          className="w-full border p-2 rounded-lg outline-none focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option value="successful">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
          className="w-full border p-2 rounded-lg outline-none focus:border-blue-500"
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
          className="w-full border p-2 rounded-lg outline-none focus:border-blue-500"
        />
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading payments...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 border-b">
                <th className="p-3 font-semibold">Receipt</th>
                <th className="p-3 font-semibold">Resident</th>
                <th className="p-3 font-semibold">Unit</th>
                <th className="p-3 font-semibold">Amount</th>
                <th className="p-3 font-semibold">Method</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Paid Date</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-gray-800 font-medium text-sm">{payment.receiptNumber || payment._id}</td>
                    <td className="p-3">
                      <div className="font-medium text-blue-600">{payment.resident?.firstName} {payment.resident?.lastName}</div>
                      <div className="text-xs text-gray-500">{payment.resident?.email || payment.resident?.mobile}</div>
                    </td>
                    <td className="p-3 text-gray-600">{payment.resident?.flatNumber || "N/A"}</td>
                    <td className="p-3 font-semibold text-gray-800">₹{(payment.totalAmount || 0).toLocaleString("en-IN")}</td>
                    <td className="p-3 text-gray-600">{payment.paymentMethod || "Razorpay"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'successful' ? 'bg-green-100 text-green-700' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        payment.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600 text-sm">{payment.paidAt ? new Date(payment.paidAt).toLocaleString("en-IN") : "N/A"}</td>
                    <td className="p-3 flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700 text-xs font-medium border border-blue-200 px-2 py-1 rounded">Receipt</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500">No payments match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payments;