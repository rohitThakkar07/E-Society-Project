const Expense = require("../../../db/models/expenseModel"); 
 
// ── Create Expense ──
const createExpense = async (req, res) => {
  try {
    const { title, category, amount, paymentMethod, expenseDate, description } = req.body;
 
    const expense = await Expense.create({
      title,
      category,
      amount,
      paymentMethod,
      expenseDate: expenseDate || Date.now(),
      description,
    });
 
    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
 
// ── Get All Expenses ──
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ expenseDate: -1 });
 
    return res.status(200).json({
      success: true,
      message: "Expenses fetched successfully",
      data: expenses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
 
// ── Get Expense By ID ──
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
 
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }
 
    return res.status(200).json({
      success: true,
      message: "Expense fetched successfully",
      data: expense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
 
// ── Update Expense ──
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
 
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }
 
    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
 
// ── Delete Expense ──
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
 
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }
 
    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
 
module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};