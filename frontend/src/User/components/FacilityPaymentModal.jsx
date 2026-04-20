import React, { useState, useEffect, useCallback } from "react";
import { X, AlertCircle, CheckCircle, Loader2, Building2 } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../service/api";
import societyConfig from "../../assets/societyConfig";

const RAZORPAY_KEY =
  import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SZ3mYhzzSVN0ov";

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve();
      return;
    }
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
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

export default function FacilityPaymentModal({
  isOpen,
  onClose,
  facilityBookingId,
  summary,
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
      const { data } = await API.post("/payment/facility/verify", {
        facilityBookingId,
        orderId: orderPayload.orderId,
        paymentId: paymentResponse.razorpay_payment_id,
        signature: paymentResponse.razorpay_signature,
      });

      if (!data.success) {
        throw new Error(data.message || "Verification failed");
      }

      setSuccessData(data.data);
      setStep("success");
      toast.success(data.message || "Payment successful!");
      onPaymentSuccess?.(data.data);
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Payment verification failed";
      setError(msg);
      setStep("error");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const openCheckout = (payload) => {
    if (!window.Razorpay) {
      toast.error("Razorpay failed to load.");
      setStep("confirm");
      return;
    }
    const options = {
      key: RAZORPAY_KEY,
      amount: payload.amountInPaise,
      currency: payload.currency || "INR",
      order_id: payload.orderId,
      name: societyConfig.name,
      description: summary?.label || "Facility booking",
      prefill: {
        name: payload.resident?.name || "",
        email: payload.resident?.email || "",
        contact: payload.resident?.phone || "",
      },
      handler: async (response) => {
        await handlePaymentSuccess(response, payload);
      },
      modal: {
        ondismiss: () => {
          setStep("confirm");
          setLoading(false);
        },
      },
      theme: { color: "#4F6EF7" },
    };
    new window.Razorpay(options).open();
  };

  const handleInitiate = async () => {
    if (!facilityBookingId) {
      toast.error("Missing booking reference");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await loadRazorpayScript();
      const { data } = await API.post("/payment/facility/initiate", {
        facilityBookingId,
      });
      if (!data.success) throw new Error(data.message || "Init failed");
      setStep("processing");
      openCheckout(data.data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Could not start payment";
      setError(msg);
      setStep("error");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const amt = summary?.amount ?? 0;

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center p-4"
      style={{ background: "color-mix(in srgb, var(--text) 45%, transparent)" }}
    >
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[var(--border)] bg-[var(--accent)]/10">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center shrink-0">
              <Building2 size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-black text-[var(--text)] truncate">Pay facility booking</h2>
              <p className="text-[11px] text-[var(--text-muted)]">Razorpay secure checkout</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--bg-alt)] text-[var(--text-muted)]"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          {step === "confirm" && (
            <>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] p-4 mb-4">
                <p className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Amount</p>
                <p className="text-3xl font-black text-[var(--accent)]">
                  ₹{Number(amt).toLocaleString("en-IN")}
                </p>
                {summary?.lines?.map((line, i) => (
                  <p key={i} className="text-xs text-[var(--text-muted)] mt-1">
                    {line}
                  </p>
                ))}
              </div>
              <button
                type="button"
                onClick={handleInitiate}
                disabled={loading}
                className="user-btn-primary w-full justify-center min-h-[48px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Starting…
                  </>
                ) : (
                  "Pay Now"
                )}
              </button>
            </>
          )}

          {step === "processing" && (
            <div className="text-center py-8">
              <Loader2 className="mx-auto animate-spin text-[var(--accent)] mb-3" size={40} />
              <p className="font-semibold text-[var(--text)]">Complete payment in the popup</p>
            </div>
          )}

          {step === "success" && successData?.payment && (
            <div className="text-center py-4">
              <CheckCircle className="mx-auto text-emerald-500 mb-3" size={48} />
              <p className="font-black text-[var(--text)] mb-4">Payment received</p>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Admin will approve your booking. You can track status under My bookings.
              </p>
              <button type="button" onClick={onClose} className="user-btn-primary w-full justify-center">
                Done
              </button>
            </div>
          )}

          {step === "error" && (
            <div className="text-center py-4">
              <AlertCircle className="mx-auto text-red-500 mb-3" size={48} />
              <p className="text-sm text-[var(--text-muted)] mb-4">{error}</p>
              <button type="button" onClick={() => reset()} className="user-btn-primary w-full justify-center">
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
