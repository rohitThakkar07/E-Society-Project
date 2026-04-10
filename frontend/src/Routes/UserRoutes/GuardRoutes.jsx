import { lazy, Suspense } from "react";
import { PageLoader } from "../../components/PageLoader";

const Dashboard = lazy(() => import("../../Guard/GuardDashboard"));
const AddVisitorEntry = lazy(() => import("../../Guard/pages/AddVisitorEntry"));
const VisitorManagement = lazy(() => import("../../Guard/pages/VisitorManagement"));
const VisitorLog = lazy(() => import("../../Guard/pages/VisitorLog"));
const VisitorDetail = lazy(() => import("../../Guard/pages/VisitorDetails"));
const SearchResident = lazy(() => import("../../Guard/pages/SearchResident"));

const guardPortalRoutes = [
  {
    index: true,
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <Dashboard />
      </Suspense>
    ),
  },
  {
    path: "visitor/add",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <AddVisitorEntry />
      </Suspense>
    ),
  },
  {
    path: "visitors",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <VisitorManagement />
      </Suspense>
    ),
  },
  {
    path: "gate-log",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <VisitorLog />
      </Suspense>
    ),
  },
  {
    path: "visitor/:id",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <VisitorDetail />
      </Suspense>
    ),
  },
  {
    path: "search-resident",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <SearchResident />
      </Suspense>
    ),
  },
];

export default guardPortalRoutes;