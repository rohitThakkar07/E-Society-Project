const Expense = require("../../../db/models/expenseModel");

// ── CREATE ────────────────────────────────────────────────────────────────────
const createExpense = async (req, res) => {
  try {
    const { title, category, amount, date, paymentMode, description } = req.body;

    if (!title || !category || !amount || !date || !paymentMode) {
      return res.status(400).json({
        success: false,
        message: "title, category, amount, date and paymentMode are required.",
      });
    }

    const expense = await Expense.create({
      title, category, amount, date, paymentMode, description,
    });

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET ALL (with optional filters) ──────────────────────────────────────────
const getAllExpenses = async (req, res) => {
  try {
    const { category, month, year, paymentMode } = req.query;
    const filter = {};

    if (category    && category    !== "All") filter.category    = category;
    if (month       && month       !== "All") filter.month       = month;
    if (year)                                 filter.year        = Number(year);
    if (paymentMode && paymentMode !== "All") filter.paymentMode = paymentMode;

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET ONE ───────────────────────────────────────────────────────────────────
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense)
      return res.status(404).json({ success: false, message: "Expense not found" });
    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── UPDATE ────────────────────────────────────────────────────────────────────
const updateExpense = async (req, res) => {
  try {
    const allowed = ["title", "category", "amount", "date", "paymentMode", "description"];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    // Recalculate month/year if date changed
    if (updates.date) {
      const d = new Date(updates.date);
      updates.month = d.toLocaleString("default", { month: "long" });
      updates.year  = d.getFullYear();
    }

    const expense = await Expense.findByIdAndUpdate(
      req.params.id, updates, { new: true, runValidators: true }
    );

    if (!expense)
      return res.status(404).json({ success: false, message: "Expense not found" });

    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE ────────────────────────────────────────────────────────────────────
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense)
      return res.status(404).json({ success: false, message: "Expense not found" });
    res.json({ success: true, message: "Expense deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DASHBOARD SUMMARY ─────────────────────────────────────────────────────────
const getDashboardSummary = async (req, res) => {
  try {
    const now       = new Date();
    const thisMonth = now.toLocaleString("default", { month: "long" });
    const thisYear  = now.getFullYear();

    const [allExpenses, monthlyExpenses] = await Promise.all([
      Expense.find({ year: thisYear }),
      Expense.find({ month: thisMonth, year: thisYear }),
    ]);

    const yearlyTotal  = allExpenses.reduce((s, e) => s + e.amount, 0);
    const monthlyTotal = monthlyExpenses.reduce((s, e) => s + e.amount, 0);

    // Category breakdown for current month
    const categoryMap = {};
    monthlyExpenses.forEach((e) => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });
    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

    // Monthly trend (all months this year)
    const trendMap = {};
    allExpenses.forEach((e) => {
      trendMap[e.month] = (trendMap[e.month] || 0) + e.amount;
    });
    const monthOrder = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const monthlyTrend = monthOrder
      .filter((m) => trendMap[m])
      .map((m) => ({ month: m.slice(0, 3), expense: trendMap[m] }));

    // Recent 5 expenses
    const recentExpenses = await Expense.find().sort({ date: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        monthlyExpense: monthlyTotal,
        yearlyExpense:  yearlyTotal,
        categoryData,
        monthlyTrend,
        recentExpenses,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── REPORT (filtered for a specific month + year) ────────────────────────────
const getReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year)
      return res.status(400).json({ success: false, message: "month and year are required." });

    const expenses = await Expense.find({ month, year: Number(year) }).sort({ date: -1 });

    const total = expenses.reduce((s, e) => s + e.amount, 0);

    const categoryMap = {};
    expenses.forEach((e) => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });
    const categorySummary = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

    res.json({
      success: true,
      data: { expenses, total, categorySummary },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getDashboardSummary,
  getReport,
};