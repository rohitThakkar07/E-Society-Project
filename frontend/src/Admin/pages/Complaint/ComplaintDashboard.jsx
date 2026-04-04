import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TablePagination,
  IconButton, Tooltip, Chip, InputBase, MenuItem, Select, FormControl, Avatar
} from "@mui/material";
import { 
  FiSearch, FiEye, FiAlertCircle, FiClock, 
  FiCheckCircle, FiInbox, FiFilter, FiTag 
} from "react-icons/fi";
import { fetchComplaints, updateComplaintStatus } from "../../../store/slices/complaintSlice";

const STATUS_STYLE = {
  Pending: { bg: "#fef2f2", color: "#dc2626" },
  "In Progress": { bg: "#fffbeb", color: "#d97706" },
  Resolved: { bg: "#ecfdf5", color: "#059669" },
};

const PRIORITY_STYLE = {
  High: { bg: "#fff1f2", color: "#e11d48", border: "#ffe4e6" },
  Medium: { bg: "#eff6ff", color: "#2563eb", border: "#dbeafe" },
  Low: { bg: "#f8fafc", color: "#64748b", border: "#f1f5f9" },
};

const ComplaintDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { complaints = [], loading } = useSelector((state) => state.complaint) ?? {};
  
  // State for search, filter, and pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  // Stats calculation
  const stats = useMemo(() => ({
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Pending").length,
    inProgress: complaints.filter(c => c.status === "In Progress").length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
  }), [complaints]);

  // Filter Logic
  const filtered = useMemo(() =>
    complaints.filter((c) => {
      const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase()) || 
                          c.category?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      return matchSearch && matchStatus;
    }), [complaints, search, statusFilter]);

  // Pagination Handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Complaint Management</h1>
          <p className="text-sm text-slate-500 font-medium">Track and resolve resident issues and maintenance requests.</p>
        </div>
      </div>

      {/* SUMMARY ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Issues", val: stats.total, color: "text-slate-900", icon: <FiInbox size={18} />, bg: "bg-slate-100" },
          { label: "Pending", val: stats.pending, color: "text-red-600", icon: <FiAlertCircle size={18} />, bg: "bg-red-50" },
          { label: "In Progress", val: stats.inProgress, color: "text-amber-600", icon: <FiClock size={18} />, bg: "bg-amber-50" },
          { label: "Resolved", val: stats.resolved, color: "text-emerald-600", icon: <FiCheckCircle size={18} />, bg: "bg-emerald-50" },
        ].map(({ label, val, color, icon, bg }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>{icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
              <p className={`text-2xl font-black ${color}`}>{loading ? "..." : (val ?? 0)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE CONTROLS */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 px-4 flex-1 min-w-[300px]">
          <FiSearch className="text-slate-400" />
          <InputBase
            placeholder="Search by Title or Category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full font-medium text-sm"
          />
        </div>
        
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
            className="bg-white rounded-xl font-bold text-xs shadow-sm"
            sx={{ borderRadius: '12px', '.MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' } }}
          >
            <MenuItem value="All"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">All Status</span></MenuItem>
            <MenuItem value="Pending"><span className="text-xs font-bold uppercase tracking-wider text-red-600">Pending</span></MenuItem>
            <MenuItem value="In Progress"><span className="text-xs font-bold uppercase tracking-wider text-amber-600">In Progress</span></MenuItem>
            <MenuItem value="Resolved"><span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Resolved</span></MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* MUI TABLE CONTAINER */}
      <TableContainer component={Paper} elevation={0} className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <Table sx={{ minWidth: 800 }}>
          <TableHead className="bg-slate-50">
            <TableRow>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Complaint Title</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {!loading ? filtered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((c) => (
              <TableRow key={c._id} hover>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-sm">{c.title}</span>
                    <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">ID: {c._id.slice(-6)}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                      <FiTag size={14} />
                    </div>
                    <span className="font-bold text-slate-600 text-xs">{c.category}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <Chip 
                    label={c.priority}
                    size="small"
                    sx={{ 
                      fontWeight: 900, 
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      bgcolor: PRIORITY_STYLE[c.priority]?.bg || PRIORITY_STYLE.Low.bg,
                      color: PRIORITY_STYLE[c.priority]?.color || PRIORITY_STYLE.Low.color,
                      border: `1px solid ${PRIORITY_STYLE[c.priority]?.border || PRIORITY_STYLE.Low.border}`,
                      borderRadius: '6px'
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Select
                    value={c.status}
                    onChange={(e) => dispatch(updateComplaintStatus({ id: c._id, status: e.target.value }))}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      '& .MuiSelect-select': { paddingY: '6px' }
                    }}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                  </Select>
                </TableCell>

                <TableCell align="center">
                  <Tooltip title="View Full Details">
                    <IconButton 
                      onClick={() => navigate(`/admin/complaints/${c._id}`)} 
                      size="small"
                      sx={{ color: '#2563eb', bgcolor: '#eff6ff', borderRadius: '10px', '&:hover': { bgcolor: '#dbeafe' } }}
                    >
                      <FiEye size={16} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )) : (
              [...Array(rowsPerPage)].map((_, i) => (
                <TableRow key={i}><TableCell colSpan={5} sx={{ py: 6, textAlign: 'center', color: '#cbd5e1' }}>Loading tickets...</TableCell></TableRow>
              ))
            )}
            
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 10, textAlign: 'center', fontWeight: 600, color: '#94a3b8' }}>
                  No complaints found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: '1px solid #f1f5f9',
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              fontWeight: 800,
              fontSize: '10px',
              textTransform: 'uppercase',
              color: '#94a3b8'
            }
          }}
        />
      </TableContainer>
    </div>
  );
};

export default ComplaintDashboard;