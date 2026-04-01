import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TablePagination,
  IconButton, Tooltip, Chip, InputBase, MenuItem, Select, FormControl, Avatar
} from "@mui/material";
import { 
  FiEdit, FiTrash2, FiSearch, FiPlus, 
  FiTag, FiCalendar, FiCreditCard, FiDollarSign 
} from "react-icons/fi";
import { fetchExpenses, deleteExpense, updateExpense } from "../../../../store/slices/expenseSlice";

const CATEGORY_STYLE = {
  Electricity: { bg: "#eff6ff", color: "#2563eb" },
  Water:       { bg: "#ecfeff", color: "#0891b2" },
  Salary:      { bg: "#faf5ff", color: "#9333ea" },
  Maintenance: { bg: "#fffbeb", color: "#d97706" },
  Other:       { bg: "#f8fafc", color: "#64748b" },
};

const ExpenseList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const expenseState = useSelector((s) => s.expense) ?? {};
  const { list: expenseData = [], loading = false } = expenseState;

  // UI State
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  // Logic: Filtering (Unchanged)
  const filtered = useMemo(() =>
    expenseData.filter((e) => {
      const matchSearch   = e.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "All" || e.category === categoryFilter;
      return matchSearch && matchCategory;
    }),
  [expenseData, search, categoryFilter]);

  // Logic: Pagination Handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) dispatch(deleteExpense(id));
  };

  const startEdit = (expense) => {
    setEditingId(expense._id);
    setEditData({
      title:       expense.title,
      category:    expense.category,
      amount:      expense.amount,
      date:        expense.date?.split("T")[0] || "",
      paymentMode: expense.paymentMode,
      description: expense.description || "",
    });
  };

  const saveEdit = async () => {
    const res = await dispatch(updateExpense({ id: editingId, data: { ...editData, amount: Number(editData.amount) } }));
    if (res.type.endsWith("fulfilled")) setEditingId(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Expense Management</h1>
          <p className="text-sm text-slate-500 font-medium">Track and monitor all society expenditures.</p>
        </div>
        <button
          onClick={() => navigate("/admin/expense/add")}
          className="bg-red-600 text-white px-6 py-3 rounded-2xl hover:bg-red-700 font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <FiPlus size={18} /> Add Expense
        </button>
      </div>

      {/* FILTERS BAR */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 px-4 flex-1 min-w-[300px]">
          <FiSearch className="text-slate-400" />
          <InputBase
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full font-medium text-sm"
          />
        </div>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            displayEmpty
            className="bg-white rounded-xl font-bold text-xs shadow-sm"
            sx={{ borderRadius: '12px', '.MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' } }}
          >
            <MenuItem value="All"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">All Categories</span></MenuItem>
            <MenuItem value="Electricity">Electricity</MenuItem>
            <MenuItem value="Water">Water</MenuItem>
            <MenuItem value="Salary">Salary</MenuItem>
            <MenuItem value="Maintenance">Maintenance</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* MUI TABLE */}
      <TableContainer component={Paper} elevation={0} className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <Table sx={{ minWidth: 900 }}>
          <TableHead className="bg-slate-50">
            <TableRow>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Expense Title</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Payment</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {!loading ? filtered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((expense) => (
              <TableRow key={expense._id} hover>
                
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar sx={{ bgcolor: '#fef2f2', color: '#ef4444', width: 36, height: 36 }}>
                      <FiDollarSign size={16} />
                    </Avatar>
                    <span className="font-bold text-slate-900 text-sm">{expense.title}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Chip 
                    label={expense.category}
                    size="small"
                    sx={{ 
                      fontWeight: 900, 
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      bgcolor: CATEGORY_STYLE[expense.category]?.bg || '#f1f5f9',
                      color: CATEGORY_STYLE[expense.category]?.color || '#64748b',
                      borderRadius: '6px'
                    }}
                  />
                </TableCell>

                <TableCell sx={{ fontWeight: 800, color: '#ef4444', fontSize: '14px' }}>
                  ₹{(expense.amount ?? 0).toLocaleString()}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-[11px]">
                    <FiCalendar className="text-slate-300" size={14} />
                    {expense.date ? new Date(expense.date).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric",
                    }) : "—"}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 text-slate-600 font-medium text-xs uppercase tracking-tighter">
                    <FiCreditCard className="text-slate-300" size={14} />
                    {expense.paymentMode}
                  </div>
                </TableCell>

                <TableCell align="center">
                  <div className="flex justify-center gap-1">
                    <Tooltip title="Edit Expense">
                      <IconButton 
                        onClick={() => startEdit(expense)} 
                        size="small"
                        sx={{ color: '#2563eb', bgcolor: '#eff6ff', borderRadius: '10px', '&:hover': { bgcolor: '#dbeafe' } }}
                      >
                        <FiEdit size={14} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        onClick={() => handleDelete(expense._id)} 
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
                <TableRow key={i}><TableCell colSpan={6} sx={{ py: 6, textAlign: 'center', color: '#cbd5e1' }}>Loading expenses...</TableCell></TableRow>
              ))
            )}
            
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 10, textAlign: 'center', fontWeight: 600, color: '#94a3b8' }}>
                  No expenditures found matching your search.
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

      {/* EDIT MODAL (Functionally identical, visually polished) */}
      {editingId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Edit Transaction</h3>
              <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-black">₹</div>
            </div>
            <div className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500 font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                  <select
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  >
                    <option value="Electricity">Electricity</option>
                    <option value="Water">Water</option>
                    <option value="Salary">Salary</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={editData.amount}
                    onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500 font-black text-red-600"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setEditingId(null)}
                  className="flex-1 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={loading}
                  className="flex-1 px-4 py-3 text-xs font-black uppercase tracking-widest text-white bg-slate-900 hover:bg-black disabled:opacity-60 rounded-2xl transition-all shadow-lg"
                >
                  {loading ? "Saving…" : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;