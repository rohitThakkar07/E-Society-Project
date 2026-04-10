import React from "react";
import { lazy, Suspense } from 'react';
import { PageLoader } from "../../components/PageLoader";
const MaintenanceDashboard = lazy(() => import("../../Admin/pages/Finance/Maintenance/MaintenanceDashboard"));
const MaintenanceList = lazy(() => import("../../Admin/pages/Finance/Maintenance/MaintenanceList"));
const AddMaintenance = lazy(() => import("../../Admin/pages/Finance/Maintenance/AddMaintenance"));
const MaintenanceDetails = lazy(() => import("../../Admin/pages/Finance/Maintenance/MaintenanceDetails"));
const InvoiceGenerator = lazy(() => import("../../Admin/pages/Finance/Maintenance/InvoiceGenerator"));
const ReceiptGenerator = lazy(() => import("../../Admin/pages/Finance/Maintenance/ReceiptGenerator"));
const GenerateMaintenance = lazy(() => import("../../Admin/pages/Finance/Maintenance/GenerateMaintenance"));
// All paths are relative to the /admin parent route
const maintenanceRoutes = [
  { path: "maintenance/dashboard", element: <Suspense fallback={<PageLoader message="Loading…" />}><MaintenanceDashboard /></Suspense> },
  { path: "maintenance/list",      element: <Suspense fallback={<PageLoader message="Loading…" />}><MaintenanceList /></Suspense> },
  { path: "maintenance/add",       element: <Suspense fallback={<PageLoader message="Loading…" />}><AddMaintenance /></Suspense> },
  { path: "maintenance/:id",       element: <Suspense fallback={<PageLoader message="Loading…" />}><MaintenanceDetails /></Suspense> },
  { path: "maintenance/:id/invoice", element: <Suspense fallback={<PageLoader message="Loading…" />}><InvoiceGenerator /></Suspense> },
  { path: "maintenance/:id/receipt", element: <Suspense fallback={<PageLoader message="Loading…" />}><ReceiptGenerator /></Suspense> },
  { path: "maintenance/generate",  element: <Suspense fallback={<PageLoader message="Loading…" />}><GenerateMaintenance /></Suspense> },
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