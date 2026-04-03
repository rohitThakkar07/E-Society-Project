import { lazy, Suspense } from 'react';
const StaffList = lazy(() => import("../../Admin/pages/Staff/StaffList"));
const AddEditStaff = lazy(() => import("../../Admin/pages/Staff/AddEditStaff"));
const StaffDetail = lazy(() => import("../../Admin/pages/Staff/StaffDetail"));
 
const staffRoutes = [
  { path: "staff/list",      element: <Suspense fallback={<div>Loading...</div>}><StaffList /></Suspense> },
  { path: "staff/add",       element: <Suspense fallback={<div>Loading...</div>}><AddEditStaff /></Suspense> },
  { path: "staff/edit/:id",  element: <Suspense fallback={<div>Loading...</div>}><AddEditStaff /></Suspense> },
  { path: "staff/:id",       element: <Suspense fallback={<div>Loading...</div>}><StaffDetail /></Suspense> },
];
export default staffRoutes;