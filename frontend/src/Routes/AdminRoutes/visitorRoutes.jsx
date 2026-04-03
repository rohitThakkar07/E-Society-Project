import React from 'react';
import { lazy, Suspense } from 'react';
const VisitorDashboard = lazy(() => import("../../Admin/pages/Visitors/VisitorDashboard"));
const VisitorDetails = lazy(() => import("../../Admin/pages/Visitors/VisitorsDetails"));
const VisitorReports = lazy(() => import("../../Admin/pages/Visitors/VisitorReports"));
const AddVisitor = lazy(() => import('../../Admin/pages/Visitors/AddVisitor'));
const visitorRoutes = [
  {
    path: "visitors",
    element: <Suspense fallback={<div>Loading...</div>}><VisitorDashboard /></Suspense>,
  },
  {
    path: "visitors/list",
    element: <Suspense fallback={<div>Loading...</div>}><VisitorDashboard /></Suspense>,
  },
  {
    path: "visitor/add",
    element: <Suspense fallback={<div>Loading...</div>}><AddVisitor /></Suspense>,
  },
  {
    path: "visitor/edit/:id",
    element: <Suspense fallback={<div>Loading...</div>}><AddVisitor /></Suspense>,
  },
  {
    path: "visitor/:id",
    element: <Suspense fallback={<div>Loading...</div>}><VisitorDetails /></Suspense>,
  },
  {
    path: "visitor/reports",
    element: <Suspense fallback={<div>Loading...</div>}><VisitorReports /></Suspense>,
  },
];

export default visitorRoutes;