import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVisitorById,
  updateVisitorStatus,
} from "../../../store/slices/visitorSlice";

const VisitorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleVisitor: visitor, loading } = useSelector(
    (state) => state.visitor
  );

  // 🔥 Fetch visitor
  useEffect(() => {
    dispatch(fetchVisitorById(id));
  }, [id, dispatch]);

  // 🔥 Check Out
  const handleCheckOut = () => {
    dispatch(updateVisitorStatus({ id, status: "Exited" }));
  };

  if (loading || !visitor) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading visitor details...
      </div>
    );
  }

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
            <p className="font-semibold">{visitor.visitorName}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Phone</p>
            <p>{visitor.mobileNumber}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Resident</p>
            <p>{visitor.visitingResident?.fullName || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Flat</p>
            <p>{visitor.visitingResident?.flatNumber || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Purpose</p>
            <p>{visitor.purpose || "-"}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Entry Time</p>
            <p>{new Date(visitor.entryTime).toLocaleString()}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Exit Time</p>
            <p>
              {visitor.exitTime
                ? new Date(visitor.exitTime).toLocaleString()
                : "Not Checked Out"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Status</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                visitor.status === "Inside"
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {visitor.status}
            </span>
          </div>

        </div>

        {/* ACTION BUTTON */}
        <div className="flex gap-4 pt-4 border-t">

          {visitor.status === "Inside" && (
            <button
              onClick={handleCheckOut}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Check Out
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

export default VisitorDetails;