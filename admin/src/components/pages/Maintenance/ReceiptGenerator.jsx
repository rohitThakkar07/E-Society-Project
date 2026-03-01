import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ReceiptGenerator = () => {
  // Dummy Receipt Data (Replace with API data later)
  const receiptData = {
    societyName: "Green Valley Society",
    address: "Ahmedabad, Gujarat",
    receiptNo: "RCPT-2026-03-001",
    date: "10-03-2026",
    resident: "Flat A-101",
    ownerName: "Rohit Sharma",
    month: "March 2026",
    maintenanceAmount: 2000,
    lateFee: 100,
    paidAmount: 2100,
    paymentMode: "UPI",
    transactionId: "TXN123456789",
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    const total =
      receiptData.maintenanceAmount + receiptData.lateFee;

    // HEADER
    doc.setFontSize(18);
    doc.text(receiptData.societyName, 14, 20);

    doc.setFontSize(10);
    doc.text(receiptData.address, 14, 26);

    doc.setFontSize(14);
    doc.text("Payment Receipt", 14, 40);

    // RECEIPT DETAILS
    doc.setFontSize(10);
    doc.text(`Receipt No: ${receiptData.receiptNo}`, 140, 20);
    doc.text(`Date: ${receiptData.date}`, 140, 26);

    doc.text(`Resident: ${receiptData.resident}`, 14, 50);
    doc.text(`Owner Name: ${receiptData.ownerName}`, 14, 56);
    doc.text(`Month: ${receiptData.month}`, 14, 62);
    doc.text(`Payment Mode: ${receiptData.paymentMode}`, 14, 68);
    doc.text(`Transaction ID: ${receiptData.transactionId}`, 14, 74);

    // TABLE
    autoTable(doc, {
      startY: 85,
      head: [["Description", "Amount (₹)"]],
      body: [
        ["Maintenance Charge", receiptData.maintenanceAmount],
        ["Late Fee", receiptData.lateFee],
        ["Total Amount", total],
        ["Paid Amount", receiptData.paidAmount],
      ],
    });

    // FOOTER
    doc.text(
      "Thank you for your payment.",
      14,
      doc.lastAutoTable.finalY + 15
    );

    doc.text(
      "Authorized Signature",
      150,
      doc.lastAutoTable.finalY + 30
    );

    doc.save(`Receipt_${receiptData.receiptNo}.pdf`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Receipt Generator
        </h1>

        <div className="space-y-2 text-gray-700">
          <p><strong>Society:</strong> {receiptData.societyName}</p>
          <p><strong>Resident:</strong> {receiptData.resident}</p>
          <p><strong>Owner:</strong> {receiptData.ownerName}</p>
          <p><strong>Month:</strong> {receiptData.month}</p>
          <p><strong>Payment Mode:</strong> {receiptData.paymentMode}</p>
          <p>
            <strong>Paid Amount:</strong> ₹
            {receiptData.paidAmount.toLocaleString()}
          </p>
        </div>

        <button
          onClick={generatePDF}
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Download Receipt PDF
        </button>
      </div>
    </div>
  );
};

export default ReceiptGenerator;