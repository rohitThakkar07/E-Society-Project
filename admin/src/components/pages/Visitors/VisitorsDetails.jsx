import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VisitorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy Data (Replace with API later)
  const [visitor, setVisitor] = useState({
    id,
    name: "Raj Patel",
    phone: "9876543210",
    flat: "A-101",
    purpose: "Delivery",
    vehicleNumber: "GJ01AB1234",
    entryTime: "10:30 AM",
    exitTime: null,
    status: "Checked In", // Pending | Checked In | Checked Out | Blocked
    approvedBy: "Guard - Amit",
  });

  const handleCheckOut = () => {
    setVisitor({
      ...visitor,
      status: "Checked Out",
      exitTime: new Date().toLocaleTimeString(),
    });
  };

  const handleBlock = () => {
    setVisitor({
      ...visitor,
      status: "Blocked",
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Visitor Details</h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Back
        </button>
      </div>

      {/* DETAILS CARD */}
      <div className="bg-white rounded-xl shadow p-6 space-y-6">

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="font-semibold">{visitor.name}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Phone</p>
            <p>{visitor.phone}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Flat</p>
            <p>{visitor.flat}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Purpose</p>
            <p>{visitor.purpose}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Vehicle Number</p>
            <p>{visitor.vehicleNumber || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Approved By</p>
            <p>{visitor.approvedBy}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Entry Time</p>
            <p>{visitor.entryTime}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Exit Time</p>
            <p>{visitor.exitTime || "Not Checked Out"}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Status</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                visitor.status === "Checked In"
                  ? "bg-green-100 text-green-600"
                  : visitor.status === "Checked Out"
                  ? "bg-gray-200 text-gray-600"
                  : visitor.status === "Blocked"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {visitor.status}
            </span>
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-4 pt-4 border-t">

          {visitor.status === "Checked In" && (
            <button
              onClick={handleCheckOut}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Check Out
            </button>
          )}

          {visitor.status !== "Blocked" && (
            <button
              onClick={handleBlock}
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Block Visitor
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

export default VisitorDetails;