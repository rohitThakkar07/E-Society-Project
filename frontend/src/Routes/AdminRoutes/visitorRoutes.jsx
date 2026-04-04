import React from 'react';
import { lazy, Suspense } from 'react';
import { PageLoader } from "../../components/PageLoader";
const VisitorDashboard = lazy(() => import("../../Admin/pages/Visitors/VisitorDashboard"));
const VisitorDetails = lazy(() => import("../../Admin/pages/Visitors/VisitorsDetails"));
const VisitorReports = lazy(() => import("../../Admin/pages/Visitors/VisitorReports"));
const AddVisitor = lazy(() => import('../../Admin/pages/Visitors/AddVisitor'));
const visitorRoutes = [
  {
    path: "visitors",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><VisitorDashboard /></Suspense>,
  },
  {
    path: "visitors/list",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><VisitorDashboard /></Suspense>,
  },
  {
    path: "visitor/add",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><AddVisitor /></Suspense>,
  },
  {
    path: "visitor/edit/:id",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><AddVisitor /></Suspense>,
  },
  {
    path: "visitor/:id",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><VisitorDetails /></Suspense>,
  },
  {
    path: "visitor/reports",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><VisitorReports /></Suspense>,
  },
];

export default visitorRoutes;