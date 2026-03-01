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
import MaintenanceDashboard from './components/pages/Maintenance/MaintenanceDashboard.jsx'
import MaintenanceList from './components/pages/Maintenance/MaintenanceList.jsx'
import MaintenanceDetails from './components/pages/Maintenance/MaintenanceDetails.jsx'
import AddMaintenance from './components/pages/Maintenance/AddMaintenance.jsx'
import InvoiceGenerator from './components/pages/Maintenance/InvoiceGenerator.jsx'
import ReceiptGenerator from './components/pages/Maintenance/ReceiptGenerator.jsx'

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
        element: <MaintenanceDashboard />,
      },
      {
        path: "MaintenanceList",
        element: <MaintenanceList />,
      },
      {
        path: "MaintenanceDetails/:id",
        element: <MaintenanceDetails />,
      },
      {
        path: "AddMaintenance",
        element: <AddMaintenance />,
      },
      {
        path: "InvoiceGenerator",
        element: <InvoiceGenerator />,
      },
      {
        path: "ReceiptGenerator",
        element: <ReceiptGenerator />,
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
