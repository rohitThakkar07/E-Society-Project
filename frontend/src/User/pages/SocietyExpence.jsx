import React, { useState } from "react";

const SocietyExpense = () => {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: "Lift Maintenance",
      amount: 5000,
      category: "Maintenance",
      date: "10 Feb 2026",
    },
    {
      id: 2,
      title: "Security Salary",
      amount: 15000,
      category: "Salary",
      date: "05 Feb 2026",
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addExpense = (e) => {
    e.preventDefault();
    const newExpense = {
      id: Date.now(),
      ...form,
    };
    setExpenses([newExpense, ...expenses]);
    setForm({ title: "", amount: "", category: "", date: "" });
  };

  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-4 sm:p-6 transition-colors duration-300">
      
      {/* Title */}
      <h1 className="text-2xl font-bold text-[var(--text)] mb-6">
        Society Expenses
      </h1>

      {/* Summary Card */}
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-xl shadow mb-8">
        <p className="text-[var(--text-muted)] text-sm">Total Expenses</p>
        <h2 className="text-3xl font-bold text-red-600 mt-2">
          ₹{totalExpense}
        </h2>
      </div>

      {/* Add Expense Form */}
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-xl shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New Expense</h2>

        <form
          onSubmit={addExpense}
          className="grid md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Expense Title"
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="border p-3 rounded-lg"
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          >
            <option value="">Select Category</option>
            <option>Maintenance</option>
            <option>Salary</option>
            <option>Electricity</option>
            <option>Water</option>
            <option>Cleaning</option>
            <option>Other</option>
          </select>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          <button className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            Add Expense
          </button>
        </form>
      </div>

      {/* Expense Table */}
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Expense History</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--text-muted)]">
              <th className="py-2">Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id} className="border-b">
                <td className="py-2">{exp.title}</td>
                <td>{exp.category}</td>
                <td className="font-medium">₹{exp.amount}</td>
                <td>{exp.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SocietyExpense;