import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TablePagination,
  IconButton, Tooltip, Chip, InputBase, MenuItem, Select, FormControl
} from "@mui/material";
import { FiEdit, FiTrash2, FiSearch, FiPlus, FiHome, FiUser, FiMapPin } from "react-icons/fi";
import { fetchFlats, fetchFlatSummary, deleteFlat } from "../../../store/slices/flatSlice";

const STATUS_STYLE = { 
  Occupied: { bg: "#ecfdf5", color: "#059669" }, 
  Vacant: { bg: "#f1f5f9", color: "#64748b" }, 
  "Under Maintenance": { bg: "#fffbeb", color: "#d97706" } 
};

const FlatList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { list: flats = [], loading, summary, summaryLoading } = useSelector((s) => s.flat) ?? {};
  
  // State for search, filter, and pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => { 
    dispatch(fetchFlats()); 
    dispatch(fetchFlatSummary()); 
  }, [dispatch]);

  // Filtering Logic
  const filtered = useMemo(() =>
    flats.filter((f) => {
      const matchSearch = f.flatNumber.toLowerCase().includes(search.toLowerCase()) || 
                          (f.owner?.name || "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || f.status === statusFilter;
      return matchSearch && matchStatus;
    }), [flats, search, statusFilter]);

  // Pagination Handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (id) => { 
    if (window.confirm("Are you sure you want to delete this flat?")) {
      dispatch(deleteFlat(id)); 
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Flat Management</h1>
          <p className="text-sm text-slate-500 font-medium">Inventory of wings, floors, and resident ownership.</p>
        </div>
        <button 
          onClick={() => navigate("/admin/flat/add")} 
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <FiPlus size={18} /> Add Flat
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Flats", val: summary?.total, color: "text-slate-900" },
          { label: "Occupied", val: summary?.occupied, color: "text-emerald-600" },
          { label: "Vacant", val: summary?.vacant, color: "text-slate-400" },
          { label: "Maintenance", val: summary?.underMaintenance, color: "text-amber-600" },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-3xl font-black ${color}`}>
              {summaryLoading ? "..." : (val ?? 0)}
            </p>
          </div>
        ))}
      </div>

      {/* TABLE CONTROLS */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 px-4 flex-1 min-w-[300px]">
          <FiSearch className="text-slate-400" />
          <InputBase
            placeholder="Search by Flat No. or Owner..."
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
            className="bg-white rounded-xl font-bold text-xs"
            sx={{ borderRadius: '12px', '.MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' } }}
          >
            <MenuItem value="All"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">All Status</span></MenuItem>
            <MenuItem value="Occupied"><span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Occupied</span></MenuItem>
            <MenuItem value="Vacant"><span className="text-xs font-bold uppercase tracking-wider text-slate-400">Vacant</span></MenuItem>
            <MenuItem value="Under Maintenance"><span className="text-xs font-bold uppercase tracking-wider text-amber-600">Maintenance</span></MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* MUI TABLE */}
      <TableContainer component={Paper} elevation={0} className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <Table sx={{ minWidth: 1000 }}>
          <TableHead className="bg-slate-50">
            <TableRow>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Flat No</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Floor / Block</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Type & Area</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Owner Details</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Maintenance</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {!loading ? filtered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((f) => (
              <TableRow key={f._id} hover>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm">
                      {f.flatNumber}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                    <FiMapPin className="text-slate-300" />
                    {f.block ? `${f.block} - ` : ""}Floor {f.floor}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <Chip 
                      label={f.type} 
                      size="small" 
                      sx={{ fontWeight: 800, fontSize: '9px', bgcolor: '#eff6ff', color: '#2563eb', borderRadius: '6px' }}
                    />
                    <div className="text-[11px] text-slate-400 font-bold">{f.area || 0} sqft</div>
                  </div>
                </TableCell>

                <TableCell>
                   <div className="flex items-center gap-2">
                     <FiUser className="text-slate-300" />
                     <div>
                       <div className="font-bold text-slate-900 text-sm">{f.owner?.name || "No Owner"}</div>
                       <div className="text-[10px] text-slate-400 font-medium">{f.owner?.phone || "N/A"}</div>
                     </div>
                   </div>
                </TableCell>

                <TableCell>
                  <div className="font-black text-slate-900">₹{f.monthlyMaintenance?.toLocaleString()}</div>
                  <div className="text-[9px] text-slate-400 font-black uppercase">Per Month</div>
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
                  <div className="flex justify-center gap-1">
                    <Tooltip title="Edit Flat">
                      <IconButton 
                        onClick={() => navigate(`/admin/flat/edit/${f._id}`)} 
                        size="small"
                        sx={{ color: '#2563eb', bgcolor: '#eff6ff', borderRadius: '10px', '&:hover': { bgcolor: '#dbeafe' } }}
                      >
                        <FiEdit size={14} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Flat">
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
                <TableRow key={i}><TableCell colSpan={7} sx={{ py: 6, textAlign: 'center', color: '#94a3b8' }}>Loading inventory...</TableCell></TableRow>
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

export default FlatList;