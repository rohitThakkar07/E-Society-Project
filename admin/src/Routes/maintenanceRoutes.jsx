import React from 'react';
import MaintenanceDashboard from "../components/pages/Finance/Maintenance/MaintenanceDashboard";
import MaintenanceList from "../components/pages/Finance/Maintenance/MaintenanceList";
import MaintenanceDetails from "../components/pages/Finance/Maintenance/MaintenanceDetails";
import AddMaintenance from "../components/pages/Finance/Maintenance/AddMaintenance";
import InvoiceGenerator from "../components/pages/Finance/Maintenance/InvoiceGenerator";
import ReceiptGenerator from "../components/pages/Finance/Maintenance/ReceiptGenerator";

const maintenanceRoutes = [
  {
    path: "maintenance/dashboard",
    element: <MaintenanceDashboard />,
  },
  {
    path: "maintenance/add",
    element: <AddMaintenance />,
  },
  {
    path: "maintenance/list",
    element: <MaintenanceList />,
  },
  {
    path: "maintenance/:id",
    element: <MaintenanceDetails />,
  },
  {
    path: "maintenance/:id/invoice",
    element: <InvoiceGenerator />,
  },
  {
    path: "maintenance/:id/receipt",
    element: <ReceiptGenerator />,
  },
];

export default maintenanceRoutes;