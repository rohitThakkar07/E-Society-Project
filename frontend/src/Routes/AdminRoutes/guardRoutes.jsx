import React from "react";
import { lazy, Suspense } from 'react';
const Guards = lazy(() => import("../../Admin/pages/Guards/Guards"));
const AddGuard = lazy(() => import("../../Admin/pages/Guards/AddGuard"));

const guardRoutes = [
  {
    path: "guards", // Correct: relative to /admin
    element: <Suspense fallback={<div>Loading...</div>}><Guards /></Suspense>,
  },
  {
    path: "guards/add", // Correct: relative to /admin
    element: <Suspense fallback={<div>Loading...</div>}><AddGuard /></Suspense>,
  },
  {
    path: "guards/edit/:id",
    element: <Suspense fallback={<div>Loading...</div>}><AddGuard /></Suspense>,
  },
];

export default guardRoutes;