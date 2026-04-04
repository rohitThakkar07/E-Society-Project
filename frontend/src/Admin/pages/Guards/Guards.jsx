import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TablePagination,
  IconButton, Tooltip, Chip, InputBase, MenuItem, Select, FormControl, Avatar, Switch
} from "@mui/material";
import { 
  FiEdit, FiTrash2, FiSearch, FiPlus, 
  FiShield, FiClock, FiPhone, FiCalendar, FiMail
} from "react-icons/fi";

import { fetchGuards, deleteGuard, updateGuardStatus } from "../../../store/slices/guardSlice"; 

const STATUS_STYLE = { 
  Active: { bg: "#ecfdf5", color: "#059669" }, 
  OnLeave: { bg: "#fffbeb", color: "#d97706" }, 
  Inactive: { bg: "#f1f5f9", color: "#64748b" } 
};

const SHIFT_STYLE = { 
  Day: "bg-orange-50 text-orange-600 border-orange-100", 
  Night: "bg-slate-800 text-white border-slate-700" 
};

const GuardList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { guards = [], loading } = useSelector((s) => s.guard || {});
  
  const [search, setSearch] = useState("");
  const [shiftFilter, setShiftFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => { 
    dispatch(fetchGuards()); 
  }, [dispatch]);

  const filtered = useMemo(() =>
    guards.filter((g) => {
      const matchSearch = 
        g.name?.toLowerCase().includes(search.toLowerCase()) || 
        g.mobileNumber?.includes(search) ||
        g.email?.toLowerCase().includes(search.toLowerCase()) ||
        g.guardId?.toLowerCase().includes(search.toLowerCase());
      const matchShift = shiftFilter === "All" || g.shift === shiftFilter;
      return matchSearch && matchShift;
    }), [guards, search, shiftFilter]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (id) => { 
    if (window.confirm("Are you sure you want to remove this guard?")) {
      dispatch(deleteGuard(id)); 
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
             Security Personnel
          </h1>
          <p className="text-sm text-slate-500 font-medium">Manage security staff, shifts, and contact records.</p>
        </div>
        <button 
          onClick={() => navigate("/admin/guards/add")} 
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-slate-800 font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <FiPlus size={18} /> Add Guard
        </button>
      </div>

      {/* CONTROLS */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 px-4 flex-1 min-w-[300px]">
          <FiSearch className="text-slate-400" />
          <InputBase
            placeholder="Search by Name, Email, Mobile or Guard ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full font-medium text-sm"
          />
        </div>
        
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
            displayEmpty
            className="bg-white rounded-xl font-bold text-xs"
            sx={{ borderRadius: '12px', '.MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' } }}
          >
            <MenuItem value="All"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">All Shifts</span></MenuItem>
            <MenuItem value="Day"><span className="text-xs font-bold uppercase tracking-wider text-orange-500">Day Shift</span></MenuItem>
            <MenuItem value="Night"><span className="text-xs font-bold uppercase tracking-wider text-slate-700">Night Shift</span></MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* TABLE */}
      <TableContainer component={Paper} elevation={0} className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <Table sx={{ minWidth: 900 }}>
          <TableHead className="bg-slate-50">
            <TableRow>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Guard Identity</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Shift</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Joining Date</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>ID Proof</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {!loading ? (
              filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ py: 8, textAlign: 'center', color: '#94a3b8' }}>
                    <div className="flex flex-col items-center gap-2">
                      <FiShield size={32} className="text-slate-200" />
                      <span className="text-sm font-medium">No guards found</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((g) => (
                    <TableRow key={g._id} hover>
                      {/* Guard Identity */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar sx={{ bgcolor: '#f8fafc', color: '#475569', width: 42, height: 42, border: '1px solid #f1f5f9' }}>
                            <FiShield size={20} />
                          </Avatar>
                          <div>
                            <div className="font-black text-slate-900 text-sm uppercase">{g.name}</div>
                            <div className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">
                              {g.guardId || `GRD-${g._id?.slice(-5).toUpperCase()}`}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Shift */}
                      <TableCell>
                        <Chip
                          icon={<FiClock size={12} className="ml-1" />}
                          label={`${g.shift || "—"} SHIFT`}
                          size="small"
                          className={SHIFT_STYLE[g.shift] || "bg-gray-100 text-gray-600"}
                          sx={{ fontWeight: 900, fontSize: '9px', borderRadius: '8px', border: '1px solid transparent' }}
                        />
                      </TableCell>

                      {/* Contact — phone + email */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-bold text-slate-700 text-xs">
                            <FiPhone className="text-slate-300 shrink-0" size={13} />
                            {g.mobileNumber || "—"}
                          </div>
                          {g.email && (
                            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                              <FiMail className="text-slate-200 shrink-0" size={12} />
                              <span className="truncate max-w-[160px]">{g.email}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Joining Date */}
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs">
                          <FiCalendar className="text-slate-300 shrink-0" size={13} />
                          {formatDate(g.joiningDate)}
                        </div>
                      </TableCell>

                      {/* ID Proof */}
                      <TableCell>
                        <div className="text-xs text-slate-600 font-semibold">
                          {g.idProofType || "—"}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                          #{g.idProofNumber || "—"}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Chip 
                            label={g.status}
                            size="small"
                            sx={{ 
                              fontWeight: 900, 
                              fontSize: '9px',
                              textTransform: 'uppercase',
                              bgcolor: STATUS_STYLE[g.status]?.bg || '#f1f5f9',
                              color: STATUS_STYLE[g.status]?.color || '#64748b',
                              borderRadius: '8px'
                            }}
                          />
                          <Switch
                            checked={g.status === 'Active'}
                            onChange={() => dispatch(updateGuardStatus({ id: g._id, status: g.status === 'Active' ? 'Inactive' : 'Active' }))}
                            color="success"
                            size="small"
                            inputProps={{ 'aria-label': 'Toggle guard status' }}
                          />
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="center">
                        <div className="flex justify-center gap-1">
                          <Tooltip title="Edit Guard">
                            <IconButton 
                              onClick={() => navigate(`/admin/guards/edit/${g._id}`)} 
                              size="small"
                              sx={{ color: '#2563eb', bgcolor: '#eff6ff', borderRadius: '10px', '&:hover': { bgcolor: '#dbeafe' } }}
                            >
                              <FiEdit size={14} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Guard">
                            <IconButton 
                              onClick={() => handleDelete(g._id)} 
                              size="small"
                              sx={{ color: '#ef4444', bgcolor: '#fef2f2', borderRadius: '10px', '&:hover': { bgcolor: '#fee2e2' } }}
                            >
                              <FiTrash2 size={14} />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              )
            ) : (
              [...Array(rowsPerPage)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7} sx={{ py: 6, textAlign: 'center', color: '#94a3b8' }}>
                    Loading guard registry...
                  </TableCell>
                </TableRow>
              ))
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

export default GuardList;