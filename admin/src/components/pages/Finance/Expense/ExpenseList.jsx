import React, { useState } from "react";

const ExpenseList = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Dummy Data (Replace with API later)
  const expenseData = [
    {
      id: 1,
      title: "Lift Repair",
      category: "Maintenance",
      amount: 15000,
      date: "05-03-2026",
      paymentMode: "Cash",
    },
    {
      id: 2,
      title: "Electric Bill",
      category: "Electricity",
      amount: 25000,
      date: "02-03-2026",
      paymentMode: "UPI",
    },
    {
      id: 3,
      title: "Security Salary",
      category: "Salary",
      amount: 35000,
      date: "01-03-2026",
      paymentMode: "Bank Transfer",
    },
  ];

  // Filter Logic
  const filteredExpenses = expenseData.filter((expense) => {
    const matchesSearch = expense.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      expense.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Expense List</h1>
          <p className="text-gray-500">Manage and track all expenses</p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="All">All Categories</option>
            <option value="Electricity">Electricity</option>
            <option value="Water">Water</option>
            <option value="Salary">Salary</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date</th>
              <th className="p-4">Payment Mode</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">{expense.title}</td>
                  <td className="p-4">{expense.category}</td>
                  <td className="p-4 text-red-600 font-semibold">
                    ₹{expense.amount.toLocaleString()}
                  </td>
                  <td className="p-4">{expense.date}</td>
                  <td className="p-4">{expense.paymentMode}</td>
                  <td className="p-4 text-center space-x-3">
                    <button className="text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center text-gray-500"
                >
                  No expenses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ExpenseList;