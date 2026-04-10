import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TablePagination,
  IconButton, Tooltip, Chip, InputBase, Avatar, Switch 
} from "@mui/material";
import {
  FiEdit, FiSearch, FiPlus, FiUser, FiPhone,
  FiLogIn, FiLogOut, FiMapPin, FiClock
} from "react-icons/fi";
import { fetchVisitors, updateVisitorStatus } from "../../../store/slices/visitorSlice";

const STATUS_STYLE = {
  Inside: { bg: "#ecfdf5", color: "#059669" },
  Exited: { bg: "#f1f5f9", color: "#64748b" },
};

const Visitors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // ✅ Pagination & Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { visitors = [], loading } = useSelector((state) => state.visitor || {});

  useEffect(() => {
    dispatch(fetchVisitors());
  }, [dispatch]);

  // ✅ Pagination Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  // Filtering Logic
  const filteredVisitors = useMemo(() =>
    visitors.filter((v) =>
      v.visitorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.flatNumber?.includes(searchTerm) ||
      v.mobileNumber?.includes(searchTerm)
    ), [visitors, searchTerm]);

  // Status Handlers
  const handleMarkExit = (id) => {
    if (window.confirm("Are you sure this visitor has exited?")) {
      dispatch(updateVisitorStatus({ id, status: "Exited", exitTime: new Date() }));
    }
  };

  const formatTime = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Visitor Management</h1>
          <p className="text-sm text-slate-500 font-medium">Real-time log of all society entries and exits.</p>
        </div>
        <button
          onClick={() => navigate("/admin/visitor/add")}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <FiPlus size={18} /> Log Visitor
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 px-4 max-w-md">
        <FiSearch className="text-slate-400" />
        <InputBase
          placeholder="Search by Visitor, Flat, or Phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full font-medium text-sm"
        />
      </div>

      {/* MUI TABLE CONTAINER */}
      <TableContainer component={Paper} elevation={0} className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <Table sx={{ minWidth: 900 }}>
          <TableHead className="bg-slate-50">
            <TableRow>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Visitor Details</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Visiting Unit</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Entry</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Exit</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading ? filteredVisitors
              // Apply Slicing for Pagination
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((v) => (
              <TableRow key={v._id} hover>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar sx={{ bgcolor: '#f1f5f9', color: '#64748b', width: 36, height: 36 }}>
                      <FiUser size={16} />
                    </Avatar>
                    <div>
                      <div className="font-bold text-slate-900">{v.visitorName}</div>
                      <div className="text-[10px] text-slate-400 font-black tracking-widest uppercase">{v.purpose || "General"}</div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                    <FiPhone className="text-slate-300" size={14} />
                    {v.mobileNumber}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                      <FiMapPin size={14} />
                    </div>
                    <span className="font-black text-indigo-600 text-sm">{v.flatNumber || (v.flat && v.flat.flatNumber) || "N/A"}</span>
                  </div>
                </TableCell>

                <TableCell>
                   <div className="flex items-center gap-1.5 text-emerald-600 font-black text-xs">
                      <FiLogIn size={14} /> {formatTime(v.entryTime)}
                   </div>
                </TableCell>

                <TableCell>
                   <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                      <FiLogOut size={14} /> {formatTime(v.exitTime)}
                   </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Chip 
                      label={v.status}
                      size="small"
                      sx={{ 
                        fontWeight: 900, 
                        fontSize: '9px',
                        textTransform: 'uppercase',
                        bgcolor: STATUS_STYLE[v.status]?.bg || STATUS_STYLE.Exited.bg,
                        color: STATUS_STYLE[v.status]?.color || STATUS_STYLE.Exited.color,
                        borderRadius: '8px'
                      }}
                    />
                    <Switch
                      checked={v.status === 'Inside'}
                      onChange={() => {
                        const nextStatus = v.status === 'Inside' ? 'Exited' : 'Inside';
                        dispatch(updateVisitorStatus({ id: v._id, status: nextStatus }));
                      }}
                      color="success"
                      size="small"
                      inputProps={{ 'aria-label': 'Toggle visitor status' }}
                    />
                  </div>
                </TableCell>

                <TableCell align="center">
                  <div className="flex justify-center gap-1">
                    {v.status === "Inside" && (
                      <Tooltip title="Mark Exit">
                        <IconButton 
                          onClick={() => handleMarkExit(v._id)}
                          size="small"
                          sx={{ color: '#d97706', bgcolor: '#fffbeb', borderRadius: '10px', '&:hover': { bgcolor: '#fef3c7' } }}
                        >
                          <FiClock size={14} />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Edit Log">
                      <IconButton 
                        onClick={() => navigate(`/admin/visitor/edit/${v._id}`)} 
                        size="small"
                        sx={{ color: '#2563eb', bgcolor: '#eff6ff', borderRadius: '10px', '&:hover': { bgcolor: '#dbeafe' } }}
                      >
                        <FiEdit size={14} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              [...Array(rowsPerPage)].map((_, i) => (
                <TableRow key={i}><TableCell colSpan={7} sx={{ py: 6, textAlign: 'center', color: '#cbd5e1' }}>Loading...</TableCell></TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* ✅ PAGINATION COMPONENT */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredVisitors.length}
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

export default Visitors;