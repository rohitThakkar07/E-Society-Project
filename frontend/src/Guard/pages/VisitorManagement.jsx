import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination,
  IconButton, Tooltip, Chip, InputBase, Avatar
} from "@mui/material";
import {
  Users, Plus, Search, CheckCircle, XCircle,
  Clock, User, MapPin, Key, ShieldCheck, RefreshCw
} from "lucide-react";
import { fetchVisitors, denyVisitor, approveVisitor } from "../../store/slices/visitorSlice";
import { toast } from "react-toastify";

const statusConfig = {
  Pending:      { bg: "#fffbeb", color: "#d97706" },
  Approved:     { bg: "#ecfdf5", color: "#059669" },
  Denied:       { bg: "#fef2f2", color: "#dc2626" },
  Inside:       { bg: "#dbeafe", color: "#1d4ed8" },
  Exited:       { bg: "#f1f5f9", color: "#64748b" },
  "Checked Out":{ bg: "#f1f5f9", color: "#64748b" },
};

const VisitorManagement = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { visitors = [], loading } = useSelector((s) => s.visitor || {});

  const user    = JSON.parse(localStorage.getItem("userData") || "{}");
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const isGuard = user?.role?.toLowerCase() === "guard";

  // OTP modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp,          setOtp]          = useState("");
  const [verifyingId,  setVerifyingId]  = useState(null);

  // Filter / pagination state
  const [search,      setSearch]      = useState("");
  const [filter,      setFilter]      = useState("All");
  const [page,        setPage]        = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchVisitors());
  }, [dispatch]);

  // OTP verify handler
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    const res = await dispatch(approveVisitor({ id: verifyingId, otp }));
    if (res.meta.requestStatus === "fulfilled") {
      setShowOtpModal(false);
      setOtp("");
      setVerifyingId(null);
    }
  };

  const filtered = useMemo(() =>
    (visitors || []).filter((v) => {
      const matchStatus = filter === "All" || v.status === filter;
      const matchSearch =
        v.visitorName?.toLowerCase().includes(search.toLowerCase()) ||
        v.mobileNumber?.includes(search) ||
        v.wing?.toLowerCase().includes(search.toLowerCase()) ||
        v.flatNumber?.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    }),
    [visitors, filter, search]
  );

  const handleChangePage        = (_, p)  => setPage(p);
  const handleChangeRowsPerPage = (e)     => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Users size={22} className="text-violet-500" /> Visitor Log
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""} · OTP-verified gate entries
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(fetchVisitors())}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition"
            title="Refresh"
          >
            <RefreshCw size={16} className="text-slate-500" />
          </button>
          <Link
            to="/guard/visitor/add"
            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm active:scale-95 transition-all text-sm hover:bg-slate-800"
          >
            <Plus size={16} /> New Entry
          </Link>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="bg-white p-2 rounded-2xl border border-slate-200 flex items-center gap-3 px-4 flex-1 min-w-[280px] shadow-sm">
          <Search size={16} className="text-slate-400 shrink-0" />
          <InputBase
            placeholder="Search visitor, flat, wing, mobile…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm"
            sx={{ fontWeight: 500 }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Pending", "Approved", "Inside", "Exited", "Denied"].map((s) => (
            <button
              key={s}
              onClick={() => { setFilter(s); setPage(0); }}
              className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                filter === s
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <TableContainer
        component={Paper}
        elevation={0}
        className="rounded-3xl border border-slate-100 overflow-hidden shadow-sm"
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8fafc" }}>
              {["Visitor", "Contact", "Visiting Unit", "Purpose", "Time", "Status", "Action"].map((h, i) => (
                <TableCell
                  key={h}
                  align={i === 6 ? "center" : "left"}
                  sx={{ fontWeight: 800, fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.8px", py: 1.5 }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: "#cbd5e1", fontSize: "12px" }}>
                    Loading visitors…
                  </TableCell>
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Users size={32} className="text-slate-200" />
                    <span className="text-sm font-medium">No visitors found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((v) => {
                const sc = statusConfig[v.status] || statusConfig.Pending;
                const unit = v.visitingResident
                  ? `${v.visitingResident.wing}-${v.visitingResident.flatNumber}`
                  : `${v.wing || "?"}-${v.flatNumber || "?"}`;

                return (
                  <TableRow
                    key={v._id}
                    hover
                    onClick={() => navigate(`/guard/visitor/${v._id}`)}
                    sx={{ cursor: "pointer" }}
                  >
                    {/* Visitor */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar sx={{ bgcolor: "#f5f3ff", color: "#7c3aed", width: 34, height: 34, fontSize: 14, fontWeight: 700 }}>
                          {v.visitorName?.[0]?.toUpperCase()}
                        </Avatar>
                        <p className="font-bold text-slate-800 text-sm">{v.visitorName}</p>
                      </div>
                    </TableCell>

                    {/* Contact */}
                    <TableCell>
                      <span className="text-slate-600 font-semibold text-xs">{v.mobileNumber || "—"}</span>
                    </TableCell>

                    {/* Visiting Unit */}
                    <TableCell>
                      <div className="flex items-center gap-1 text-indigo-600 font-black text-xs uppercase">
                        <MapPin size={12} className="text-indigo-300 shrink-0" />
                        {unit}
                      </div>
                    </TableCell>

                    {/* Purpose */}
                    <TableCell>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase">
                        {v.purpose || "—"}
                      </span>
                    </TableCell>

                    {/* Time */}
                    <TableCell>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(v.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={v.status}
                        size="small"
                        sx={{
                          fontWeight: 900,
                          fontSize: "9px",
                          textTransform: "uppercase",
                          bgcolor: sc.bg,
                          color: sc.color,
                          borderRadius: "8px",
                          letterSpacing: "0.5px",
                        }}
                      />
                    </TableCell>

                    {/* Action */}
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      {(isAdmin || isGuard) && v.status === "Pending" && (
                        <div className="flex gap-2 justify-center">
                          <Tooltip title="Verify OTP & Approve">
                            <IconButton
                              size="small"
                              onClick={() => { setVerifyingId(v._id); setShowOtpModal(true); }}
                              sx={{ color: "#10b981", bgcolor: "#ecfdf5", borderRadius: "10px", "&:hover": { bgcolor: "#d1fae5" } }}
                            >
                              <ShieldCheck size={15} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Deny Entry">
                            <IconButton
                              size="small"
                              onClick={() => dispatch(denyVisitor(v._id))}
                              sx={{ color: "#ef4444", bgcolor: "#fef2f2", borderRadius: "10px", "&:hover": { bgcolor: "#fee2e2" } }}
                            >
                              <XCircle size={15} />
                            </IconButton>
                          </Tooltip>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: "1px solid #f1f5f9",
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
              fontSize: "11px",
              fontWeight: 700,
              color: "#94a3b8",
            },
          }}
        />
      </TableContainer>

      {/* OTP VERIFICATION MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Key size={30} />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-1">Verify OTP</h2>
            <p className="text-sm text-slate-500 mb-6 font-medium">
              Enter the 6-digit code provided by the resident.
            </p>
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <input
                required
                autoFocus
                type="text"
                maxLength="6"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="• • • • • •"
                className="w-full text-center text-3xl font-black tracking-[0.5em] py-4 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none bg-slate-50 transition"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowOtpModal(false); setOtp(""); setVerifyingId(null); }}
                  className="flex-1 py-3 text-sm font-bold text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={otp.length !== 6}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50 transition"
                >
                  Verify & Allow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorManagement;