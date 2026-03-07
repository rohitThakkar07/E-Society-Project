import React from 'react';
import RoleDashboard from "../components/pages/RoleRights/RoleDashboard";
import CreateRole from "../components/pages/RoleRights/CreateRole";
import RoleList from "../components/pages/RoleRights/RoleList";
import UserAccessList from "../components/pages/RoleRights/UserAccessList";

const roleRoutes = [
  {
    path: "roles",
    element: <RoleDashboard />,
  },
  {
    path: "roles/create-role",
    element: <CreateRole />,
  },
  {
    path: "roles/edit/:id",
    element: <CreateRole />,
  },
  {
    path: "roles/list",
    element: <RoleList />,
  },
  {
    path: "roles/user-access",
    element: <UserAccessList />,
  },
];

export default roleRoutes;