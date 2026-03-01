import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const InvoiceGenerator = () => {

  // Dummy Invoice Data (Later fetch from backend)
  const invoiceData = {
    societyName: "Green Valley Society",
    address: "Ahmedabad, Gujarat",
    invoiceNo: "INV-2026-03-001",
    date: "01-03-2026",
    resident: "Flat A-101",
    ownerName: "Rohit Sharma",
    month: "March 2026",
    maintenanceAmount: 2000,
    lateFee: 100,
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text(invoiceData.societyName, 14, 20);

    doc.setFontSize(10);
    doc.text(invoiceData.address, 14, 26);

    doc.setFontSize(14);
    doc.text("Maintenance Invoice", 14, 40);

    // Invoice Details
    doc.setFontSize(10);
    doc.text(`Invoice No: ${invoiceData.invoiceNo}`, 140, 20);
    doc.text(`Date: ${invoiceData.date}`, 140, 26);

    doc.text(`Resident: ${invoiceData.resident}`, 14, 50);
    doc.text(`Owner Name: ${invoiceData.ownerName}`, 14, 56);
    doc.text(`Month: ${invoiceData.month}`, 14, 62);

    const total =
      invoiceData.maintenanceAmount + invoiceData.lateFee;

    // Table
    autoTable(doc, {
      startY: 75,
      head: [["Description", "Amount (₹)"]],
      body: [
        ["Maintenance Charge", invoiceData.maintenanceAmount],
        ["Late Fee", invoiceData.lateFee],
        ["Total", total],
      ],
    });

    doc.save(`Invoice_${invoiceData.invoiceNo}.pdf`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto">

        <h1 className="text-2xl font-bold mb-4">
          Invoice Generator
        </h1>

        <div className="space-y-2 text-gray-700">
          <p><strong>Society:</strong> {invoiceData.societyName}</p>
          <p><strong>Resident:</strong> {invoiceData.resident}</p>
          <p><strong>Owner:</strong> {invoiceData.ownerName}</p>
          <p><strong>Month:</strong> {invoiceData.month}</p>
          <p>
            <strong>Total Amount:</strong> ₹
            {(
              invoiceData.maintenanceAmount +
              invoiceData.lateFee
            ).toLocaleString()}
          </p>
        </div>

        <button
          onClick={generatePDF}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Download Invoice PDF
        </button>

      </div>
    </div>
  );
};

export default InvoiceGenerator;