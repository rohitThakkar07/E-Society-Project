import { lazy, Suspense } from "react";

const PayMaintenance = lazy(() => import("../../User/pages/PayMaintenance"));

// Header nav: Finances → "Pay Maintenance" → "/maintenance"
const MaintenanceRoutes = [
  {
    path: "maintenance",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PayMaintenance />
      </Suspense>
    ),
  },
];

export default MaintenanceRoutes;