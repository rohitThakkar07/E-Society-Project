import React, { useState, useEffect, useCallback } from "react";
import { X, AlertCircle, CheckCircle, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../service/api";

const RAZORPAY_KEY =
  import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SZ3mYhzzSVN0ov";

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve();
      return;
    }
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay")));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });
}

/**
 * Razorpay checkout for maintenance bills.
 * Uses shared API client (correct base URL + auth) → POST /payment/initiate, /payment/verify.
 */
export default function RazorpayPaymentModal({
  isOpen,
  onClose,
  maintenanceId,
  billDetails,
  onPaymentSuccess,
}) {
  const [step, setStep] = useState("confirm");
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState(null);

  const reset = useCallback(() => {
    setStep("confirm");
    setLoading(false);
    setSuccessData(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  const handlePaymentSuccess = async (paymentResponse, orderPayload) => {
    try {
      setLoading(true);
      const { data } = await API.post("/payment/verify", {
        maintenanceId,
        orderId: orderPayload.orderId,
        paymentId: paymentResponse.razorpay_payment_id,
        signature: paymentResponse.razorpay_signature,
      });

      if (!data.success) {
        throw new Error(data.message || "Payment verification failed");
      }

      setSuccessData(data.data);
      setStep("success");
      toast.success(data.message || "Payment successful!");
      onPaymentSuccess?.(data.data);
    } catch (err) {
      console.error("Payment verification error:", err);
      const msg =
        err.response?.data?.message || err.message || "Payment verification failed";
      setError(msg);
      setStep("error");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const openRazorpayCheckout = (data) => {
    if (!window.Razorpay) {
      toast.error("Razorpay failed to load. Refresh and try again.");
      setStep("confirm");
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: data.amountInPaise,
      currency: data.currency || "INR",
      order_id: data.orderId,
      name: "E-Society",
      description: `Maintenance ${data.billDetails?.month || ""} ${data.billDetails?.year || ""}`.trim(),
      prefill: {
        name: data.resident?.name || "",
        email: data.resident?.email || "",
        contact: data.resident?.phone || "",
      },
      handler: async (response) => {
        await handlePaymentSuccess(response, data);
      },
      modal: {
        ondismiss: () => {
          setStep("confirm");
          setLoading(false);
        },
      },
      theme: { color: "#4F6EF7" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleInitiatePayment = async () => {
    if (!maintenanceId) {
      toast.error("Missing bill reference.");
      return;
    }
    try {
      setLoading(true);
      setError(null);

      await loadRazorpayScript();

      const { data } = await API.post("/payment/initiate", { maintenanceId });
      if (!data.success) {
        throw new Error(data.message || "Failed to create order");
      }

      const payload = data.data;
      setStep("processing");
      openRazorpayCheckout(payload);
    } catch (err) {
      console.error("Payment initiation error:", err);
      const msg =
        err.response?.data?.message || err.message || "Failed to initiate payment";
      setError(msg);
      setStep("error");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const totalDisplay = billDetails?.amount ?? 0;

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6"
      style={{
        background: "color-mix(in srgb, var(--text) 45%, transparent)",
      }}
    >
      <div
        className="bg-[var(--card)] text-[var(--text)] rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border border-[var(--border)] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pay-modal-title"
      >
        {/* Header */}
        <div className="relative shrink-0 border-b border-[var(--border)] bg-gradient-to-r from-[var(--accent)]/12 via-transparent to-[var(--accent)]/8 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 pr-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white shadow-md shrink-0">
                  <ShieldCheck size={18} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <h2
                    id="pay-modal-title"
                    className="text-lg font-black text-[var(--text)] tracking-tight leading-tight"
                  >
                    Pay maintenance
                  </h2>
                  <p className="text-[11px] font-semibold text-[var(--text-muted)] mt-0.5 truncate">
                    Secured by Razorpay
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 p-2 rounded-xl hover:bg-[var(--bg-alt)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors -mr-1 -mt-0.5"
              aria-label="Close"
            >
              <X size={22} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {step === "confirm" && (
            <div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-alt)] p-5 mb-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Amount due
                </p>
                <p className="text-3xl sm:text-4xl font-black text-[var(--accent)] tabular-nums">
                  ₹{Number(totalDisplay).toLocaleString("en-IN")}
                </p>
                {billDetails?.month != null && (
                  <p className="text-sm font-semibold text-[var(--text)] mt-2">
                    {billDetails.month} {billDetails.year}
                  </p>
                )}
              </div>

              <div className="space-y-0 mb-5 rounded-xl border border-[var(--border)] overflow-hidden text-sm">
                <div className="flex justify-between px-4 py-3 bg-[var(--bg-alt)]/50">
                  <span className="text-[var(--text-muted)]">Base</span>
                  <span className="font-bold tabular-nums">
                    ₹{Number(billDetails?.baseAmount ?? 0).toLocaleString("en-IN")}
                  </span>
                </div>
                {Number(billDetails?.lateFee) > 0 && (
                  <div className="flex justify-between px-4 py-3 border-t border-[var(--border)]">
                    <span className="text-[var(--text-muted)]">Late fee</span>
                    <span className="font-bold text-red-600 tabular-nums">
                      ₹{Number(billDetails.lateFee).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between px-4 py-3 border-t border-[var(--border)] bg-[var(--accent)]/10">
                  <span className="font-bold">Total</span>
                  <span className="font-black text-[var(--accent)] tabular-nums">
                    ₹{Number(totalDisplay).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleInitiatePayment}
                disabled={loading}
                className="user-btn-primary w-full justify-center min-h-[48px] text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin shrink-0" />
                    Opening checkout…
                  </>
                ) : (
                  "Pay with Razorpay"
                )}
              </button>
              <p className="text-center text-[11px] text-[var(--text-muted)] mt-3">
                Test mode: use Razorpay test cards / UPI from the dashboard.
              </p>
            </div>
          )}

          {step === "processing" && (
            <div className="text-center py-10">
              <Loader2
                size={44}
                className="mx-auto text-[var(--accent)] animate-spin mb-4"
              />
              <p className="font-bold text-[var(--text)]">Complete payment in the popup</p>
              <p className="text-sm text-[var(--text-muted)] mt-2">
                Do not close this page until you finish or cancel in Razorpay.
              </p>
            </div>
          )}

          {step === "success" && successData?.payment && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={36} className="text-emerald-600" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-black text-[var(--text)] mb-1">Payment successful</h3>
              <p className="text-sm text-[var(--text-muted)] mb-5">
                Your maintenance bill is marked paid.
              </p>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] p-4 text-left space-y-2 text-sm mb-5">
                <div className="flex justify-between gap-2">
                  <span className="text-[var(--text-muted)]">Receipt</span>
                  <span className="font-mono font-bold text-emerald-700 text-right break-all">
                    {successData.payment.receiptNumber}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[var(--text-muted)]">Paid</span>
                  <span className="font-bold tabular-nums">
                    ₹{Number(successData.payment.amount).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <button type="button" onClick={onClose} className="user-btn-primary w-full justify-center">
                Done
              </button>
            </div>
          )}

          {step === "error" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={36} className="text-red-600" />
              </div>
              <h3 className="text-lg font-black text-[var(--text)] mb-2">Something went wrong</h3>
              <p className="text-sm text-[var(--text-muted)] mb-5">{error}</p>
              <button
                type="button"
                onClick={() => {
                  reset();
                }}
                className="user-btn-primary w-full justify-center"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
