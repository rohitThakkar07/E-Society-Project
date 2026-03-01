import React, { useState } from "react";

const Payments = () => {
  // 1. Mock data for Maintenance Payments
  const [payments, setPayments] = useState([
    { id: "INV-2026-001", unit: "A-101", resident: "Rahul Sharma", amount: 5000, type: "Maintenance - Feb", date: "05 Feb 2026", status: "Paid" },
    { id: "INV-2026-002", unit: "B-205", resident: "Priya Patel", amount: 5000, type: "Maintenance - Feb", date: "10 Feb 2026", status: "Pending" },
    { id: "INV-2026-003", unit: "C-302", resident: "Amit Kumar", amount: 1500, type: "Clubhouse Booking", date: "12 Feb 2026", status: "Paid" },
    { id: "INV-2026-004", unit: "A-102", resident: "Neha Gupta", amount: 10000, type: "Maintenance - Jan & Feb", date: "01 Feb 2026", status: "Overdue" },
  ]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      
      {/* 2. Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Maintenance & Payments</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + Generate Invoice
        </button>
      </div>

      {/* 3. The Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 border-b">
              <th className="p-3 font-semibold">Invoice No.</th>
              <th className="p-3 font-semibold">Unit & Resident</th>
              <th className="p-3 font-semibold">Description</th>
              <th className="p-3 font-semibold">Amount</th>
              <th className="p-3 font-semibold">Due/Paid Date</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b hover:bg-gray-50 transition-colors">
                
                <td className="p-3 text-gray-800 font-medium text-sm">{payment.id}</td>
                
                {/* Stack Unit and Resident Name for easy reading */}
                <td className="p-3">
                  <div className="font-medium text-blue-600">{payment.unit}</div>
                  <div className="text-xs text-gray-500">{payment.resident}</div>
                </td>
                
                <td className="p-3 text-gray-600">{payment.type}</td>
                
                {/* Formatted Amount */}
                <td className="p-3 font-semibold text-gray-800">
                  ₹{payment.amount.toLocaleString('en-IN')}
                </td>
                
                <td className="p-3 text-gray-600 text-sm">{payment.date}</td>

                {/* Dynamic styling for Payment Status */}
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                    payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {payment.status}
                  </span>
                </td>

                {/* Action Buttons */}
                <td className="p-3 flex gap-3 items-center mt-1">
                  {/* If Paid, show Receipt. If Pending/Overdue, show Reminder */}
                  {payment.status === 'Paid' ? (
                     <button className="text-blue-500 hover:text-blue-700 font-medium text-sm border border-blue-200 px-2 py-1 rounded">
                       Receipt
                     </button>
                  ) : (
                    <button className="text-orange-500 hover:text-orange-700 font-medium text-sm border border-orange-200 px-2 py-1 rounded flex items-center gap-1">
                      Remind
                    </button>
                  )}
                  <button className="text-gray-500 hover:text-gray-700 font-medium ml-2">Edit</button>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* 4. Empty State */}
      {payments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No payment records found.
        </div>
      )}

    </div>
  );
};

export default Payments;