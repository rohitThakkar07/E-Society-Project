import React from 'react';
import MaintenanceDashboard from "../../Admin/pages/Finance/Maintenance/MaintenanceDashboard";
import MaintenanceList from "../../Admin/pages/Finance/Maintenance/MaintenanceList";
import MaintenanceDetails from "../../Admin/pages/Finance/Maintenance/MaintenanceDetails";
import AddMaintenance from "../../Admin/pages/Finance/Maintenance/AddMaintenance";
import InvoiceGenerator from "../../Admin/pages/Finance/Maintenance/InvoiceGenerator";
import ReceiptGenerator from "../../Admin/pages/Finance/Maintenance/ReceiptGenerator";

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