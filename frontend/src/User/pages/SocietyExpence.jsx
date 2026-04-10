import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses } from "../../store/slices/expenseSlice";

const CATEGORY_STYLES = {
  Electricity: "bg-blue-50 text-blue-700",
  Water: "bg-cyan-50 text-cyan-700",
  Salary: "bg-violet-50 text-violet-700",
  Maintenance: "bg-amber-50 text-amber-700",
  Other: "bg-slate-100 text-slate-700",
};

const fmtCurrency = (value) => `Rs. ${(value ?? 0).toLocaleString("en-IN")}`;

const SocietyExpense = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const expenseState = useSelector((state) => state.expense) ?? {};
  const { list: expenses = [], loading = false } = expenseState;

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return expenses;

    return expenses.filter((expense) =>
      [expense.title, expense.category, expense.paymentMode]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [expenses, search]);

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const thisMonth = new Date().toLocaleString("default", { month: "long" });
    const thisYear = new Date().getFullYear();
    const monthly = expenses.reduce((sum, item) => {
      const itemDate = item.date ? new Date(item.date) : null;
      if (!itemDate || Number.isNaN(itemDate.getTime())) return sum;

      const isCurrentMonth =
        itemDate.toLocaleString("default", { month: "long" }) === thisMonth &&
        itemDate.getFullYear() === thisYear;

      return isCurrentMonth ? sum + Number(item.amount || 0) : sum;
    }, 0);

    return {
      total,
      monthly,
      records: expenses.length,
    };
  }, [expenses]);

  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-6 text-[var(--text)] transition-colors duration-300 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-lg)]">
          <div className="grid gap-6 px-6 py-7 md:grid-cols-[1.2fr_0.8fr] md:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]">Finance Overview</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl">Society Expenses</h1>
              <p className="mt-3 max-w-2xl text-sm font-medium text-[var(--text-muted)]">
                Live expense records are now loaded from the existing expense API through Redux, so this page shows real spending data instead of local dummy entries.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)]/60 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--text-muted)]">Total Spend</p>
                <p className="mt-2 text-2xl font-black text-red-600">{fmtCurrency(stats.total)}</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)]/60 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--text-muted)]">This Month</p>
                <p className="mt-2 text-2xl font-black text-[var(--text)]">{fmtCurrency(stats.monthly)}</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)]/60 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--text-muted)]">Records</p>
                <p className="mt-2 text-2xl font-black text-[var(--text)]">{stats.records}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-md)] sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black text-[var(--text)]">Expense History</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Search across real expense records returned by the backend.</p>
            </div>

            <div className="w-full md:max-w-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, category, or payment mode"
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-[var(--border)]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-[var(--bg)]/70 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  <tr>
                    <th className="px-5 py-4">Title</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Payment Mode</th>
                    <th className="px-5 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] bg-[var(--card)]">
                  {loading ? (
                    [...Array(5)].map((_, index) => (
                      <tr key={index}>
                        <td colSpan="5" className="px-5 py-6 text-center text-sm font-medium text-[var(--text-muted)]">
                          Loading expense records...
                        </td>
                      </tr>
                    ))
                  ) : filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <tr key={expense._id} className="transition hover:bg-[var(--bg)]/40">
                        <td className="px-5 py-4">
                          <div className="font-bold text-[var(--text)]">{expense.title}</div>
                          {expense.description ? (
                            <div className="mt-1 text-xs text-[var(--text-muted)]">{expense.description}</div>
                          ) : null}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${CATEGORY_STYLES[expense.category] || CATEGORY_STYLES.Other}`}>
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-bold text-red-600">{fmtCurrency(expense.amount)}</td>
                        <td className="px-5 py-4 text-sm font-medium text-[var(--text-muted)]">{expense.paymentMode || "—"}</td>
                        <td className="px-5 py-4 text-sm font-medium text-[var(--text-muted)]">
                          {expense.date
                            ? new Date(expense.date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-5 py-12 text-center">
                        <p className="text-lg font-bold text-[var(--text)]">No expense records found</p>
                        <p className="mt-2 text-sm text-[var(--text-muted)]">
                          {search ? "Try a different search term." : "The API did not return any expense entries yet."}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SocietyExpense;
