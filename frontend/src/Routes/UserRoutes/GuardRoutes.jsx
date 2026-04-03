import { lazy, Suspense } from "react";

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
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    ),
  },
  {
    path: "visitor/add",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AddVisitorEntry />
      </Suspense>
    ),
  },
  {
    path: "visitors",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <VisitorManagement />
      </Suspense>
    ),
  },
  {
    path: "gate-log",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <VisitorLog />
      </Suspense>
    ),
  },
  {
    path: "visitor/:id",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <VisitorDetail />
      </Suspense>
    ),
  },
  {
    path: "search-resident",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResident />
      </Suspense>
    ),
  },
];

export default guardPortalRoutes;