import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TablePagination,
  IconButton, Tooltip, Chip, InputBase, Avatar 
} from "@mui/material";
import { Users, Plus, X, Search, CheckCircle, XCircle, Clock, Phone, User, Calendar, MapPin, Key, ShieldCheck } from "lucide-react";
import { fetchVisitors, createVisitor, denyVisitor, approveVisitor } from "../../store/slices/visitorSlice"; // Ensure verifyVisitorOtp exists in your slice
import { fetchResidents } from "../../store/slices/residentSlice";
import { toast } from "react-toastify";

const statusConfig = {
  Pending:   { bg: "#fffbeb", color: "#d97706", icon: <Clock size={12} /> },
  Approved:  { bg: "#ecfdf5", color: "#059669", icon: <CheckCircle size={12} /> },
  Denied:    { bg: "#fef2f2", color: "#dc2626", icon: <XCircle size={12} /> },
  "Checked Out": { bg: "#f1f5f9", color: "#64748b", icon: <CheckCircle size={12} /> },
};

const VisitorManagement = () => {
  const dispatch = useDispatch();
  const { list: visitors = [], loading } = useSelector((s) => s.visitor || {});
  const { residents = [] } = useSelector((s) => s.resident || {});
  
  console.log(visitors)
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const isGuard = user?.role?.toLowerCase() === "guard";

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyingId, setVerifyingId] = useState(null);
  
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [form, setForm] = useState({
    visitorName: "",
    mobileNumber: "",
    purpose: "Visit",
    visitingResident: "",
    vehicleNumber: ""
  });

  useEffect(() => { 
    dispatch(fetchVisitors()); 
    dispatch(fetchResidents()); 
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const selectedResident = residents.find(r => r._id === form.visitingResident);
    const payload = { ...form, wing: selectedResident?.wing || "", flatNumber: selectedResident?.flatNumber || "" };
    
    const res = await dispatch(createVisitor(payload));
    if (res.meta.requestStatus === "fulfilled") {
      setShowForm(false);
      setForm({ visitorName: "", mobileNumber: "", purpose: "Visit", visitingResident: "", vehicleNumber: "" });
    }
  };

  //  OTP Verification Handler
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    // Assuming your backend expects { visitorId, otp }
    // Replace approveVisitor with your actual verify thunk if it's different
    const res = await dispatch(approveVisitor({ id: verifyingId, otp }));
    
    if (res.meta.requestStatus === "fulfilled") {
      setShowOtpModal(false);
      setOtp("");
      setVerifyingId(null);
    }
  };

  const filtered = useMemo(() => 
    (visitors || []).filter(v => {
      const matchStatus = filter === "All" || v.status === filter;
      const matchSearch = v.visitorName?.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    }), [visitors, filter, search]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-2">
            <Users size={24} className="text-violet-500" /> Visitor Log
          </h1>
          <p className="text-sm text-slate-400 font-medium">Verify guest entry via OTP authentication.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all">
          <Plus size={18} /> Add Visitor
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-wrap items-center gap-4">
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 px-4 flex-1 min-w-[300px]">
          <Search size={18} className="text-slate-400" />
          <InputBase placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} className="w-full font-medium text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Pending", "Approved", "Denied"].map(s => (
            <button key={s} onClick={() => { setFilter(s); setPage(0); }}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                filter === s ? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-white text-slate-400 border-slate-100"
              }`}>{s}</button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="max-w-6xl mx-auto">
        <TableContainer component={Paper} elevation={0} className="rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <Table sx={{ minWidth: 800 }}>
            <TableHead className="bg-slate-50">
              <TableRow>
                <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Visitor</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Visiting Unit</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading ? filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((v) => (
                <TableRow key={v._id} hover>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar sx={{ bgcolor: '#f5f3ff', color: '#7c3aed', width: 36, height: 36 }}><User size={16} /></Avatar>
                      <div>
                        <p className="font-bold text-slate-800 text-sm uppercase">{v.visitorName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider italic">{v.purpose}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-slate-600 font-bold text-xs">{v.mobileNumber}</span></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-indigo-600 font-black text-xs uppercase">
                      <MapPin size={12} className="text-indigo-300" />
                      {v.visitingResident ? (
                        `${v.visitingResident.wing}-${v.visitingResident.flatNumber}`
                      ) : (
                        `${v.wing}-${v.flatNumber}` 
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip label={v.status} size="small" sx={{ fontWeight: 900, fontSize: '9px', textTransform: 'uppercase', bgcolor: statusConfig[v.status]?.bg, color: statusConfig[v.status]?.color, borderRadius: '8px' }} />
                  </TableCell>
                  <TableCell align="center">
                    {(isAdmin || isGuard) && v.status === "Pending" && (
                      <div className="flex gap-2 justify-center">
                        <Tooltip title="Verify OTP & Approve">
                           <IconButton size="small" onClick={() => { setVerifyingId(v._id); setShowOtpModal(true); }} sx={{ color: '#10b981', bgcolor: '#ecfdf5', '&:hover': { bgcolor: '#d1fae5' } }}>
                             <ShieldCheck size={16} />
                           </IconButton>
                        </Tooltip>
                        <Tooltip title="Deny Entry">
                           <IconButton size="small" onClick={() => dispatch(denyVisitor(v._id))} sx={{ color: '#ef4444', bgcolor: '#fef2f2' }}><XCircle size={16} /></IconButton>
                        </Tooltip>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )) : (
                [...Array(5)].map((_, i) => <TableRow key={i}><TableCell colSpan={5} align="center" sx={{ py: 4, color: '#cbd5e1' }}>Syncing...</TableCell></TableRow>)
              )}
            </TableBody>
          </Table>
          <TablePagination rowsPerPageOptions={[5, 10]} component="div" count={filtered.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
        </TableContainer>
      </div>

      {/* ✅ OTP VERIFICATION MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Key size={32} />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Verify Entry</h2>
            <p className="text-sm text-slate-500 mb-6 font-medium">Please enter the 6-digit code provided by the resident.</p>
            
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <input
                required
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="0 0 0 0 0 0"
                className="w-full text-center text-3xl font-black tracking-[0.5em] py-4 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:ring-0 transition-all outline-none bg-slate-50"
              />
              
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => { setShowOtpModal(false); setOtp(""); }} 
                  className="flex-1 py-3 text-xs font-black uppercase text-slate-400 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
                >
                  Verify Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD VISITOR MODAL (Existing) */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Log New Visitor</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Visitor Name</label>
                <input required value={form.visitorName} onChange={e => setForm({ ...form, visitorName: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Mobile Number</label>
                <input required type="tel" maxLength="10" value={form.mobileNumber} onChange={e => setForm({ ...form, mobileNumber: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Purpose</label>
                  <select value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white font-bold">
                    {["Visit", "Delivery", "Service", "Guest", "Other"].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Visiting Unit</label>
                  <select required value={form.visitingResident} onChange={e => setForm({ ...form, visitingResident: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white font-bold">
                    <option value="">Select Flat</option>
                    {residents.map(r => <option key={r._id} value={r._id}>{r.wing}-{r.flatNumber}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase shadow-lg mt-4">Send OTP to Resident</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorManagement;