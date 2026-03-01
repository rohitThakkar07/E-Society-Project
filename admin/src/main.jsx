import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter, createBrowserRouter, RouterProvider} from 'react-router-dom'
import AdminLayout from './components/common/AdminLayout.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import Residents from './components/pages/Residents.jsx'
import Guards from './components/pages/Guards.jsx'
import Visitors from './components/pages/Visitors.jsx'
import Payments from './components/pages/Payments.jsx'
import Complaints from './components/pages/Complaints.jsx'
import ExpenseReport from './components/pages/Finance/Expense/ExpenseReport.jsx'
import ExpenseDashboard from './components/pages/Finance/Expense/ExpenseDashboard.jsx'
import ExpenseList from './components/pages/Finance/Expense/ExpenseList.jsx'
import AddExpense from './components/pages/Finance/Expense/AddExpense.jsx'
import MaintenanceDashboard from './components/pages/Finance/Maintenance/MaintenanceDashboard.jsx'
import MaintenanceList from './components/pages/Finance/Maintenance/MaintenanceList.jsx'
import MaintenanceDetails from './components/pages/Finance/Maintenance/MaintenanceDetails.jsx'
import AddMaintenance from './components/pages/Finance/Maintenance/AddMaintenance.jsx'
import InvoiceGenerator from './components/pages/Finance/Maintenance/InvoiceGenerator.jsx'
import ReceiptGenerator from './components/pages/Finance/Maintenance/ReceiptGenerator.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />, 
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "residents",
        element: <Residents />,
      },
      {
        path: "guards",
        element: <Guards />,
      },
      {
        path: "visitors",
        element: <Visitors />,
      },
      {
        path: "payments",
        element: <Payments />,
      },
      {
        path: "maintenance",
        children: [
          {
            path: "dashboard",
            element: <MaintenanceDashboard />,
          },
          {
            path: "add",
            element: <AddMaintenance />,
          },
          {
            path: "list",
            element: <MaintenanceList />,
          },
          {
            path: ":id",
            element: <MaintenanceDetails />,
          },
          {
            path: ":id/invoice",
            element: <InvoiceGenerator />,
          },
          {
            path: ":id/receipt",
            element: <ReceiptGenerator />,
          },
        ],
      },
      {
        path: "expense",
        children: [
          {
            path: "dashboard",
            element: <ExpenseDashboard />,
          },
          {
            path: "add",
            element: <AddExpense />,
          },
          {
            path: "list",
            element: <ExpenseList />,
          },
          {
            path: "report",
            element: <ExpenseReport />,
          },
        ],
      },
      {
        path: "complaints",
        element: <Complaints />,
      },
    ],
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
