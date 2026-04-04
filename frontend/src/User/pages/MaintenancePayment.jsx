import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  Download,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import RazorpayPaymentModal from "../components/RazorpayPaymentModal";
import PaymentReceipt from "../components/PaymentReceipt";

const MaintenancePayment = () => {
  const [activeTab, setActiveTab] = useState("pending"); // pending, paid
  const [bills, setBills] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, maintenanceId: null, billDetails: null });
  const [receiptModal, setReceiptModal] = useState({ isOpen: false, receiptNumber: null });
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    fetchBillsAndPayments();
  }, []);

  const fetchBillsAndPayments = async () => {
    try {
      setLoading(true);

      // Fetch maintenance bills
      const billsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/maintenance/my-bills`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (billsResponse.data.success) {
        setBills(billsResponse.data.data || []);
      }

      // Fetch payment history
      const paymentResponse = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/payment/my-history`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (paymentResponse.data.success) {
        setPaymentHistory(paymentResponse.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  const getPendingBills = () => {
    return bills.filter((bill) => bill.status !== "Paid");
  };

  const getPaidBills = () => {
    return bills.filter((bill) => bill.status === "Paid");
  };

  const getTotalDueAmount = () => {
    return getPendingBills().reduce((sum, bill) => sum + (bill.amount + (bill.lateFee || 0)), 0);
  };

  const handleOpenPaymentModal = (bill) => {
    setSelectedBill(bill);
    setPaymentModal({
      isOpen: true,
      maintenanceId: bill._id,
      billDetails: {
        month: bill.month,
        year: bill.year,
        baseAmount: bill.amount,
        lateFee: bill.lateFee || 0,
        amount: bill.amount + (bill.lateFee || 0),
      },
    });
  };

  const handlePaymentSuccess = (response) => {
    toast.success("Payment completed successfully!");
    setPaymentModal({ isOpen: false, maintenanceId: null, billDetails: null });
    
    // Refresh data
    fetchBillsAndPayments();

    // Show receipt
    if (response.payment?.receiptNumber) {
      setTimeout(() => {
        setReceiptModal({
          isOpen: true,
          receiptNumber: response.payment.receiptNumber,
        });
      }, 1000);
    }
  };

  const handleViewReceipt = (payment) => {
    setReceiptModal({
      isOpen: true,
      receiptNumber: payment.receiptNumber,
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Maintenance Payments
          </h1>
          <p className="text-gray-600">Manage your monthly maintenance charges and payments</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          
          {/* Total Due */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-md border border-red-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-red-600 text-sm font-semibold">Amount Due</p>
                <h2 className="text-3xl font-bold text-red-700 mt-2">
                  ₹{getTotalDueAmount().toLocaleString("en-IN")}
                </h2>
                <p className="text-red-600 text-xs mt-2">
                  {getPendingBills().length} pending bill{getPendingBills().length !== 1 ? "s" : ""}
                </p>
              </div>
              <AlertCircle size={32} className="text-red-600" />
            </div>

          </div>

          {/* Total Paid */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-md border border-green-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-green-600 text-sm font-semibold">Total Paid</p>
                <h2 className="text-3xl font-bold text-green-700 mt-2">
                  ₹{paymentHistory.reduce((sum, p) => sum + (p.totalAmount || 0), 0).toLocaleString("en-IN")}
                </h2>
                <p className="text-green-600 text-xs mt-2">
                  {paymentHistory.length} successful payment{paymentHistory.length !== 1 ? "s" : ""}
                </p>
              </div>
              <CheckCircle size={32} className="text-green-600" />
            </div>
          </div>

          {/* Last Payment */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md border border-blue-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-600 text-sm font-semibold">Last Payment</p>
                <h2 className="text-2xl font-bold text-blue-700 mt-2">
                  {paymentHistory.length > 0
                    ? new Date(paymentHistory[0].paidAt).toLocaleDateString("en-IN")
                    : "No payment yet"}
                </h2>
                <p className="text-blue-600 text-xs mt-2">
                  {paymentHistory.length > 0 ? paymentHistory[0].receiptNumber : ""}
                </p>
              </div>
              <Clock size={32} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "pending"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
            }`}
          >
            Pending Bills ({getPendingBills().length})
          </button>
          <button
            onClick={() => setActiveTab("paid")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "paid"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
            }`}
          >
            Paid Bills ({getPaidBills().length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "history"
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
            }`}
          >
            Payment History ({paymentHistory.length})
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-gray-600">Loading payment data...</p>
          </div>
        )}

        {/* Pending Bills */}
        {!loading && activeTab === "pending" && (
          <div className="space-y-4">
            {getPendingBills().length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
                <p className="text-gray-600 font-semibold">All bills are paid!</p>
                <p className="text-gray-500 text-sm">No pending maintenance charges</p>
              </div>
            ) : (
              getPendingBills().map((bill) => (
                <div
                  key={bill._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border-l-4 border-red-500"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          {bill.month} {bill.year}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            bill.status === "Overdue"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {bill.status === "Overdue" ? "⚠️ Overdue" : "Pending"}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">
                        {bill.description || "Monthly maintenance charge"}
                      </p>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Base Amount</p>
                          <p className="font-bold text-gray-800">₹{bill.amount.toLocaleString("en-IN")}</p>
                        </div>
                        {bill.lateFee > 0 && (
                          <div>
                            <p className="text-gray-500">Late Fee</p>
                            <p className="font-bold text-red-600">
                              ₹{bill.lateFee.toLocaleString("en-IN")}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-500">Total Due</p>
                          <p className="font-bold text-blue-600">
                            ₹{(bill.amount + (bill.lateFee || 0)).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenPaymentModal(bill)}
                      className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2"
                    >
                      Pay Now
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Paid Bills */}
        {!loading && activeTab === "paid" && (
          <div className="space-y-4">
            {getPaidBills().length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 font-semibold">No paid bills yet</p>
                <p className="text-gray-500 text-sm">Your paid bills will appear here</p>
              </div>
            ) : (
              getPaidBills().map((bill) => (
                <div
                  key={bill._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border-l-4 border-green-500"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          {bill.month} {bill.year}
                        </h3>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          ✓ Paid
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">
                        Paid on {new Date(bill.paidDate).toLocaleDateString("en-IN")}
                      </p>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Amount Paid</p>
                          <p className="font-bold text-green-600">
                            ₹{(bill.amount + (bill.lateFee || 0)).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Payment Method</p>
                          <p className="font-bold text-gray-800">
                            {bill.paymentHistory?.[bill.paymentHistory.length - 1]?.mode || "Razorpay"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Receipt</p>
                          <p className="font-mono text-xs font-semibold text-blue-600">
                            {bill.paymentHistory?.[bill.paymentHistory.length - 1]?.transactionId?.slice(0, 12)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const payment = paymentHistory.find(
                          (p) => p.maintenance?._id === bill._id
                        );
                        if (payment) {
                          handleViewReceipt(payment);
                        }
                      }}
                      className="ml-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition flex items-center gap-2"
                    >
                      <Eye size={18} />
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Payment History */}
        {!loading && activeTab === "history" && (
          <div className="space-y-4">
            {paymentHistory.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 font-semibold">No payment history</p>
                <p className="text-gray-500 text-sm">Your payment history will appear here</p>
              </div>
            ) : (
              paymentHistory.map((payment) => (
                <div
                  key={payment._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border-l-4 border-green-500"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          {payment.maintenance?.month} {payment.maintenance?.year}
                        </h3>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          ✓ {payment.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">
                        Paid on {new Date(payment.paidAt).toLocaleString("en-IN")}
                      </p>

                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Amount</p>
                          <p className="font-bold text-gray-800">
                            ₹{payment.totalAmount.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Method</p>
                          <p className="font-bold text-gray-800">{payment.paymentMethod || "Razorpay"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Receipt No.</p>
                          <p className="font-mono text-xs font-semibold text-blue-600">
                            {payment.receiptNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Payment ID</p>
                          <p className="font-mono text-xs font-semibold text-blue-600">
                            {payment.razorpayPaymentId?.slice(0, 12)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewReceipt(payment)}
                      className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2"
                    >
                      <Download size={18} />
                      Receipt
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Razorpay Payment Modal */}
      <RazorpayPaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, maintenanceId: null, billDetails: null })}
        maintenanceId={paymentModal.maintenanceId}
        billDetails={paymentModal.billDetails}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Payment Receipt Modal */}
      <PaymentReceipt
        isOpen={receiptModal.isOpen}
        onClose={() => setReceiptModal({ isOpen: false, receiptNumber: null })}
        receiptNumber={receiptModal.receiptNumber}
      />
    </div>
  );
};

export default MaintenancePayment;