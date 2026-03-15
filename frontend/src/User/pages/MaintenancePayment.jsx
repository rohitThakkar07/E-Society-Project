import React from "react";

const MaintenancePayment = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Maintenance Payment
      </h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Monthly Charge</p>
          <h2 className="text-xl font-semibold mt-1">₹2,500</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Due Amount</p>
          <h2 className="text-xl font-semibold mt-1 text-red-600">₹5,000</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Last Payment</p>
          <h2 className="text-xl font-semibold mt-1">Jan 2026</h2>
        </div>
      </div>

      {/* Payment Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Pay Maintenance</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Flat Number"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            placeholder="Amount"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Select Month</option>
            <option>January</option>
            <option>February</option>
            <option>March</option>
          </select>

          <select className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Payment Method</option>
            <option>UPI</option>
            <option>Card</option>
            <option>Net Banking</option>
          </select>
        </div>

        <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
          Pay Now
        </button>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <h2 className="text-lg font-semibold mb-4">Payment History</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-2">Month</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">January 2026</td>
              <td>₹2,500</td>
              <td className="text-green-600 font-medium">Paid</td>
              <td>05 Jan 2026</td>
            </tr>

            <tr>
              <td className="py-2">December 2025</td>
              <td>₹2,500</td>
              <td className="text-green-600 font-medium">Paid</td>
              <td>04 Dec 2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenancePayment;