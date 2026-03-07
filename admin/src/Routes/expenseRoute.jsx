import React from 'react';
import ExpenseDashboard from "../components/pages/Finance/Expense/ExpenseDashboard";
import ExpenseList from "../components/pages/Finance/Expense/ExpenseList";
import AddExpense from "../components/pages/Finance/Expense/AddExpense";
import ExpenseReport from "../components/pages/Finance/Expense/ExpenseReport";

const expenseRoutes = [
  {
    path: "expense/dashboard",
    element: <ExpenseDashboard />,
  },
  {
    path: "expense/add",
    element: <AddExpense />,
  },
  {
    path: "expense/list",
    element: <ExpenseList />,
  },
  {
    path: "expense/report",
    element: <ExpenseReport />,
  },
];

export default expenseRoutes;