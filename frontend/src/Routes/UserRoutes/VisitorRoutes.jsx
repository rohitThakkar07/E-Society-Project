import { lazy, Suspense } from "react";
import { PageLoader } from "../../components/PageLoader";

const VisitorManagement = lazy(() => import("../../Guard/pages/VisitorManagement"));
const VisitorLog = lazy(() => import("../../Guard/pages/VisitorLog"));
const VisitorDetail = lazy(() => import("../../Guard/pages/VisitorDetails"));

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
  {
    path: "visitors/visitor/:id",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <VisitorDetail />
      </Suspense>
    ),
  },
];

export default VisitorRoutes;