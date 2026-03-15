import React from 'react';
import RoleDashboard from "../../Admin/pages/RoleRights/RoleDashboard";
import CreateRole from "../../Admin/pages/RoleRights/CreateRole";
import RoleList from "../../Admin/pages/RoleRights/RoleList";
import UserAccessList from "../../Admin/pages/RoleRights/UserAccessList";

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