import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DollarSign,
  CheckCircle,
  Clock,
  Download,
} from "lucide-react";
import { fetchMyMaintenance } from "../../store/slices/maintenanceSlice";
import { fetchPaymentHistory } from "../../store/slices/paymentSlice";
import RazorpayPaymentModal from "../components/RazorpayPaymentModal";

function formatPaymentMethod(m) {
  if (m == null || m === "") return "—";
  const x = String(m).toLowerCase();
  if (x === "upi") return "UPI";
  if (x === "card") return "Card";
  if (x === "netbanking") return "Net Banking";
  if (x === "wallet") return "Wallet";
  if (x === "emandate") return "E-Mandate";
  return String(m);
}

const PayMaintenance = () => {
  const dispatch = useDispatch();

  const { list: records = [] } = useSelector((s) => s.maintenance || {});
  const myPayments = useSelector((s) => s.payment?.history || []);

  const [paymentModalData, setPaymentModalData] = useState({
    isOpen: false,
    maintenanceId: null,
    billDetails: null,
  });
  const [activeTab, setActiveTab] = useState("pay");

  useEffect(() => {
    dispatch(fetchMyMaintenance());
    dispatch(fetchPaymentHistory());
  }, [dispatch]);

  const pending = useMemo(
    () =>
      (records || []).filter((r) =>
        ["pending", "overdue"].includes(String(r?.status || "").toLowerCase())
      ),
    [records]
  );

  const paid = useMemo(
    () =>
      (records || []).filter(
        (r) => String(r?.status || "").toLowerCase() === "paid"
      ),
    [records]
  );

  const totalDue = pending.reduce(
    (sum, r) => sum + (r.amount || 0) + (r.lateFee || 0),
    0
  );

  const openPayModal = (record) => {
    setPaymentModalData({
      isOpen: true,
      maintenanceId: record._id,
      billDetails: {
        amount: (record.amount || 0) + (record.lateFee || 0),
        baseAmount: record.amount || 0,
        lateFee: record.lateFee || 0,
        month: record.month,
        year: record.year,
      },
    });
  };

  const closePayModal = () => {
    setPaymentModalData({
      isOpen: false,
      maintenanceId: null,
      billDetails: null,
    });
  };

  const statusConfig = {
    paid: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    overdue: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-100">
            <DollarSign size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Maintenance
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Pay dues with Razorpay and view history
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-3xl p-6 text-white shadow-xl relative overflow-hidden bg-gradient-to-br from-[var(--accent)] to-indigo-700">
            <div className="relative z-10">
              <p className="text-slate-200/90 text-xs font-bold uppercase tracking-widest mb-2">
                Total outstanding
              </p>
              <p className="text-4xl font-black">₹{totalDue.toLocaleString("en-IN")}</p>
              <div className="mt-4 flex items-center gap-2 text-slate-200/80 text-xs">
                <Clock size={12} /> {pending.length} bill{pending.length !== 1 ? "s" : ""}{" "}
                pending
              </div>
            </div>
            <DollarSign className="absolute -right-4 -bottom-4 text-slate-900/20 w-32 h-32" />
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
              Bills paid
            </p>
            <p className="text-3xl font-extrabold text-emerald-600">{paid.length}</p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
              Pending
            </p>
            <p className="text-3xl font-extrabold text-amber-500">{pending.length}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
          {["pay", "history"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all uppercase tracking-tight ${
                activeTab === t
                  ? "bg-white shadow-md text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t === "pay" ? "Outstanding" : "Payment history"}
            </button>
          ))}
        </div>

        {activeTab === "pay" && (
          <div className="space-y-4">
            {pending.length > 0 ? (
              pending.map((r) => (
                <div
                  key={r._id}
                  className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-500 font-bold shrink-0">
                      {r.month?.substring(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800">
                        {r.month} {r.year}
                      </p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase inline-block mt-1 ${
                          statusConfig[r?.status?.toLowerCase()] || "bg-slate-100"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-black text-slate-900 tabular-nums">
                        ₹{(r.amount + (r.lateFee || 0)).toLocaleString("en-IN")}
                      </p>
                      {r.lateFee > 0 && (
                        <p className="text-[10px] text-red-500 font-bold">
                          Includes ₹{r.lateFee} late fee
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => openPayModal(r)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-indigo-100 whitespace-nowrap"
                    >
                      Pay with Razorpay
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <CheckCircle size={48} className="mx-auto text-emerald-200 mb-4" />
                <p className="text-slate-500 font-bold">All dues are cleared.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            {myPayments.length ? (
              <div className="divide-y divide-slate-50">
                {myPayments.map((p) => (
                  <div
                    key={p._id}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-6 py-5 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                        <CheckCircle size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800">
                          {p.maintenance?.month} {p.maintenance?.year}
                        </p>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">
                          {formatPaymentMethod(p.paymentMethod)} •{" "}
                          {p.paidAt
                            ? new Date(p.paidAt).toLocaleDateString()
                            : "—"}{" "}
                          • {p.receiptNumber || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 pl-14 sm:pl-0">
                      <p className="font-black text-slate-900 tabular-nums">
                        ₹{(p.totalAmount ?? 0).toLocaleString("en-IN")}
                      </p>
                      <button
                        type="button"
                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-slate-100"
                        title="Download (coming soon)"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400 font-bold">
                No payment history yet.
              </div>
            )}
          </div>
        )}
      </div>

      <RazorpayPaymentModal
        isOpen={paymentModalData.isOpen}
        onClose={closePayModal}
        maintenanceId={paymentModalData.maintenanceId}
        billDetails={paymentModalData.billDetails}
        onPaymentSuccess={() => {
          dispatch(fetchMyMaintenance());
          dispatch(fetchPaymentHistory());
        }}
      />
    </div>
  );
};

export default PayMaintenance;
