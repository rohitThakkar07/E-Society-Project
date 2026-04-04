import { lazy, Suspense } from "react";
import { PageLoader } from "../../components/PageLoader";

const VisitorManagement = lazy(() => import("../../Guard/pages/VisitorManagement"));
const VisitorLog = lazy(() => import("../../Guard/pages/VisitorLog"));

// Header nav: Operations → "Visitor Management" → "/visitors"
const VisitorRoutes = [
  {
    path: "visitors",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <VisitorManagement />
      </Suspense>
    ),
  },
  {
    path: "gate-logs",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <VisitorLog />
      </Suspense>
    ),
  },
];

export default VisitorRoutes;