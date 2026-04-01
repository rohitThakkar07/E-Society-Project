import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TablePagination,
  IconButton, Tooltip, Chip, InputBase, MenuItem, Select, FormControl, Avatar
} from "@mui/material";
import { 
  FiSearch, FiPlus, FiCalendar, FiClock, 
  FiHome, FiUser, FiFilter, FiEye 
} from "react-icons/fi";
import { fetchBookings } from "../../../store/slices/facilityBookingSlice";

// ── HELPERS ──────────────────────────────────────────────────────────────────

const getFacilityName = (facility) => {
  if (!facility) return "—";
  return typeof facility === "object" ? facility.name : String(facility);
};

const getResidentData = (resident) => {
  if (!resident) return { name: "N/A", flat: "N/A" };
  const name = resident.firstName 
    ? `${resident.firstName} ${resident.lastName || ""}` 
    : resident.name || "Admin";
  const flat = resident.flatNumber || "Office";
  return { name, flat };
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const STATUS_STYLE = {
  Approved: { bg: "#ecfdf5", color: "#059669" },
  Rejected: { bg: "#fef2f2", color: "#dc2626" },
  Pending: { bg: "#fffbeb", color: "#d97706" },
  Cancelled: { bg: "#f1f5f9", color: "#64748b" },
};

const BookingList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { bookings = [], loading } = useSelector((state) => state.booking);

  // State for search, filters, and pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [facilityFilter, setFacilityFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  // Generate unique facility list
  const facilityNames = useMemo(() => [
    ...new Set(
      bookings
        .map((b) => getFacilityName(b.facility))
        .filter((n) => n !== "—")
    ),
  ], [bookings]);

  // Filter logic
  const filtered = useMemo(() =>
    bookings.filter((b) => {
      const { name, flat } = getResidentData(b.resident);
      const facilityName = getFacilityName(b.facility);
      const searchStr = `${name} ${flat}`.toLowerCase();
      const matchSearch = searchStr.includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || b.status === statusFilter;
      const matchFacility = facilityFilter === "All" || facilityName === facilityFilter;
      return matchSearch && matchStatus && matchFacility;
    }),
  [bookings, search, statusFilter, facilityFilter]);

  // Pagination Handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Facility Bookings</h1>
          <p className="text-sm text-slate-500 font-medium">Review and manage resident reservations.</p>
        </div>
        <button
          onClick={() => navigate("/admin/facility/book")}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <FiPlus size={18} /> New Booking
        </button>
      </div>

      {/* FILTERS ROW */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 px-4 flex-1 min-w-[300px]">
          <FiSearch className="text-slate-400" />
          <InputBase
            placeholder="Search name or flat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full font-medium text-sm"
          />
        </div>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={facilityFilter}
            onChange={(e) => setFacilityFilter(e.target.value)}
            displayEmpty
            className="bg-white rounded-xl font-bold text-xs shadow-sm"
            sx={{ borderRadius: '12px', '.MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' } }}
          >
            <MenuItem value="All"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">All Facilities</span></MenuItem>
            {facilityNames.map((name) => (
              <MenuItem key={name} value={name}><span className="text-xs font-bold uppercase tracking-wider">{name}</span></MenuItem>
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
            <MenuItem value="Approved"><span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Approved</span></MenuItem>
            <MenuItem value="Rejected"><span className="text-xs font-bold uppercase tracking-wider text-red-600">Rejected</span></MenuItem>
          </Select>
        </FormControl>

        {(search || statusFilter !== "All" || facilityFilter !== "All") && (
          <button
            onClick={() => { setSearch(""); setStatusFilter("All"); setFacilityFilter("All"); }}
            className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* MUI TABLE */}
      <TableContainer component={Paper} elevation={0} className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <Table sx={{ minWidth: 1000 }}>
          <TableHead className="bg-slate-50">
            <TableRow>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>#</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Unit</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Facility</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Resident</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Schedule</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading ? filtered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((booking, index) => {
                const { name, flat } = getResidentData(booking.resident);
                return (
                  <TableRow key={booking._id} hover>
                    <TableCell sx={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700 }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                          <FiHome size={14} />
                        </div>
                        <span className="font-black text-indigo-600 text-sm">{flat}</span>
                      </div>
                    </TableCell>

                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {getFacilityName(booking.facility)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar sx={{ bgcolor: '#f8fafc', color: '#64748b', width: 28, height: 28, fontSize: '12px' }}>
                          <FiUser size={14} />
                        </Avatar>
                        <span className="font-bold text-slate-700 text-sm">{name}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[11px]">
                          <FiCalendar size={12} className="text-slate-300" /> {formatDate(booking.bookingDate)}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                          <FiClock size={12} className="text-slate-200" /> 
                          {booking.startTime && booking.endTime ? `${booking.startTime} – ${booking.endTime}` : "—"}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Chip 
                        label={booking.status || "Pending"}
                        size="small"
                        sx={{ 
                          fontWeight: 900, 
                          fontSize: '9px',
                          textTransform: 'uppercase',
                          bgcolor: STATUS_STYLE[booking.status]?.bg || '#f1f5f9',
                          color: STATUS_STYLE[booking.status]?.color || '#64748b',
                          borderRadius: '8px'
                        }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton 
                          onClick={() => navigate(`/admin/facility/booking/${booking._id}`)} 
                          size="small"
                          sx={{ color: '#2563eb', bgcolor: '#eff6ff', borderRadius: '10px', '&:hover': { bgcolor: '#dbeafe' } }}
                        >
                          <FiEye size={16} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              }) : (
              [...Array(rowsPerPage)].map((_, i) => (
                <TableRow key={i}><TableCell colSpan={7} sx={{ py: 6, textAlign: 'center', color: '#cbd5e1' }}>Loading bookings...</TableCell></TableRow>
              ))
            )}

            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ py: 10, textAlign: 'center', fontWeight: 600, color: '#94a3b8' }}>
                  No reservations found.
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

export default BookingList;