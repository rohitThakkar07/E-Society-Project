import React, { lazy, Suspense } from 'react';
import { PageLoader } from "../../components/PageLoader";

const Payments = lazy(() => import("../../Admin/pages/Payments"));

const paymentRoutes = [
  {
    path: "payments",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <Payments />
      </Suspense>
    ),
  },
];

export default paymentRoutes;