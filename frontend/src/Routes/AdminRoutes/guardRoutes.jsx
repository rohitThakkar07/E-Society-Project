import React from "react";
import { lazy, Suspense } from 'react';
import { PageLoader } from "../../components/PageLoader";
const Guards = lazy(() => import("../../Admin/pages/Guards/Guards"));
const AddGuard = lazy(() => import("../../Admin/pages/Guards/AddGuard"));

const guardRoutes = [
  {
    path: "guards", // Correct: relative to /admin
    element: <Suspense fallback={<PageLoader message="Loading…" />}><Guards /></Suspense>,
  },
  {
    path: "guards/add", // Correct: relative to /admin
    element: <Suspense fallback={<PageLoader message="Loading…" />}><AddGuard /></Suspense>,
  },
  {
    path: "guards/edit/:id",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><AddGuard /></Suspense>,
  },
];

export default guardRoutes;