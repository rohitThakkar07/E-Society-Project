import React, { lazy, Suspense } from 'react';
import { PageLoader } from "../../components/PageLoader";

const Residents = lazy(() => import("../../Admin/pages/Residents/Residents"));
const ResidentForm = lazy(() => import("../../Admin/pages/Residents/ResidentForm"));

const residentRoutes = [
  {
    path: "residents",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <Residents />
      </Suspense>
    ),
  },
  {
    path: "residents/add",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <ResidentForm />
      </Suspense>
    ),
  },
  {
    path: "residents/edit/:id",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <ResidentForm />
      </Suspense>
    ),
  },
];

export default residentRoutes;