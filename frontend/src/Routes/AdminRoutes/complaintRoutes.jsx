import React, { lazy, Suspense } from 'react';
import { PageLoader } from "../../components/PageLoader";

const ComplaintDashboard = lazy(() => import("../../Admin/pages/Complaint/ComplaintDashboard"));
const ComplaintDetails = lazy(() => import("../../Admin/pages/Complaint/ComplaintDetails"));
const CreateComplaint = lazy(() => import("../../Admin/pages/Complaint/CreateComplaint"));

const complaintRoutes = [
  {
    path: "complaints",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <ComplaintDashboard />
      </Suspense>
    ),
  },
  {
    path: "complaints/create",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <CreateComplaint />
      </Suspense>
    ),
  },
  {
    path: "complaints/:id",
    element: (
      <Suspense fallback={<PageLoader message="Loading…" />}>
        <ComplaintDetails />
      </Suspense>
    ),
  },
];

export default complaintRoutes;