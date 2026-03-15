import React from "react";

const MyInvoice = () => {
  const invoices = [
    {
      id: "INV-001",
      month: "January 2026",
      amount: 2500,
      status: "Paid",
      date: "05 Jan 2026",
    },
    {
      id: "INV-002",
      month: "February 2026",
      amount: 2500,
      status: "Unpaid",
      date: "Pending",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        My Invoices
      </h1>

      {/* Invoice Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">{invoice.month}</h2>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  invoice.status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {invoice.status}
              </span>
            </div>

            <p className="text-gray-500 text-sm">Invoice ID</p>
            <p className="font-medium mb-2">{invoice.id}</p>

            <p className="text-gray-500 text-sm">Amount</p>
            <p className="font-semibold text-xl mb-2">₹{invoice.amount}</p>

            <p className="text-gray-500 text-sm">Date</p>
            <p className="mb-4">{invoice.date}</p>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                View
              </button>
              <button className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300">
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Invoice Preview (Optional Section) */}
      <div className="bg-white rounded-xl shadow p-6 mt-10">
        <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <p><span className="font-medium">Flat No:</span> A-102</p>
          <p><span className="font-medium">Resident:</span> Rohit</p>
          <p><span className="font-medium">Maintenance:</span> ₹2000</p>
          <p><span className="font-medium">Water Charges:</span> ₹300</p>
          <p><span className="font-medium">Parking:</span> ₹200</p>
          <p><span className="font-medium">Total:</span> ₹2500</p>
        </div>

        <div className="mt-6">
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyInvoice;