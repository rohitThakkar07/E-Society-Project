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
      
      // Receipt Styling Constants
      const primaryColor = [37, 99, 235]; // Blue 600
      const secondaryColor = [107, 114, 128]; // Gray 400
      const textColor = [31, 41, 55]; // Gray 800
      const lightGray = [249, 250, 251]; // Gray 50

      // 1. HEADER BANNER
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 40, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text(societyConfig.name.toUpperCase(), 15, 20);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`${societyConfig.city}, ${societyConfig.state}`, 15, 28);
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("OFFICIAL PAYMENT RECEIPT", 140, 22);

      // 2. RECEIPT INFO BOX
      doc.setTextColor(...textColor);
      doc.setFontSize(10);
      doc.text(`Receipt No: ${receipt.receiptNumber || "-"}`, 140, 50);
      doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 140, 56);
      doc.text(`Status: SUCCESSFUL`, 140, 62);

      // 3. RESIDENT SECTION
      doc.setDrawColor(229, 231, 235);
      doc.line(15, 68, 195, 68);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("RESIDENT DETAILS", 15, 80);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...secondaryColor);
      doc.text("Name:", 15, 88);
      doc.text("Flat/Unit:", 15, 94);
      doc.text("Email:", 15, 100);
      
      doc.setTextColor(...textColor);
      doc.text(receipt.resident?.name || "-", 50, 88);
      doc.text(receipt.resident?.flatNumber || "-", 50, 94);
      doc.text(receipt.resident?.email || "-", 50, 100);

      // 4. PAYMENT BREAKDOWN TABLE
      doc.setFillColor(...lightGray);
      doc.rect(15, 115, 180, 10, "F");
      doc.setFont("helvetica", "bold");
      doc.text("DESCRIPTION", 20, 121);
      doc.text("AMOUNT", 150, 121);
      
      doc.line(15, 125, 195, 125);
      
      doc.setFont("helvetica", "normal");
      doc.text(`Maintenance - ${receipt.month || "-"} ${receipt.year || ""}`, 20, 135);
      doc.text(`Rs. ${Number(receipt.baseAmount || 0).toLocaleString("en-IN")}`, 150, 135);
      
      if (Number(receipt.lateFee) > 0) {
        doc.text("Late Payment Fee", 20, 143);
        doc.text(`Rs. ${Number(receipt.lateFee).toLocaleString("en-IN")}`, 150, 143);
      }
      
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(0.5);
      doc.line(140, 150, 195, 150);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("TOTAL PAID", 100, 160);
      doc.text(`Rs. ${Number(receipt.amount || 0).toLocaleString("en-IN")}`, 150, 160);

      // 5. TRANSACTION DETAILS (BOTTOM BOX)
      doc.setLineWidth(0.1);
      doc.setDrawColor(229, 231, 235);
      doc.rect(15, 175, 180, 25);
      
      doc.setFontSize(9);
      doc.setTextColor(...secondaryColor);
      doc.text("Payment Method", 20, 182);
      doc.text("Transaction ID", 80, 182);
      doc.text("Order ID", 140, 182);
      
      doc.setTextColor(...textColor);
      doc.setFont("helvetica", "bold");
      doc.text(receipt.paymentMethod?.toUpperCase() || "ONLINE", 20, 190);
      doc.text(receipt.paymentId || "-", 80, 190);
      doc.text(receipt.orderId || "-", 140, 190);

      // 6. FOOTER
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...secondaryColor);
      doc.text("This receipt is automatically generated upon successful payment verification.", 105, 230, { align: "center" });
      doc.text("For any queries, contact the society administration office.", 105, 235, { align: "center" });
      
      // SIGNATURE AREA
      doc.setTextColor(...textColor);
      doc.setFont("helvetica", "bold");
      doc.text("Authorized Signatory", 150, 260);
      doc.setDrawColor(200);
      doc.line(145, 255, 195, 255);

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
