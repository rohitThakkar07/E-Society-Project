import { lazy, Suspense } from "react";
import { PageLoader } from "../../components/PageLoader";

const PayMaintenance = lazy(() => import("../../User/pages/PayMaintenance"));

// Header nav: Finances → "Pay Maintenance" → "/maintenance"
const MaintenanceRoutes = [
  {
    path: "maintenance",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <PayMaintenance />
      </Suspense>
    ),
  },
];

export default maintenanceRoutes;