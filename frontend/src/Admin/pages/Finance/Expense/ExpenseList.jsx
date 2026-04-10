import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
    if (window.confirm("Delete this expense?")) dispatch(deleteExpense(id));
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
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense List</h1>
          <p className="text-sm text-gray-500">Manage and track all expenses</p>
        </div>
        <button
          onClick={() => navigate("/admin/expense/add")}
          className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 text-sm font-medium self-start"
        >
          + Add Expense
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm w-full sm:w-52 outline-none focus:ring-2 focus:ring-red-400"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-400"
        >
          <option value="All">All Categories</option>
          <option value="Electricity">Electricity</option>
          <option value="Water">Water</option>
          <option value="Salary">Salary</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Other">Other</option>
        </select>
        {(search || categoryFilter !== "All") && (
          <button
            onClick={() => { setSearch(""); setCategoryFilter("All"); }}
            className="text-xs text-red-500 border border-red-100 bg-red-50 px-3 py-2 rounded-lg"
          >
            Clear
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mode</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length > 0 ? (
              filtered.map((expense, index) => (
                <tr key={expense._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-gray-400 text-xs">{index + 1}</td>
                  <td className="px-5 py-4 font-medium text-gray-800">{expense.title}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_STYLE[expense.category] || "bg-gray-100 text-gray-500"}`}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-red-600 font-semibold">
                    ₹{(expense.amount ?? 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {expense.date ? new Date(expense.date).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric",
                    }) : "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{expense.paymentMode}</td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => startEdit(expense)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-5 py-12 text-center text-gray-400 text-sm">
                  No expenses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {expenseData.length} expenses
          </div>
        )}
      </div>

      {/* INLINE EDIT MODAL */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-5">Edit Expense</h3>
            <div className="space-y-4">

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <option value="Electricity">Electricity</option>
                    <option value="Water">Water</option>
                    <option value="Salary">Salary</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Amount (₹)</label>
                  <input
                    type="number"
                    value={editData.amount}
                    onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
                  <input
                    type="date"
                    value={editData.date}
                    onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Mode</label>
                  <select
                    value={editData.paymentMode}
                    onChange={(e) => setEditData({ ...editData, paymentMode: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-400 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setEditingId(null)}
                className="flex-1 px-4 py-2.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-lg"
              >
                {loading ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExpenseList;