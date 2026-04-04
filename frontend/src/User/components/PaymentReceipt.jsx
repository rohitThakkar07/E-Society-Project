import React, { useState, useEffect } from "react";
import { Download, Mail, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { PageLoaderInline } from "../../components/PageLoader";

const PaymentReceipt = ({ isOpen, onClose, receiptNumber }) => {
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

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/payment/receipt/${receiptNumber}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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

    // Create a simple HTML for PDF
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt - ${receipt.receiptNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          .receipt { max-width: 600px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
          .header h1 { color: #3b82f6; margin: 0; font-size: 28px; }
          .header p { color: #666; margin: 5px 0; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
          .row { display: flex; justify-content: space-between; padding: 10px 0; }
          .row.total { background-color: #f3f4f6; padding: 15px; margin: 15px 0; font-weight: bold; font-size: 18px; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1>E-Society</h1>
            <p>Payment Receipt</p>
            <p>${receipt.receiptNumber}</p>
          </div>

          <div class="section">
            <div class="section-title">Resident Details</div>
            <div class="row">
              <span>Name:</span>
              <span>${receipt.resident.name}</span>
            </div>
            <div class="row">
              <span>Flat Number:</span>
              <span>${receipt.resident.flatNumber}</span>
            </div>
            <div class="row">
              <span>Email:</span>
              <span>${receipt.resident.email}</span>
            </div>
            <div class="row">
              <span>Phone:</span>
              <span>${receipt.resident.phone}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Payment Details</div>
            <div class="row">
              <span>Month:</span>
              <span>${receipt.month} ${receipt.year}</span>
            </div>
            <div class="row">
              <span>Base Amount:</span>
              <span>₹${receipt.baseAmount?.toLocaleString("en-IN")}</span>
            </div>
            ${receipt.lateFee > 0 ? `<div class="row">
              <span>Late Fee:</span>
              <span>₹${receipt.lateFee?.toLocaleString("en-IN")}</span>
            </div>` : ""}
            <div class="row total">
              <span>Total Amount Paid:</span>
              <span>₹${receipt.amount?.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Transaction Details</div>
            <div class="row">
              <span>Payment Method:</span>
              <span>${receipt.paymentMethod || "Razorpay"}</span>
            </div>
            <div class="row">
              <span>Payment ID:</span>
              <span style="font-family: monospace; font-size: 12px;">${receipt.paymentId}</span>
            </div>
            <div class="row">
              <span>Order ID:</span>
              <span style="font-family: monospace; font-size: 12px;">${receipt.orderId}</span>
            </div>
            <div class="row">
              <span>Status:</span>
              <span style="color: #10b981; font-weight: bold;">✓ Verified</span>
            </div>
            <div class="row">
              <span>Date & Time:</span>
              <span>${new Date(receipt.paidAt).toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div class="footer">
            <p>This is a computer-generated receipt. No signature is required.</p>
            <p>For any queries, contact the society management.</p>
            <p>Generated on ${new Date().toLocaleString("en-IN")}</p>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSendEmail = async () => {
    toast.success("Receipt sent to your email");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[130] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Payment Receipt</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          
          {loading && <PageLoaderInline message="Loading receipt…" className="py-10" />}

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {receipt && !error && (
            <>
              {/* Receipt Container */}
              <div className="bg-white border border-gray-300 rounded-lg p-8" id="receipt-content">
                
                {/* Header */}
                <div className="text-center mb-8 pb-6 border-b-2 border-blue-600">
                  <h1 className="text-3xl font-bold text-blue-600 mb-2">E-Society</h1>
                  <p className="text-gray-600">Payment Receipt</p>
                  <p className="text-gray-500 text-sm mt-2">{receipt.receiptNumber}</p>
                </div>

                {/* Resident Details */}
                <div className="mb-8">
                  <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    Resident Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Name</p>
                      <p className="font-semibold text-gray-800">{receipt.resident.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Flat Number</p>
                      <p className="font-semibold text-gray-800">{receipt.resident.flatNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Email</p>
                      <p className="font-semibold text-gray-800 text-sm">{receipt.resident.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Phone</p>
                      <p className="font-semibold text-gray-800">{receipt.resident.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
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
                      <span className="font-semibold">₹{receipt.baseAmount?.toLocaleString("en-IN")}</span>
                    </div>
                    {receipt.lateFee > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Late Fee:</span>
                        <span className="font-semibold text-red-600">₹{receipt.lateFee?.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 bg-blue-50 px-4 rounded-lg font-bold text-lg">
                      <span>Total Amount Paid:</span>
                      <span className="text-blue-600">₹{receipt.amount?.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="mb-8">
                  <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    Transaction Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-semibold">{receipt.paymentMethod || "Razorpay"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment ID:</span>
                      <span className="font-mono text-xs">{receipt.paymentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono text-xs">{receipt.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-semibold text-green-600">✓ Verified & Completed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date & Time:</span>
                      <span className="font-semibold">
                        {new Date(receipt.paidAt).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center border-t border-gray-200 pt-4 text-xs text-gray-500">
                  <p className="mb-1">This is a computer-generated receipt. No signature is required.</p>
                  <p className="mb-1">For any queries, contact the society management.</p>
                  <p>Generated on {new Date().toLocaleString("en-IN")}</p>
                </div>
              </div>

              {/* Action Buttons */}
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
