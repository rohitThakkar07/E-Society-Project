import React from 'react';
import { lazy, Suspense } from 'react';
const RoleDashboard = lazy(() => import("../../Admin/pages/RoleRights/RoleDashboard"));
const CreateRole = lazy(() => import("../../Admin/pages/RoleRights/CreateRole"));
const RoleList = lazy(() => import("../../Admin/pages/RoleRights/RoleList"));
const UserAccessList = lazy(() => import("../../Admin/pages/RoleRights/UserAccessList"));

const roleRoutes = [
  {
    path: "roles",
    element: <Suspense fallback={<div>Loading...</div>}><RoleDashboard /></Suspense>,
  },
  {
    path: "roles/create-role",
    element: <Suspense fallback={<div>Loading...</div>}><CreateRole /></Suspense>,
  },
  {
    path: "roles/edit/:id",
    element: <Suspense fallback={<div>Loading...</div>}><CreateRole /></Suspense>,
  },
  {
    path: "roles/list",
    element: <Suspense fallback={<div>Loading...</div>}><RoleList /></Suspense>,
  },
  {
    path: "roles/user-access",
    element: <Suspense fallback={<div>Loading...</div>}><UserAccessList /></Suspense>,
  },
];

export default roleRoutes;