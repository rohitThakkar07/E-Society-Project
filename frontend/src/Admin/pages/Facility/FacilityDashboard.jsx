import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TablePagination,
  IconButton, Tooltip, Chip, Avatar
} from "@mui/material";
import { 
  FiEdit, FiTrash2, FiPlus, FiTool, 
  FiActivity, FiCheckCircle, FiAlertCircle, FiXCircle 
} from "react-icons/fi";
import { fetchFacilities, deleteFacility } from "../../../store/slices/facilitySlice";

const STATUS_STYLE = {
  Available: { bg: "#ecfdf5", color: "#059669" },
  Maintenance: { bg: "#fffbeb", color: "#d97706" },
  Closed: { bg: "#fef2f2", color: "#dc2626" },
};

const FacilityDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { facilities = [], loading } = useSelector((state) => state.facility);

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchFacilities());
  }, [dispatch]);

  // Stats Logic
  const stats = useMemo(() => ({
    total: facilities.length,
    available: facilities.filter(f => f.status === "Available").length,
    maintenance: facilities.filter(f => f.status === "Maintenance").length,
    closed: facilities.filter(f => f.status === "Closed").length,
  }), [facilities]);

  // Handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this facility?")) {
      dispatch(deleteFacility(id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Facility Overview
          </h1>
          <p className="text-sm text-slate-500 font-medium">Monitor society asset status and availability.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => navigate("/admin/facility-booking/list")} 
                className="bg-white text-slate-600 px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 font-bold text-sm transition-all"
            >
                View Bookings
            </button>
            <button 
                onClick={() => navigate("/admin/facility/add")} 
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
            >
                <FiPlus size={18} /> Add Facility
            </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Resources", val: stats.total, color: "text-slate-900", icon: <FiActivity />, bg: "bg-slate-100" },
          { label: "Active", val: stats.available, color: "text-emerald-600", icon: <FiCheckCircle />, bg: "bg-emerald-50" },
          { label: "Maintenance", val: stats.maintenance, color: "text-amber-600", icon: <FiTool />, bg: "bg-amber-50" },
          { label: "Closed", val: stats.closed, color: "text-red-600", icon: <FiXCircle />, bg: "bg-red-50" },
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

      {/* FACILITY LIST TABLE */}
      <div className="mb-4">
        <h2 className="text-lg font-black text-slate-800 mb-4 px-1 uppercase tracking-tight">Facility Inventory</h2>
        <TableContainer component={Paper} elevation={0} className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <Table sx={{ minWidth: 800 }}>
            <TableHead className="bg-slate-50">
              <TableRow>
                <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Asset Name</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {!loading ? facilities
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((f) => (
                <TableRow key={f._id} hover>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar sx={{ bgcolor: '#eff6ff', color: '#2563eb', width: 40, height: 40, borderRadius: '12px' }}>
                        <FiTool size={20} />
                      </Avatar>
                      <div className="font-bold text-slate-900 text-sm">{f.name}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell sx={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic', maxWidth: '300px' }}>
                    {f.description || "No description provided"}
                  </TableCell>

                  <TableCell>
                    <Chip 
                      label={f.status}
                      size="small"
                      sx={{ 
                        fontWeight: 900, 
                        fontSize: '9px',
                        textTransform: 'uppercase',
                        bgcolor: STATUS_STYLE[f.status]?.bg || '#f1f5f9',
                        color: STATUS_STYLE[f.status]?.color || '#64748b',
                        borderRadius: '8px'
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <div className="flex justify-center gap-2">
                      <Tooltip title="Edit Facility">
                        <IconButton 
                          onClick={() => navigate(`/admin/facility/edit/${f._id}`)} 
                          size="small"
                          sx={{ color: '#2563eb', bgcolor: '#eff6ff', borderRadius: '10px', '&:hover': { bgcolor: '#dbeafe' } }}
                        >
                          <FiEdit size={14} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Facility">
                        <IconButton 
                          onClick={() => handleDelete(f._id)} 
                          size="small"
                          sx={{ color: '#ef4444', bgcolor: '#fef2f2', borderRadius: '10px', '&:hover': { bgcolor: '#fee2e2' } }}
                        >
                          <FiTrash2 size={14} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                [...Array(rowsPerPage)].map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={4} sx={{ py: 6, textAlign: 'center', color: '#94a3b8' }}>Updating assets...</TableCell></TableRow>
                ))
              )}

              {!loading && facilities.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} sx={{ py: 10, textAlign: 'center', fontWeight: 600, color: '#94a3b8' }}>
                    No society assets registered yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={facilities.length}
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
    </div>
  );
};

export default FacilityDashboard;