import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMaintenanceById } from "../../../../store/slices/maintenanceSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const InvoiceGenerator = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleRecord: data, loading } = useSelector((s) => s.maintenance);

  useEffect(() => {
    if (id) dispatch(fetchMaintenanceById(id));
  }, [id, dispatch]);

  const generatePDF = () => {
    if (!data) return;
    const doc = new jsPDF();
    const total = data.amount + (data.lateFee || 0);

    doc.setFontSize(18).text("E-SOCIETY MANAGEMENT", 14, 20);
    doc.setFontSize(10).text("Maintenance Invoice", 14, 30);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 140, 20);
    doc.text(`Status: ${data.status}`, 140, 26);

    doc.setFontSize(11).text("Billed To:", 14, 45);
    doc.text(`Name: ${data.resident?.firstName} ${data.resident?.lastName}`, 14, 52);
    doc.text(`Flat: ${data.resident?.wing}-${data.resident?.flatNumber}`, 14, 58);
    doc.text(`Period: ${data.month} ${data.year}`, 14, 64);

    autoTable(doc, {
      startY: 75,
      head: [["Description", "Amount"]],
      body: [
        ["Monthly Maintenance Charge", `INR ${data.amount}`],
        ["Late Fee / Penalties", `INR ${data.lateFee || 0}`],
        ["Total Payable", `INR ${total}`],
      ],
      theme: 'striped'
    });

    doc.save(`Invoice_${data.month}_${data.resident?.flatNumber}.pdf`);
  };

  if (loading) return <div className="p-10 text-center">Loading Invoice Data...</div>;
  if (!data) return <div className="p-10 text-center text-red-500">Invoice not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border max-w-xl w-full">
        <h2 className="text-xl font-bold mb-4">Invoice for {data.month} {data.year}</h2>
        <div className="text-sm space-y-2 border-b pb-4 mb-4">
           <p><strong>Resident:</strong> {data.resident?.firstName} {data.resident?.lastName}</p>
           <p><strong>Flat:</strong> {data.resident?.wing}-{data.resident?.flatNumber}</p>
           <p><strong>Amount:</strong> ₹{data.amount + data.lateFee}</p>
        </div>
        <button onClick={generatePDF} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Download Invoice PDF</button>
      </div>
    </div>
  );
};

export default InvoiceGenerator;