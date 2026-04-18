import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchVisitorById } from "../../../store/slices/visitorSlice";
import { 
  FiUser, FiPhone, FiClock, FiMapPin, FiCalendar, 
  FiCheckCircle, FiXCircle, FiArrowLeft, FiShield, FiKey 
} from "react-icons/fi";
import { approveVisitor, denyVisitor, markExit } from "../../../store/slices/visitorSlice";
import { toast } from "react-toastify";

const VisitorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleVisitor: visitor, loading } = useSelector((state) => state.visitor);

  const [showOtpModal, setShowOtpModal] = React.useState(false);
  const [otp, setOtp] = React.useState("");

  useEffect(() => {
    dispatch(fetchVisitorById(id));
  }, [id, dispatch]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("Enter 6-digit OTP");
    const res = await dispatch(approveVisitor({ id, otp }));
    if (res.meta.requestStatus === "fulfilled") {
      setShowOtpModal(false);
      setOtp("");
      dispatch(fetchVisitorById(id));
    }
  };

  const handleAction = async (action, data = null) => {
     if (!window.confirm(`Are you sure you want to ${action}?`)) return;
     let res;
     if (action === 'deny') res = await dispatch(denyVisitor(id));
     if (action === 'exit') res = await dispatch(markExit(id));
     
     if (res?.meta?.requestStatus === "fulfilled") {
        dispatch(fetchVisitorById(id));
     }
  };

  if (loading || !visitor) {
    return (
      <div className="p-12 text-center text-slate-400 font-black uppercase tracking-[0.2em] text-xs">
        Loading visitor dossier...
      </div>
    );
  }

  const isPending = visitor.status === "Pending";
  const isInside = ["Inside", "Approved"].includes(visitor.status);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-['Inter',_sans-serif]">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-black uppercase tracking-widest text-[10px]">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to logs
          </button>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
            visitor.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
            isInside ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
            'bg-slate-100 text-slate-400 border-slate-200'
          }`}>
            Status: {visitor.status}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                  <FiShield size={160} />
               </div>

               <div className="flex items-start gap-6 relative z-10">
                  <div className="h-20 w-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-600/20">
                    {visitor.visitorName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{visitor.visitorName}</h2>
                    <p className="text-slate-400 font-bold mt-1 flex items-center gap-2">
                      <FiPhone /> {visitor.mobileNumber}
                    </p>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12 border-t border-slate-50 pt-10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visiting Resident</span>
                    <p className="font-bold text-slate-800 text-lg leading-tight">
                      {visitor.visitingResident?.firstName} {visitor.visitingResident?.lastName}
                    </p>
                    <div className="flex items-center gap-2 text-indigo-600 font-black text-sm mt-1">
                       <FiMapPin className="text-indigo-300" /> Unit {visitor.wing?.toUpperCase()}-{visitor.flatNumber}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Purpose of Visit</span>
                    <p className="font-bold text-slate-800 text-lg uppercase tracking-tight">{visitor.purpose || "GENERAL VISIT"}</p>
                    <div className="text-slate-400 font-bold text-xs mt-1">
                       Logged by {visitor.loggedBy?.name || "System"}
                    </div>
                  </div>
               </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Access Timeline</h3>
               <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                       <FiClock size={20} />
                    </div>
                    <div>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Entry Recorded</span>
                       <p className="font-black text-slate-800 tracking-tight">
                        {visitor.entryTime ? new Date(visitor.entryTime).toLocaleString() : "Awaiting entry..."}
                       </p>
                    </div>
                  </div>

                  <div className="h-8 w-0.5 bg-slate-100 ml-6" />

                  <div className="flex items-center gap-6">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${visitor.exitTime ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-300'}`}>
                       <FiCalendar size={20} />
                    </div>
                    <div>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Exit Recorded</span>
                       <p className={`font-black tracking-tight ${visitor.exitTime ? 'text-slate-800' : 'text-slate-300 italic'}`}>
                        {visitor.exitTime ? new Date(visitor.exitTime).toLocaleString() : "Still active inside residency"}
                       </p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            {isPending && (
              <div className="bg-amber-600 rounded-[2rem] p-8 text-white shadow-xl shadow-amber-600/20">
                <FiKey size={40} className="mb-4 opacity-50" />
                <h3 className="text-xl font-black tracking-tight leading-tight">Awaiting Verification</h3>
                <p className="text-amber-100 text-xs font-bold mt-2 leading-relaxed">
                  This visitor has not been verified by the resident.
                </p>
                <button 
                  onClick={() => setShowOtpModal(true)}
                  className="w-full mt-6 bg-white text-amber-600 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:scale-[1.02] transition-all active:scale-95"
                >
                  Verify Now
                </button>
                <button 
                  onClick={() => handleAction('deny')}
                  className="w-full mt-3 bg-amber-700/50 text-white py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-amber-700/80 transition-all"
                >
                  Deny Entry
                </button>
              </div>
            )}

            {visitor.status === "Approved" && (
                <div className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-600/20">
                  <FiCheckCircle size={40} className="mb-4 opacity-50" />
                  <h3 className="text-xl font-black tracking-tight">Entry Approved</h3>
                  <p className="text-emerald-100 text-xs font-bold mt-2 leading-relaxed">Identity verified. Resident has authorized the visitor to enter the premises.</p>
                </div>
            )}

            {isInside && visitor.status !== "Approved" && (
               <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Quick Action</span>
                  <button 
                    onClick={() => handleAction('exit')}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-lg"
                  >
                    <FiXCircle size={14} /> Log Checkout
                  </button>
               </div>
            )}
            
            <div className="bg-blue-600/5 rounded-[2rem] p-8 border border-blue-600/10">
               <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <FiShield /> Security Protocol
               </h4>
               <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                  All visitor entries must be verified via OTP. For emergency overrides or manual entries, please ensure notes are added to the visitor log.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/60">
          <div className="w-full max-w-sm rounded-[2.5rem] bg-white p-8 text-center shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
             <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-amber-50 shadow-inner">
                <FiKey size={32} className="text-amber-600" />
             </div>
             <h2 className="mb-2 text-2xl font-black text-slate-900 tracking-tight">Resident OTP</h2>
             <p className="mb-8 text-[10px] font-black text-slate-400 uppercase tracking-widest underline decoration-amber-100 underline-offset-4">Verifying {visitor.visitorName}</p>
             
             <form onSubmit={handleVerifyOtp} className="space-y-6">
              <input
                required autoFocus type="text" maxLength="6"
                value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="0 0 0 0 0 0"
                className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 py-5 text-center text-4xl font-black tracking-[0.3em] transition-all focus:outline-none focus:border-amber-500 focus:bg-white"
              />
              <div className="flex gap-4">
                 <button type="button" onClick={() => { setShowOtpModal(false); setOtp(""); }} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Abort</button>
                 <button type="submit" disabled={otp.length !== 6} className="flex-1 bg-slate-900 text-white rounded-2xl py-4 text-xs font-black uppercase tracking-widest shadow-lg shadow-black/20 active:scale-95 transition-all">Confirm</button>
              </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorDetails;