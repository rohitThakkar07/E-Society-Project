import React from "react";
import MaintenanceDashboard from "../../Admin/pages/Finance/Maintenance/MaintenanceDashboard";
import MaintenanceList      from "../../Admin/pages/Finance/Maintenance/MaintenanceList";
import AddMaintenance       from "../../Admin/pages/Finance/Maintenance/AddMaintenance";
import MaintenanceDetails   from "../../Admin/pages/Finance/Maintenance/MaintenanceDetails";
import InvoiceGenerator     from "../../Admin/pages/Finance/Maintenance/InvoiceGenerator";
import ReceiptGenerator     from "../../Admin/pages/Finance/Maintenance/ReceiptGenerator";
import GenerateMaintenance  from "../../Admin/pages/Finance/Maintenance/GenerateMaintenance";
// All paths are relative to the /admin parent route
const maintenanceRoutes = [
  { path: "maintenance/dashboard", element: <MaintenanceDashboard /> },
  { path: "maintenance/list",      element: <MaintenanceList /> },
  { path: "maintenance/add",       element: <AddMaintenance /> },
  { path: "maintenance/:id",       element: <MaintenanceDetails /> },
  { path: "maintenance/:id/invoice", element: <InvoiceGenerator /> },
  { path: "maintenance/:id/receipt", element: <ReceiptGenerator /> },
  { path: "maintenance/generate",  element: <GenerateMaintenance /> },
];

export default maintenanceRoutes;
// import React from 'react';
// import MaintenanceDashboard from "../../Admin/pages/Finance/Maintenance/MaintenanceDashboard";
// import MaintenanceList from "../../Admin/pages/Finance/Maintenance/MaintenanceList";
// import MaintenanceDetails from "../../Admin/pages/Finance/Maintenance/MaintenanceDetails";
// import AddMaintenance from "../../Admin/pages/Finance/Maintenance/AddMaintenance";
// import InvoiceGenerator from "../../Admin/pages/Finance/Maintenance/InvoiceGenerator";
// import ReceiptGenerator from "../../Admin/pages/Finance/Maintenance/ReceiptGenerator";

// const maintenanceRoutes = [
//   {
//     path: "maintenance/dashboard",
//     element: <MaintenanceDashboard />,
//   },
//   {
//     path: "maintenance/add",
//     element: <AddMaintenance />,
//   },
//   {
//     path: "maintenance/list",
//     element: <MaintenanceList />,
//   },
//   {
//     path: "maintenance/:id",
//     element: <MaintenanceDetails />,
//   },
//   {
//     path: "maintenance/:id/invoice",
//     element: <InvoiceGenerator />,
//   },
//   {
//     path: "maintenance/:id/receipt",
//     element: <ReceiptGenerator />,
//   },
// ];

// export default maintenanceRoutes;