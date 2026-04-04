import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TablePagination,
  IconButton, Tooltip, Chip, InputBase, MenuItem, Select, FormControl 
} from "@mui/material";
import { 
  FiEdit, FiTrash2, FiSearch, FiPlus, 
  FiEye, FiFileText, FiHome, FiUser 
} from "react-icons/fi";
// ✅ Ensure path is correct
import {
  fetchMaintenanceList,
  deleteMaintenance,
} from "../../../../store/slices/maintenanceSlice";

const STATUS_STYLE = {
  Paid: { bg: "#ecfdf5", color: "#059669" },
  Pending: { bg: "#fffbeb", color: "#d97706" },
  Overdue: { bg: "#fef2f2", color: "#dc2626" },
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TABS = [
  { label: "Overview", path: "/admin/maintenance/dashboard" },
  { label: "Records",  path: "/admin/maintenance/list" },
  { label: "Add Bill", path: "/admin/maintenance/add" },
  { label: "Generate", path: "/admin/maintenance/generate" },
];

const MaintenanceList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const maintenanceState = useSelector((s) => s.maintenance || {});
  const maintenanceData = maintenanceState.list || maintenanceState.records || [];
  const loading = maintenanceState.loading;

  // Pagination & Filter State
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchMaintenanceList());
  }, [dispatch]);

  // ✅ RELATIONSHIP-AWARE FILTER (Logic Unchanged)
  const filtered = useMemo(() => {
    return (maintenanceData || []).filter((item) => {
      const wing = item.flat?.wing || item.resident?.wing || "";
      const flatNo = item.flat?.flatNumber || item.resident?.flatNumber || "";
      const firstName = item.resident?.firstName || "";
      const lastName = item.resident?.lastName || "";

      const searchSource = `${wing} ${flatNo} ${firstName} ${lastName}`.toLowerCase();
      const matchSearch = searchSource.includes(search.toLowerCase());

      const matchMonth = monthFilter === "All" || item.month === monthFilter;
      const matchStatus = statusFilter === "All" || item.status === statusFilter;

      return matchSearch && matchMonth && matchStatus;
    });
  }, [maintenanceData, search, monthFilter, statusFilter]);

  // Pagination Handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this maintenance record?")) {
      dispatch(deleteMaintenance(id));
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Maintenance</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Manage invoices and track society collections.</p>
        </div>
        <button onClick={() => navigate("/admin/maintenance/add")} className="admin-btn-primary">
          <FiPlus size={16} /> Add Bill
        </button>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-6 w-fit flex-wrap">
        {TABS.map((tab) => (
          <button key={tab.path} onClick={() => navigate(tab.path)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${location.pathname === tab.path ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* FILTERS ROW */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 px-4 flex-1 min-w-[300px]">
          <FiSearch className="text-slate-400" />
          <InputBase
            placeholder="Search by Flat or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full font-medium text-sm"
          />
        </div>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            displayEmpty
            className="bg-white rounded-xl font-bold text-xs shadow-sm"
            sx={{ borderRadius: '12px', '.MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' } }}
          >
            <MenuItem value="All"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">All Months</span></MenuItem>
            {MONTHS.map((m) => (
              <MenuItem key={m} value={m}><span className="text-xs font-bold uppercase tracking-wider">{m}</span></MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
            className="bg-white rounded-xl font-bold text-xs shadow-sm"
            sx={{ borderRadius: '12px', '.MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' } }}
          >
            <MenuItem value="All"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">All Status</span></MenuItem>
            <MenuItem value="Pending"><span className="text-xs font-bold uppercase tracking-wider text-amber-600">Pending</span></MenuItem>
            <MenuItem value="Paid"><span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Paid</span></MenuItem>
            <MenuItem value="Overdue"><span className="text-xs font-bold uppercase tracking-wider text-red-600">Overdue</span></MenuItem>
          </Select>
        </FormControl>

        {(search || monthFilter !== "All" || statusFilter !== "All") && (
          <button
            onClick={() => { setSearch(""); setMonthFilter("All"); setStatusFilter("All"); }}
            className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* MUI TABLE CONTAINER */}
      <TableContainer component={Paper} elevation={0} className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <Table sx={{ minWidth: 1000 }}>
          <TableHead className="bg-slate-50">
            <TableRow>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>#</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Flat & Wing</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Resident</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading ? filtered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => (
              <TableRow key={item._id} hover>
                <TableCell sx={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700 }}>
                  {page * rowsPerPage + index + 1}
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                      <FiHome size={14} />
                    </div>
                    <div>
                      <span className="font-black text-slate-900 text-sm">
                        {item.flat?.wing || item.resident?.wing || "—"}-{item.flat?.flatNumber || item.resident?.flatNumber || "—"}
                      </span>
                      <div className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">
                        {item.flat?.type || "Unit"}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700 text-sm">
                      {item.resident?.firstName || "Resident"} {item.resident?.lastName || ""}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {item.resident?.mobileNumber || "No Contact"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="font-black text-slate-900 text-sm">
                    ₹{(item.amount + (item.lateFee || 0)).toLocaleString()}
                  </div>
                  <div className="text-[9px] text-indigo-500 font-black uppercase tracking-tighter">
                    {item.month} {item.year}
                  </div>
                </TableCell>

                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '12px' }}>
                  {item.dueDate ? new Date(item.dueDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }) : "—"}
                </TableCell>

                <TableCell>
                  <Chip 
                    label={item.status}
                    size="small"
                    sx={{ 
                      fontWeight: 900, 
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      bgcolor: STATUS_STYLE[item.status]?.bg || '#f1f5f9',
                      color: STATUS_STYLE[item.status]?.color || '#64748b',
                      borderRadius: '8px'
                    }}
                  />
                </TableCell>

                <TableCell align="center">
                  <div className="flex justify-center gap-1">
                    <Tooltip title="View Details">
                      <IconButton onClick={() => navigate(`/admin/maintenance/${item._id}`)} size="small" sx={{ color: '#6366f1', bgcolor: '#f5f3ff', borderRadius: '10px' }}>
                        <FiEye size={14} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Invoice">
                      <IconButton onClick={() => navigate(`/admin/maintenance/${item._id}/invoice`)} size="small" sx={{ color: '#10b981', bgcolor: '#ecfdf5', borderRadius: '10px' }}>
                        <FiFileText size={14} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(item._id)} size="small" sx={{ color: '#ef4444', bgcolor: '#fef2f2', borderRadius: '10px' }}>
                        <FiTrash2 size={14} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              [...Array(rowsPerPage)].map((_, i) => (
                <TableRow key={i}><TableCell colSpan={7} sx={{ py: 6, textAlign: 'center', color: '#cbd5e1' }}>Loading records...</TableCell></TableRow>
              ))
            )}

            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ py: 10, textAlign: 'center', fontWeight: 600, color: '#94a3b8' }}>
                  No maintenance records found.
                </TableCell>
              </TableRow>
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

export default MaintenanceList;