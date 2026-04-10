import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import API from "../../service/api";
import societyConfig from "../../assets/societyConfig";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadingReceipt, setDownloadingReceipt] = useState("");
  const [filters, setFilters] = useState({ status: "", query: "", startDate: "", endDate: "" });

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/payment/list", {
        params: {
          status: filters.status || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
        },
      });

      if (res.data.success) {
        setPayments(res.data.data || []);
      } else {
        setError(res.data.message || "Unable to load payments");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filters.status, filters.startDate, filters.endDate]);

  const filteredPayments = payments.filter((payment) => {
    const q = filters.query.trim().toLowerCase();
    if (!q) return true;
    const residentName = `${payment.resident?.firstName || ""} ${payment.resident?.lastName || ""}`.trim().toLowerCase();
    return (
      (payment.receiptNumber || "").toLowerCase().includes(q) ||
      residentName.includes(q) ||
      (payment.resident?.flatNumber || "").toLowerCase().includes(q) ||
      (payment.razorpayOrderId || "").toLowerCase().includes(q)
    );
  });

  const downloadReceipt = async (receiptNumber) => {
    if (!receiptNumber) {
      setError("Receipt number not available for this payment");
      return;
    }

    try {
      setDownloadingReceipt(receiptNumber);
      setError(null);

      const res = await API.get(`/payment/receipt/${receiptNumber}`);
      const receipt = res.data?.data;

      if (!receipt) {
        throw new Error("Receipt data not found");
      }

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
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to download receipt");
    } finally {
      setDownloadingReceipt("");
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Maintenance & Payments</h2>
          <p className="mt-1 text-sm text-gray-500">View all payments, search and filter across residents.</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          value={filters.query}
          onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
          placeholder="Search by invoice, resident, flat or order"
          className="w-full rounded-lg border p-2 outline-none focus:border-blue-500"
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          className="w-full rounded-lg border p-2 outline-none focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option value="successful">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
          className="w-full rounded-lg border p-2 outline-none focus:border-blue-500"
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
          className="w-full rounded-lg border p-2 outline-none focus:border-blue-500"
        />
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      {loading ? (
        <div className="py-8 text-center text-gray-600">Loading payments...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b bg-gray-100 text-gray-600">
                <th className="p-3 font-semibold">Receipt</th>
                <th className="p-3 font-semibold">Resident</th>
                <th className="p-3 font-semibold">Unit</th>
                <th className="p-3 font-semibold">Amount</th>
                <th className="p-3 font-semibold">Method</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Paid Date</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} className="border-b transition-colors hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium text-gray-800">{payment.receiptNumber || payment._id}</td>
                    <td className="p-3">
                      <div className="font-medium text-blue-600">{payment.resident?.firstName} {payment.resident?.lastName}</div>
                      <div className="text-xs text-gray-500">{payment.resident?.email || payment.resident?.mobile}</div>
                    </td>
                    <td className="p-3 text-gray-600">{payment.resident?.flatNumber || "N/A"}</td>
                    <td className="p-3 font-semibold text-gray-800">Rs. {(payment.totalAmount || 0).toLocaleString("en-IN")}</td>
                    <td className="p-3 text-gray-600">{payment.paymentMethod || "Razorpay"}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        payment.status === "successful" ? "bg-green-100 text-green-700" :
                        payment.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        payment.status === "failed" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{payment.paidAt ? new Date(payment.paidAt).toLocaleString("en-IN") : "N/A"}</td>
                    <td className="p-3">
                      <button
                        onClick={() => downloadReceipt(payment.receiptNumber)}
                        disabled={!payment.receiptNumber || downloadingReceipt === payment.receiptNumber}
                        className="rounded border border-blue-200 px-2 py-1 text-xs font-medium text-blue-500 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {downloadingReceipt === payment.receiptNumber ? "Downloading..." : "Receipt"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500">No payments match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payments;
