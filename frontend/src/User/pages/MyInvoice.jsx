import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import RazorpayPaymentModal from "../components/RazorpayPaymentModal";
import { fetchMyMaintenance } from "../../store/slices/maintenanceSlice";
import { Download, Filter, IndianRupee } from "lucide-react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiCreditCard } from "react-icons/fi";

const MyInvoice = () => {
  const dispatch = useDispatch();
  const { list: invoices = [], loading } = useSelector((s) => s.maintenance || {});

  // State for filtering
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentInvoice, setPaymentInvoice] = useState(null);
  const [paymentModalData, setPaymentModalData] = useState({ isOpen: false, maintenanceId: null, billDetails: null });
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  useEffect(() => {
    dispatch(fetchMyMaintenance());
  }, [dispatch]);

  // ✅ Filter Logic
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter === "All") return true;
      if (statusFilter === "Paid") return inv.status?.toLowerCase() === "paid";
      if (statusFilter === "Unpaid") return inv.status?.toLowerCase() !== "paid";
      return true;
    });
  }, [invoices, statusFilter]);

  const handleDownload = (item) => {
    const doc = new jsPDF();
    const isPaid = item.status?.toLowerCase() === "paid";
    const title = isPaid ? "PAYMENT RECEIPT" : "MAINTENANCE INVOICE";

    doc.setFontSize(20).text("E-SOCIETY MANAGEMENT", 14, 22);
    doc.setFontSize(10).text(title, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 22);
    doc.line(14, 35, 196, 35);

    doc.setFontSize(12).text("Billed To:", 14, 45);
    doc.setFontSize(10);
    doc.text(`Name: ${item.resident?.firstName} ${item.resident?.lastName}`, 14, 52);
    doc.text(`Flat: ${item.resident?.wing || "A"}-${item.resident?.flatNumber}`, 14, 58);
    doc.text(`Period: ${item.month} ${item.year}`, 14, 64);
    doc.text(`Status: ${item.status}`, 150, 52);

    autoTable(doc, {
      startY: 75,
      head: [["Description", "Amount (INR)"]],
      body: [
        ["Monthly Maintenance Charge", item.amount.toLocaleString()],
        ["Late Fee / Penalties", (item.lateFee || 0).toLocaleString()],
        ["Total Payable", (item.amount + (item.lateFee || 0)).toLocaleString()],
      ],
      theme: "striped",
      headStyles: { fillColor: isPaid ? [16, 185, 129] : [59, 130, 246] },
    });

    doc.save(`${item.month}_${item.year}_Invoice.pdf`);
  };

  const handlePayNow = (invoice) => {
    setPaymentInvoice(invoice);
    setPaymentMessage("");
    setPaymentModalData({
      isOpen: true,
      maintenanceId: invoice._id,
      billDetails: {
        amount: invoice.amount + (invoice.lateFee || 0),
        baseAmount: invoice.amount,
        lateFee: invoice.lateFee || 0,
        month: invoice.month,
        year: invoice.year,
      },
    });
  };

  const closePayModal = () => {
    setPaymentModalData({ isOpen: false, maintenanceId: null, billDetails: null });
    setPaymentInvoice(null);
    setPaymentMessage("");
  };

  const handlePaymentSubmit = async (event) => {
    event?.preventDefault();
    toast.info("Please initiate Razorpay payment using Pay Now.");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER & FILTERS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Invoices</h1>
            <p className="text-sm text-slate-500 font-medium">Manage and track your society dues</p>
          </div>

          <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
            {["All", "Paid", "Unpaid"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  statusFilter === status
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT GRID */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-200 h-64 rounded-3xl"></div>
            ))}
          </div>
        ) : filteredInvoices.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice._id}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xs uppercase">
                    {invoice.month?.substring(0, 3)}
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                      invoice.status?.toLowerCase() === "paid"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </div>

                <div className="mb-6">
                  <h2 className="font-black text-slate-800 text-lg leading-tight">
                    {invoice.month} {invoice.year}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    Invoice ID: #{invoice._id.slice(-6)}
                  </p>
                </div>

                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Amount Due</p>
                    <div className="flex items-center text-2xl font-black text-slate-900">
                      <IndianRupee size={20} className="mr-0.5" />
                      {(invoice.amount + (invoice.lateFee || 0)).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(invoice)}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                  >
                    <Download size={14} /> Download
                  </button>
                  {invoice.status?.toLowerCase() !== "paid" && (
                    <button
                      onClick={() => handlePayNow(invoice)}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95"
                    >
                      <FiCreditCard size={14} /> Pay Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-800 text-xl font-black mb-1">No {statusFilter !== "All" ? statusFilter : ""} Invoices Found</p>
            <p className="text-slate-400 font-medium">Try changing your filter settings to see more results.</p>
          </div>
        )}

        <RazorpayPaymentModal
          isOpen={paymentModalData.isOpen}
          onClose={closePayModal}
          maintenanceId={paymentModalData.maintenanceId}
          billDetails={paymentModalData.billDetails}
          onPaymentSuccess={(data) => {
            dispatch(fetchMyMaintenance());
            closePayModal();
            setPaymentMessage("Payment successful! Refreshing invoice data...");
          }}
        />
      </div>
    </div>
  );
};

export default MyInvoice;