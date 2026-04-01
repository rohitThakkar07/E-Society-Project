import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TablePagination,
  IconButton, Tooltip, Avatar, Chip, InputBase
} from "@mui/material";
import { 
  FiEdit, FiTrash2, FiSearch, FiPlus, 
  FiUser, FiHome, FiPhone, FiMail 
} from "react-icons/fi";
import { fetchResidents, deleteResident } from "../../../store/slices/residentSlice";

const ResidentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // State for search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { residents = [], loading } = useSelector((state) => state.resident);

  useEffect(() => {
    dispatch(fetchResidents());
  }, [dispatch]);

  // Filtering Logic
  const filteredResidents = useMemo(() =>
    residents.filter((r) =>
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.flatNumber?.includes(searchTerm) ||
      r.mobileNumber?.includes(searchTerm)
    ), [residents, searchTerm]);

  // Pagination Handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this resident?")) {
      dispatch(deleteResident(id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Resident Directory</h1>
          <p className="text-sm text-slate-500 font-medium">Manage society members and occupancy details.</p>
        </div>
        <button 
          onClick={() => navigate("/admin/residents/add")} 
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-slate-800 font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <FiPlus size={18} /> Add Resident
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 px-4 max-w-md">
        <FiSearch className="text-slate-400" />
        <InputBase
          placeholder="Search residents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full font-medium text-sm"
        />
      </div>

      {/* MUI TABLE CONTAINER */}
      <TableContainer component={Paper} elevation={0} className="rounded-2xl border border-slate-100 overflow-hidden">
        <Table sx={{ minWidth: 700 }}>
          <TableHead className="bg-slate-50">
            <TableRow>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Resident Details</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Unit</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {!loading ? filteredResidents
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((r) => (
              <TableRow key={r._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                
                {/* Resident Identity */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar sx={{ bgcolor: '#f1f5f9', color: '#64748b', width: 36, height: 36 }}>
                      <FiUser size={16} />
                    </Avatar>
                    <div>
                      <div className="font-bold text-slate-900">{r.firstName} {r.lastName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <FiMail size={10} /> {r.email || "No email"}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Flat Details */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                      <FiHome size={14} />
                    </div>
                    <span className="font-black text-indigo-600 text-sm">{r.flatNumber}</span>
                  </div>
                </TableCell>

                {/* Resident Type */}
                <TableCell>
                  <Chip 
                    label={r.residentType} 
                    size="small"
                    sx={{ 
                      fontWeight: 800, 
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      bgcolor: r.residentType === 'Owner' ? '#eff6ff' : '#faf5ff',
                      color: r.residentType === 'Owner' ? '#2563eb' : '#9333ea',
                      border: '1px solid currentColor',
                      borderRadius: '8px'
                    }} 
                  />
                </TableCell>

                {/* Contact */}
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                    <FiPhone className="text-slate-300" size={14} />
                    {r.mobileNumber}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${r.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className={`text-[11px] font-black uppercase tracking-tighter ${r.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {r.status}
                    </span>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell align="center">
                  <div className="flex justify-center gap-1">
                    <Tooltip title="Edit Profile">
                      <IconButton onClick={() => navigate(`/admin/residents/edit/${r._id}`)} size="small" sx={{ color: '#2563eb', bgcolor: '#eff6ff', borderRadius: '10px', '&:hover': { bgcolor: '#dbeafe' } }}>
                        <FiEdit size={14} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove Resident">
                      <IconButton onClick={() => handleDelete(r._id)} size="small" sx={{ color: '#ef4444', bgcolor: '#fef2f2', borderRadius: '10px', '&:hover': { bgcolor: '#fee2e2' } }}>
                        <FiTrash2 size={14} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>

              </TableRow>
            )) : (
              // Loading Skeleton State
              [...Array(rowsPerPage)].map((_, i) => (
                <TableRow key={i}><TableCell colSpan={6} sx={{ py: 4, textAlign: 'center', color: '#cbd5e1' }}>Loading data...</TableCell></TableRow>
              ))
            )}
            
            {!loading && filteredResidents.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 10, textAlign: 'center', fontWeight: 600, color: '#94a3b8' }}>
                  No residents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredResidents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: '1px solid #f1f5f9',
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              fontWeight: 700,
              fontSize: '11px',
              textTransform: 'uppercase',
              color: '#64748b'
            }
          }}
        />
      </TableContainer>
    </div>
  );
};

export default ResidentList;