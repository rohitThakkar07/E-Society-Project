import { lazy, Suspense } from 'react';
const AlertDashboard = lazy(() => import("../../Admin/pages/Alert/AlertDashbord"));
 
 const alertRoutes = [
  { path: "alert/dashboard", element: <Suspense fallback={<div>Loading...</div>}><AlertDashboard /></Suspense> },
];
export default alertRoutes;
