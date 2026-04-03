import React, { lazy, Suspense } from 'react';

const Payments = lazy(() => import("../../Admin/pages/Payments"));

const paymentRoutes = [
  {
    path: "payments",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Payments />
      </Suspense>
    ),
  },
];

export default paymentRoutes;