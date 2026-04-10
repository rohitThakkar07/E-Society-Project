import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // ✅ Added Redux hooks
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TablePagination,
  IconButton, Tooltip, Chip, InputBase, Avatar
} from "@mui/material";
import { FiEdit, FiTrash2, FiSearch, FiPlus, FiGrid, FiLayers } from "react-icons/fi";

// ✅ Import your thunks from the flatSlice
import { fetchFlats, deleteFlat } from "../../../store/slices/flatSlice"; 

const Flats = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Connect to Redux Store
  const { list: flats = [], loading } = useSelector((state) => state.flat || {});

  // State for UI interaction
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ✅ Fetch real data on mount
  useEffect(() => {
    dispatch(fetchFlats());
  }, [dispatch]);

  // Handlers
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this flat?")) {
      dispatch(deleteFlat(id));
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ✅ Optimized Filter Logic for real data
  const filteredFlats = useMemo(() => 
    flats.filter((flat) =>
      `${flat.wing}-${flat.flatNumber}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flat.flatType?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [flats, searchTerm]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
             Flats Inventory
          </h1>
          <p className="text-sm text-slate-500 font-medium">Manage wings, floor distribution, and occupancy.</p>
        </div>
        <button
          onClick={() => navigate("add")}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <FiPlus size={18} /> Add New Flat
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 px-4 max-w-md">
        <FiSearch className="text-slate-400" />
        <InputBase
          placeholder="Search by Flat (e.g. A-101)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full font-medium text-sm"
        />
      </div>

      {/* MUI TABLE */}
      <TableContainer component={Paper} elevation={0} className="rounded-2xl border border-slate-100 overflow-hidden">
        <Table sx={{ minWidth: 700 }}>
          <TableHead className="bg-slate-50">
            <TableRow>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Flat Info</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Wing</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Floor</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Residents</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading ? filteredFlats
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((flat) => (
              <TableRow key={flat._id} hover>
                
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar sx={{ bgcolor: '#eef2ff', color: '#4f46e5', width: 40, height: 40, borderRadius: '12px' }}>
                      <FiGrid size={20} />
                    </Avatar>
                    <div>
                      <div className="font-black text-slate-900 text-base">{flat.wing}-{flat.flatNumber}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {flat._id?.slice(-6)}</div>
                    </div>
                  </div>
                </TableCell>

                <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>{flat.wing}</TableCell>
                
                <TableCell>
                   <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                      <FiLayers className="text-slate-300" /> {flat.floorNumber}
                   </div>
                </TableCell>

                <TableCell>
                  <Chip 
                    label={flat.flatType} 
                    size="small"
                    sx={{ fontWeight: 800, fontSize: '10px', bgcolor: '#f5f3ff', color: '#7c3aed', borderRadius: '6px' }}
                  />
                </TableCell>

                <TableCell sx={{ fontWeight: 800, color: '#475569' }}>
                   {flat.residentCount || 0} <span className="text-[10px] text-slate-400 ml-1">PPL</span>
                </TableCell>

                <TableCell>
                  <Chip 
                    label={flat.status || "Vacant"}
                    size="small"
                    sx={{ 
                      fontWeight: 900, 
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      bgcolor: flat.status === 'Occupied' ? '#ecfdf5' : '#fffbeb',
                      color: flat.status === 'Occupied' ? '#059669' : '#d97706',
                    }}
                  />
                </TableCell>

                <TableCell align="center">
                  <div className="flex justify-center gap-2">
                    <Tooltip title="Edit Flat">
                      <IconButton 
                        onClick={() => navigate(`/admin/flats/edit/${flat._id}`)} 
                        sx={{ color: '#2563eb', bgcolor: '#eff6ff', borderRadius: '10px', '&:hover': { bgcolor: '#dbeafe' } }}
                      >
                        <FiEdit size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Flat">
                      <IconButton 
                        onClick={() => handleDelete(flat._id)}
                        sx={{ color: '#ef4444', bgcolor: '#fef2f2', borderRadius: '10px', '&:hover': { bgcolor: '#fee2e2' } }}
                      >
                        <FiTrash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>

              </TableRow>
            )) : (
              // Loading State Rows
              [...Array(rowsPerPage)].map((_, i) => (
                <TableRow key={i}><TableCell colSpan={7} sx={{ py: 6, textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>Loading flats data...</TableCell></TableRow>
              ))
            )}

            {!loading && filteredFlats.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ py: 12, textAlign: 'center' }}>
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No matching units found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredFlats.length}
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

export default Flats;