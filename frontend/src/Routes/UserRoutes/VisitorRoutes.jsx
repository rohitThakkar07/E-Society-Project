import { lazy, Suspense } from "react";

const VisitorManagement = lazy(() => import("../../Guard/pages/VisitorManagement"));
const VisitorLog = lazy(() => import("../../Guard/pages/VisitorLog"));

// Header nav: Operations → "Visitor Management" → "/visitors"
const VisitorRoutes = [
  {
    path: "visitors",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <VisitorManagement />
      </Suspense>
    ),
  },
  {
    path: "gate-logs",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <VisitorLog />
      </Suspense>
    ),
  },
];

export default VisitorRoutes;