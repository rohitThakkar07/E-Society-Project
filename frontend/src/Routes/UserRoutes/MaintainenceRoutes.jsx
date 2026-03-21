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