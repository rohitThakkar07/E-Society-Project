import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2, FiSearch, FiPlus, FiTag, FiCalendar, FiCreditCard } from "react-icons/fi";
import { fetchExpenses, deleteExpense, updateExpense } from "../../../../store/slices/expenseSlice";

const CATEGORY_STYLE = {
  Electricity: "bg-blue-100 text-blue-700",
  Water:       "bg-cyan-100 text-cyan-700",
  Salary:      "bg-purple-100 text-purple-700",
  Maintenance: "bg-yellow-100 text-yellow-700",
  Other:       "bg-gray-100 text-gray-600",
};

const ExpenseList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const expenseState = useSelector((s) => s.expense) ?? {};
  const { list: expenseData = [], loading = false } = expenseState;

  const [search,         setSearch]         = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editingId,      setEditingId]      = useState(null);
  const [editData,       setEditData]       = useState({});

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const filtered = useMemo(() =>
    expenseData.filter((e) => {
      const matchSearch   = e.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "All" || e.category === categoryFilter;
      return matchSearch && matchCategory;
    }),
  [expenseData, search, categoryFilter]);

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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Expense Management</h1>
          <p className="text-sm text-gray-500">Track and monitor all society expenditures.</p>
        </div>
        <button
          onClick={() => navigate("/admin/expense/add")}
          className="bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <FiPlus /> Add Expense
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* FILTERS BAR */}
        <div className="p-4 border-b border-gray-50 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 text-sm transition-all"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="All">All Categories</option>
            <option value="Electricity">Electricity</option>
            <option value="Water">Water</option>
            <option value="Salary">Salary</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* TABLE BODY */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-widest border-b">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Payment Mode</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="p-6 bg-gray-50/50"></td>
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((expense) => (
                  <tr key={expense._id} className="hover:bg-red-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{expense.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${CATEGORY_STYLE[expense.category] || "bg-gray-100 text-gray-500"}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-red-600 font-bold">
                      ₹{(expense.amount ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-gray-400" size={14} />
                        {expense.date ? new Date(expense.date).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric",
                        }) : "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiCreditCard className="text-gray-400" size={14} />
                        {expense.paymentMode}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => startEdit(expense)}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    No expenses found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DESIGN - Updated for consistency */}
      {editingId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Edit Expense</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Category</label>
                  <select
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Electricity">Electricity</option>
                    <option value="Water">Water</option>
                    <option value="Salary">Salary</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Amount (₹)</label>
                  <input
                    type="number"
                    value={editData.amount}
                    onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 font-bold"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingId(null)}
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-xl transition-all shadow-md shadow-red-100"
                >
                  {loading ? "Saving…" : "Save Changes"}
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