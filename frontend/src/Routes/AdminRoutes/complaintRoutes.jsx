import React, { lazy, Suspense } from 'react';

const ComplaintDashboard = lazy(() => import("../../Admin/pages/Complaint/ComplaintDashboard"));
const ComplaintDetails = lazy(() => import("../../Admin/pages/Complaint/ComplaintDetails"));
const CreateComplaint = lazy(() => import("../../Admin/pages/Complaint/CreateComplaint"));

const complaintRoutes = [
  {
    path: "complaints",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ComplaintDashboard />
      </Suspense>
    ),
  },
  {
    path: "complaints/create",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CreateComplaint />
      </Suspense>
    ),
  },
  {
    path: "complaints/:id",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ComplaintDetails />
      </Suspense>
    ),
  },
];

export default complaintRoutes;