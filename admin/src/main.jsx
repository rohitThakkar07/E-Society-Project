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
import FacilityDashboard from './components/pages/Facility/FacilityDashboard.jsx'
import BookingForm from './components/pages/Facility/BookingForm.jsx'
import BookingList from './components/pages/Facility/BookingList.jsx'
import BookingCalendar from './components/pages/Facility/BookingCalendar.jsx'
import BookingDetails from './components/pages/Facility/BookingDetails.jsx'
import MaintenanceDashboard from './components/pages/Finance/Maintenance/MaintenanceDashboard.jsx';
import MaintenanceList from './components/pages/Finance/Maintenance/MaintenanceList.jsx'
import MaintenanceDetails from './components/pages/Finance/Maintenance/MaintenanceDetails.jsx'
import AddMaintenance from './components/pages/Finance/Maintenance/AddMaintenance.jsx'
import InvoiceGenerator from './components/pages/Finance/Maintenance/InvoiceGenerator.jsx'
import ReceiptGenerator from './components/pages/Finance/Maintenance/ReceiptGenerator.jsx'
import RoleDashboard from './components/pages/RoleRights/RoleDashboard.jsx'
import CreateRole from './components/pages/RoleRights/CreateRole.jsx'
import RoleList from './components/pages/RoleRights/RoleList.jsx'
import UserAccessList from './components/pages/RoleRights/UserAccessList.jsx'
import ComplaintDashboard from './components/pages/Complaint/ComplaintDashboard.jsx'
import ComplaintDetails from './components/pages/Complaint/ComplaintDetails.jsx'
import CreateComplaint from './components/pages/Complaint/CreateComplaint.jsx'

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
        path: "facility",
        children: [
          {
            path: "dashboard",
            element: <FacilityDashboard />,
          },
          {
            path: "book",
            element: <BookingForm />,
          },
          {
            path: "list",
            element: <BookingList />,
          },
          {
            path: "calendar",
            element: <BookingCalendar />,
          },
          {
            path: "booking/:id",
            element: <BookingDetails />,
          },
        ],
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
        path: "roles",
        element: <RoleDashboard />,
      },
      {
        path: "roles/create-role",
        element: <CreateRole />,
      },
      {
        path: "roles/edit/:id",
        element: <CreateRole />,
      },
      {
        path: "roles/list",
        element: <RoleList />,
      },
      {
        path: "roles/user-access",
        element: <UserAccessList />,
      },
      {
        path: "complaints",
        element: <ComplaintDashboard />,
      },
      {
        path: "complaints/create",
        element: <CreateComplaint />,
      },
      {
        path: "complaints/:id",
        element: <ComplaintDetails />,
      },
    ],
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
