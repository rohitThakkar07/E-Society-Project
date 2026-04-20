import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DollarSign,
  CheckCircle,
  Clock,
  Download,
  Sparkles,
  Receipt,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { fetchMyMaintenance } from "../../store/slices/maintenanceSlice";
import { fetchPaymentHistory } from "../../store/slices/paymentSlice";
import RazorpayPaymentModal from "../components/RazorpayPaymentModal";
import PaymentReceipt from "../components/PaymentReceipt";

function formatPaymentMethod(m) {
  if (m == null || m === "") return "-";
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
  const [receiptModal, setReceiptModal] = useState({
    isOpen: false,
    receiptNumber: null,
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

  const totalDue = pending.reduce((sum, r) => sum + (r.amount || 0) + (r.lateFee || 0), 0);
  const totalPaid = myPayments.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const latestPayment = myPayments[0];

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

  const openReceiptModal = (receiptNumber) => {
    if (!receiptNumber) return;
    setReceiptModal({ isOpen: true, receiptNumber });
  };

  const statusConfig = {
    paid: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    overdue: "bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse",
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] p-4 text-[var(--text)] transition-all duration-300 md:p-8">
      <div className="mx-auto max-w-5xl m-12">
        
        {/* Header Section with Glass Effect & Glow */}
        <section className="group relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8 transition-all duration-500 hover:shadow-[0_0_50px_rgba(16,185,129,0.1)]">
          <div className="absolute -right-12 top-0 h-48 w-48 rounded-full bg-emerald-400/10 blur-[80px] group-hover:bg-emerald-400/20 transition-all duration-700" />
          <div className="absolute left-1/3 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-indigo-400/5 blur-[80px]" />
          
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] backdrop-blur">
                <Sparkles size={13} className="text-emerald-500 animate-spin-slow" />
                Smart payments
              </div>
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 group-hover:scale-110 transition-transform duration-500">
                  <DollarSign size={28} />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl">Payments</h1>
              </div>
              <p className="max-w-xl text-sm font-medium leading-relaxed text-[var(--text-muted)] opacity-80">
                Pay dues, track receipts, and stay on top of your monthly society maintenance.
              </p>
              
              {latestPayment && (
                <button
                  type="button"
                  onClick={() => openReceiptModal(latestPayment.receiptNumber)}
                  className="group/btn mt-6 inline-flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-5 py-3 text-sm font-black text-[var(--text)] shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-500/30 active:scale-95"
                >
                  <Receipt size={18} className="text-emerald-500 group-hover/btn:rotate-12 transition-transform" />
                  <span className="max-w-[150px] truncate">Recent: {latestPayment.receiptNumber}</span>
                  <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                </button>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Outstanding", value: `₹${totalDue.toLocaleString()}`, tone: "text-rose-500 border-rose-500/20" },
                { label: "Bills Paid", value: paid.length, tone: "text-emerald-500 border-emerald-500/20" },
                { label: "Pending", value: pending.length, tone: "text-amber-500 border-amber-500/20" },
                { label: "Total Paid", value: `₹${totalPaid.toLocaleString()}`, tone: "text-sky-500 border-sky-500/20" },
              ].map((item) => (
                <div key={item.label} className="group/stat rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className={`mb-2 text-[9px] font-black uppercase tracking-widest ${item.tone}`}>{item.label}</div>
                  <div className="text-lg font-black text-[var(--text)]">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Switcher with Animation */}
        <div className="mt-8 inline-flex rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-1.5 shadow-sm">
          {["pay", "history"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`rounded-xl px-7 py-3 text-[11px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 ${
                activeTab === t 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {t === "pay" ? `Outstanding (${pending.length})` : `History (${myPayments.length})`}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <div className="mt-8 transition-all duration-500">
          {activeTab === "pay" ? (
            <div className="space-y-4">
              {pending.length > 0 ? (
                pending.map((r) => (
                  <div
                    key={r._id}
                    className="group relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/5"
                  >
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-5">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--bg)] text-xl font-black text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                          {r.month?.substring(0, 3)}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-black text-[var(--text)]">{r.month} {r.year}</h3>
                            <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${statusConfig[r?.status?.toLowerCase()] || "bg-slate-100"}`}>
                              {r.status}
                            </span>
                          </div>
                          <div className="mt-2 flex gap-4 text-xs font-bold text-[var(--text-muted)]">
                            <span>Base: ₹{r.amount?.toLocaleString()}</span>
                            {r.lateFee > 0 && <span className="text-rose-500">Late Fee: ₹{r.lateFee.toLocaleString()}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 sm:items-end">
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60">Total Amount</p>
                          <p className="text-3xl font-black text-[var(--text)]">₹{(r.amount + (r.lateFee || 0)).toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => openPayModal(r)}
                          className="group/pay inline-flex items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-8 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-95"
                        >
                          Pay Now
                          <ArrowRight size={16} className="group-hover/pay:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[3rem] border-2 border-dashed border-[var(--border)] bg-[var(--card)] py-24 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-xl font-black text-[var(--text)]">All Clear!</h3>
                  <p className="mt-2 text-[var(--text-muted)] opacity-70">No outstanding maintenance bills for you.</p>
                </div>
              )}
            </div>
          ) : (
            /* History Section */
            <div className="overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] shadow-sm">
              {myPayments.length ? (
                <div className="divide-y divide-[var(--border)]">
                  {myPayments.map((p) => (
                    <div
                      key={p._id}
                      className="group flex flex-col gap-5 px-8 py-6 transition-all hover:bg-[var(--bg)] sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-5">
                        <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                          <CheckCircle size={22} />
                        </div>
                        <div>
                          <p className="text-lg font-black text-[var(--text)]">{p.maintenance?.month} {p.maintenance?.year}</p>
                          <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60">
                            {formatPaymentMethod(p.paymentMethod)} • {p.receiptNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-6 pl-16 sm:pl-0">
                        <div className="text-right">
                          <p className="text-xl font-black text-[var(--text)]">₹{p.totalAmount?.toLocaleString()}</p>
                          <p className="text-[10px] font-bold text-[var(--text-muted)]">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : ""}</p>
                        </div>
                        <button
                          onClick={() => openReceiptModal(p.receiptNumber)}
                          className="rounded-xl bg-[var(--bg)] p-3 text-[var(--text-muted)] transition-all hover:bg-indigo-600 hover:text-white hover:shadow-lg active:scale-90"
                          title="Download Receipt"
                        >
                          <Download size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center">
                  <AlertCircle size={48} className="mx-auto mb-4 text-[var(--border)]" />
                  <h3 className="text-xl font-black text-[var(--text)]">No records</h3>
                  <p className="mt-2 text-[var(--text-muted)]">Your payment history will appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>
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

      <PaymentReceipt
        isOpen={receiptModal.isOpen}
        onClose={() => setReceiptModal({ isOpen: false, receiptNumber: null })}
        receiptNumber={receiptModal.receiptNumber}
      />
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PayMaintenance;