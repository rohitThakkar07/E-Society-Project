import React from 'react';
import { lazy, Suspense } from 'react';
const ExpenseDashboard = lazy(() => import("../../Admin/pages/Finance/Expense/ExpenseDashboard"));
const ExpenseList = lazy(() => import("../../Admin/pages/Finance/Expense/ExpenseList"));
const AddExpense = lazy(() => import("../../Admin/pages/Finance/Expense/AddExpense"));
const ExpenseReport = lazy(() => import("../../Admin/pages/Finance/Expense/ExpenseReport"));

const expenseRoutes = [
  {
    path: "expense/dashboard",
    element: <Suspense fallback={<div>Loading...</div>}><ExpenseDashboard /></Suspense>,
  },
  {
    path: "expense/add",
    element: <Suspense fallback={<div>Loading...</div>}><AddExpense /></Suspense>,
  },
  {
    path: "expense/list",
    element: <Suspense fallback={<div>Loading...</div>}><ExpenseList /></Suspense>,
  },
  {
    path: "expense/report",
    element: <Suspense fallback={<div>Loading...</div>}><ExpenseReport /></Suspense>,
  },
];

export default expenseRoutes;