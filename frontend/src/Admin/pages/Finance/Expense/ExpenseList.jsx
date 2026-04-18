import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

const TABS = [
  { label: "Overview",     path: "/admin/expense/dashboard", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { label: "All Expenses", path: "/admin/expense/list",      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Reports",      path: "/admin/expense/report",    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
];

const ExpenseList = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    <div>
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Expense</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Track and monitor all society expenditures.</p>
        </div>
        <button onClick={() => navigate("/admin/expense/add")} className="admin-btn-primary">
          <FiPlus size={16} /> Add Expense
        </button>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-6 w-fit flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${location.pathname === tab.path ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
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
      <TableContainer component={Paper} elevation={0} className="admin-table-wrap shadow-sm">
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell>Expense Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell align="center">Actions</TableCell>
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

      {/* EDIT MODAL — Kaynex Style */}
      {editingId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <p className="admin-modal-title">Edit Expense</p>
              <button className="admin-modal-close" onClick={() => setEditingId(null)}
                title="Close">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="admin-modal-body space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Expense Title</label>
                <input type="text" value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="admin-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Category</label>
                  <select value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    className="admin-input">
                    <option value="Electricity">Electricity</option>
                    <option value="Water">Water</option>
                    <option value="Salary">Salary</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Amount (₹)</label>
                  <input type="number" value={editData.amount}
                    onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                    className="admin-input" />
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setEditingId(null)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button onClick={saveEdit} disabled={loading}
                className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-60">
                {loading ? "Saving…" : "Update Expense"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
