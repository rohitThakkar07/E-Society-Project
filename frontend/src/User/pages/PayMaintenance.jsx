import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  X,
  Download,
  Receipt
} from "lucide-react";
import {
  fetchMyMaintenance,
  payMaintenance
} from "../../store/slices/maintainenceSlice";

const PayMaintenance = () => {
  const dispatch = useDispatch();
  const { records, loading } = useSelector((s) => s.maintenance);

  const [selected, setSelected] = useState(null);
  const [payModal, setPayModal] = useState(null);
  const [payMethod, setPayMethod] = useState("UPI");
  const [activeTab, setActiveTab] = useState("pay"); // 🔥 NEW

  useEffect(() => {
    dispatch(fetchMyMaintenance());
  }, [dispatch]);

  const pending =
    (records || []).filter(
      (r) => r.status === "Pending" || r.status === "Overdue"
    ) || [];

  const paid =
    (records || []).filter((r) => r.status === "Paid") || [];

  const totalDue = pending.reduce(
    (sum, r) => sum + (r.amount || 0),
    0
  );

  const handlePay = async () => {
    await dispatch(
      payMaintenance({ id: payModal._id, method: payMethod })
    );
    setPayModal(null);
  };

  const statusConfig = {
    Paid: {
      color: "bg-emerald-100 text-emerald-700",
      icon: <CheckCircle size={13} />
    },
    Pending: {
      color: "bg-amber-100 text-amber-700",
      icon: <Clock size={13} />
    },
    Overdue: {
      color: "bg-red-100 text-red-700",
      icon: <AlertCircle size={13} />
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-2 mb-6">
          <DollarSign size={20} className="text-emerald-500" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Maintenance
            </h1>
            <p className="text-sm text-slate-400">
              Pay and track your maintenance dues
            </p>
          </div>
        </div>

        {/* 🔥 TABS */}
        <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("pay")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === "pay"
                ? "bg-white shadow text-slate-900"
                : "text-slate-500"
            }`}
          >
            Pay Maintenance
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === "history"
                ? "bg-white shadow text-slate-900"
                : "text-slate-500"
            }`}
          >
            History
          </button>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl p-6 text-white">
            <p className="text-slate-400 text-sm mb-1">Total Due</p>
            <p className="text-4xl font-bold">
              ₹{totalDue.toLocaleString()}
            </p>
            <p className="text-slate-400 text-xs mt-2">
              {pending.length} pending
            </p>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
            <p className="text-emerald-600 text-sm">Paid</p>
            <p className="text-3xl font-bold text-emerald-700">
              {paid.length}
            </p>
          </div>

          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
            <p className="text-amber-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-amber-700">
              {pending.length}
            </p>
          </div>
        </div>

        {/* 🔥 PAY TAB */}
        {activeTab === "pay" && (
          <div>
            {pending.length > 0 ? (
              <div className="space-y-3">
                {pending.map((r) => (
                  <div
                    key={r._id}
                    className="bg-white rounded-2xl border p-5 flex justify-between"
                  >
                    <div>
                      <p className="font-semibold">
                        {r.month || "Maintenance"}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          statusConfig[r.status]?.color
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="font-bold">
                        ₹{r.amount}
                      </p>
                      <button
                        onClick={() => setPayModal(r)}
                        className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm"
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-400">
                No pending dues 🎉
              </p>
            )}
          </div>
        )}

        {/* 🔥 HISTORY TAB */}
        {activeTab === "history" && (
          <div>
            {loading ? (
              <p>Loading...</p>
            ) : paid.length ? (
              <div className="bg-white rounded-2xl border overflow-hidden">
                {paid.map((r, i) => (
                  <div
                    key={r._id}
                    className={`flex justify-between px-5 py-4 ${
                      i > 0 ? "border-t" : ""
                    }`}
                  >
                    <div>
                      <p>{r.month}</p>
                      <p className="text-xs text-slate-400">
                        {r.paymentMethod}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <p>₹{r.amount}</p>
                      <Download size={16} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-400">
                No history yet
              </p>
            )}
          </div>
        )}
      </div>

      {/* 🔥 PAY MODAL */}
      {payModal== false && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl w-80">
            <h2 className="font-bold mb-4">Confirm Payment</h2>

            <p className="text-xl mb-4">
              ₹{payModal.amount}
            </p>

            <div className="flex gap-2 mb-4">
              {["UPI", "Card", "Net Banking"].map((m) => (
                <button
                  key={m}
                  onClick={() => setPayMethod(m)}
                  className={`px-3 py-2 rounded ${
                    payMethod === m
                      ? "bg-slate-900 text-white"
                      : "border"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPayModal(null)}
                className="flex-1 border p-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handlePay}
                className="flex-1 bg-emerald-600 text-white p-2 rounded"
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayMaintenance;

