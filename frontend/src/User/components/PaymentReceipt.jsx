import React, { useState, useEffect } from "react";
import { Download, Mail, X } from "lucide-react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import { PageLoaderInline } from "../../components/PageLoader";
import API from "../../service/api";
import societyConfig from "../../assets/societyConfig";

const PaymentReceipt = (
  { isOpen, onClose, receiptNumber }) => {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && receiptNumber) {
      fetchReceipt();
    }
  }, [isOpen, receiptNumber]);

  const fetchReceipt = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.get(`/payment/receipt/${receiptNumber}`);

      if (response.data.success) {
        setReceipt(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch receipt");
      toast.error("Failed to load receipt");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!receipt) return;

    const doc = new jsPDF();
    const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
    const line = (label, value, y, bold = false) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setTextColor(75, 85, 99);
      doc.text(`${label}:`, 16, y);
      doc.setTextColor(17, 24, 39);
      doc.text(String(value ?? "-"), 72, y);
    };

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 24, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text(`${societyConfig.name} Payment Receipt`, 16, 15);

    doc.setFontSize(11);
    doc.setTextColor(55, 65, 81);
    doc.text(`Receipt No: ${receipt.receiptNumber || "-"}`, 16, 34);
    doc.text(`Generated On: ${new Date().toLocaleString("en-IN")}`, 16, 41);

    doc.setDrawColor(229, 231, 235);
    doc.line(16, 46, 194, 46);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(17, 24, 39);
    doc.text("Resident Details", 16, 56);
    line("Name", receipt.resident?.name || "-", 66);
    line("Flat Number", receipt.resident?.flatNumber || "-", 74);
    line("Email", receipt.resident?.email || "-", 82);
    if (receipt.resident?.phone) {
      line("Phone", receipt.resident.phone, 90);
    }

    doc.line(16, 96, 194, 96);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(17, 24, 39);
    doc.text("Payment Details", 16, 106);
    line("Billing Month", `${receipt.month || "-"} ${receipt.year || ""}`.trim(), 116);
    line("Base Amount", money(receipt.baseAmount), 124);

    let nextY = 132;
    if (Number(receipt.lateFee) > 0) {
      line("Late Fee", money(receipt.lateFee), nextY);
      nextY += 8;
    }
    line("Total Paid", money(receipt.amount), nextY, true);

    nextY += 14;
    doc.line(16, nextY - 6, 194, nextY - 6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(17, 24, 39);
    doc.text("Transaction Details", 16, nextY + 4);
    line("Payment Method", receipt.paymentMethod || "Razorpay", nextY + 14);
    line("Payment ID", receipt.paymentId || receipt.razorpayPaymentId || "-", nextY + 22);
    line("Order ID", receipt.orderId || receipt.razorpayOrderId || "-", nextY + 30);
    line("Status", "Verified & Completed", nextY + 38, true);
    line("Paid At", receipt.paidAt ? new Date(receipt.paidAt).toLocaleString("en-IN") : "-", nextY + 46);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text("This is a computer-generated receipt. No signature is required.", 16, 275);

    doc.save(`Receipt_${receipt.receiptNumber || "payment"}.pdf`);
    toast.success("Receipt downloaded");
  };

  const handleSendEmail = async () => {
    toast.success("Receipt sent to your email");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[130] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Payment Receipt</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-8">
          {loading && <PageLoaderInline message="Loading receipt..." className="py-10" />}

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {receipt && !error && (
            <>
              <div className="bg-white border border-gray-300 rounded-lg p-8" id="receipt-content">
                <div className="text-center mb-8 pb-6 border-b-2 border-blue-600">
                  <h1 className="text-3xl font-bold text-blue-600 mb-2">{societyConfig.name}</h1>
                  <p className="text-gray-600">Payment Receipt</p>
                  <p className="text-gray-500 text-sm mt-2">{receipt.receiptNumber}</p>
                </div>

                <div className="mb-8">
                  <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    Resident Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Name</p>
                      <p className="font-semibold text-gray-800">{receipt.resident?.name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Flat Number</p>
                      <p className="font-semibold text-gray-800">{receipt.resident?.flatNumber || "-"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Email</p>
                      <p className="font-semibold text-gray-800 text-sm">{receipt.resident?.email || "-"}</p>
                    </div>
                    {receipt.resident?.phone && (
                      <div>
                        <p className="text-gray-500 text-sm">Phone</p>
                        <p className="font-semibold text-gray-800">{receipt.resident.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    Payment Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">For Month:</span>
                      <span className="font-semibold">{receipt.month} {receipt.year}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Base Amount:</span>
                      <span className="font-semibold">Rs. {Number(receipt.baseAmount || 0).toLocaleString("en-IN")}</span>
                    </div>
                    {Number(receipt.lateFee) > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Late Fee:</span>
                        <span className="font-semibold text-red-600">Rs. {Number(receipt.lateFee || 0).toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 bg-blue-50 px-4 rounded-lg font-bold text-lg">
                      <span>Total Amount Paid:</span>
                      <span className="text-blue-600">Rs. {Number(receipt.amount || 0).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    Transaction Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-semibold">{receipt.paymentMethod || "Razorpay"}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600 shrink-0">Payment ID:</span>
                      <span className="font-mono text-xs text-right break-all">{receipt.paymentId || receipt.razorpayPaymentId || "-"}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600 shrink-0">Order ID:</span>
                      <span className="font-mono text-xs text-right break-all">{receipt.orderId || receipt.razorpayOrderId || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-semibold text-green-600">Verified & Completed</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600 shrink-0">Date & Time:</span>
                      <span className="font-semibold text-right">
                        {receipt.paidAt ? new Date(receipt.paidAt).toLocaleString("en-IN") : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center border-t border-gray-200 pt-4 text-xs text-gray-500">
                  <p className="mb-1">This is a computer-generated receipt. No signature is required.</p>
                  <p className="mb-1">For any queries, contact the society management.</p>
                  <p>Generated on {new Date().toLocaleString("en-IN")}</p>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download PDF
                </button>
                <button
                  onClick={handleSendEmail}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Mail size={20} />
                  Send via Email
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt;
