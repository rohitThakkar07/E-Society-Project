import React from 'react';
import { lazy, Suspense } from 'react';
import { PageLoader } from "../../components/PageLoader";
const RoleDashboard = lazy(() => import("../../Admin/pages/RoleRights/RoleDashboard"));
const CreateRole = lazy(() => import("../../Admin/pages/RoleRights/CreateRole"));
const RoleList = lazy(() => import("../../Admin/pages/RoleRights/RoleList"));
const UserAccessList = lazy(() => import("../../Admin/pages/RoleRights/UserAccessList"));

const roleRoutes = [
  {
    path: "roles",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><RoleDashboard /></Suspense>,
  },
  {
    path: "roles/create-role",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><CreateRole /></Suspense>,
  },
  {
    path: "roles/edit/:id",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><CreateRole /></Suspense>,
  },
  {
    path: "roles/list",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><RoleList /></Suspense>,
  },
  {
    path: "roles/user-access",
    element: <Suspense fallback={<PageLoader message="Loading…" />}><UserAccessList /></Suspense>,
  },
];

export default roleRoutes;