import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import RazorpayPaymentModal from "../components/RazorpayPaymentModal";
import { fetchMyMaintenance } from "../../store/slices/maintenanceSlice";
import { Download, Filter, IndianRupee, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";
import societyConfig from "../../assets/societyConfig";
import autoTable from "jspdf-autotable";
import { FiCreditCard } from "react-icons/fi";
import { SkeletonGrid } from "../../components/PageLoader";

const MyInvoice = () => {
  const dispatch = useDispatch();
  const { list: invoices = [], loading } = useSelector((s) => s.maintenance || {});

  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentModalData, setPaymentModalData] = useState({
    isOpen: false,
    maintenanceId: null,
    billDetails: null,
  });

  useEffect(() => {
    dispatch(fetchMyMaintenance());
  }, [dispatch]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter === "All") return true;
      if (statusFilter === "Paid") return inv.status?.toLowerCase() === "paid";
      if (statusFilter === "Unpaid") return inv.status?.toLowerCase() !== "paid";
      return true;
    });
  }, [invoices, statusFilter]);

  const paidCount = invoices.filter((inv) => inv.status?.toLowerCase() === "paid").length;
  const unpaidCount = invoices.filter((inv) => inv.status?.toLowerCase() !== "paid").length;
  const totalOutstanding = invoices
    .filter((inv) => inv.status?.toLowerCase() !== "paid")
    .reduce((sum, inv) => sum + (inv.amount || 0) + (inv.lateFee || 0), 0);

  // --- Professional PDF Download Logic ---
  const handleDownload = (item) => {
    const doc = new jsPDF();
    const isPaid = item.status?.toLowerCase() === "paid";
    const primaryColor = isPaid ? [16, 185, 129] : [59, 130, 246]; 
    const title = isPaid ? "PAYMENT RECEIPT" : "MAINTENANCE INVOICE";

    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 5, 297, 'F'); 
    doc.setFont("helvetica", "bold").setFontSize(22).setTextColor(40, 40, 40);
    doc.text(societyConfig.name.toUpperCase(), 14, 22);
    doc.setFontSize(10).setFont("helvetica", "normal").setTextColor(100, 100, 100);
    doc.text(title, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 196, 22, { align: "right" });
    doc.line(14, 35, 196, 35);

    doc.setFontSize(11).setFont("helvetica", "bold").setTextColor(40, 40, 40).text("BILLED TO:", 14, 48);
    doc.setFontSize(10).text(`Name: ${item.resident?.firstName} ${item.resident?.lastName}`, 14, 55);
    doc.text(`Flat: ${item.resident?.wing || "A"}-${item.resident?.flatNumber}`, 14, 61);
    doc.text(`Period: ${item.month} ${item.year}`, 14, 67);
    doc.text("STATUS:", 150, 48);
    doc.setTextColor(...primaryColor).text(item.status?.toUpperCase(), 150, 55);

    autoTable(doc, {
        startY: 78,
        head: [["DESCRIPTION", "AMOUNT (INR)"]],
        body: [
          ["Monthly Maintenance Charge", `Rs. ${item.amount.toLocaleString()}`],
          ["Late Fee / Penalties", `Rs. ${(item.lateFee || 0).toLocaleString()}`],
          [
            { content: "TOTAL PAYABLE", styles: { fontStyle: 'bold', fillColor: [245, 245, 245] } }, 
            { content: `Rs. ${(item.amount + (item.lateFee || 0)).toLocaleString()}`, styles: { fontStyle: 'bold', fillColor: [245, 245, 245] } }
          ],
        ],
        theme: "striped",
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { cellPadding: 5, fontSize: 10 },
        columnStyles: { 1: { halign: 'right' } }
    });

    let finalY = doc.lastAutoTable.finalY + 25;
    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(14, finalY, 90, 35, 2, 2, 'FD');
    doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(40, 40, 40).text("PAYMENT NOTES:", 18, finalY + 8);
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(100, 100, 100);
    doc.text("• Digital copy for society records.", 18, finalY + 16);
    doc.text("• Late fee applicable after due date.", 18, finalY + 22);
    doc.text(`• Generated via ${societyConfig.name} Portal.`, 18, finalY + 28);

    const centerX = 165; 
    const centerY = finalY + 15;
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.8);
    doc.circle(centerX, centerY, 18, 'D'); 
    doc.setLineWidth(0.2);
    doc.circle(centerX, centerY, 15, 'D');
    doc.setFontSize(6);
    doc.setTextColor(...primaryColor);
    doc.text(societyConfig.name.toUpperCase(), centerX, centerY - 5, { align: "center", maxWidth: 28 });
    doc.text("OFFICIAL SEAL", centerX, centerY + 5, { align: "center" });
    doc.setFontSize(10).text("★", centerX, centerY + 10, { align: "center" });
    doc.setFontSize(9).setTextColor(40, 40, 40);
    doc.text("AUTHORIZED SIGNATORY", centerX, finalY + 42, { align: "center" });
    doc.save(`${item.month}_${item.year}_Invoice.pdf`);
  };

  const handlePayNow = (invoice) => {
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
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] p-4 text-[var(--text)] transition-all duration-300 sm:p-8 pt-36">
      <div className="mx-auto max-w-7xl mt-12">
        
        {/* Header Section */}
        <section className="group relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)]">
          <div className="absolute -right-12 top-0 h-48 w-48 rounded-full bg-sky-400/10 blur-[80px] group-hover:bg-sky-400/20 transition-all duration-700 pointer-events-none" />
          <div className="absolute left-1/3 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-emerald-400/5 blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-6 py-1.5 text-[11px] font-black uppercase tracking-widest text-[var(--text-muted)] backdrop-blur">
                <Sparkles size={14} className="text-sky-500 animate-pulse" />
                Billing Portal
              </div>
              <h1 className="flex items-center gap-4 text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">
                <FileText className="text-indigo-500" size={40} />
                My Invoices
              </h1>
              <p className="max-w-md text-sm font-medium leading-relaxed text-[var(--text-muted)] opacity-80">
                Track, download and manage your society maintenance payments seamlessly.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "All", value: invoices.length, tone: "border-slate-500/20 text-slate-500" },
                { label: "Paid", value: paidCount, tone: "border-emerald-500/20 text-emerald-500" },
                { label: "Unpaid", value: unpaidCount, tone: "border-amber-500/20 text-amber-500" },
                { label: "Due", value: `₹${totalOutstanding.toLocaleString()}`, tone: "border-rose-500/20 text-rose-500" },
              ].map((item) => (
                <div key={item.label} className="group/stat rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-5 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className={`mb-2 text-[10px] font-black uppercase tracking-widest ${item.tone}`}>{item.label}</div>
                  <div className="text-xl font-black text-[var(--text)]">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <div className="mt-8 flex items-center gap-3 overflow-x-auto rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm scrollbar-hide">
          <Filter size={18} className="ml-3 text-[var(--text-muted)]" />
          {["All", "Paid", "Unpaid"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-2xl px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 ${
                statusFilter === status 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                  : "bg-[var(--bg)] text-[var(--text-muted)] hover:bg-[var(--border)]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Invoice Cards */}
        {loading ? (
          <div className="mt-8">
            <SkeletonGrid count={6} gridClassName="grid gap-8 md:grid-cols-2 lg:grid-cols-3" itemClassName="h-72 rounded-[2.5rem]" />
          </div>
        ) : (
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice._id}
                className="group relative rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg)] text-sm font-black uppercase text-[var(--text-muted)] group-hover:text-indigo-500 transition-colors">
                    {invoice.month?.substring(0, 3)}
                  </div>
                  <span className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-wider ${
                    invoice.status?.toLowerCase() === "paid" 
                    ? "bg-emerald-500/10 text-emerald-500" 
                    : "bg-amber-500/10 text-amber-500 animate-pulse"
                  }`}>
                    {invoice.status}
                  </span>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-black text-[var(--text)]">{invoice.month} {invoice.year}</h2>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">INV-#{invoice._id.slice(-6)}</p>
                </div>

                <div className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-5 transition-all group-hover:border-indigo-500/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Total Amount</p>
                  <div className="mt-2 flex items-center text-3xl font-black text-[var(--text)]">
                    <IndianRupee size={22} className="mr-1 text-indigo-500" />
                    {(invoice.amount + (invoice.lateFee || 0)).toLocaleString()}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(invoice)}
                    className="group/btn flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Download size={16} className="group-hover/btn:scale-110 transition-transform" />
                    Bill
                  </button>
                  
                  {invoice.status?.toLowerCase() !== "paid" ? (
                    <button
                      onClick={() => handlePayNow(invoice)}
                      className="group/pay flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <FiCreditCard size={16} className="group-hover/pay:rotate-12 transition-transform" />
                      Pay
                    </button>
                  ) : (
                    <div className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                      <CheckCircle2 size={16} /> Completed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <RazorpayPaymentModal
          isOpen={paymentModalData.isOpen}
          onClose={closePayModal}
          maintenanceId={paymentModalData.maintenanceId}
          billDetails={paymentModalData.billDetails}
          onPaymentSuccess={() => {
            dispatch(fetchMyMaintenance());
          }}
        />
      </div>
    </div>
  );
};

export default MyInvoice;