import React, { useState, useEffect } from "react";
import { X, AlertCircle, CheckCircle, Loader } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const RazorpayPaymentModal = ({ 
  isOpen, 
  onClose, 
  maintenanceId, 
  billDetails, 
  onPaymentSuccess 
}) => {
  const [step, setStep] = useState("confirm"); // confirm, processing, success, error
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);

  // Initialize Razorpay script
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Step 1: Initiate payment - Create Razorpay order
  const handleInitiatePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
      const response = await axios.post(
        `${apiUrl}/api/payment/initiate`,
        { maintenanceId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create order");
      }

      const data = response.data.data;
      setOrderId(data.orderId);
      setPaymentDetails(data);
      setStep("processing");

      // Open Razorpay Checkout
      openRazorpayCheckout(data);
    } catch (err) {
      console.error("Payment initiation error:", err);
      setError(err.response?.data?.message || err.message || "Failed to initiate payment");
      setStep("error");
      toast.error(err.response?.data?.message || "Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Open Razorpay Checkout Modal
  const openRazorpayCheckout = (data) => {
    const options = {
      key: "rzp_test_SZ3mYhzzSVN0ov", // Razorpay Key ID
      amount: data.amountInPaise, // Amount in paise
      currency: data.currency,
      order_id: data.orderId,
      
      // Pre-fill customer details
      prefill: {
        name: data.resident.name,
        email: data.resident.email,
        contact: data.resident.phone,
      },

      // Callback on payment success
      handler: async (response) => {
        await handlePaymentSuccess(response, data);
      },

      // Callback on payment failure/error
      modal: {
        ondismiss: () => {
          setStep("confirm");
          toast.error("Payment cancelled");
        },
      },

      // Themes
      theme: {
        color: "#3b82f6", // Blue theme to match your design
      },
    };

    // Create Razorpay instance and open checkout
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  // Step 3: Handle payment success - Verify signature
  const handlePaymentSuccess = async (paymentResponse, orderData) => {
    try {
      setLoading(true);

      // Send payment verification to backend
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
      const response = await axios.post(
        `${apiUrl}/api/payment/verify`,
        {
          maintenanceId,
          orderId: orderData.orderId,
          paymentId: paymentResponse.razorpay_payment_id,
          signature: paymentResponse.razorpay_signature,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Payment verification failed");
      }

      // Payment successful
      setStep("success");
      toast.success("Payment successful!");

      // Call callback to refresh data
      if (onPaymentSuccess) {
        onPaymentSuccess(response.data.data);
      }

      // Auto close modal after 3 seconds
      setTimeout(() => {
        onClose();
        setStep("confirm");
      }, 3000);
    } catch (err) {
      console.error("Payment verification error:", err);
      setError(err.response?.data?.message || err.message || "Payment verification failed");
      setStep("error");
      toast.error(err.response?.data?.message || "Payment verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[130] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Payment Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Confirm Step */}
          {step === "confirm" && (
            <div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl mb-6">
                <p className="text-gray-600 text-sm mb-2">Amount to Pay</p>
                <h1 className="text-4xl font-bold text-blue-600 mb-2">
                  ₹{billDetails?.amount?.toLocaleString("en-IN") || "0"}
                </h1>
                <p className="text-gray-600 text-xs">
                  {billDetails?.month} {billDetails?.year}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Base Amount</span>
                  <span className="font-semibold">₹{billDetails?.baseAmount?.toLocaleString("en-IN") || "0"}</span>
                </div>
                {billDetails?.lateFee > 0 && (
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Late Fee</span>
                    <span className="font-semibold text-red-600">₹{billDetails?.lateFee?.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 bg-blue-50 px-3 rounded-lg">
                  <span className="text-gray-800 font-semibold">Total Amount</span>
                  <span className="font-bold text-blue-600">₹{billDetails?.amount?.toLocaleString("en-IN") || "0"}</span>
                </div>
              </div>

              <button
                onClick={handleInitiatePayment}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Pay with Razorpay"
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                🔒 Payments are secured by Razorpay
              </p>
            </div>
          )}

          {/* Processing Step */}
          {step === "processing" && (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Loader size={48} className="text-blue-600 animate-spin" />
              </div>
              <p className="text-gray-800 font-semibold">Processing Payment...</p>
              <p className="text-gray-500 text-sm mt-2">Please complete the payment in the popup</p>
            </div>
          )}

          {/* Success Step */}
          {step === "success" && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle size={48} className="text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Successful</h3>
              <p className="text-gray-600 text-sm mb-4">
                Your payment has been verified and accepted
              </p>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
                <p className="text-xs text-gray-600 mb-1">Receipt Number</p>
                <p className="font-mono text-sm font-bold text-green-600">
                  {paymentDetails?.receiptNumber}
                </p>
              </div>
              <p className="text-xs text-gray-500">Closing in a moment...</p>
            </div>
          )}

          {/* Error Step */}
          {step === "error" && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-4 rounded-full">
                  <AlertCircle size={48} className="text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Failed</h3>
              <p className="text-gray-600 text-sm mb-4">{error}</p>
              <button
                onClick={() => {
                  setStep("confirm");
                  setError(null);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-gray-500 text-center">
            This is a test payment gateway. No real money will be debited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPaymentModal;
