import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MaintenanceDetails = () => {
  const navigate = useNavigate();

  const [maintenance, setMaintenance] = useState({
    id: 1,
    resident: "Flat A-101",
    ownerName: "Rohit Sharma",
    month: "March 2026",
    amount: 2000,
    lateFee: 100,
    dueDate: "2026-03-10",
    status: "Pending",
    paymentHistory: [
      { date: "2026-03-05", amount: 1000, mode: "UPI" },
      { date: "2026-03-08", amount: 900, mode: "Cash" },
    ],
  });

  const totalPaid = maintenance.paymentHistory.reduce(
    (acc, item) => acc + item.amount,
    0
  );

  const totalAmount = maintenance.amount + maintenance.lateFee;

  const remaining = totalAmount - totalPaid;

  // ✅ Auto Mark as Paid
  const handleMarkAsPaid = () => {
    if (remaining <= 0) {
      setMaintenance({ ...maintenance, status: "Paid" });
    } else {
      alert("Full payment not completed!");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Maintenance Details</h1>
        <p className="text-gray-500">
          Detailed information of selected maintenance record
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-xl shadow p-6 space-y-6">

        {/* BASIC INFO */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 text-sm">Resident</p>
            <p className="font-semibold">{maintenance.resident}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Owner Name</p>
            <p className="font-semibold">{maintenance.ownerName}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Month</p>
            <p className="font-semibold">{maintenance.month}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Due Date</p>
            <p className="font-semibold">{maintenance.dueDate}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Total Amount</p>
            <p className="font-semibold text-blue-600">₹{totalAmount}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Total Paid</p>
            <p className="font-semibold text-green-600">₹{totalPaid}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Remaining Amount</p>
            <p className="font-semibold text-red-600">₹{remaining}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Status</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                maintenance.status === "Paid"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {maintenance.status}
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-4 pt-4 border-t">

          {/* Invoice Button */}
          <button
            onClick={() => navigate('/InvoiceGenerator')}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Generate Invoice
          </button>

          {/* Receipt Button (Only if Paid) */}
          {maintenance.status === "Paid" && (
            <button
              onClick={() => navigate('/ReceiptGenerator')}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Generate Receipt
            </button>
          )}

          {/* Mark as Paid Button */}
          {maintenance.status !== "Paid" && (
            <button
              onClick={handleMarkAsPaid}
              className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* PAYMENT HISTORY */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Payment History</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payment Mode</th>
              </tr>
            </thead>

            <tbody>
              {maintenance.paymentHistory.map((payment, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{payment.date}</td>
                  <td className="p-3 text-green-600 font-medium">
                    ₹{payment.amount}
                  </td>
                  <td className="p-3">{payment.mode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default MaintenanceDetails;