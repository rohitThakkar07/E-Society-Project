import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMaintenanceById,
  markAsPaid,
  addPayment,
  clearSingleRecord,
} from "../../../../store/slices/maintainenceSlice";

const STATUS_STYLE = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Overdue: "bg-red-100 text-red-600",
};

const Field = ({ label, children }) => (
  <div>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
    <div className="font-medium text-gray-800">{children || "—"}</div>
  </div>
);

const MaintenanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleRecord: maintenance, loading } = useSelector((s) => s.maintenance);

  // Payment modal state
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMode, setPayMode] = useState("Cash");
  const [payTxn, setPayTxn] = useState("");

  useEffect(() => {
    if (id) dispatch(fetchMaintenanceById(id));
    return () => dispatch(clearSingleRecord());
  }, [id, dispatch]);

  if (loading && !maintenance) {
    return (
      <div className="p-6 min-h-screen bg-gray-100 flex items-center justify-center">
        <svg className="w-8 h-8 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  if (!maintenance) {
    return (
      <div className="p-6 text-center text-gray-400">
        <p className="mb-2">Record not found.</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 underline text-sm">← Go back</button>
      </div>
    );
  }

  const totalDue = maintenance.amount + (maintenance.lateFee || 0) + (maintenance.escalationCharge || 0);
  const totalPaid = (maintenance.paymentHistory || []).reduce((s, p) => s + p.amount, 0);
  const remaining = Math.max(0, totalDue - totalPaid);

  const handleMarkPaid = () => {
dispatch(markAsPaid({ id, notes: "Manual payment" }));
  };
  
  const handleAddPayment = () => {
    if (!payAmount || Number(payAmount) <= 0) return;
    dispatch(addPayment({
      id,
      amount: Number(payAmount),
      mode: payMode,
      transactionId: payTxn
    }));
    setShowPayModal(false);
    setPayAmount(""); setPayMode("Cash"); setPayTxn("");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Details</h1>
          <p className="text-sm text-gray-500">Detailed maintenance record</p>
        </div>
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      {/* DETAIL CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400" />

        <div className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">

            {/* resident is populated { flatNumber, name } */}
            <Field label="Flat / Resident">
              {maintenance.resident?.flatNumber || maintenance.resident?.name || "—"}
            </Field>

            <Field label="Month / Year">
              {maintenance.month} {maintenance.year}
            </Field>

            <Field label="Due Date">
              {maintenance.dueDate
                ? new Date(maintenance.dueDate).toLocaleDateString("en-IN", {
                  day: "2-digit", month: "long", year: "numeric",
                })
                : "—"}
            </Field>

            <Field label="Status">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_STYLE[maintenance.status] || "bg-gray-100"}`}>
                {maintenance.status}
              </span>
            </Field>

            <Field label="Maintenance Amount">
              ₹{(maintenance.amount || 0).toLocaleString()}
            </Field>

            <Field label="Late Fee">
              ₹{(maintenance.lateFee || 0).toLocaleString()}
            </Field>

            {(maintenance.escalationCharge || 0) > 0 && (
              <Field label="Escalation Charge">
                <span className="text-red-600">₹{maintenance.escalationCharge.toLocaleString()}</span>
              </Field>
            )}

            <Field label="Total Due">
              <span className="text-blue-600 font-semibold text-lg">
                ₹{totalDue.toLocaleString()}
              </span>
            </Field>

            <Field label="Remaining">
              <span className={remaining > 0 ? "text-red-600 font-semibold text-lg" : "text-green-600 font-semibold text-lg"}>
                ₹{remaining.toLocaleString()}
              </span>
            </Field>

            {maintenance.escalationLevel > 0 && (
              <Field label="Escalation Level">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  maintenance.escalationLevel >= 3 ? 'bg-purple-100 text-purple-700' :
                  maintenance.escalationLevel >= 2 ? 'bg-red-100 text-red-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  Level {maintenance.escalationLevel}
                  {maintenance.escalationLevel === 1 && ' — Extra charge applied'}
                  {maintenance.escalationLevel === 2 && ' — Defaulter'}
                  {maintenance.escalationLevel === 3 && ' — Admin notified'}
                </span>
              </Field>
            )}

            {maintenance.isDefaulter && (
              <Field label="Defaulter Status">
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                  ⚠ Marked as Defaulter
                </span>
              </Field>
            )}

            {maintenance.gracePeriodEnds && maintenance.status !== 'Paid' && (
              <Field label="Grace Period Ends">
                {new Date(maintenance.gracePeriodEnds).toLocaleDateString("en-IN", {
                  day: "2-digit", month: "long", year: "numeric",
                })}
              </Field>
            )}

            {maintenance.description && (
              <div className="md:col-span-2">
                <Field label="Description">{maintenance.description}</Field>
              </div>
            )}

          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="px-6 md:px-8 pb-4">
          <p className="text-xs text-gray-400 mb-1">
            Payment progress — ₹{totalPaid.toLocaleString()} of ₹{totalDue.toLocaleString()} paid
          </p>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalPaid / totalDue) * 100).toFixed(0)}%` }}
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        {maintenance.status !== "Paid" && (
          <div className="flex flex-wrap gap-3 px-6 md:px-8 py-5 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => setShowPayModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
            >
              Add Payment
            </button>
            <button
              onClick={handleMarkPaid}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
            >
              Mark as Paid
            </button>
            <button
              onClick={() => navigate(`/admin/maintenance/${id}/invoice`)}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold transition"
            >
              Generate Invoice
            </button>
          </div>
        )}

        {maintenance.status === "Paid" && (
          <div className="flex flex-wrap gap-3 px-6 md:px-8 py-5 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => navigate(`/admin/maintenance/${id}/invoice`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
            >
              Generate Invoice
            </button>
            <button
              onClick={() => navigate(`/admin/maintenance/${id}/receipt`)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
            >
              Generate Receipt
            </button>
          </div>
        )}
      </div>

      {/* PAYMENT HISTORY */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Payment History</h2>
        {(maintenance.paymentHistory || []).length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Mode</th>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {maintenance.paymentHistory.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(p.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-green-600 font-medium">₹{p.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600">{p.mode}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{p.transactionId || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">No payments recorded yet.</p>
        )}
      </div>

      {/* ADD PAYMENT MODAL */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder={`Max ₹${remaining.toLocaleString()}`}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Payment Mode *
                </label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Transaction ID (optional)
                </label>
                <input
                  type="text"
                  value={payTxn}
                  onChange={(e) => setPayTxn(e.target.value)}
                  placeholder="e.g. TXN123456"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPayModal(false)}
                className="flex-1 px-4 py-2.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPayment}
                disabled={!payAmount || Number(payAmount) <= 0}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg"
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MaintenanceDetails;