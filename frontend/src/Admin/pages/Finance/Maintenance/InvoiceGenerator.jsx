import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMaintenanceById } from "../../../../store/slices/maintenanceSlice";
import { FiFileText, FiDownload, FiArrowLeft, FiUser, FiHome, FiCreditCard } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const InvoiceGenerator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // ✅ Ensure you are destructuring the correct key from your slice
  const { singleRecord: data, loading } = useSelector((s) => s.maintenance || {});

  useEffect(() => {
    if (id) dispatch(fetchMaintenanceById(id));
  }, [id, dispatch]);

  // ✅ Safe calculations
  const amount = data?.amount || 0;
  const lateFee = data?.lateFee || 0;
  const total = amount + lateFee;
  const residentName = data?.resident ? `${data.resident.firstName} ${data.resident.lastName || ""}` : "Loading...";
  const flatDisplay = data?.resident ? `${data.resident.wing || "A"}-${data.resident.flatNumber || ""}` : "—";

  const generatePDF = () => {
    if (!data) return;
    const doc = new jsPDF();

    doc.setFontSize(20).setTextColor(30, 58, 138).text("E-SOCIETY MANAGEMENT", 14, 20);
    doc.setFontSize(10).setTextColor(100).text("Maintenance & Service Invoice", 14, 28);
    
    doc.setFontSize(10).setTextColor(0).text(`Invoice No: #INV-${data._id?.slice(-6).toUpperCase()}`, 140, 20);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 26);
    doc.text(`Status: ${data.status || "Pending"}`, 140, 32);

    doc.setDrawColor(200).line(14, 38, 196, 38);

    doc.setFontSize(11).setFont("helvetica", "bold").text("Billed To:", 14, 50);
    doc.setFont("helvetica", "normal").text(`Resident: ${residentName}`, 14, 58);
    doc.text(`Flat Unit: ${flatDisplay}`, 14, 64);
    doc.text(`Billing Period: ${data.month} ${data.year}`, 14, 70);

    autoTable(doc, {
      startY: 80,
      head: [["Description", "Qty", "Rate", "Amount"]],
      body: [
        ["Monthly Maintenance Charges", "1", `INR ${amount}`, `INR ${amount}`],
        ["Late Payment Surcharge", "1", `INR ${lateFee}`, `INR ${lateFee}`],
      ],
      foot: [["", "", "Total Amount Payable", `INR ${total}`]],
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
    });

    doc.save(`Invoice_${data.month}_${data.year}_${data.resident?.flatNumber}.pdf`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse text-blue-600 font-bold">Generating Invoice View...</div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-red-500">Invoice Data unavailable. Please go back.</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center font-sans">
      {/* Header with Back Button */}
      <div className="max-w-xl w-full flex justify-between items-center mb-6">
         <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-lg border hover:bg-gray-50 transition shadow-sm flex items-center gap-2 text-sm font-medium">
            <FiArrowLeft /> Back
         </button>
         <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Billing Section</div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 max-w-xl w-full overflow-hidden">
        {/* Visual Decoration */}
        <div className="h-3 bg-blue-600 w-full" />
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">Invoice for <br/><span className="text-blue-600">{data.month} {data.year}</span></h2>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${data.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {data.status}
              </span>
            </div>
            <FiFileText size={40} className="text-blue-100" />
          </div>

          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><FiUser /></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resident</p>
                <p className="font-bold text-gray-800">{residentName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600"><FiHome /></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Flat Number</p>
                <p className="font-bold text-gray-800">{flatDisplay}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><FiCreditCard /></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Amount</p>
                <p className="text-xl font-black text-gray-900">₹{total.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={generatePDF} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <FiDownload /> Download Official PDF
          </button>
          
          <p className="text-center text-[10px] text-gray-400 mt-6 uppercase tracking-widest">Generated by e-Society System</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;