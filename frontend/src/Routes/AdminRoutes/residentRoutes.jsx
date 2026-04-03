import React, { lazy, Suspense } from 'react';

const Residents = lazy(() => import("../../Admin/pages/Residents/Residents"));
const ResidentForm = lazy(() => import("../../Admin/pages/Residents/ResidentForm"));

const residentRoutes = [
  {
    path: "residents",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Residents />
      </Suspense>
    ),
  },
  {
    path: "residents/add",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ResidentForm />
      </Suspense>
    ),
  },
  {
    path: "residents/edit/:id",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ResidentForm />
      </Suspense>
    ),
  },
];

export default residentRoutes;