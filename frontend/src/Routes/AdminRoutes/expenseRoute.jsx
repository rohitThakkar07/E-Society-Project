import React from 'react';
import { lazy, Suspense } from 'react';
import { PageLoader } from "../../components/PageLoader";
const ExpenseDashboard = lazy(() => import("../../Admin/pages/Finance/Expense/ExpenseDashboard"));
const ExpenseList = lazy(() => import("../../Admin/pages/Finance/Expense/ExpenseList"));
const AddExpense = lazy(() => import("../../Admin/pages/Finance/Expense/AddExpense"));
const ExpenseReport = lazy(() => import("../../Admin/pages/Finance/Expense/ExpenseReport"));

const expenseRoutes = [
  {
    path: "expense/dashboard",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><ExpenseDashboard /></Suspense>,
  },
  {
    path: "expense/add",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><AddExpense /></Suspense>,
  },
  {
    path: "expense/list",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><ExpenseList /></Suspense>,
  },
  {
    path: "expense/report",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><ExpenseReport /></Suspense>,
  },
];

export default expenseRoutes;