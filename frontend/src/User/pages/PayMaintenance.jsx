import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DollarSign, CheckCircle, Clock, X, Download,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { fetchMyMaintenance } from "../../store/slices/maintenanceSlice";
import {
  initiatePayment,
  addPayment,           
  fetchPaymentHistory,  
  clearIntent,
  selectIntent,
  selectInitiating,
  selectConfirming,     
  selectConfirmError,
  selectLastReceipt,
  selectHistory,        
} from "../../store/slices/paymentSlice";

const PAYMENT_METHODS = ["UPI", "Card", "Net Banking", "Cash"];

const PayMaintenance = () => {
  const dispatch = useDispatch();

  const { list: records = [] } = useSelector((s) => s.maintenance || {});
  const intent       = useSelector(selectIntent);
  const initiating   = useSelector(selectInitiating);
  const confirming   = useSelector(selectConfirming);
  const confirmError = useSelector(selectConfirmError);
  const lastReceipt  = useSelector(selectLastReceipt);
  const myPayments   = useSelector(selectHistory);       // ✅ fixed

  const [payModal,  setPayModal]  = useState(null);
  const [payMethod, setPayMethod] = useState("UPI");
  const [activeTab, setActiveTab] = useState("pay");
  const [step,      setStep]      = useState("select"); // "select" | "processing" | "success"

  useEffect(() => {
    dispatch(fetchMyMaintenance());
    dispatch(fetchPaymentHistory());  // ✅ fixed
  }, [dispatch]);

  // Show confirm error as toast + go back to select step
  useEffect(() => {
    if (confirmError) {
      toast.error(confirmError);
      setStep("select"); // go back so user can retry
    }
  }, [confirmError]);

  // When receipt arrives → move to success step
  useEffect(() => {
    if (lastReceipt) {
      setStep("success");
      dispatch(fetchMyMaintenance());
      dispatch(fetchPaymentHistory()); // refresh history
    }
  }, [lastReceipt, dispatch]);

  const pending = useMemo(() =>
    (records || []).filter((r) => ["pending", "overdue"].includes(r?.status?.toLowerCase())),
    [records]
  );

  const paid = useMemo(() =>
    (records || []).filter((r) => r?.status?.toLowerCase() === "paid"),
    [records]
  );

  const totalDue = pending.reduce((sum, r) => sum + (r.amount || 0) + (r.lateFee || 0), 0);

  // Step 1: open modal + get payment intent
  const handleOpenPayModal = async (record) => {
    setPayModal(record);
    setStep("select");
    setPayMethod("UPI");
    dispatch(clearIntent());

    const result = await dispatch(initiatePayment(record._id));
    if (initiatePayment.rejected.match(result)) {
      toast.error(result.payload || "Could not initiate payment");
      setPayModal(null);
    }
  };

  const handleCloseModal = () => {
    setPayModal(null);
    setStep("select");
    dispatch(clearIntent());
  };

  // Step 2: confirm payment
  const handleConfirmPay = async () => {
    if (!payModal || !intent) return;
    setStep("processing");

    await dispatch(addPayment({                      // ✅ was: confirmPayment
      maintenanceId:   payModal._id,
      paymentMethod:   payMethod,
      paymentIntentId: intent.paymentIntentId,
    }));
  };

  const statusConfig = {
    paid:    "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    overdue: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-100">
            <DollarSign size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Maintenance</h1>
            <p className="text-sm text-slate-500 font-medium">Pay dues and view history</p>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Outstanding</p>
              <p className="text-4xl font-black">₹{totalDue.toLocaleString()}</p>
              <div className="mt-4 flex items-center gap-2 text-slate-400 text-xs">
                <Clock size={12} /> {pending.length} bills remaining
              </div>
            </div>
            <DollarSign className="absolute -right-4 -bottom-4 text-slate-800 w-32 h-32" />
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Bills Paid</p>
            <p className="text-3xl font-extrabold text-emerald-600">{paid.length}</p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Pending</p>
            <p className="text-3xl font-extrabold text-amber-500">{pending.length}</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
          {["pay", "history"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all uppercase tracking-tight ${
                activeTab === t ? "bg-white shadow-md text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t === "pay" ? "Outstanding" : "Payment History"}
            </button>
          ))}
        </div>

        {/* OUTSTANDING */}
        {activeTab === "pay" && (
          <div className="space-y-4">
            {pending.length > 0 ? pending.map((r) => (
              <div key={r._id} className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-500 font-bold">
                    {r.month?.substring(0, 3)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{r.month} {r.year}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusConfig[r?.status?.toLowerCase()] || "bg-slate-100"}`}>
                      {r.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">₹{(r.amount + (r.lateFee || 0)).toLocaleString()}</p>
                    {r.lateFee > 0 && <p className="text-[10px] text-red-500 font-bold">+ ₹{r.lateFee} Late Fee</p>}
                  </div>
                  <button
                    onClick={() => handleOpenPayModal(r)}
                    disabled={initiating && payModal?._id === r._id}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                  >
                    {initiating && payModal?._id === r._id ? "Loading..." : "Pay"}
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <CheckCircle size={48} className="mx-auto text-emerald-200 mb-4" />
                <p className="text-slate-500 font-bold">All dues are cleared. Great job!</p>
              </div>
            )}
          </div>
        )}

        {/* HISTORY */}
        {activeTab === "history" && (
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            {myPayments.length ? (
              <div className="divide-y divide-slate-50">
                {myPayments.map((p) => (
                  <div key={p._id} className="flex justify-between items-center px-6 py-5 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                        <CheckCircle size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">
                          {p.maintenance?.month} {p.maintenance?.year}
                        </p>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">
                          via {p.paymentMethod} • {new Date(p.paidAt).toLocaleDateString()} • {p.receiptNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-black text-slate-900">₹{p.totalAmount?.toLocaleString()}</p>
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400 font-bold">No payment history found.</div>
            )}
          </div>
        )}
      </div>

      {/* PAY MODAL */}
      {Boolean(payModal) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl">

            {/* SELECT METHOD */}
            {step === "select" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-black text-xl text-slate-800">Checkout</h2>
                  <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600"><X /></button>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                  <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">
                    Payable for {payModal.month} {payModal.year}
                  </p>
                  <p className="text-3xl font-black text-slate-900">
                    ₹{((payModal.amount || 0) + (payModal.lateFee || 0)).toLocaleString()}
                  </p>
                  {payModal.lateFee > 0 && (
                    <p className="text-xs text-red-500 mt-1">Includes ₹{payModal.lateFee} late fee</p>
                  )}
                </div>

                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block ml-1">
                  Select Method
                </label>
                <div className="grid grid-cols-1 gap-2 mb-8">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setPayMethod(m)}
                      className={`px-4 py-3 rounded-xl flex items-center justify-between text-sm font-bold transition-all ${
                        payMethod === m
                          ? "bg-slate-900 text-white"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {m}
                      {payMethod === m && <CheckCircle size={14} />}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleConfirmPay}
                  disabled={!intent || initiating}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                >
                  {initiating ? "Preparing..." : `Pay ₹${((payModal.amount || 0) + (payModal.lateFee || 0)).toLocaleString()}`}
                </button>
              </>
            )}

            {/* PROCESSING */}
            {step === "processing" && (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6" />
                <h2 className="font-black text-xl text-slate-800 mb-2">Processing Payment</h2>
                <p className="text-slate-400 text-sm">Please wait, do not close this window...</p>
              </div>
            )}

            {/* SUCCESS */}
            {step === "success" && lastReceipt && (
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={36} className="text-emerald-600" />
                </div>
                <h2 className="font-black text-xl text-slate-800 mb-1">Payment Successful!</h2>
                <p className="text-slate-400 text-sm mb-6">Your maintenance has been paid.</p>

                <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2 mb-6 border border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Receipt No.</span>
                    <span className="font-bold text-slate-800">{lastReceipt.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Transaction ID</span>
                    <span className="font-bold text-slate-800 text-xs">{lastReceipt.transactionId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Method</span>
                    <span className="font-bold text-slate-800">{payMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Date</span>
                    <span className="font-bold text-slate-800">
                      {new Date(lastReceipt.paidAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="w-full bg-slate-900 text-white py-3 rounded-2xl font-bold"
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default PayMaintenance;